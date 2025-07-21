// import DOMPurify from "isomorphic-dompurify";
import DOMPurify from 'dompurify';
import { motion } from "framer-motion";
import CustomTypewriter from "@/wrappers/AnimationWrappers/CustomTypeWriter";

const AssessmentQuestion = (question) => {
  const sanitizedContent = DOMPurify.sanitize(question.question.qtext);

  return (
    <motion.div
      key={question.question.qno}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="assessment-questioncontent">
        {console.log("Question in Question Box : ", question.question)}
        {question.question.qlabel.trim().length > 0 ? (
          <h2 className="question-heading">
            {parseInt(question.question.qno, 10) + 1}.{" "}
            <CustomTypewriter
              content={question.question.qlabel}
              key={question.question.qno}
            />
            {/* {question.question.qlabel} */}
          </h2>
        ) : (
          <p></p>
        )}

        <div className="assessment-qtype">
          {question.question.qtype}
        </div>

        {question.question.qtext.trim().length == 0 ? (
          <p></p>
        ) : (
          <div className="question-display">
          <CustomTypewriter content = {sanitizedContent} key={question.question.qno} />
          </div>
          // <div
          //   dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          //   className="question-display"
          // />
        )}

        <div className="extra-content"></div>
      </div>
    </motion.div>
  );
};

export default AssessmentQuestion;
