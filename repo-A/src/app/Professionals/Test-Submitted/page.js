"use client";
import { useEffect, useState } from 'react';
import styles from './ExamFeedback.module.css';
import { jsPDF } from 'jspdf';
import { jwtDecode } from 'jwt-decode';

export default function ExamFeedback() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const examId = localStorage.getItem('exam_id');
        if (!examId) throw new Error('Exam ID not found in local storage');

        const response = await fetch(`http://localhost:8000/feedback/${examId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch results: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownloadPdf = () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication token not found');
      
      const decoded = jwtDecode(token);
      const email = decoded.email;
      const userName = decoded.name;

      if (!data.length || !data[0]?.feedback) {
        throw new Error('No feedback data available to download');
      }

      const doc = new jsPDF();
      let yPos = 20;
      const pageHeight = doc.internal.pageSize.height;

      const addNewPageIfNeeded = (blockHeight) => {
        if (yPos + blockHeight > pageHeight - 20) {
          doc.addPage();
          yPos = 20;
        }
      };

      // Add title
      doc.setFontSize(18);
      doc.text('Exam Feedback Report', 10, yPos);
      yPos += 15;

      // Add user info
      doc.setFontSize(12);
      doc.text(`Email ID: ${email}`, 10, yPos);
      yPos += 10;
      doc.text(`Name: ${userName}`, 10, yPos);
      yPos += 15;

      // Add feedback content
      data[0].feedback.forEach((item, index) => {
        doc.setFontSize(14);
        const questionTitle = `Question ${item.question_id}: ${item.question}`;
        const questionLines = doc.splitTextToSize(questionTitle, 180);
        const answerLines = doc.splitTextToSize(`Your Answer: ${item.answer}`, 180);
        const feedbackLines = doc.splitTextToSize(`Feedback: ${item.feedback}`, 180);
        const blockHeight =
          questionLines.length * 10 +
          10 + // Score
          answerLines.length * 10 +
          feedbackLines.length * 10 +
          20; // Padding + separator

        addNewPageIfNeeded(blockHeight);

        doc.text(questionLines, 10, yPos);
        yPos += questionLines.length * 10;

        doc.setFontSize(12);
        doc.text(`Score: ${item.score}`, 10, yPos);
        yPos += 10;

        doc.text(answerLines, 10, yPos);
        yPos += answerLines.length * 10;

        doc.text(feedbackLines, 10, yPos);
        yPos += feedbackLines.length * 10;

        // Add separator if not last item
        if (index < data[0].feedback.length - 1) {
          doc.setDrawColor(200);
          doc.line(10, yPos, 200, yPos);
          yPos += 10;
        }
      });

      doc.save('exam-feedback-report.pdf');
    } catch (error) {
      console.error('PDF generation error:', error);
      alert(`Error generating PDF: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button 
        onClick={handleDownloadPdf}
        className={styles.downloadButton}
      >
        Download PDF
      </button>
      
      <h1 className={styles.title}>Exam Feedback</h1>
      {data[0]?.feedback.map((item) => (
        <div key={item.question_id} className={styles.feedbackCard}>
          <div className={styles.questionHeader}>
            <div>
              <h3 className={styles.questionTitle}>Question {item.question_id}</h3>
              <p className={styles.questionText}>{item.question}</p>
            </div>
            <span className={`${styles.scoreBadge} ${item.score > 0 ? styles.scoreGood : styles.scoreBad}`}>
              Score: {item.score}
            </span>
          </div>
          <div className={styles.answerSection}>
            <p className={styles.sectionLabel}>Your Answer:</p>
            <p className={styles.answerText}>{item.answer}</p>
          </div>
          <div className={styles.feedbackSection}>
            <p className={styles.sectionLabel}>Feedback:</p>
            <p className={styles.feedbackText}>{item.feedback}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
