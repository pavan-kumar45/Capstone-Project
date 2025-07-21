from fastapi import FastAPI, HTTPException, Query, File, UploadFile
from pydantic import BaseModel
from typing import List, Optional, Dict, TypedDict
from langgraph.graph import StateGraph, END
import chromadb
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.core import StorageContext
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.groq import Groq
import json
import uuid
import os
from pymongo import MongoClient
from bson.objectid import ObjectId
from fastapi.middleware.cors import CORSMiddleware
from langchain_groq import ChatGroq

# FastAPI app initialization
app = FastAPI()

# Initialize components
groq_api_key = "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"
embed_model = HuggingFaceEmbedding()

# MongoDB Connection
client = MongoClient("mongodb://localhost:27017/")
db = client["questions_database"]
collection = db["generated_questions"]
drafts_collection = client["User-Drafts"]["drafts"]
score_feedback_collection = client["User-Drafts"]["score_feedback"]
# CORS Middleware to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ChromaDB
chroma_client = chromadb.PersistentClient(path="./chroma_db")
chroma_collection_name = "uploaded_pdf_collection"
chroma_collection = None
vector_store = None
storage_context = None
index = None

# Initialize LLMs
pdf_llm = Groq(api_key=groq_api_key, model="llama-3.3-70b-versatile")
general_llm = Groq(api_key=groq_api_key, model="llama-3.3-70b-versatile")

# Initialize the Groq Llama model
generate_llm = ChatGroq(
    temperature=0,
    groq_api_key="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",
    model_name="llama-3.3-70b-versatile",
    max_tokens=800,
    timeout=60
)

# Define data models
class QuestionModel(BaseModel):
    id: str
    qno: str
    qlabel: str
    qtext: str
    qtype: str
    qoptions: List[str] = []
    qlanguage: List[str] = []
    difficulty: str
    qmulticheck: bool = False

class SectionModel(BaseModel):
    id: str
    name: str
    marks: int
    difficultyLevel: str
    questions: List[QuestionModel]

class OutputModel(BaseModel):
    exam_id: str
    totalSections: int
    difficultyLevel: str
    primaryskills: List[str]
    secondaryskills: List[str]
    totalMarks: int
    sections: List[SectionModel]

# Define state schema
class GraphState(TypedDict):
    topic: List[str]
    num_mcqs: int
    num_text: int
    num_code: int
    difficulty: str
    source: Optional[str]
    response: Optional[OutputModel]

def parse_questions(response_str: str, q_type: str, start_id: int = 1, qlanguages: Optional[List[str]] = None) -> List[QuestionModel]:
    try:
        parsed = json.loads(response_str)
    except json.JSONDecodeError:
        return []
    questions = []
    for i, item in enumerate(parsed, start=start_id):
        question = QuestionModel(
            id=str(i),
            qno=str(i - 1),
            qlabel=item.get("qlabel", f"{q_type} - {item.get('topic', '')} - {item.get('difficulty', '')}"),
            qtext=item.get("qtext", ""),
            qtype=q_type,
            qoptions=item.get("qoptions", []),
            qlanguage=qlanguages if qlanguages else [],
            difficulty=item.get("difficulty", "Medium"),
            qmulticheck=item.get("qmulticheck", False)
        )
        questions.append(question)
    return questions

def generate_section(questions: List[QuestionModel], difficulty: str) -> SectionModel:
    total_marks = len(questions) * 10  # Assuming 10 marks per question
    return SectionModel(
        id=str(uuid.uuid4()),
        name="Generated Questions",
        marks=total_marks,
        difficultyLevel=difficulty,
        questions=questions
    )

# Define nodes
def route_topic(state: GraphState):
    global index
    if index is None:
        return {"source": "model"}
    
    for topic in state['topic']:
        retriever = index.as_retriever(similarity_top_k=1)
        results = retriever.retrieve(topic)
        if results and results[0].score > 0.7:
            # Additional content check
            topic_lower = topic.lower()  # Apply .lower() to the individual topic string
            text_lower = results[0].text.lower()
            
            if topic_lower in text_lower:
                print(f"Generating from PDF (score: {results[0].score:.2f})...")
                return {"source": "pdf"}
        
        print("Generating from pretrained model")
        return {"source": "model"}

