import React, { useState } from "react";
import styles from './PPStyle.module.css'; // Importing styles from the CSS module
import { IoNotificationsOutline } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";
import Link from "next/link";

export default function PPNavBar() {
  const [ppMenuName, setPpMenuName] = useState(
    `${styles['pp-responsive-menu']} ${styles['pp-menu-invisible']}`
  );

  function handlePPMenuVisibility() {
    ppMenuName === `${styles['pp-responsive-menu']} ${styles['pp-menu-visible']}`
      ? setPpMenuName(`${styles['pp-responsive-menu']} ${styles['pp-menu-invisible']}`)
      : setPpMenuName(`${styles['pp-responsive-menu']} ${styles['pp-menu-visible']}`);
  }

  return (
    <div className={`${styles['pp-navbar-container']} ${styles['pp-div']}`}>
      <div className={styles['pp-nav-left']}>
        <div className={ppMenuName}>
          <div className={styles['pp-menu-slidebar']}>
            <ul className={styles['pp-menu-responsive-options']}>
              <li className={styles['menu-personal-info']}>
                <div className={styles['menu-profile-image']}>
                  <img
                    className={styles['menu-profile-img']}
                    src="../profile-pic.png"
                    alt="user-profile-picture"
                  />
                </div>
                <div className={styles['menu-profile-bio']}>
                  <div className={styles['menu-name']}>Rina Williams</div>
                  <div className={styles['menu-tag']}>Software Developer</div>
                  <div className={styles['menu-update-link']}>View Profile</div>
                </div>
              </li>
              <Link href="../Home/" className={styles['link']}>
                Home
              </Link>
              <li>Companies</li>
              <li>Services</li>
              <li>Feedback</li>
            </ul>
          </div>
          <div
            className={styles['pp-menu-extra-content']}
            onClick={handlePPMenuVisibility}
          ></div>
        </div>
        <div className={styles['pp-responsive-navbar-hamburger-menu']}>
          <button
            className={styles['pp-hamburger-menu']}
            onClick={handlePPMenuVisibility}
          >
            <IoMdMenu className={styles['pp-hamburger-icon']} />
          </button>
        </div>
        <h1 className={styles['navbar-heading']}></h1>
      </div>
      <div className={styles['pp-nav-right']}>
        <div className={styles['menu-options']}>
          <ul className={`${styles['menu-standard']} ${styles['menu-items-regular']}`}>
            <Link href="./Home/" className={styles['link']}>
              Home
            </Link>
            <li>Companies</li>
            <li>Services</li>
          </ul>
          <ul className={`${styles['menu-custom']} ${styles['menu-items-regular']}`}>
            <li className={styles['notification-block']}>
              <div className={styles['notification-icon']}>
                <IoNotificationsOutline className={styles['react-notification-icon']} />
              </div>
              <div className={styles['notification-count']}>2</div>
            </li>
            <li className={styles['profile-img-block']}>
              <img
                className={styles['navbar-profile-img']}
                src="../profile-pic.png"
                alt="user-profile-picture"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
