import React from "react";
import styles from './PPStyle.module.css'; // Importing styles from the CSS module

export default function PPQuickLinks() {
  return (
    <div className={styles['pp-quicklinks-container']}>
      <h3>Quick Links</h3>
      <div className={styles['quick-links']}>
        <ul>
          <li>
            <a href="#summary">Summary</a>
          </li>
          <li>
            <a href="#skills">Skills</a>
          </li>
          <li>
            <a href="#experience">Experience</a>
          </li>
          <li>
            <a href="#education">Education</a>
          </li>
          <li>
            <a href="#certifications">Certifications</a>
          </li>
          <li>
            <a href="#personal">Personal Details</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
