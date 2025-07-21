import React, { useState } from "react";
import { educationModal } from "@/store/atoms/UserEntityModals";
import { useRecoilState } from "recoil";
import { useForm } from "react-hook-form";
import { userEducationStore } from "@/store/atoms/ProfileEntities/UserPersonalProfileDetailsStore";
import useFormHandler from "@/utils/CommonAPI";
import styles from './ModalStyles.module.css'; // Importing styles

export default function PPEducationModal() {
  const currentYear = new Date().getFullYear();
  const startingYears = Array.from(
    { length: currentYear - 1939 },
    (_, index) => 1940 + index
  ).reverse();
  const endingYears = Array.from(
    { length: currentYear + 7 - 1939 },
    (_, index) => 1940 + index
  ).reverse();

  const [educationModalDisplay, setEducationModalDisplay] = useRecoilState(educationModal);

  const closeModal = (event) => {
    event.preventDefault();
    setEducationModalDisplay(false);
  };

  const [userEducationData, setUserEducationData] = useRecoilState(userEducationStore);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const { handleFormSubmission } = useFormHandler();

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const updatedState = {
      educationId: 1122,
      educationName: data.educationName,
      universityName: data.universityName,
      course: data.course,
      specialization: data.specialization,
      courseType: data.courseType,
      courseDuration: {
        startYear: data.startYear,
        endYear: data.endYear,
      },
      gradingSystem: data.gradingSystem,
      marskobtained: data.marksObtained,
    };
    const updatedUserEducation = [...userEducationData, updatedState];
    setUserEducationData(updatedUserEducation);
    handleFormSubmission("education", userEducationData);
    console.log(updatedUserEducation);
  };

  return (
    <div className={`${styles['education-modal-container']} ${styles['modal-container']}`}>
      <form
        className={`${styles['education-form']} ${styles['user-form']}`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <button className={styles['close-modal']} onClick={closeModal}></button>
        <h3>Add Education</h3>
        <div className={`${styles['radio-group-div']} ${styles['row']}`}>
          <p className={`${styles['radio-group-question']} ${styles['form-question']}`}>Education</p>
          <div className={styles['form-answer']}>
            <select
              name="joining-year"
              id="et"
              {...register("educationName", {
                required: "Select your education",
              })}
            >
              <option value="">Select Education</option>
              <option value="Doctorate/PhD">Doctorate/PhD</option>
              <option value="Masters / Post-Graduation">Masters / Post-Graduation</option>
              <option value="Graduation / Diploma">Graduation / Diploma</option>
              <option value="Class XII">Class XII</option>
              <option value="Class X">Class X</option>
            </select>
          </div>
          {errors.educationName && (
            <p className={styles['error-field']}>{errors.educationName.message}</p>
          )}
        </div>
        <div className={`${styles['radio-group-div']} ${styles['row']}`}>
          <p className={`${styles['radio-group-question']} ${styles['form-question']}`}>
            University / Institute
          </p>
          <div className={styles['form-answer']}>
            <input
              type="text"
              name="university-name"
              placeholder="Type your University / Institute"
              {...register("universityName", {
                required: "Enter your university name",
              })}
            />
          </div>
          {errors.universityName && (
            <p className={styles['error-field']}>{errors.universityName.message}</p>
          )}
        </div>
        <div className={`${styles['text-input-div']} ${styles['row']}`}>
          <p className={`${styles['text-question']} ${styles['form-question']}`}>Course</p>
          <div className={styles['form-answer']}>
            <input
              type="text"
              name="university-name"
              placeholder="Type your course"
              {...register("course", {
                required: "Select your course",
              })}
            />
          </div>
        </div>
        <div className={`${styles['text-input-div']} ${styles['row']}`}>
          <p className={`${styles['text-question']} ${styles['form-question']}`}>Specialization</p>
          <div className={styles['form-answer']}>
            <input
              type="text"
              name="specialization-name"
              placeholder="Type your Specialization"
              {...register("specialization", {
                required: "Enter your area of expertise",
              })}
            />
          </div>
          {errors.specialization && (
            <p className={styles['error-field']}>{errors.specialization.message}</p>
          )}
        </div>
        <div className={`${styles['form-input-div']} ${styles['row']}`}>
          <p className={`${styles['form-group-question']} ${styles['form-question']}`}>Course Type</p>

          <div className={styles['form-answer']}>
            <label className={styles['form-input-group']}>
              <input
                type="radio"
                name="education-type"
                id="et-ft"
                value="Full Time"
                {...register("courseType", {
                  required: "Select your course type",
                })}
              />{" "}
              <label htmlFor="et-ft" className={styles['label-content']}>
                Full-Time
              </label>
            </label>
            <label className={styles['form-input-group']}>
              <input
                type="radio"
                name="education-type"
                id="et-pt"
                value="Part Time"
                {...register("courseType", {
                  required: "Select your course type",
                })}
              />{" "}
              <label htmlFor="et-pt" className={styles['label-content']}>
                Part time
              </label>
            </label>
            <label className={styles['form-input-group']}>
              <input
                type="radio"
                name="education-type"
                id="et-dl"
                value="Correspondence/Distance Learning"
                {...register("courseType", {
                  required: "Select your course type",
                })}
              />{" "}
              <label htmlFor="et-dl" className={styles['label-content']}>
                Correspondence/Distance Learning
              </label>
            </label>
          </div>
        </div>
        <div className={`${styles['form-input-div']} ${styles['row']}`}>
          <p className={`${styles['form-group-question']} ${styles['form-question']}`}>Course Duration</p>

          <div className={styles['form-answer']}>
            <select
              name="starting-year"
              id="ey"
              {...register("startYear", {
                required: "Select your course begin year",
              })}
            >
              <option value="" disabled>
                Starting year
              </option>
              {startingYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              name="ending-year"
              id="em"
              {...register("endYear", {
                required: "Select your course end year",
              })}
            >
              <option value="" disabled>
                Ending year
              </option>
              {endingYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={`${styles['form-input-div']} ${styles['row']}`}>
          <p className={`${styles['form-group-question']} ${styles['form-question']}`}>Marks Obtained</p>

          <div className={styles['form-answer']}>
            <select
              name="grading-system"
              id="ey"
              {...register("gradingSystem", {
                required: "Select your grading system",
              })}
            >
              <option value="" disabled>
                Grading System
              </option>
              <option value="Scale 10 Grading System">Scale 10 Grading System</option>
              <option value="Scale 4 Grading System">Scale 4 Grading System</option>
              <option value="% marks of 100 Maximum">% marks of 100 Maximum</option>
              <option value="Course requires a pass">Course requires a pass</option>
            </select>
          </div>
        </div>
        <div className={`${styles['text-input-div']} ${styles['row']}`}>
          <p className={`${styles['text-question']} ${styles['form-question']}`}>Marks</p>
          <div className={styles['form-answer']}>
            <input
              type="text"
              name="designation-name"
              placeholder="Type your marks"
              {...register("marksObtained", {
                required: "Enter your marks for the course",
              })}
            />
          </div>
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
