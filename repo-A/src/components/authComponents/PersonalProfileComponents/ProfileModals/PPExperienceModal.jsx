import React, { useState } from "react";
import { experienceModal } from "@/store/atoms/UserEntityModals";
import { useRecoilState } from "recoil";
import { useForm } from "react-hook-form";
import { userExperienceStore } from "@/store/atoms/ProfileEntities/UserPersonalProfileDetailsStore";
import useFormHandler from "@/utils/CommonAPI";
import styles from './ModalStyles.module.css'; // Importing styles

export default function PPExperienceModal() {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1939 },
    (_, index) => 1940 + index
  ).reverse();
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
  const noticePeriod = [
    "15 Days or less",
    "1 Month",
    "2 Months",
    "3 Months",
    "More than 3 months",
    "Serving Notice period",
  ];

  const [experienceModalDisplay, setExperienceModalDisplay] = useRecoilState(experienceModal);
  const [userExperienceData, setUserExperienceData] = useRecoilState(userExperienceStore);

  const closeModal = (event) => {
    event.preventDefault();
    setExperienceModalDisplay(false);
  };

  const [showSection, setShowSection] = useState(false);
  const [noticePeriodContents, setShowNoticePeriodContents] = useState(false);

  // Function to handle radio button change
  const handleRadioButtonChange = (event) => {
    setShowSection(event.target.value === "yes"); // Show section if user selects 'yes'
    setValue("currentEmployment", event.target.value);
  };

  const handleNoticePeriodChange = (event) => {
    setShowNoticePeriodContents(event.target.value === "Serving Notice period");
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();
  
  const { handleFormSubmission } = useFormHandler();
  
  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const updatedState = {
      employmentId: 1122,
      currentEmployment: data.currentEmployment,
      employmentType: data.employmentType,
      totalExperience: {
        experienceyear: "5",
        experiencemonth: "3"
      },
      companyName: data.companyName,
      designation: data.designation,
      joiningDate: {
        joiningyear: data.joiningyear,
        joiningmonth: data.joiningmonth
      },
      leavingDate: {
        endingyear: data.endingyear,
        endingmonth: data.endingmonth
      },
      annualSalary: {
        currency: data.currency,
        amount: data.amount
      },
      jobProfile: data.jobProfile,
      noticeperiod: {
        noticeperiodsituation: data.noticeperiod
      }
    };
    const updatedUserExperience = [...userExperienceData, updatedState];
    setUserExperienceData(updatedUserExperience);
    handleFormSubmission("experience", userExperienceData);
    console.log(updatedUserExperience);
  };

  return (
    <div className={`${styles['experience-modal-container']} ${styles['modal-container']}`}>
      <form className={`${styles['experience-form']} ${styles['user-form']}`} onSubmit={handleSubmit(onSubmit)}>
        <button className={styles['close-modal']} onClick={closeModal}></button>
        <h3>Add Experience</h3>

        <div className={`${styles['radio-group-div']} ${styles['row']}`}>
          <p className={`${styles['radio-group-question']} ${styles['form-question']}`}>
            Is this your current employment?
          </p>
          <div className={styles['form-answer']}>
            <label className={styles['form-input-group']}>
              <input
                type="radio"
                name="current-employment"
                id="ce-yes"
                value="yes"
                {...register("currentEmployment", {
                  required: "Select if you are currently working here",
                })}
                onChange={handleRadioButtonChange}
              />
              <label htmlFor="ce-yes" className={styles['label-content']}>
                Yes
              </label>
            </label>
            <label className={styles['form-input-group']}>
              <input
                type="radio"
                name="current-employment"
                id="ce-no"
                value="no"
                {...register("currentEmployment", {
                  required: "Select if you are currently working here",
                })}
                onChange={handleRadioButtonChange}
              />
              <label htmlFor="ce-no" className={styles['label-content']}>
                No
              </label>
            </label>
          </div>
          {errors.currentEmployment && (
            <p className={styles['error-field']}>{errors.currentEmployment.message}</p>
          )}
        </div>
        <div className={`${styles['radio-group-div']} ${styles['row']}`}>
          <p className={`${styles['radio-group-question']} ${styles['form-question']}`}>Employment Type</p>
          <div className={styles['form-answer']}>
            <label className={styles['form-input-group']}>
              <input
                type="radio"
                name="employment-type"
                id="et-ft"
                {...register("employmentType", {
                  required: "Select your employment type",
                })}
                value="Full Time"
              />
              <label htmlFor="et-ft" className={styles['label-content']}>
                Full-Time
              </label>
            </label>
            <label className={styles['form-input-group']}>
              <input
                type="radio"
                name="employment-type"
                id="et-in"
                {...register("employmentType", {
                  required: "Select your employment type",
                })}
                value="Internship"
              />
              <label htmlFor="et-in" className={styles['label-content']}>
                Internship
              </label>
            </label>
          </div>
          {errors.employmentType && (
            <p className={styles['error-field']}>{errors.employmentType.message}</p>
          )}
        </div>
        <div className={`${styles['text-input-div']} ${styles['row']}`}>
          <p className={`${styles['text-question']} ${styles['form-question']}`}>Company Name</p>
          <div className={styles['form-answer']}>
            <input
              type="text"
              name="company-name"
              placeholder="Type your organization"
              {...register("companyName", {
                required: "Enter your company name",
              })}
            />
          </div>
          {errors.companyName && (
            <p className={styles['error-field']}>{errors.companyName.message}</p>
          )}
        </div>
        <div className={`${styles['text-input-div']} ${styles['row']}`}>
          <p className={`${styles['text-question']} ${styles['form-question']}`}>Your Designation</p>
          <div className={styles['form-answer']}>
            <input
              type="text"
              name="designation-name"
              placeholder="Type your designation"
              {...register("designation", {
                required: "Enter your designation",
              })}
            />
          </div>
          {errors.designation && (
            <p className={styles['error-field']}>{errors.designation.message}</p>
          )}
        </div>
        <div className={`${styles['select-input-div']} ${styles['row']}`}>
          <p className={`${styles['select-group-question']} ${styles['form-question']}`}>Joining Date</p>
          <div className={styles['form-answer']}>
            <select
              name="joining-year"
              id="jy"
              {...register("joiningyear", {
                required: "Select your joining year",
              })}
            >
              <option value="" disabled selected>
                Select year
              </option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              name="joining-month"
              id="jm"
              {...register("joiningmonth", {
                required: "Select your joining month",
              })}
            >
              <option value="" disabled selected>
                Select month
              </option>
              {months.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          {errors.joiningyear && (
            <p className={styles['error-field']}>{errors.joiningyear.message}</p>
          )}
          {errors.joiningmonth && (
            <p className={styles['error-field']}>{errors.joiningmonth.message}</p>
          )}
        </div>

        {!showSection && (
          <div className={`${styles['select-input-div']} ${styles['row']}`}>
            <p className={`${styles['select-group-question']} ${styles['form-question']}`}>Worked till</p>
            <div className={styles['form-answer']}>
              <select
                name="ending-year"
                id="ey"
                {...register("endingyear", {
                  required: "Select your leaving year",
                })}
              >
                <option value="" disabled selected>
                  Select year
                </option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                name="ending-month"
                id="em"
                {...register("endingmonth", {
                  required: "Select your leaving month",
                })}
              >
                <option value="" disabled selected>
                  Select month
                </option>
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            {errors.endingyear && (
              <p className={styles['error-field']}>{errors.endingyear.message}</p>
            )}
          </div>
        )}
        <div className={`${styles['text-input-div']} ${styles['row']}`}>
          <p className={`${styles['text-question']} ${styles['form-question']}`}>Job Profile</p>
          <div className={styles['form-answer']}>
            <textarea
              name="job-profile"
              id="jp"
              cols="30"
              rows="10"
              placeholder="Provide your job profile"
              {...register("jobProfile", {
                required: "Write briefly about your work in the company",
              })}
            ></textarea>
          </div>
          {errors.jobProfile && (
            <p className={styles['error-field']}>{errors.jobProfile.message}</p>
          )}
        </div>
        {showSection && (
          <>
            <div className={`${styles['select-input-div']} ${styles['row']}`}>
              <p className={`${styles['select-group-question']} ${styles['form-question']}`}>
                Notice Period
              </p>
              <div className={styles['form-answer']}>
                <select
                  name="notice-period"
                  id="np"
                  {...register("noticeperiod", {
                    required: "Provide your notice period status",
                  })}
                >
                  <option value="" disabled selected>
                    Select notice period
                  </option>
                  {noticePeriod.map((period) => (
                    <option key={period} value={period}>
                      {period}
                    </option>
                  ))}
                </select>
              </div>
              {errors.noticeperiod && (
                <p className={styles['error-field']}>{errors.noticeperiod.message}</p>
              )}
            </div>
            <div className={`${styles['select-input-div']} ${styles['row']}`}>
              <p className={`${styles['select-group-question']} ${styles['form-question']}`}>
                Salary in CTC
              </p>
              <div className={styles['form-answer']}>
                <select
                  name="expected-salary"
                  id="es"
                  {...register("currency", {
                    required: "Select currency",
                  })}
                >
                  <option value="" disabled selected>
                    Currency
                  </option>
                  <option value="₹" selected>
                    ₹
                  </option>
                  <option value="$">$</option>
                </select>
                <input
                  type="text"
                  name="salary"
                  placeholder="Eg : 450,000"
                  {...register("amount", {
                    required: "Provide your salary in CTC",
                  })}
                />
              </div>
              {errors.amount && (
                <p className={styles['error-field']}>{errors.amount.message}</p>
              )}
              {errors.currency && (
                <p className={styles['error-field']}>{errors.currency.message}</p>
              )}
            </div>
          </>
        )}
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
