"use client";

import React from "react";
import Link from "next/link";
import './page.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useRouter } from "next/navigation";
import { jwtDecode } from 'jwt-decode';

export default function page() {
  const router = useRouter();
  const [userName, setUserName] = React.useState(null);

  const handleClick = (e) => {
    // Show confirmation dialog
    const confirmed = window.confirm("Are you sure you want to start the exam?");
    
    // If the user cancels, prevent navigation
    if (!confirmed) {
      e.preventDefault();
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decodedToken = jwtDecode(credentialResponse.credential);
      console.log("Google User:", decodedToken);
      localStorage.setItem("authToken", credentialResponse.credential);
      setUserName(decodedToken.name);
      // router.push("./Home/");
    } catch (error) {
      console.error("Error decoding Google token:", error);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Login Failed');
  };

  return (
    <div className="homepage">
      <div className="profilepage">
        <Link href="./Professionals/generateQuestions/" className="link-profile">
          Generate Questions and Exam-Id
        </Link>
      </div>
      <div className="assessmentpage">
        <Link href="./Professionals/assessment/" className="link-assessment" onClick={handleClick}>
          Write Exam
        </Link>
      </div>
      <div className="google-login">
        <GoogleOAuthProvider clientId="324196355188-glishm51qcpu5fjes6unnhiassr793fk.apps.googleusercontent.com">
          {userName ? (
            <span>Welcome, {userName}</span>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          )}
        </GoogleOAuthProvider>
      </div>
    </div>
  );
}
