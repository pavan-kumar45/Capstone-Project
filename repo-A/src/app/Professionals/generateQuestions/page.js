"use client";

import { useState, useEffect, useRef } from "react";

export default function Assessment() {
  const [examIds, setExamIds] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [numMcqs, setNumMcqs] = useState(0);
  const [numText, setNumText] = useState(0);
  const [numCode, setNumCode] = useState(0);
  const [difficulty, setDifficulty] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedExamDetails, setSelectedExamDetails] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();

  // Fetch exam IDs on component mount and after successful generation
  useEffect(() => {
    fetchExamIds();
  }, []);

  const fetchExamIds = async () => {
    try {
      const response = await fetch("http://localhost:8000/exam_ids", {
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setExamIds(data);
    } catch (error) {
      console.error("Error fetching exam IDs:", error);
    }
  };

  const fetchExamDetails = async (examId) => {
    try {
      const response = await fetch(`http://localhost:8000/exam_details/${examId}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setSelectedExamDetails(data);
    } catch (error) {
      console.error("Error fetching exam details:", error);
    }
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadResponse = await fetch("http://localhost:8000/upload-pdf/", {
        method: "POST",
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.detail || "PDF upload failed");
      }
      
      const successData = await uploadResponse.json();
      setSuccessMessage(successData.message || "PDF uploaded successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      
    } catch (error) {
      setSuccessMessage(`PDF upload failed: ${error.message}`);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const generateQuestions = async () => {
    const requestBody = {
      topic: [topic],
      num_mcqs: numMcqs,
      num_text: numText,
      num_code: numCode,
      difficulty: difficulty,
    };

    try {
      const response = await fetch("http://localhost:8000/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      setSuccessMessage("Questions generated successfully!");
      await fetchExamIds();
      
    } catch (error) {
      setSuccessMessage("Failed to generate questions. Please try again.");
      console.error("Error generating questions:", error);
    }

    setTimeout(() => setSuccessMessage(""), 3000);
    
    // Reset form fields
    setIsPopupOpen(false);
    setTopic("");
    setNumMcqs(0);
    setNumText(0);
    setNumCode(0);
    setDifficulty("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleExamIdClick = async (examId) => {
    await fetchExamDetails(examId);
  };

  const closeExamDetailsPopup = () => {
    setSelectedExamDetails(null);
  };

  const countQuestionsByType = (questions) => {
    let mcqCount = 0;
    let textCount = 0;
    let codeCount = 0;

    questions.forEach((question) => {
      if (question.qtype === "MCQ") mcqCount++;
      else if (question.qtype === "Text") textCount++;
      else if (question.qtype === "code") codeCount++;
    });

    return { mcqCount, textCount, codeCount };
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Exam IDs</h1>
        <button className="generate-button" onClick={() => setIsPopupOpen(true)}>
          Generate Questions
        </button>
      </div>

      <div className="exam-list">
        {examIds.map((id) => (
          <div key={id} className="exam-id" onClick={() => handleExamIdClick(id)}>
            {id}
          </div>
        ))}
      </div>

      {/* Generate Questions Popup */}
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Generate Questions</h2>
            <label>Topic:</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            <label>Number of MCQs:</label>
            <input
              type="number"
              min="0"
              value={numMcqs}
              onChange={(e) => setNumMcqs(parseInt(e.target.value) || 0)}
            />

            <label>Number of Text Questions:</label>
            <input
              type="number"
              min="0"
              value={numText}
              onChange={(e) => setNumText(parseInt(e.target.value) || 0)}
            />

            <label>Number of Code Questions:</label>
            <input
              type="number"
              min="0"
              value={numCode}
              onChange={(e) => setNumCode(parseInt(e.target.value) || 0)}
            />

            <label>Difficulty:</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="">Select Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <label>Upload PDF (optional):</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) handleFileUpload(file);
              }}
              ref={fileInputRef}
            />

            <div className="button-group">
              <button onClick={generateQuestions}>Submit</button>
              <button
                onClick={() => {
                  setIsPopupOpen(false);
                  setTopic("");
                  setNumMcqs(0);
                  setNumText(0);
                  setNumCode(0);
                  setDifficulty("");
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Details Popup */}
      {selectedExamDetails && (
        <div className="popup">
          <div className="popup-content">
            <h2>Exam Details</h2>
            <p><strong>Exam ID:</strong> {selectedExamDetails.exam_id}</p>
            <p><strong>Topic:</strong> {selectedExamDetails.primaryskills.join(", ")}</p>
            <p><strong>Difficulty Level:</strong> {selectedExamDetails.difficultyLevel}</p>
            <p><strong>Total Marks:</strong> {selectedExamDetails.totalMarks}</p>

            {selectedExamDetails.sections.map((section, index) => {
              const { mcqCount, textCount, codeCount } = countQuestionsByType(section.questions);
              return (
                <div key={index}>
                  <p><strong>Number of MCQs:</strong> {mcqCount}</p>
                  <p><strong>Number of Text Questions:</strong> {textCount}</p>
                  <p><strong>Number of Code Questions:</strong> {codeCount}</p>
                </div>
              );
            })}

            <button onClick={closeExamDetailsPopup}>Close</button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className={`success-message ${successMessage.includes("Success") ? "success" : "error"}`}>
          {successMessage}
        </div>
      )}

      <style jsx>{`
        .container {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .generate-button {
          padding: 10px 20px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .generate-button:hover {
          background-color: #005bb5;
        }

        .exam-list {
          display: grid;
          gap: 10px;
        }

        .exam-id {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .exam-id:hover {
          background-color: #f0f0f0;
        }

        .popup {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .popup-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 400px;
          display: grid;
          gap: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .popup-content h2 {
          margin: 0 0 10px;
          font-size: 1.5rem;
        }

        .popup-content label {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .popup-content input,
        .popup-content select {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        .popup-content input[type="file"] {
          padding: 5px;
        }

        .button-group {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .button-group button {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }

        .button-group button:first-child {
          background-color: #0070f3;
          color: white;
        }

        .button-group button:first-child:hover {
          background-color: #005bb5;
        }

        .button-group button:last-child {
          background-color: #f0f0f0;
          color: #333;
        }

        .button-group button:last-child:hover {
          background-color: #ddd;
        }

        .success-message {
          position: fixed;
          bottom: 20px;
          right: 20px;
          padding: 15px;
          border-radius: 5px;
          color: white;
          font-size: 1rem;
          z-index: 1000;
          animation: slideIn 0.5s ease;
        }

        .success {
          background-color: #4CAF50;
        }

        .error {
          background-color: #f44336;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}