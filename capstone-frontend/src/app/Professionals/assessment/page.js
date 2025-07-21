"use client";

import AssessmentHeader from "@/components/authComponents/AssessmentHeader";
import "./assessmentStyle.css";
import AssessmentQuestion from "@/components/authComponents/AssessmentQuestion";
import AssessmentAnswer from "@/components/authComponents/AssessmentAnswer";
import { useEffect, useState } from "react";
import {
  storeQuestionOnBoard,
  storeUserAnswerData,
  storeQuestionData,
} from "@/store/atoms/assessmentDataStore";
import AssessmentOperation from "@/components/authComponents/AssessmentOperation";
import QuestionsModal from "@/components/authComponents/QuestionsModal";
import { useRecoilState } from "recoil";
import Loading from "../../loading";

export default function Assessment() {
  const [questionsData, setQuestionsData] = useRecoilState(storeQuestionData);
  const [questionOnBoard, setQuestionOnBoard] = useRecoilState(storeQuestionOnBoard);
  const [userAnswerData, setUserAnswerData] = useRecoilState(storeUserAnswerData);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [examId, setExamId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Function to initialize userAnswerData
  const initializeUserAnswerData = () => {
    if (questionsData && questionsData.length > 0) {
      const initialAnswers = questionsData.map((question) => {
        return {
          qno: question.qno,
          qid: question.id,
          review: false,
          answer: question.qtype === "code" || question.qtype === "Text" ? "" : [],
        };
      });
      setUserAnswerData(initialAnswers);
    }
  };

  // Function to display the previous question
  const previousQuestionDisplay = () => {
    if (questionOnBoard.qno > 0) {
      const questionNo = parseInt(questionOnBoard.qno, 10) - 1;
      defaultQuestionToDisplay(questionNo, questionsData[questionNo]);
    }
  };

  // Function to display the next question
  const nextQuestionDisplay = () => {
    if (questionOnBoard.qno < questionsData.length - 1) {
      const questionNo = parseInt(questionOnBoard.qno, 10) + 1;
      defaultQuestionToDisplay(questionNo, questionsData[questionNo]);
    }
  };

  // Function to set the question to display
  const defaultQuestionToDisplay = (defaultQuestionNumber, defaultQuestionData) => {
    setQuestionOnBoard(defaultQuestionData);
  };

  // Function to handle marking a question for review
  const handleReviewButton = () => {
    const index = parseInt(questionOnBoard.qno, 10);
    const newUserData = [...userAnswerData];
    newUserData[index] = {
      ...newUserData[index],
      review: !newUserData[index].review,
    };
    setUserAnswerData(newUserData);
  };

  // Function to toggle modal visibility
  const handleModalVisibility = () => {
    setModalVisibility(!modalVisibility);
  };

  // Fetch questions and validate exam_id
  const handlePopupSubmit = async () => {
    if (examId.trim() === "") {
      setErrorMessage("Please enter a valid Exam ID.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/questions?exam_id=${examId}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.length === 0) {
        throw new Error("Invalid Exam ID");
      }

      // Store the exam_id in local storage (automatically replaces existing value)
      localStorage.setItem("exam_id", examId);

      setQuestionsData(data);
      setQuestionOnBoard(data[0]);
      initializeUserAnswerData();
      setShowPopup(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Invalid Exam ID. Please try again.");
    }
  };

  return (
    <>
      {/* Popup for Exam ID input */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Enter Exam ID</h2>
            <input
              type="text"
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
              placeholder="Enter Exam ID"
            />
            <button onClick={handlePopupSubmit}>Submit</button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        </div>
      )}

      {!showPopup && questionsData && questionOnBoard && userAnswerData ? (
        <div className="assessment-maincontent">
          <AssessmentHeader />

          <div className="assessment-usercontent">
            <div className="question">
              <AssessmentQuestion question={questionOnBoard} id="assessment-question" />
            </div>
            <div className="answer">
              <AssessmentAnswer
                lang={questionOnBoard.qlanguage}
                type={questionOnBoard.qtype}
                option={questionOnBoard.qoptions}
                multicheck={questionOnBoard.qmulticheck}
                qNo={parseInt(questionOnBoard.qno, 10)}
              />
            </div>
          </div>
          <AssessmentOperation
            previousQuestionDisplay={previousQuestionDisplay}
            nextQuestionDisplay={nextQuestionDisplay}
            questionNo={questionOnBoard.qno}
            questionLength={questionsData.length}
            markedForReview={
              userAnswerData[parseInt(questionOnBoard.qno, 10)]
                ? userAnswerData[parseInt(questionOnBoard.qno, 10)].review
                : false
            }
            handleReviewButton={handleReviewButton}
            handleModalVisibility={handleModalVisibility}
            anchor="assessment-question"
          />
          <QuestionsModal
            modalVisibility={modalVisibility}
            handleModalVisibility={handleModalVisibility}
            defaultQuestionToDisplay={defaultQuestionToDisplay}
          />
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}