def generate_from_pdf(state: GraphState):
    print("generating from pdf....")

    # global index, chroma_client, chroma_collection_name, chroma_collection, vector_store, storage_context
    query_engine = index.as_query_engine(llm=pdf_llm)
    all_questions = []
    start_id = 1
    
    for topic in state['topic']:
        # Generate MCQs
        mcq_prompt = f"""
        Generate {state['num_mcqs']} {state['difficulty']}-level multiple-choice questions about {topic}.
        Format as a JSON array following this example:
        {{
            "id": "1",
            "qno": "0",
            "qlabel": "MCQ - {topic} - {state['difficulty']}",
            "qtext": "What is...?",
            "qtype": "MCQ",
            "qoptions": ["Option1", "Option2", "Option3", "Option4"],
            "difficulty": "{state['difficulty']}",
            "qmulticheck": false
        }}
        Return only the JSON array.
        """
        mcq_response = query_engine.query(mcq_prompt)
        mcq_questions = parse_questions(str(mcq_response), "MCQ", start_id=start_id)
        all_questions.extend(mcq_questions)
        start_id += len(mcq_questions)
        
        # Generate Text questions
        text_prompt = f"""
        Generate {state['num_text']} {state['difficulty']}-level text questions about {topic}.
        Format as a JSON array following this example:
        {{
            "id": "1",
            "qno": "0",
            "qlabel": "Text - {topic} - {state['difficulty']}",
            "qtext": "Explain...",
            "qtype": "Text",
            "difficulty": "{state['difficulty']}",
            "qmulticheck": false
        }}
        Return only the JSON array.
        """
        text_response = query_engine.query(text_prompt)
        text_questions = parse_questions(str(text_response), "Text", start_id=start_id)
        all_questions.extend(text_questions)
        start_id += len(text_questions)
        
        # Generate Code questions
        code_prompt = f"""
        Generate {state['num_code']} {state['difficulty']}-level coding questions about {topic}.
        Format as a JSON array following this example:
        {{
            "id": "1",
            "qno": "0",
            "qlabel": "Code - {topic} - {state['difficulty']}",
            "qtext": "Write a function...",
            "qtype": "code",
            "qlanguage": ["python"],
            "difficulty": "{state['difficulty']}",
            "qmulticheck": false
        }}
        Return only the JSON array.
        """
        code_response = query_engine.query(code_prompt)
        code_questions = parse_questions(str(code_response), "code", start_id=start_id, qlanguages=["python"])
        all_questions.extend(code_questions)
        start_id += len(code_questions)
    
    section = generate_section(all_questions, state['difficulty'])
    output = OutputModel(
        exam_id=str(uuid.uuid4()),
        totalSections=1,
        difficultyLevel=state['difficulty'],
        primaryskills=state['topic'],
        secondaryskills=[],
        totalMarks=section.marks,
        sections=[section]
    )

    # try:
    #     chroma_client.delete_collection(chroma_collection_name)
    #     print(f"Deleted Chroma collection: {chroma_collection_name}")
    # except Exception as e:
    #     print(f"Error deleting Chroma collection: {e}")
        
    #     # Reset global components
    # chroma_collection = None
    # vector_store = None
    # storage_context = None
    # index = None
    return {"response": output}

def generate_from_model(state: GraphState):

    print("generating from pretrained model...")
    all_questions = []
    start_id = 1

    for topic in state['topic']:
        # Generate MCQs
        mcq_prompt = f"""
        Generate {state['num_mcqs']} {state['difficulty']}-level multiple-choice questions about {topic}.
        Format as a JSON array following this example:
        {{
            "id": "1",
            "qno": "0",
            "qlabel": "MCQ - {topic} - {state['difficulty']}",
            "qtext": "What is...?",
            "qtype": "MCQ",
            "qoptions": ["Option1", "Option2", "Option3", "Option4"],
            "difficulty": "{state['difficulty']}",
            "qmulticheck": false
        }}
        Return only the JSON array.
        """
        mcq_response = general_llm.complete(mcq_prompt)
        mcq_questions = parse_questions(mcq_response.text, "MCQ", start_id=start_id)
        all_questions.extend(mcq_questions)
        start_id += len(mcq_questions)
        
        # Generate Text questions
        text_prompt = f"""
        Generate {state['num_text']} {state['difficulty']}-level text questions about {topic}.
        Format as a JSON array following this example:
        {{
            "id": "1",
            "qno": "0",
            "qlabel": "Text - {topic} - {state['difficulty']}",
            "qtext": "Explain...",
            "qtype": "Text",
            "difficulty": "{state['difficulty']}",
            "qmulticheck": false
        }}
        Return only the JSON array.
        """
        text_response = general_llm.complete(text_prompt)
        text_questions = parse_questions(text_response.text, "Text", start_id=start_id)
        all_questions.extend(text_questions)
        start_id += len(text_questions)
        
        # Generate Code questions
        code_prompt = f"""
        Generate {state['num_code']} {state['difficulty']}-level coding questions about {topic}.
        Format as a JSON array following this example:
        {{
            "id": "1",
            "qno": "0",
            "qlabel": "Code - {topic} - {state['difficulty']}",
            "qtext": "Write a function...",
            "qtype": "code",
            "qlanguage": ["python"],
            "difficulty": "{state['difficulty']}",
            "qmulticheck": false
        }}
        Return only the JSON array.
        """
        code_response = general_llm.complete(code_prompt)
        code_questions = parse_questions(code_response.text, "code", start_id=start_id, qlanguages=["python"])
        all_questions.extend(code_questions)
        start_id += len(code_questions)
    
    section = generate_section(all_questions, state['difficulty'])
    output = OutputModel(
        exam_id=str(uuid.uuid4()),
        totalSections=1,
        difficultyLevel=state['difficulty'],
        primaryskills=state['topic'],
        secondaryskills=[],
        totalMarks=section.marks,
        sections=[section]
    )

    global chroma_client, chroma_collection_name, chroma_collection, vector_store, storage_context, index
    try:
        chroma_client.delete_collection(chroma_collection_name)
        print(f"Deleted Chroma collection: {chroma_collection_name}")
    except Exception as e:
        print(f"Error deleting Chroma collection: {e}")
    
    # Reset global components
    chroma_collection = None
    vector_store = None
    storage_context = None
    index = None

    return {"response": output}

