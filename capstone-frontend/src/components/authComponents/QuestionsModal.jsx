import { useState } from "react";
import {
  storeQuestionData,
  storeUserAnswerData,
} from "@/store/atoms/assessmentDataStore";
import { useRecoilState } from "recoil";

export default function QuestionsModal({
  modalVisibility,
  handleModalVisibility,
  defaultQuestionToDisplay,
}) {
  const [questionData, setQuestionData] = useRecoilState(storeQuestionData);
  const [answerReview, setAnswerReview] = useRecoilState(storeUserAnswerData);

  const changeQuestion = (index) => {
    console.log("This is index", index, "This is data", questionData[index]);
    defaultQuestionToDisplay(index, questionData[index]);
    handleModalVisibility();
  };

  return (
    <>
      {modalVisibility && questionData ? (
        <div className="questionsmodal-maincontent">
          <div className={`questions-list ${modalVisibility ? 'visible' : ''}`}>
            <div className="questions-heading">
              <h3>All Questions</h3>
              <button className="close-modal" onClick={handleModalVisibility}>
                X
              </button>
            </div>
            <div className="questions-content">
              {console.log("Questions Data display", questionData)}
              {questionData.map((question, index) => (
                <button
                  key={index}
                  id={question.qno}
                  className="eachQuestion"
                  onClick={() => changeQuestion(index)}
                >
                  <div className="question-no">
                    {parseInt(question.qno) + 1}
                  </div>
                  <div className="question-text">
                    <div className="question-para">{question.qlabel}</div>
                    <div>
                      {answerReview &&
                      answerReview[index] &&
                      answerReview[index].review ? (
                        <div className="markedForReview">Review</div>
                      ) : (
                        <div></div>
                      )}
                      <div className="question-type">{question.qtype}</div>
                    </div>
                  </div>
                </button>
              ))}
              <div className="question-list-extracontent"></div>
            </div>
          </div>
          <div
            className="questions-extracontent"
            onClick={handleModalVisibility}
          ></div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
