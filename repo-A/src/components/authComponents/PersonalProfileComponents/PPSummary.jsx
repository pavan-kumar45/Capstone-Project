import Loading from "@/app/loading";
import React from "react";
import { CiEdit } from "react-icons/ci";
import { resumeModal, summaryModal } from "@/store/atoms/UserEntityModals";
import PPSummaryModal from "./ProfileModals/PPSummaryModal";
import { useRecoilState } from "recoil";
// import styles from './ProfileModals/ModalStyles.module.css'; // Importing styles
import PPResumeModal from "./ProfileModals/PPResumeModal";
import { userSummaryStore, userResumeDetailsStore } from "@/store/atoms/ProfileEntities/UserPersonalProfileDetailsStore";
import styles from './PPStyle.module.css';
import style from './ProfileModals/ModalStyles.module.css'

export default function PPSummary() {
  const [summaryModalDisplayMain, setSummaryModalDisplayMain] =
    useRecoilState(summaryModal);

  const openModal = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSummaryModalDisplayMain(true);
  };

  const [summaryData, setSummaryData] = useRecoilState(userSummaryStore);
  const [resumeData, setResumeData] = useRecoilState(userResumeDetailsStore); 

  const [resumeModalDisplayMain, setResumeModalDisplayMain] =
    useRecoilState(resumeModal);

  const openResumeModal = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setResumeModalDisplayMain(true);
  };

  return summaryData ? (
    <>
      {summaryModalDisplayMain && (
        <div className={`${style['summary-modal']} ${style['global-modal-background']}`}>
          <PPSummaryModal />
        </div>
      )}
      {resumeModalDisplayMain && (
        <div className={`${style['summary-modal']} ${style['global-modal-background']}`}>
          <PPResumeModal />
        </div>
      )}
      <div className={`${styles['pp-overview-content']} ${styles['pp-content']}`} id="summary">
        <div className={styles['content-info']}>
          <h3 className={styles['content-heading']}>Summary</h3>
          <button className={styles['update-info']} onClick={openModal}>
            Update Summary
          </button>
          <div className={styles['profile-edit']}>
            <CiEdit className={styles['pe-icon']} />
          </div>
        </div>
        <div className={styles['overview-content']}>
          <div className={styles['user-bio']}>{summaryData}</div>
          <div className={styles['resume-info']}>
            <h4 className={styles['content-heading']}>Resume</h4>
            <p>
              Resume is the most important document recruiters look for.
              Recruiters generally do not look at profiles without resumes.
            </p>
            <div className={styles['resume-attachment']}>
              <a href="">{resumeData.name}</a>
              <span> Uploaded on {resumeData.lastuploadeddate}</span>
            </div>

            <div className={styles['upload-resume']}>
              <button className={styles['upload']} onClick={openResumeModal}>Upload Resume</button>
              <p className={styles['supported-uploads']}>
                Supported Formats: doc, docx, rtf, pdf, up to 2 MB
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <Loading />
  );
}
