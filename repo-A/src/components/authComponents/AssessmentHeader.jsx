import React, { useState, useEffect } from "react";
import "./authComponentStyle.css";
import { GiHamburgerMenu } from "react-icons/gi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // For decoding JWT tokens

export default function AssessmentHeader() {
  const [responsiveAssessmentMenu, setResponsiveAssessmentMenu] = useState(
    "responsive-assessment-menu-hidden ahm"
  );
  const [time, setTime] = useState({ hours: 2, minutes: 0, seconds: 15 });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userId, setUserId] = useState("guest"); // Initialize as "guest" for fallback
  const [examId, setExamId] = useState(""); // Exam ID will be dynamically fetched
  const router = useRouter();

  // Extract userId from JWT token
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const email = decodedToken.sub || decodedToken.email;
        if (email) {
          const extractedUserId = email.split("@")[0];
          setUserId(extractedUserId);
          console.log("User ID extracted:", extractedUserId);
        } else {
          console.error("Email not found in token");
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    } else {
      console.warn("No auth token found. Defaulting to guest user.");
    }
  }, []);

  // Fetch exam ID from the FastAPI endpoint
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

  // Fetch timer state from the backend
  useEffect(() => {
    const fetchTimer = async () => {
      if (!userId || !examId) return; // Ensure both userId and examId are available

      try {
        const response = await axios.get("/api/timer", { params: { userId, examId } });
        if (response.data.success && response.data.data) {
          setTime(response.data.data.remainingTime);
        } else {
          console.log("No existing timer data found. Starting new timer.");
          setTime({ hours: 2, minutes: 0, seconds: 0 });
        }
      } catch (error) {
        console.error("Error fetching timer state:", error.message);
        setTime({ hours: 2, minutes: 0, seconds: 0 });
      }
    };

    if (userId !== "guest" && examId) {
      fetchTimer();
    }
  }, [userId, examId]);

  // Timer logic with sync to backend
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTime((prevTime) => {
        const { hours, minutes, seconds } = prevTime;

        if (hours === 0 && minutes === 0 && seconds === 0) {
          clearInterval(timerInterval);
          handleTimerEnd();
          return prevTime;
        } else if (seconds > 0) {
          return { ...prevTime, seconds: seconds - 1 };
        } else if (minutes > 0) {
          return { hours, minutes: minutes - 1, seconds: 59 };
        } else if (hours > 0) {
          return { hours: hours - 1, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    const syncInterval = setInterval(async () => {
      setTime((latestTime) => {
        saveTimerState(latestTime);
        return latestTime;
      });
    }, 30000);

    return () => {
      clearInterval(timerInterval);
      clearInterval(syncInterval);
    };
  }, [userId, examId]);

  const saveTimerState = async (latestTime) => {
    try {
      await axios.post("/api/timer", {
        userId,
        examId,
        remainingTime: latestTime,
      });
      console.log("Timer synced successfully for user:", userId, "and exam:", examId);
    } catch (error) {
      console.error("Error syncing timer state:", error.response?.data || error.message);
    }
  };

  const handleTimerEnd = async () => {
    await saveTimerState(time); // Save the timer state before submission
  
    // Get exam_id from local storage
    const examId = localStorage.getItem("exam_id");
    if (!examId) {
      console.error("Exam ID not found in local storage.");
      return;
    }
  
    try {
      // Call the /evaluate_answers endpoint
      const response = await fetch(`http://localhost:8000/evaluate_answers?exam_id=${examId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to evaluate answers. Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Evaluation Result:", data);

      // localStorage.removeItem("exam_id");
  
      // Redirect after successful submission
      setIsSubmitted(true);
      router.push("/Professionals/Test-Submitted");
    } catch (error) {
      console.error("Error while submitting answers:", error);
    }
  };
  
  const handleSubmit = async () => {
    await saveTimerState(time); // Save the timer state before submission
  
    // Get exam_id from local storage
    const examId = localStorage.getItem("exam_id");
    if (!examId) {
      console.error("Exam ID not found in local storage.");
      return;
    }
  
    try {
      // Call the /evaluate_answers endpoint
      const response = await fetch(`http://localhost:8000/evaluate_answers?exam_id=${examId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to evaluate answers. Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Evaluation Result:", data);

      // localStorage.removeItem("exam_id");
  
      // Redirect after successful submission
      setIsSubmitted(true);
      router.push("/Professionals/Test-Submitted");
    } catch (error) {
      console.error("Error while submitting answers:", error);
    }
  };

  const handleAssessmentMenuVisibility = () => {
    setResponsiveAssessmentMenu("responsive-assessment-menu-visible ahm");
  };

  const closeAssessmentModal = () => {
    setResponsiveAssessmentMenu("responsive-assessment-menu-hidden ahm");
  };

  const formatTime = (unit) => (unit < 10 ? `0${unit}` : unit);

  return (
    <div className="assessmentheader-maincontent assessment-content">
      <div className="assessmentheader-leftcontent">
        <Link href="./Home/"></Link>
      </div>
      <div className="assessmentheader-rightcontent">
        {!isSubmitted ? (
          <>
            <div className="countdowntime">
              <p>{formatTime(time.hours)}:{formatTime(time.minutes)}:{formatTime(time.seconds)}</p>
            </div>
            <button className="assessment-submit" onClick={handleSubmit}>
              <p>Submit Exam</p>
            </button>
          </>
        ) : (
          <div className="submission-message">
            {/* Loading spinner */}
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
            <h1>Submitting your answers...</h1>
          </div>
        )}
        <button
          type="button"
          className="navbar-hamburger assessment-hamburger"
          onClick={handleAssessmentMenuVisibility}
          aria-label="Menu"
          title="Menu"
        >
          <GiHamburgerMenu className="hamburger-icon" aria-hidden="true" />
        </button>
      </div>
      <div className={responsiveAssessmentMenu}>
        {!isSubmitted ? (
          <>
            <div className="countdowntime responsive-countdowntime">
              <p>{formatTime(time.hours)}:{formatTime(time.minutes)}:{formatTime(time.seconds)}</p>
            </div>
            <button className="assessment-submit responsive-assessment-submit" onClick={handleSubmit}>
              <p>Submit Exam</p>
            </button>
          </>
        ) : ( 
          <div className="submission-message">
            <h1>Your answers have been successfully submitted!</h1>
          </div>
        )}
        <button className="close-assessment-modal" onClick={closeAssessmentModal}>
          close
        </button>
      </div>
    </div>
  );
}