# Build workflow
workflow = StateGraph(GraphState)
workflow.add_node("route_topic", route_topic)
workflow.add_node("generate_from_pdf", generate_from_pdf)
workflow.add_node("generate_from_model", generate_from_model)
workflow.set_entry_point("route_topic")
workflow.add_conditional_edges(
    "route_topic",
    lambda x: x["source"],
    {"pdf": "generate_from_pdf", "model": "generate_from_model"}
)
workflow.add_edge("generate_from_pdf", END)
workflow.add_edge("generate_from_model", END)
app_graph = workflow.compile()

# Define request model
class QuestionRequest(BaseModel):
    topic: List[str]
    num_mcqs: int
    num_text: int
    num_code: int
    difficulty: str

# Endpoints
@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    global index, chroma_collection, vector_store, storage_context
    
    # Create temp directory
    temp_dir = "temp_pdfs"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, file.filename)
    
    # Save uploaded file
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    # Process PDF
    try:
        # Delete existing collection
        try:
            chroma_client.delete_collection(chroma_collection_name)
        except:
            pass
        
        # Create new collection
        chroma_collection = chroma_client.get_or_create_collection(chroma_collection_name)
        vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
        storage_context = StorageContext.from_defaults(vector_store=vector_store)
        
        # Load documents and create index
        documents = SimpleDirectoryReader(input_files=[file_path]).load_data()
        index = VectorStoreIndex.from_documents(
            documents, storage_context=storage_context, embed_model=embed_model
        )
        
        return {"message": "PDF processed successfully", "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up temp file
        if os.path.exists(file_path):
            os.remove(file_path)

@app.post("/generate-questions", response_model=OutputModel)
async def generate_questions(request: QuestionRequest):
    inputs = {
        "topic": request.topic,
        "num_mcqs": request.num_mcqs,
        "num_text": request.num_text,
        "num_code": request.num_code,
        "difficulty": request.difficulty,
        "source": None,
        "response": None
    }
    
    final_state = None
    for output in app_graph.stream(inputs):
        for key, value in output.items():
            final_state = value
    
    if not final_state or not final_state.get("response"):
        raise HTTPException(status_code=500, detail="Failed to generate questions")
    
    generated_response = final_state["response"]
    result = collection.insert_one(generated_response.dict())
    generated_response.exam_id = str(result.inserted_id)
    return generated_response

@app.get("/questions", response_model=List[Dict])
def get_questions(exam_id: str = Query(..., description="The ID of the exam to fetch questions from")):
    document = collection.find_one({"exam_id": exam_id})
    
    if document and "sections" in document and document["sections"]:
        questions = document["sections"][0]["questions"]
        return questions
    else:
        raise HTTPException(status_code=404, detail="Questions not found for the given exam_id")

@app.get("/latest_exam_id")
def get_latest_exam_id():
    document = collection.find_one(sort=[("_id", -1)])
    
    if document and "exam_id" in document:
        return {"exam_id": document["exam_id"]}
    else:
        raise HTTPException(status_code=404, detail="Exam ID not found")


@app.post("/evaluate_answers")
async def evaluate_answers(exam_id: str):
    # Fetch the exam document
    exam_document = collection.find_one({"exam_id": exam_id})
    if not exam_document:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    # Get primary skill (topic) from exam details
    try:
        topic = exam_document["primaryskills"][0]  # Assuming single primary skill
    except (KeyError, IndexError):
        raise HTTPException(status_code=400, detail="Primary skill not found in exam document")

    # Initialize evaluation components
    # chroma_collection_name = exam_document.get("chroma_collection_name")
    chroma_collection_name = "uploaded_pdf_collection"
    print(chroma_collection_name)
    use_pdf = False
    index = None

    if chroma_collection_name:
        try:
            # Load Chroma collection and create index
            chroma_collection = chroma_client.get_collection(chroma_collection_name)
            vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
            storage_context = StorageContext.from_defaults(vector_store=vector_store)
            index = VectorStoreIndex.from_vector_store(vector_store, embed_model=embed_model)
            
            # Check if topic exists in PDF content
            retriever = index.as_retriever(similarity_top_k=1)
            results = retriever.retrieve(topic)
            print(results[0].score)
            if results and results[0].score > 0.7:
                topic_lower = topic.lower()
                text_lower = results[0].text.lower()
                if topic_lower in text_lower:
                    use_pdf = True
                    print("Evaluating from PDF...")
        except Exception as e:
            print(f"Error loading Chroma collection: {e}")

    # Process all user answers
    user_answers = drafts_collection.find({"examId": exam_id})
    for user_doc in user_answers:
        feedback = []
        for question, answer in zip(exam_document["sections"][0]["questions"], user_doc["answerData"]):
            if not answer or not isinstance(answer, dict):
                continue
            print("Evaluating...")
            actual_answer = answer.get("answer", "")
            if not actual_answer.strip():
                continue

            # Prepare evaluation prompt
            prompt = f"""
            Evaluate the following answer for the given question based on the specified criteria:
            - Question Type: {question['qtype']}
            - Question: {question['qtext']}
            - Answer: {actual_answer}

            Scoring Guidelines:
            1. MCQ: 0 or 10 based on correctness
            2. Text: 0-10 based on relevance/accuracy
            3. Code: 0-10 based on optimality/correctness

            Instructions:
            - First line: score: [0-10]
            - Subsequent lines: feedback: [detailed feedback]
            """

            # Route evaluation based on PDF check
            if use_pdf and index:
                print("Evaluating from pdf...")
                query_engine = index.as_query_engine(llm=pdf_llm)
                response = query_engine.query(prompt)
            else:
                print("Evaluating from pretrained model")
                response = general_llm.complete(prompt)

            # Parse response
            response_text = response.text if hasattr(response, "text") else str(response)
            score = 0
            feedback_text = "No feedback provided"
            
            # Extract score and feedback
            if "score:" in response_text.lower():
                try:
                    score_part = response_text.lower().split("score:")[1].strip()
                    score = int(score_part.split()[0])
                except (IndexError, ValueError):
                    pass
                
            if "feedback:" in response_text.lower():
                try:
                    feedback_part = response_text.split("feedback:")[1].strip()
                    feedback_text = feedback_part
                except IndexError:
                    pass

            feedback.append({
                "question_id": question["id"],
                "question": question["qtext"],
                "answer": actual_answer,
                "score": score,
                "feedback": feedback_text
            })

        # Store feedback
        score_feedback_collection.update_one(
            {"examId": exam_id, "userId": user_doc["userId"]},
            {"$set": {"feedback": feedback}},
            upsert=True
        )

    return {"status": "Evaluation completed", "exam_id": exam_id}

@app.get("/exam_ids", response_model=List[str])
def get_all_exam_ids():
    documents = collection.find({}, {"exam_id": 1})
    exam_ids = [doc["exam_id"] for doc in documents if "exam_id" in doc]
    return exam_ids

@app.get("/exam_details/{exam_id}")
async def get_exam_details(exam_id: str):
    exam_details = collection.find_one({"exam_id": exam_id})
    if not exam_details:
        raise HTTPException(status_code=404, detail="Exam not found")
    exam_details["_id"] = str(exam_details["_id"])
    return exam_details

from typing import  Any
from fastapi.responses import JSONResponse
# Endpoint to fetch feedback by examId
@app.get("/feedback/{exam_id}", response_class=JSONResponse)
async def get_feedback_by_exam(exam_id: str):
    try:
        # Query MongoDB for all documents matching the examId
        feedback_data = score_feedback_collection.find({"examId": exam_id})

        # Transform the MongoDB documents to match the expected JSON structure
        response_list: List[Dict[str, Any]] = []
        for doc in feedback_data:
            response = {
                # "id": doc.get("id", ""),
                "examId": doc.get("examId", ""),
                "userId": doc.get("userId", ""),
                "feedback": [
                    {
                        
                        "question_id": item.get("question_id", ""),
                        "question": item.get("question", ""),
                        "answer": item.get("answer", ""),
                        "score": item.get("score", 0),
                        "feedback": item.get("feedback", "")
                        
                    }
                    for item in doc.get("feedback", [])
                ]
            }
            response_list.append(response)

        # If no documents are found, return a default response
        if not response_list:
            return JSONResponse(
                content={
                    "id": "",
                    "examId": exam_id,
                    "userId": "",
                    "feedback": []
                },
                status_code=404
            )

        return JSONResponse(content=response_list, status_code=200)

    except Exception as e:
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )



# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)