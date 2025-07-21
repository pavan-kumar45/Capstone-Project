import React, { useState } from "react";
import { summaryModal } from "@/store/atoms/UserEntityModals";
import { useRecoilState } from "recoil";
import { userSummaryStore } from "@/store/atoms/ProfileEntities/UserPersonalProfileDetailsStore";
import { useForm } from "react-hook-form";
import styles from './ModalStyles.module.css';

export default function PPSummaryModal() {
  const [summaryModalDisplay, setSummaryModalDisplay] = useRecoilState(summaryModal);

  const closeModal = (event) => {
    event.preventDefault();
    setSummaryModalDisplay(false);
  };

  const [userSummaryData, setSummaryData] = useRecoilState(userSummaryStore);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      summary: userSummaryData,
    },
  });

  const OnSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSummaryData(data.summary);
    console.log(data);
  };

  return (
    <div className={`${styles['summary-modal-container']} ${styles['modal-container']}`}>
      <form
        className={`${styles['summary-form']} ${styles['user-form']}`}
        onSubmit={handleSubmit(OnSubmit)}
      >
        <button className={styles['close-modal']} onClick={closeModal}></button>
        <h3>Profile Summary</h3>

        <div className={`${styles['text-input-div']} ${styles['row']}`}>
          <p className={`${styles['text-question']} ${styles['form-question']}`}>
            Your profile summary should mention the highlights of your career
            and education, what your professional interests are, and what kind
            of a career you are looking for. Write a meaningful summary of more
            than 50 characters.
          </p>
          <div className={styles['form-answer']}>
            <textarea
              name="job-profile"
              id="jp"
              cols="30"
              rows="10"
              placeholder="Provide your job profile"
              className={styles['summary-profile']}
              {...register("summary", {
                required: "Summary cannot be empty",
              })}
            ></textarea>
          </div>
          {errors.summary && (
            <p className={styles['error-field']}>{errors.summary.message}</p>
          )}
        </div>

        <div className={`${styles['submit-div']} ${styles['row']}`}>
          <button className={styles['cancel']} onClick={closeModal}>
            Cancel
          </button>
          <button className={styles['submit']} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Loading..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
