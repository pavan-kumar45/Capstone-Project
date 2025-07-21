import React, { useEffect, useState } from "react";
import { experienceEditModal } from "@/store/atoms/UserEntityModals";
import { useRecoilState } from "recoil";
import { useForm } from "react-hook-form";
import { userExperienceStore } from "@/store/atoms/ProfileEntities/UserPersonalProfileDetailsStore";
import useFormHandler from "@/utils/CommonAPI";

export default function PPExperienceEditModal({ employmentId }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1939 },
    (_, index) => 1940 + index
  ).reverse();
  const days = Array.from({ length: 31 }, (_, index) => 1 + index);
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
    "Serving Notice Period",
  ];

  const [experienceEditModalDisplay, setExperienceEditModalDisplay] =
    useRecoilState(experienceEditModal);

  const [userExperienceData, setUserExperienceData] =
    useRecoilState(userExperienceStore);
  const [experienceInfo, setExperienceInfo] = useState();

  const closeModal = (event) => {
    event.preventDefault();
    setExperienceEditModalDisplay(false);
  };
  const [showSection, setShowSection] = useState(false);

  // Function to handle radio button change
  const handleRadioButtonChange = (event) => {
    console.log(event.target.value);
    setShowSection(event.target.value === "yes"); // Show section if user selects 'yes'
    setValue("currentEmployment", event.target.value);
  };
  const handleNoticePeriodChange = (event) => {
    console.log(event.target.value);
    setShowNoticePeriodContents(event.target.value === "Serving Notice period");
  };

  useEffect(() => {
    if (Array.isArray(userExperienceData) && userExperienceData.length > 0) {
      const experienceInfo = userExperienceData.find(
        (experience) => experience.employmentId === employmentId
      );

      if (experienceInfo) {
        setExperienceInfo(experienceInfo);
        console.log("Experience Info:", experienceInfo);
      } else {
        console.log("No experience found with employment ID:", employmentId);
      }
    } else {
      console.log("User experience data is empty or not an array.");
    }
    
    console.log(employmentId);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  useEffect(() => {
    // Set default values for form fields when experienceInfo is available
    if (experienceInfo) {
      setValue("currentEmployment", experienceInfo.currentEmployment);
      setValue("employmentType", experienceInfo.employmentType);
      setValue("companyName", experienceInfo.companyName);
      setValue("designation", experienceInfo.designation);
      setValue("joiningyear", experienceInfo.joiningDate.joiningyear);
      setValue("joiningmonth", experienceInfo.joiningDate.joiningmonth);
      setValue("endingyear", experienceInfo.leavingDate.endingyear);
      setValue("endingmonth", experienceInfo.leavingDate.endingmonth);
      setValue("jobProfile", experienceInfo.jobProfile);
      setValue("currency", experienceInfo.annualSalary.currency);
      setValue("amount", experienceInfo.annualSalary.amount);
      setValue("noticeperiod", {noticesituation: experienceInfo.inNoticePeriod?'Serving Notice Period':"",});
      setValue("employmentId",experienceInfo.employmentId)

      setShowSection(experienceInfo.currentEmployment === "yes");
    }
  }, [experienceInfo, setValue]);

  const { handleFormSubmission} = useFormHandler();

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const updatedState = {
      employmentId: data.employmentId,
      currentEmployment: data.currentEmployment,
      employmentType: data.employmentType,
      totalExperience: {
        experienceyear: "5",
        experiencemonth: "3",
      },
      companyName: data.companyName,
      designation: data.designation,
      joiningDate: {
        joiningyear: data.joiningyear,
        joiningmonth: data.joiningmonth,
      },
      leavingDate: {
        endingyear: data.endingyear,
        endingmonth: data.endingmonth,
      },
      annualSalary: {
        currency: data.currency,
        amount: data.amount,
      },
      jobProfile: data.jobProfile,
      noticeperiod: {
        noticesituation: data.inNoticePeriod?'Serving Notice Period':"",
      },
    };
    const updatedExperienceData = userExperienceData.map(experience => {
      if (experience.employmentId === employmentId) {
        return updatedState; // Replace the existing object with the new object directly
      }
      return experience; // Return unchanged object if employmentId doesn't match
    });
    setUserExperienceData(updatedExperienceData);
    handleFormSubmission("experience",userExperienceData)
    console.log(updatedExperienceData);
  };

  return (
    experienceInfo && (
      <div className="experience-modal-container modal-container">
        <form
          className="experience-form user-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <button className="close-modal" onClick={closeModal}></button>
          <h3>Add Experience</h3>

          <div className="radio-group-div row">
            <p className="radio-group-question form-question">
              Is this your current employment ?
            </p>
            <div className="form-answer">
              <label className="form-input-group">
                <input
                  type="radio"
                  name="current-employment"
                  id="ce-yes"
                  value="yes"
                  {...register("currentEmployment", {
                    required: "Select if you are currently working here",
                  })}
                  onChange={handleRadioButtonChange}
                />{" "}
                <label htmlFor="ce-yes" className="label-content">
                  Yes
                </label>
              </label>
              <label className="form-input-group">
                <input
                  type="radio"
                  name="current-employment"
                  id="ce-no"
                  value="no"
                  {...register("currentEmployment", {
                    required: "Select if you are currently working here",
                  })}
                  onChange={handleRadioButtonChange}
                />{" "}
                <label htmlFor="ce-no" className="label-content">
                  No
                </label>
              </label>
            </div>
            {errors.currentEmployment && (
              <p className="error-field">{errors.currentEmployment.message}</p>
            )}
          </div>
          <div className="radio-group-div row">
            <p className="radio-group-question form-question">
              Employment Type
            </p>
            <div className="form-answer">
              <label className="form-input-group">
                <input
                  type="radio"
                  name="employment-type"
                  id="et-ft"
                  {...register("employmentType", {
                    required: "Select your employment type",
                  })}
                  value="Fulltime"
                />{" "}
                <label htmlFor="et-ft" className="label-content">
                  Full-Time
                </label>
              </label>
              <label className="form-input-group">
                <input
                  type="radio"
                  name="employment-type"
                  id="et-in"
                  {...register("employmentType", {
                    required: "Select your employment type",
                  })}
                  value="Internship"
                />{" "}
                <label htmlFor="et-in" className="label-content">
                  Internship
                </label>
              </label>
            </div>
            {errors.employmentType && (
              <p className="error-field">{errors.employmentType.message}</p>
            )}
          </div>
          <div className="text-input-div row">
            <p className="text-question form-question">Company Name</p>
            <div className="form-answer">
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
              <p className="error-field">{errors.companyName.message}</p>
            )}
          </div>
          <div className="text-input-div row">
            <p className="text-question form-question">Your Designation</p>
            <div className="form-answer">
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
              <p className="error-field">{errors.designation.message}</p>
            )}
          </div>
          <div className="select-input-div row">
            <p className="select-group-question form-question">Joining Date</p>

            <div className="form-answer">
              <select
                name="joining-year"
                id="jy"
                {...register("joiningyear", {
                  required: "Select your joining year",
                })}
              >
                <option value="invalid" disabled selected>
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
              <p className="error-field">{errors.joiningyear.message}</p>
            )}
            {errors.joiningmonth && (
              <p className="error-field">{errors.joiningmonth.message}</p>
            )}
          </div>

          {!showSection && (
            <div className="select-input-div row">
              <p className="select-group-question form-question">Worked till</p>
              <div className="form-answer">
                <select
                  name="ending-year"
                  id="ey"
                  {...register("endingyear", {
                    required: "Select your leaving year",
                  })}
                >
                  <option value="invalid" disabled selected>
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
                <p className="error-field">{errors.endingmonth.message}</p>
              )}
            </div>
          )}
          <div className="text-input-div row">
            <p className="text-question form-question">Job Profile</p>
            <div className="form-answer">
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
              <p className="error-field">{errors.jobProfile.message}</p>
            )}
          </div>
          {showSection && (
            <>
              {" "}
              <div className="select-input-div row">
                <p className="select-group-question form-question">
                  Notice Period
                </p>

                <div className="form-answer">
                  <select
                    name="joining-year"
                    id="jy"
                    {...register("noticeperiod", {
                      required: "Provide your notice period status",
                    })}
                  >
                    <option value="Invalid" disabled selected>
                      Select notice period
                    </option>
                    {noticePeriod.map((notice,index) => (
                      <option key={index} value={notice}>
                        {notice}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.noticeperiod && (
                  <p className="error-field">{errors.noticeperiod.message}</p>
                )}
              </div>
              <div className="select-input-div row">
                <p className="select-group-question form-question">
                  Salary in CTC
                </p>

                <div className="form-answer">
                  <select
                    name="expected-salary"
                    id="es"
                    {...register("currency", {
                      required: "Selecte currency",
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
                  <p className="error-field">{errors.amount.message}</p>
                )}
                {errors.currency && (
                  <p className="error-field">{errors.currency.message}</p>
                )}
              </div>
            </>
          )}
          <div className="submit-div row">
            <button className="cancel" onClick={closeModal}>
              Cancel
            </button>
            <button className="submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Loading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    )
  );
}
