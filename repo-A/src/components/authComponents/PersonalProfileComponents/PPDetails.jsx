import React, { useEffect, useState } from "react";
import { CiCircleCheck, CiEdit } from "react-icons/ci";
import { detailsEditModal } from "@/store/atoms/UserEntityModals";
import PPDetailsEditModal from "./ProfileModals/EditModals/PPDetailsEditModal";
import { useRecoilState } from "recoil";
import styles from './PPStyle.module.css'; // Importing styles

export default function PPDetails({ details }) {
  const [detailsData, setDetailsData] = useState();

  useEffect(() => {
    console.log("--------------Details Data-----------------");
    console.log(details);
    setDetailsData(details);
  }, [details]);

  const [detailsModalDisplayMain, setDetailsModalDisplayMain] = useRecoilState(detailsEditModal);

  const openModal = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setDetailsModalDisplayMain(true);
  };

  return (
    detailsData && (
      <div className={`${styles['pp-details-container']} ${styles['pp-content']}`} id="personal">
        {detailsModalDisplayMain && (
          <div className={`${styles['education-modal']} ${styles['global-modal-background']}`}>
            <PPDetailsEditModal />
          </div>
        )}
        <div className={styles['content-info']}>
          <h3 className={styles['content-heading']}>Personal Details</h3>
          <button className={styles['update-info']} onClick={openModal}>
            Update Details
          </button>
          <div className={styles['profile-edit']}>
            <CiEdit className={styles['pe-icon']} />
          </div>
        </div>
        <div className={styles['details-content']}>
          <div className={styles['details-top-div']}>
            <div className={styles['details-left-div']}>
              <div className={`${styles['personal']} ${styles['detail-part']}`}>
                <p className={styles['details-heading']}>Personal Details</p>
                <p>
                  {detailsData.gender}, {detailsData.maritalstatus}
                </p>
              </div>
              <div className={`${styles['career-break']} ${styles['detail-part']}`}>
                <p className={styles['details-heading']}>Career break</p>
                <p>
                  {detailsData.careerbreak === false ? <>No</> : <></>}
                  {detailsData.careerbreak && (
                    <>
                      {detailsData.breakDuration.startMonth},{" "}
                      {detailsData.breakDuration.startYear} -{" "}
                      {detailsData.breakDuration.endMonth},{" "}
                      {detailsData.breakDuration.endYear}
                    </>
                  )}
                </p>
              </div>
              <div className={`${styles['dob']} ${styles['detail-part']}`}>
                <p className={styles['details-heading']}>Date Of Birth</p>
                <p>
                  {detailsData.dob.day} {detailsData.dob.month},{" "}
                  {detailsData.dob.year}
                </p>
              </div>
            </div>
            <div className={styles['details-right-div']}>
              <div className={`${styles['work-permit']} ${styles['detail-part']}`}>
                <p className={styles['details-heading']}>Work Permit</p>
                <p>
                  {detailsData.workPermitCountries.map((permit, index) => (
                    <span key={permit}>
                      {permit}
                      {index !== detailsData.workPermitCountries.length - 1 && ", "}
                    </span>
                  ))}
                </p>
              </div>
              <div className={`${styles['address']} ${styles['detail-part']}`}>
                <p className={styles['details-heading']}>Address</p>
                <p>{detailsData.permanentaddress}</p>
              </div>
            </div>
          </div>
          <div className={styles['details-bottom-div']}>
            <div className={styles['languages']}>
              <h4 className={styles['languages-heading']}>Languages</h4>
              <table>
                <thead>
                  <tr>
                    <th className={styles['details-heading']}>Language</th>
                    <th className={styles['details-heading']}>Proficiency</th>
                    <th className={styles['details-heading']}>Read</th>
                    <th className={styles['details-heading']}>Write</th>
                    <th className={styles['details-heading']}>Speak</th>
                  </tr>
                </thead>
                <tbody>
                  {detailsData.languages.map((language, index) => (
                    <tr key={index}>
                      <td>{language.languagename}</td>
                      <td>{language.proficiency}</td>
                      <td>{language.read ? <CiCircleCheck /> : <>-</>}</td>
                      <td>{language.write ? <CiCircleCheck /> : <>-</>}</td>
                      <td>{language.speak ? <CiCircleCheck /> : <>-</>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
