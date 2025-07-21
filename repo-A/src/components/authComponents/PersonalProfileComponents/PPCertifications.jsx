import React, { useState, useEffect } from "react";
import { TbEdit } from "react-icons/tb";
import PPCertificationModal from "./ProfileModals/PPCertificationModal";
import {
  certificationEditModal,
  certificationModal,
} from "@/store/atoms/UserEntityModals";
import { useRecoilState } from "recoil";
import PPCertificationEditModal from "./ProfileModals/EditModals/PPCertificationEditModal";
import { userCertificationStore } from "@/store/atoms/ProfileEntities/UserPersonalProfileDetailsStore";
import styles from './PPStyle.module.css'; // Importing styles
import style from './ProfileModals/ModalStyles.module.css';

export default function PPCertifications({ certification }) {
  const [certificationData, setCertificationData] = useRecoilState(userCertificationStore);

  const [certificationModalDisplayMain, setCertificationModalDisplayMain] = useRecoilState(certificationModal);

  const openModal = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCertificationModalDisplayMain(true);
  };

  const [certificationEditModalDisplayMain, setCertificationEditModalDisplayMain] = useRecoilState(certificationEditModal);

  const [selectedCertificationId, setSelectedCertificationId] = useState();

  const openEditModal = (id) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedCertificationId(id);
    setCertificationEditModalDisplayMain(true);
  };

  return (
    certificationData && (
      <>
        {certificationModalDisplayMain && (
          <div className={`${style['education-modal']} ${style['global-modal-background']}`}>
            <PPCertificationModal />
          </div>
        )}
        {certificationEditModalDisplayMain && (
          <div className={`${style['education-modal']} ${style['global-modal-background']}`}>
            <PPCertificationEditModal certificationId={selectedCertificationId} />
          </div>
        )}
        <div className={`${styles['pp-accomplishment-container']} ${styles['pp-content']}`} id="certifications">
          <div className={styles['content-info']}>
            <h3 className={styles['content-heading']}>Accomplishments</h3>
            <button className={styles['update-info']} onClick={openModal}>
              Add Accomplishment
            </button>
            <div className={styles['profile-edit']}>+</div>
          </div>
          {certificationData.map((certification) => (
            <div className={styles['accomplishment-content']} key={certification.id}>
              <div className={`${styles['certification-content']} ${styles['acc-details']}`}>
                <h4 className={styles['cert']}>
                  {certification.type}
                  <button onClick={() => openEditModal(certification.id)}>
                    <TbEdit className={styles['editIcon']} />
                  </button>
                </h4>
                <div className={styles['accomplishment-title']}>
                  {certification.name}
                </div>
                <div className={styles['accomplishment-date']}>
                  {certification.issuedDate.certificationmontth} {certification.issuedDate.year}
                </div>
                <div className={styles['accomplishment-description']}>
                  <p>{certification.description}</p>
                </div>
                <div className={styles['accomplishment-url']}>
                  <a href={certification.relatedLink}>
                    More Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  );
}
