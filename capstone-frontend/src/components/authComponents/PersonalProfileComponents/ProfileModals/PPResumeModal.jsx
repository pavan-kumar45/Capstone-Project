import React from "react";
import { resumeModal } from "@/store/atoms/UserEntityModals";
import { useRecoilState } from "recoil";
import { userResumeDetailsStore } from "@/store/atoms/ProfileEntities/UserPersonalProfileDetailsStore";
import { useForm } from "react-hook-form";
import styles from './ModalStyles.module.css'; // Importing styles

export default function PPResumeModal() {
  const [resumeModalDisplay, setResumeModalDisplay] = useRecoilState(resumeModal);
  const [userResume, setResumeData] = useRecoilState(userResumeDetailsStore);

  const closeModal = (event) => {
    event.preventDefault();
    setResumeModalDisplay(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Function to handle file selection
  const onSubmit = (data) => {
    const { file } = data;
    const fileName = file[0]?.name;
    const uploadDate = new Date(file[0]?.lastModified).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    console.log("File Name:", fileName);
    console.log("Date of Upload:", uploadDate);

    const resumeLink = `../${fileName}`;

    const updatedResumeDetails = {
      name: fileName,
      lastuploadeddate: uploadDate,
      resumelink: resumeLink,
    };

    setResumeData(updatedResumeDetails);

    console.log(userResume);
  };

  return (
    <div className={`${styles['summary-modal-container']} ${styles['modal-container']}`}>
      <form className={`${styles['summary-form']} ${styles['user-form']}`} onSubmit={handleSubmit(onSubmit)}>
        <button className={styles['close-modal']} onClick={closeModal}></button>
        <h3>Update Resume</h3>

        <div className={`${styles['text-input-div']} ${styles['row']}`}>
          <p className={`${styles['text-question']} ${styles['form-question']}`}>
            Make sure you always provide updated resume with latest skills acquired. This helps your resume shortlisted for your dream companies.
          </p>
          <input
            type="file"
            {...register("file", {
              required: "File is required",
              validate: {
                fileType: (value) => {
                  const allowedTypes = [
                    "application/pdf",
                    "text/rtf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  ];
                  return (
                    allowedTypes.includes(value[0]?.type) ||
                    "Unsupported file type"
                  );
                },
              },
            })}
            accept=".pdf,.rtf,.doc,.docx"
          />
          {errors.file && (
            <p className={styles['error-field']}>{errors.file.message}</p>
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
