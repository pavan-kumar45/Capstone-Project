import React, { useState } from "react";
import { TbEdit } from "react-icons/tb";
import PPExperienceModal from "./ProfileModals/PPExperienceModal";
import PPExperienceEditModal from "./ProfileModals/EditModals/PPExperienceEditModal";
import {
  experienceModal,
  experienceEditModal,
} from "@/store/atoms/UserEntityModals";
import { useRecoilState } from "recoil";
import { userExperienceStore } from "@/store/atoms/ProfileEntities/UserPersonalProfileDetailsStore";
import styles from './PPStyle.module.css'; // Importing styles
import style from './ProfileModals/ModalStyles.module.css'

const paraTrimmer = (jobProfile) => {
  if (jobProfile.length > 50) {
    return jobProfile.substring(0, 300) + "...";
  }
  return jobProfile;
};

const getMonthName = (monthNum) => {
  const date = new Date(null, monthNum - 1);
  return date.toLocaleString("default", { month: "long" });
};

export default function PPExperience() {
  const [experienceData, setExperienceData] = useRecoilState(userExperienceStore);
  const [experienceModalDisplayMain, setExperienceModalDisplayMain] = useRecoilState(experienceModal);

  const [experienceEditModalDisplayMain, setExperienceEditModalDisplayMain] = useRecoilState(experienceEditModal);

  const [experienceEditId, setExperienceEditId] = useState();

  const openModal = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExperienceModalDisplayMain(true);
  };

  const openEditModal = (employmentId) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExperienceEditId(employmentId);
    setExperienceEditModalDisplayMain(true);
  };

  return (
    <>
      {experienceModalDisplayMain && (
        <div className={`${style['experience-modal']} ${style['global-modal-background']}`}>
          <PPExperienceModal />
        </div>
      )}
      {experienceEditModalDisplayMain && experienceEditId && (
        <div className={`${style['experience-modal']} ${style['global-modal-background']}`}>
          <PPExperienceEditModal employmentId={experienceEditId} />
        </div>
      )}
      <div className={`${styles['pp-experience-container']} ${styles['pp-content']}`} id="experience">
        <div className={styles['content-info']}>
          <h3 className={styles['content-heading']}>Experience</h3>
          <button className={styles['update-info']} onClick={openModal}>
            Add Experience
          </button>
          <div className={styles['profile-edit']}>+</div>
        </div>
        {experienceData &&
          experienceData.map((experience) => (
            <div className={styles['experience-content']} key={experience.employmentId}>
              <div className={`${styles['current-employment']} ${styles['employment-details']}`}>
                <div className={`${styles['designation']} ${styles['emp']}`}>
                  {experience.designation}
                  <button
                    id={experience.employmentId}
                    onClick={() => openEditModal(experience.employmentId)}
                  >
                    <TbEdit className={styles['editIcon']} />
                  </button>
                </div>
                <div className={`${styles['company-name']} ${styles['emp']}`}>
                  {experience.companyName}
                </div>
                <div className={`${styles['employment-type-duration']} ${styles['emp']}`}>
                  <div className={styles['employment-type']}>
                    {experience.employmentType}
                  </div>
                  <div className={styles['experience-seperation']}>|</div>
                  <div className={styles['employment-duration']}>
                    {experience.currentEmployment ? (
                      <>
                        {getMonthName(experience.joiningDate.joiningmonth)}{" "}
                        {experience.joiningDate.joiningyear} {"To Present"}
                      </>
                    ) : (
                      <>
                        {getMonthName(experience.joiningDate.joiningmonth)}{" "}
                        {experience.joiningDate.joiningyear} {"To"}{" "}
                        {getMonthName(experience.leavingDate.endingmonth)}{" "}
                        {experience.leavingDate.endingyear}
                      </>
                    )}{" "}
                    {experience.totalExperience.experienceyear !== null ? (
                      <>
                        ({experience.totalExperience.experienceyear} {"Year"}{" "}
                        {experience.totalExperience.experiencemonth} {"Months"})
                      </>
                    ) : (
                      <>
                        ({experience.totalExperience.experiencemonth} {"Months"})
                      </>
                    )}
                  </div>
                </div>
                <div className={`${styles['notice-period']} ${styles['emp']}`}>
                  {experience.noticeperiodsituation}
                </div>

                <div className={`${styles['job-profile']} ${styles['emp']}`}>
                  <p>{paraTrimmer(experience.jobProfile)}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
