"use client";

import React, { useEffect, useState } from "react";
import { TbEdit } from "react-icons/tb";
import PPEducationModal from "./ProfileModals/PPEducationModal";
import PPEducationEditModal from "./ProfileModals/EditModals/PPEducationEditModal";
import {
  educationModal,
  educationEditModal,
} from "@/store/atoms/UserEntityModals";
import { useRecoilState } from "recoil";
import { userEducationStore } from "@/store/atoms/ProfileEntities/UserPersonalProfileDetailsStore";
import styles from './PPStyle.module.css'; // Importing styles
import style from './ProfileModals/ModalStyles.module.css';

export default function PPEducation() {
  const [educationData, setEducationData] = useRecoilState(userEducationStore);
  const [educationNames, setEducationNames] = useState();
  const [missingNames, setMissingNames] = useState();
  const [educationEditId, setEducationEditId] = useState();

  let predefinedNames = [
    "PhD/Doctorate",
    "Masters/Post Graduation",
    "Graduation/Diploma",
    "Class 10th",
    "Class 12th",
  ];

  useEffect(() => {
    if (educationData) {
      const names = educationData.map((edu) => edu.educationName);
      setEducationNames(names);
      const missing = predefinedNames.filter((name) => !names.includes(name));
      setMissingNames(missing);
    }
  }, [educationData]);

  const [educationModalDisplayMain, setEducationModalDisplayMain] = useRecoilState(educationModal);
  const [educationEditModalDisplayMain, setEducationEditModalDisplayMain] = useRecoilState(educationEditModal);

  const openModal = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEducationModalDisplayMain(true);
  };

  const openEditModal = (educationId) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEducationEditId(educationId);
    setEducationEditModalDisplayMain(true);
  };

  return (
    educationData &&
    missingNames && (
      <>
        {educationModalDisplayMain && (
          <div className={`${style['education-modal']} ${style['global-modal-background']}`}>
            <PPEducationModal />
          </div>
        )}
        {educationEditModalDisplayMain && (
          <div className={`${style['education-modal']} ${style['global-modal-background']}`}>
            <PPEducationEditModal educationId={educationEditId} />
          </div>
        )}
        <div className={`${styles['pp-education-container']} ${styles['pp-content']}`} id="education">
          <div className={styles['content-info']}>
            <h3 className={styles['content-heading']}>Education</h3>
            <button className={styles['update-info']} onClick={openModal}>
              Add Education
            </button>
            <div className={styles['profile-edit']}>+</div>
          </div>
          <div className={styles['education-content']}>
            {console.log("This is", educationData)}
            {educationData.map((education) => (
              <div className={styles['education-details']} key={education.educationName}>
                <div className={`${styles['course']} ${styles['edu']}`}>
                  <div className={styles['course-name']}>{education.course}</div>
                  <div className={styles['specialization']}>
                    {education.specialization}
                  </div>
                  <button onClick={() => openEditModal(education.educationId)}>
                    <TbEdit className={styles['editIcon']} />
                  </button>
                </div>
                <div className={`${styles['institution']} ${styles['edu']}`}>
                  {education.universityName}
                </div>
                <div className={`${styles['education-duration-details']} ${styles['edu']}`}>
                  <div className={styles['education-duration']}>
                    {education.educationName === "Class 10th" ? (
                      <>{education.courseDuration.endYear}</>
                    ) : (
                      <>
                        {education.courseDuration.startYear}-{" "}
                        {education.courseDuration.endYear}
                      </>
                    )}
                  </div>
                  <div>|</div>
                  <div className={styles['education-time']}>{education.courseType}</div>
                </div>
              </div>
            ))}
            {missingNames.map((missedEducation) => (
              <button className={styles['addMissingEducation']} key={missedEducation}>
                Add {missedEducation}
              </button>
            ))}
          </div>
        </div>
      </>
    )
  );
}
