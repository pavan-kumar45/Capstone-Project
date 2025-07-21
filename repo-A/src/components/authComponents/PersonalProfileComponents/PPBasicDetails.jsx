import React, { useState } from "react";

import { PiSuitcaseSimple } from "react-icons/pi";
import { BiWalletAlt } from "react-icons/bi";
import { IoCallOutline } from "react-icons/io5";
import { SlLocationPin } from "react-icons/sl";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaExternalLinkAlt } from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { FaLink } from "react-icons/fa6";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { profileModal, picModal } from "@/store/atoms/UserEntityModals";
import PPProfileModal from "./ProfileModals/PPProfileModal";
import Loading from "@/app/loading";
import { useRecoilState } from "recoil";
import PPProfilePicModal from "./ProfileModals/PPProfilePicModal";
import {
  userBasicDetailsStore,
  userProfileStore,
} from "@/store/atoms/ProfileEntities/UserPersonalProfileDetailsStore";
import { userExperienceStore } from "@/store/atoms/ProfileEntities/UserPersonalProfileDetailsStore";
import styles from './PPStyle.module.css'; // Importing styles
import style from './ProfileModals/ModalStyles.module.css'

export default function PPBasicDetails({ basicDetails }) {
  const [progress, setProgress] = useState(100);
  const [basicDetailsData, setBasicDetailsData] = useRecoilState(
    userBasicDetailsStore
  );
  const [userProfile, setUserProfile] = useRecoilState(userProfileStore);
  const [userExperienceData, setUserExperienceData] =
    useRecoilState(userExperienceStore);
  const progressBarColors = {
    low: "#f04141",
    good: "#47b749",
    average: "#FDAA29",
  };
  const handleProgressBarColors = (progress) => {
    if (progress <= 25) {
      return progressBarColors.low;
    } else if (progress > 25 && progress <= 75) {
      return progressBarColors.average;
    } else {
      return progressBarColors.good;
    }
  };

  const [profileModalDisplayMain, setProfileModalDisplayMain] =
    useRecoilState(profileModal);
  const openModal = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setProfileModalDisplayMain(true);
  };

  const [picModalDisplayMain, setPicModalDisplayMain] =
    useRecoilState(picModal);
  const openPicModal = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPicModalDisplayMain(true);
  };

  return basicDetailsData && userExperienceData ? (
    <div className={`${styles['pp-summary-container']} ${styles['pp-div']}`}>
      {profileModalDisplayMain && (
        <div className={`${style['profile-modal']} ${style['global-modal-background']}`}>
          <PPProfileModal />
        </div>  
      )}
      {picModalDisplayMain && (
        <div className={`${style['pic-modal']} ${style['global-modal-background']}`}>
          <PPProfilePicModal />
        </div>
      )}
      <div className={styles['left-summary']}>
        <div className={styles['user-image-circle']}>
          <CircularProgressbarWithChildren
            value={userProfile.userProfileCompletion}
            className={styles['react-circle']}
            strokeWidth={3}
            styles={buildStyles({
              pathColor: handleProgressBarColors(
                userProfile.userProfileCompletion
              ),
              trailColor: "transparent",
            })}
          >
            <img
              className={styles['user-pic']}
              src={
                userProfile.userProfilePicLink
                  ? userProfile.userProfilePicLink
                  : "../defaultProfilePic.jpeg"
              }
              alt="user-profile-picture"
            />
          </CircularProgressbarWithChildren>
          <div
            className={styles['progress-status']}
            style={{
              color: handleProgressBarColors(userProfile.userProfileCompletion),
            }}
          >
            {userProfile.userProfileCompletion}%
          </div>
        </div>
        <button
          className={`${styles['edit-profile-image-button']} ${styles['image-button']}`}
          onClick={openPicModal}
        >
          Update Image
        </button>
        <div className={styles['profile-edit']}>
          <CiEdit className={styles['pe-icon']} />
        </div>
      </div>
      <div className={styles['right-summary']}>
        <div className={styles['top-summary']}>
          <div className={styles['top-left-summary']}>
            <div className={styles['main-head']}>
              <h2 className={styles['user-name']}>{basicDetailsData.fullname}</h2>
            </div>
            <p className={styles['user-profession-tag']}>
              <b>{userExperienceData[0].designation}</b>
            </p>
            <p className={styles['user-current-job']}>
              at<span> {userExperienceData[0].companyName}</span>
            </p>
          </div>
          <div className={styles['top-right-summary']}>
            <button className={styles['update-info']} onClick={openModal}>
              Update Profile
            </button>
            <div className={styles['last-updated']}>
              <span className={styles['last-updated']}>Profile last updated - </span>
              <span className={styles['last-updated-time']}>
                {basicDetailsData.profilelastupdated}
              </span>
            </div>
          </div>
        </div>
        <div className={styles['bottom-summary']}>
          <div className={styles['bottom-left-summary']}>
            <div className={`${styles['user-currentlocation']} ${styles['info-content']}`} title="Location">
              <span className={`${styles['address-icon']} ${styles['info-icon']}`}>
                <SlLocationPin />
              </span>
              <span className={styles['user-city']}>
                {basicDetailsData.currentlocation.city},{" "}
              </span>
              <span className={styles['user-country']}>
                {basicDetailsData.currentlocation.country}
              </span>
            </div>
            <div
              className={`${styles['user-experience']} ${styles['info-content']}`}
              title="Total Experience"
            >
              <span className={`${styles['suitcase-icon']} ${styles['info-icon']}`}>
                <PiSuitcaseSimple />
              </span>
              {basicDetailsData.experience.years ? (
                <>
                  <span className={styles['user-year']}>
                    {basicDetailsData.experience.years} Year,
                  </span>
                  <span className={styles['user-month']}>
                    {basicDetailsData.experience.months} Months
                  </span>
                </>
              ) : (
                <span className={styles['user-year']}>Fresher</span>
              )}
            </div>
            <div className={`${styles['user-expectedctc']} ${styles['info-content']}`} title="Expected CTC">
              <span className={`${styles['wallet-icon']} ${styles['info-icon']}`}>
                <BiWalletAlt />
              </span>
              <span className={styles['ctc']}>
                {basicDetailsData.expectedCTC.currency}{" "}
                {parseInt(basicDetailsData.expectedCTC.amount)}
              </span>
            </div>
          </div>
          <div className={styles['bottom-right-summary']}>
            <div className={`${styles['user-phonenumber']} ${styles['info-content']}`} title="Phone Number">
              <span className={`${styles['call-icon']} ${styles['info-icon']}`}>
                <IoCallOutline />
              </span>
              <span className={styles['number']}>
                {basicDetailsData.mobilenumber.number}
              </span>
              {basicDetailsData.mobilenumber.verified ? (
                <span className={styles['user-verified']}>
                  <RiVerifiedBadgeFill />
                </span>
              ) : (
                <span className={styles['user-verified']}></span>
              )}
            </div>
            <div className={`${styles['user-email']} ${styles['info-content']}`} title="Email">
              <span className={`${styles['email-icon']} ${styles['info-icon']}`}>
                <MdOutlineMailOutline />
              </span>
              <span className={styles['email']}>{basicDetailsData.email.address}</span>
              {basicDetailsData.email.verified ? (
                <span className={styles['user-verified']}>
                  <RiVerifiedBadgeFill />
                </span>
              ) : (
                <span className={styles['user-verified']}></span>
              )}
            </div>
            <div className={`${styles['user-noticeperiod']} ${styles['info-content']}`} title="Notice Period">
              <span className={`${styles['calendar-icon']} ${styles['info-icon']}`}>
                <FaLink />
              </span>
              <span className={styles['social-media-links']}>
                {basicDetailsData.githubLink && (
                  <a href={basicDetailsData.githubLink} target="_blank" rel="noopener noreferrer">
                    Github <FaExternalLinkAlt className={styles['external-link']} />
                  </a>
                )}
                {basicDetailsData.linkedinLink && (
                  <a href={basicDetailsData.linkedinLink} target="_blank" rel="noopener noreferrer">
                    LinkedIn <FaExternalLinkAlt className={styles['external-link']} />
                  </a>
                )}
                {basicDetailsData.portfolioLink && (
                  <a href={basicDetailsData.portfolioLink} target="_blank" rel="noopener noreferrer">
                    Portfolio <FaExternalLinkAlt className={styles['external-link']} />
                  </a>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
}
