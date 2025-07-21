import Loading from "@/app/loading";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { useRecoilState } from "recoil";
import { skillModal } from "@/store/atoms/UserEntityModals";
import PPSkillModal from "./ProfileModals/PPSkillModal";
import { userSkillsStore } from "@/store/atoms/ProfileEntities/UserPersonalProfileDetailsStore";
import styles from './PPStyle.module.css'; // Importing styles
import style from './ProfileModals/ModalStyles.module.css'

export default function PPSkills() {
  const [filteredPrimarySkillsData, setFilteredPrimarySkillsData] = useState();
  const [filteredSecondarySkillsData, setFilteredSecondarySkillsData] = useState();
  const [userSkillsData, setUserSkillsData] = useRecoilState(userSkillsStore);

  useEffect(() => {
    console.log("-----------Skills Data-----------");
    if (userSkillsData !== null) {
      const filteredSecondarySkills = userSkillsData.filter(
        (skill) => skill.skillType === "secondary"
      );
      const filteredPrimarySkills = userSkillsData.filter(
        (skill) => skill.skillType === "primary"
      );

      setFilteredPrimarySkillsData(filteredPrimarySkills);
      setFilteredSecondarySkillsData(filteredSecondarySkills);
    }
  }, [userSkillsData]);

  const [skillModalDisplayMain, setskillModalDisplayMain] = useRecoilState(skillModal);

  const openModal = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setskillModalDisplayMain(true);
  };

  return (
    filteredPrimarySkillsData &&
    filteredSecondarySkillsData && (
      <>
        {skillModalDisplayMain && (
          <div className={`${style['experience-modal']} ${style['global-modal-background']}`}>
            <PPSkillModal />
          </div>
        )}
        <div className={`${styles['pp-skills-container']} ${styles['pp-content']}`} id="skills">
          <div className={styles['content-info']}>
            <h3 className={styles['content-heading']}>Skills</h3>
            <button className={styles['update-info']} onClick={openModal}>
              Update Skills
            </button>
            <div className={styles['profile-edit']}>
              <CiEdit className={styles['pe-icon']} />
            </div>
          </div>
          <div className={styles['skills-content']}>
            <div className={`${styles['primary-skills-div']} ${styles['skill-div']}`}>
              <h4>Primary Skills</h4>
              <ul className={styles['primary-skills']}>
                {filteredPrimarySkillsData.map((skill, index) => (
                  <li key={skill.skillName}>{skill.skillName}</li>
                ))}
              </ul>
            </div>

            <div className={`${styles['secondary-skills-div']} ${styles['skill-div']}`}>
              <h4>Secondary Skills</h4>
              <ul className={styles['secondary-skills']}>
                {filteredSecondarySkillsData.map((skill, index) => (
                  <li key={skill.skillName}>{skill.skillName}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </>
    )
  );
}
