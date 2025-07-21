import React from "react";
import styles from "./CommonComponents.module.css"; // Importing styles
import { FaSquareFacebook } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";

export default function CommonFooter() {
  return (
    <div className={styles['common-footer-content']}>
      <div className={styles['cf-right-content']}>
        <div className={styles['cf-left-content']}>
          <div className={styles['cf-logo']}>
            <h3></h3>
          </div>
          <div className={`${styles['cf']} ${styles['social-media']}`}>
            <div className={styles['cf-heading']}>Connect with us</div>
            <ul className={styles['cf-icons']}>
              <li className={styles['cf-icon-link']}>
                <FaSquareFacebook className={styles['cf-icon']} />
              </li>
              <li className={styles['cf-icon-link']}>
                <FaInstagramSquare className={styles['cf-icon']} />
              </li>
              <li className={styles['cf-icon-link']}>
                <FaSquareXTwitter className={styles['cf-icon']} />
              </li>
              <li className={styles['cf-icon-link']}>
                <FaLinkedin className={styles['cf-icon']} />
              </li>
            </ul>
          </div>
        </div>
        <ul className={`${styles['cf-first-content']} ${styles['cf-links-content']}`}>
          <li className={styles['cf-links']}>About Us</li>
          <li className={styles['cf-links']}>Careers</li>
          <li className={styles['cf-links']}>Employee home</li>
          <li className={styles['cf-links']}>Sitemap</li>
          <li className={styles['cf-links']}>Credits</li>
        </ul>
        <ul className={`${styles['cf-second-content']} ${styles['cf-links-content']}`}>
          <li className={styles['cf-links']}>Help center</li>
          <li className={styles['cf-links']}>Summon/Notices</li>
          <li className={styles['cf-links']}>Grievances</li>
          <li className={styles['cf-links']}>Report issue</li>
        </ul>
        <ul className={`${styles['cf-third-content']} ${styles['cf-links-content']}`}>
          <li className={styles['cf-links']}>Privacy policy</li>
          <li className={styles['cf-links']}>Terms & Conditions</li>
          <li className={styles['cf-links']}>Fraud alert</li>
          <li className={styles['cf-links']}>Trust & safety</li>
        </ul>
      </div>
      <div className={styles['cf-bottom-content']}>
        Copyright © 2023. All rights reserved. Made with ❤️ by Job Circuit
      </div>
    </div>
  );
}
