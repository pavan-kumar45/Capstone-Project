import React, { useState } from "react";
import { certificationModal } from "@/store/atoms/UserEntityModals";
import { useRecoilState } from "recoil";
import { userCertificationStore } from "@/store/atoms/ProfileEntities/UserPersonalProfileDetailsStore";
import { useForm } from "react-hook-form";
import useFormHandler from "@/utils/CommonAPI";
import styles from './ModalStyles.module.css'; // Importing styles

export default function PPCertificationModal() {
  const currentYear = new Date().getFullYear();
  const issuedYear = Array.from(
    { length: currentYear - 1939 },
    (_, index) => 1940 + index
  ).reverse();

  const [certificationModalDisplay, setCertificationModalDisplay] = useRecoilState(certificationModal);

  const closeModal = (event) => {
    event.preventDefault();
    setCertificationModalDisplay(false);
  };

  const [userCertificationData, setUserCertificationData] = useRecoilState(userCertificationStore);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const { handleFormSubmission } = useFormHandler();

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const updatedState = {
      id: 555,
      name: data.name,
      type: data.type,
      description: data.description,
      issuedDate: {
        year: data.year,
        month: data.month,
      },
      relatedLink: data.relatedLink,
    };

    setUserCertificationData([...userCertificationData, updatedState]); // Ensure the array is updated correctly
    handleFormSubmission("certifications", userCertificationData);
    console.log(updatedState);
  };

  return (
    <div className={`${styles['certification-modal-container']} ${styles['modal-container']}`}>
      <form
        className={`${styles['certification-form']} ${styles['user-form']}`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <button className={styles['close-modal']} onClick={closeModal}></button>
        <h3>Add Accomplishment</h3>
        <div className={`${styles['radio-group-div']} ${styles['row']}`}>
          <p className={`${styles['radio-group-question']} ${styles['form-question']}`}>Accomplishment</p>
          <div className={styles['form-answer']}>
            <select
              name="joining-year"
              id="jy"
              {...register("type", {
                required: "Select your accomplishment",
              })}
            >
              <option value="" disabled>
                Accomplishment Type
              </option>
              <option value="Online Profile">Online Profile</option>
              <option value="Work Sample">Work Sample</option>
              <option value="Paper Presentation">
                White paper / Research publication / Journal Entry
              </option>
              <option value="Patent">Patent</option>
              <option value="Certification">Certification</option>
            </select>
          </div>
        </div>
        <div className={`${styles['input-group-div']} ${styles['row']}`}>
          <p className={`${styles['input-group-question']} ${styles['form-question']}`}>Title</p>
          <div className={styles['form-answer']}>
            <input
              type="text"
              name="university-name"
              placeholder="Title of achieved accomplishment"
              {...register("name", {
                required: "Certification name cannot be empty",
              })}
            />
          </div>
        </div>
        <div className={`${styles['input-group-div']} ${styles['row']}`}>
          <p className={`${styles['input-group-question']} ${styles['form-question']}`}>Description</p>
          <div className={styles['form-answer']}>
            <textarea
              name="accomplishment-description"
              id="ad"
              cols="30"
              rows="10"
              placeholder="Describe your accomplishment"
              {...register("description", {
                required: "Description cannot be empty",
              })}
            ></textarea>
          </div>
        </div>
        <div className={`${styles['select-input-div']} ${styles['row']}`}>
          <p className={`${styles['form-group-question']} ${styles['form-question']}`}>Accomplished on</p>
          <div className={styles['form-answer']}>
            <select
              name="issued-year"
              id="iy"
              {...register("year", {
                required: "Select certification issued year",
              })}
            >
              <option value="" disabled>
                Issued year
              </option>
              {issuedYear.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              name="issued-month"
              id="im"
              {...register("month", {
                required: "Select certification issued month",
              })}
            >
              <option value="" disabled>
                Select month
              </option>
              {months.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={`${styles['text-input-div']} ${styles['row']}`}>
          <p className={`${styles['text-question']} ${styles['form-question']}`}>URL</p>
          <div className={styles['form-answer']}>
            <input
              type="text"
              name="accomplishment-url"
              placeholder="Any related link to your accomplishment"
              {...register("relatedLink")}
            />
          </div>
        </div>

        <div className={`${styles['submit-div']} ${styles['row']}`}>
          <button className={styles['cancel']} onClick={closeModal}>
            Cancel
          </button>
          <button className={styles['submit']} type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}


