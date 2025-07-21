import { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { storeUserAnswerData } from "@/store/atoms/assessmentDataStore";
import { useRecoilState } from "recoil";
import { motion } from "framer-motion";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function AssessmentAnswer(props) {
  const [username, setUsername] = useState("guest");
  const [examId, setExamId] = useState(""); // Dynamically fetched examId
  const [availableLanguages, setAvailableLanguages] = useState(["javascript"]);
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedRadio, setSelectedRadio] = useState([]);
  const [userAnswerData, setUserAnswerData] = useRecoilState(storeUserAnswerData);
  const [loading, setLoading] = useState(true);
  const { lang, type, option, multicheck, qNo } = props;
  const hasFetchedDraft = useRef(false);

  // Decode JWT token to extract username
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const email = decodedToken.sub || decodedToken.email;
        if (email) {
          const extractedUsername = email.split("@")[0];
          setUsername(extractedUsername);
          console.log("Extracted username:", extractedUsername);
        } else {
          console.error("Email not found in token");
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  // Fetch examId from FastAPI
  useEffect(() => {
    const fetchExamId = async () => {
      try {
        const response = await axios.get("http://localhost:8000/latest_exam_id");
        if (response.data && response.data.exam_id) {
          setExamId(response.data.exam_id);
          console.log("Fetched Exam ID:", response.data.exam_id);
        } else {
          console.error("Failed to fetch exam ID. Response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching exam ID:", error.message);
      }
    };

    fetchExamId();
  }, []);

  // Fetch draft once when component mounts
  useEffect(() => {
    const fetchUsernameAndDraft = async () => {
      let usernameValue = "guest"; // Default value
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const email = decodedToken.sub || decodedToken.email;
          if (email) {
            usernameValue = email.split("@")[0];
            setUsername(usernameValue);
          } else {
            console.error("Email not found in token");
          }
        } catch (error) {
          console.error("Invalid token:", error);
        }
      }

      if (usernameValue && examId) {
        try {
          const response = await axios.get(`http://localhost:3000/api/get-draft`, {
            params: {
              userId: usernameValue,
              examId,
            },
          });
          if (response.data && Array.isArray(response.data.answerData)) {
            setUserAnswerData(response.data.answerData);
          } else {
            setUserAnswerData([]); // Initialize with empty array if no data
          }
        } catch (error) {
          console.error("Error fetching draft:", error);
          setUserAnswerData([]); // Initialize with empty array on error
        } finally {
          setLoading(false);
        }
      }
    };

    if (examId) {
      fetchUsernameAndDraft();
    }
  }, [examId]);

  // Sync local state when question changes
  useEffect(() => {
    if (userAnswerData && userAnswerData[qNo]) {
      const currentAnswer = userAnswerData[qNo].answer;

      if (type === "code" || type === "Text") {
        // Editor content handles this
      } else if (multicheck && Array.isArray(currentAnswer)) {
        setSelectedOptions(currentAnswer);
        setSelectedRadio([]);
      } else if (!multicheck && currentAnswer) {
        setSelectedRadio([currentAnswer]);
        setSelectedOptions([]);
      } else {
        setSelectedOptions([]);
        setSelectedRadio([]);
      }
    } else {
      setSelectedOptions([]);
      setSelectedRadio([]);
    }
  }, [qNo, userAnswerData, multicheck, type]);

  // Auto-save user answer as a draft every 30 seconds
  useEffect(() => {
    const saveDraftInterval = setInterval(() => {
      saveUserAnswerDraft();
    }, 10000); // 30 seconds

    return () => {
      clearInterval(saveDraftInterval); // Cleanup interval on unmount
    };
  }, [userAnswerData, examId]);

  // Modify save function to accept data parameter
  const saveUserAnswerDraft = async (data) => {
    if (!examId) return;
    try {
      const response = await axios.post("http://localhost:3000/api/save-draft", {
        userId: username,
        examId,
        userAnswerData: data || userAnswerData,
        timestamp: new Date(),
      });
      console.log("Draft saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  // Update answer content and save immediately
  const setAnswerContent = (value) => {
    setUserAnswerData((prevUserAnswers) => {
      const newAnswerArray = Array.isArray(prevUserAnswers) ? [...prevUserAnswers] : [];
      newAnswerArray[qNo] = { ...(newAnswerArray[qNo] || {}), answer: value };
      saveUserAnswerDraft(newAnswerArray); // Immediate save with new data
      return newAnswerArray;
    });
  };

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    const newSelectedOptions = selectedOptions.includes(value)
      ? selectedOptions.filter((item) => item !== value)
      : [...selectedOptions, value];

    setSelectedOptions(newSelectedOptions);
    setAnswerContent(newSelectedOptions);
  };

  const handleRadioButtonChange = (event) => {
    const value = event.target.value;
    setSelectedRadio([value]);
    setAnswerContent(value);
  };

  const isCheckBoxChecked = (option) => {
    return selectedOptions.includes(option);
  };

  const isRadioButtonSelected = (option) => {
    return selectedRadio.includes(option);
  };

  // Function to get the current answer for code/text questions
  const changeDefaultAnswerSectionContent = () => {
    return userAnswerData && userAnswerData[qNo] && userAnswerData[qNo].answer
      ? userAnswerData[qNo].answer
      : ""; // Default to empty string
  };

  // Update available languages when 'lang' prop changes
  useEffect(() => {
    if (lang && Array.isArray(lang)) {
      setAvailableLanguages(lang);
      setLanguage(lang[0] || "javascript"); // Set default language
    }
  }, [lang]);

  const options = {
    quickSuggestions: false,
  };

  const handleThemeSelect = (event) => {
    const selectedTheme = event.target.value;
    setTheme(selectedTheme);
  };

  const handleLanguageSelect = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
  };

  const EditorSettings = () => (
    <div className="settings">
      <select name="theme" className="theme-select" onChange={handleThemeSelect} value={theme}>
        <option value="vs-dark">Dark</option>
        <option value="light">Light</option>
      </select>
      <select name="language" className="language-select" onChange={handleLanguageSelect} value={language}>
        {availableLanguages.map((langOption, index) => (
          <option value={langOption} key={index}>
            {langOption}
          </option>
        ))}
      </select>
    </div>
  );

  const MultiCheckComponent = ({ multiCheckOptions }) => (
    <div className="answer-multicontent">
      {multiCheckOptions.map((option) => (
        <label key={option} className="checkbox-label">
          <input
            type="checkbox"
            value={option}
            checked={isCheckBoxChecked(option)}
            onChange={handleCheckboxChange}
          />
          {option}
        </label>
      ))}
    </div>
  );

  const MultiChoiceComponent = ({ multiChoiceOptions }) => (
    <div className="answer-multicontent">
      {multiChoiceOptions.map((option) => (
        <label key={option} className="checkbox-label">
          <input
            type="radio"
            name={`question-${qNo}`} // Ensure radio buttons are grouped per question
            value={option}
            checked={isRadioButtonSelected(option)}
            onChange={handleRadioButtonChange}
          />
          {option}
        </label>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.7 }}
    >
      <div className="assessment-answercontent">
        {type === "code" ? (
          <>
            <EditorSettings />
            <Editor
              height="90vh"
              theme={theme}
              value={changeDefaultAnswerSectionContent()}
              onChange={(value) => setAnswerContent(value)}
              options={options}
              language={language}
            />
          </>
        ) : type === "Text" ? (
          <textarea
            className="modern-text-editor"
            value={changeDefaultAnswerSectionContent()}
            onChange={(e) => setAnswerContent(e.target.value)}
            placeholder="Type your answer here..."
            style={{
              height: "90vh",
              width: "100%",
              padding: "1.5rem",
              borderRadius: "12px",
              border: "2px solid #e0e0e0",
              backgroundColor: "#f8fafc",
              fontSize: "16px",
              lineHeight: "1.6",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              resize: "vertical",
            }}
            onFocus={(e) => {
              e.target.style.backgroundColor = "#ffffff";
              e.target.style.borderColor = "#6366f1";
              e.target.style.boxShadow = "0 0 0 4px rgba(99, 102, 241, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.backgroundColor = "#f8fafc";
              e.target.style.borderColor = "#e0e0e0";
              e.target.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.metaKey) {
                e.target.style.transform = "scale(0.98)";
                setTimeout(() => {
                  e.target.style.transform = "scale(1)";
                }, 100);
              }
            }}
          />
        ) : type === "MCQ" ? (
          multicheck ? (
            <MultiCheckComponent multiCheckOptions={option} />
          ) : (
            <MultiChoiceComponent multiChoiceOptions={option} />
          )
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </motion.div>
  );
}