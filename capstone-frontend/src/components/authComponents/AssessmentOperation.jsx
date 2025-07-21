import { CiShuffle } from "react-icons/ci";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { CiFlag1 } from "react-icons/ci";

export default function AssessmentOperation({
  previousQuestionDisplay,
  nextQuestionDisplay,
  questionNo,
  questionLength,
  markedForReview,
  handleReviewButton,
  handleModalVisibility,
}) {
  return (
    <div className="operation-maincontent">
      <div className="operation-content">
        <button
          className="pick-question flex flex-row justify-center align-center"
          onClick={handleModalVisibility}
        >
          <CiShuffle className="shuffle-icon" />
          Pick a question
        </button>
        <div className="question-nav flex align-center">
          <button
            className="left-icon change-question flex justify-center align-center"
            onClick={previousQuestionDisplay}
          >
            <FaAngleLeft />
          </button>
          <div className="question-no">
            {parseInt(questionNo, 10) + 1} / {questionLength}
          </div>
          <button
            className="right-icon change-question flex justify-center align-center"
            onClick={nextQuestionDisplay}
          >
            <FaAngleRight />
          </button>
        </div>
        <div className="review">
          {markedForReview ? (
            <button
              className="flex review-button-active"
              onClick={handleReviewButton}
            >
              <CiFlag1 className="flag-icon" />
              Marked for review
            </button>
          ) : (
            <button
              className="flex review-button-inactive"
              onClick={handleReviewButton}
            >
              <CiFlag1 className="flag-icon" />
              Mark for review
            </button>
          )}
        </div>
      </div>
      {/* <div className="operation-extracontent"></div> */}
    </div>
  );
}
