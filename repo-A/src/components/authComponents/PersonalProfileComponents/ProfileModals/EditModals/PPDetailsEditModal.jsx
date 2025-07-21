import React, { useState, useEffect } from "react";
import { detailsEditModal } from "@/store/atoms/UserEntityModals";
import { useRecoilState } from "recoil";
import { userPersonalDetailsStore } from "@/store/atoms/ProfileEntities/UserPersonalProfileDetailsStore";
import { useForm } from "react-hook-form";
import countryOptions from "../../../../../../public/data/Country";

export default function PPDetailsEditModal() {
  const currentYear = new Date().getFullYear();
  const issuedYear = Array.from(
    { length: currentYear - 1939 },
    (_, index) => 1940 + index
  ).reverse();
  const endingYears = Array.from(
    { length: currentYear + 7 - 1939 },
    (_, index) => 1940 + index
  ).reverse();

  const [detailsEditModalDisplay, setDetailsEditModalDisplay] =
    useRecoilState(detailsEditModal);

  const closeModal = (event) => {
    event.preventDefault();
    setDetailsEditModalDisplay(false);
  };

  const defaultLanguageObject = {
    languagename: "",
    proficiency: "",
    read: false,
    write: false,
    speak: false,
  };

  const addDefaultLanguageObject = () => {
    console.log("Added new language");

    setLanguagesList((prevArray) => [...prevArray, defaultLanguageObject]);
  };

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

  const [userDetailsData, setUserDetailsData] = useRecoilState(
    userPersonalDetailsStore
  );

  const [showCareerExtraSections, setShowCareerExtraSections] = useState();
  const [showCareerEndSection, setShowCareerEndSection] = useState();

  const hanldeCareerBreakChange = (event) => {
    console.log(event.target.value);
    const careerBreak = event.target.value;
    setShowCareerExtraSections(careerBreak === "yes");
  };

  const [languagesList, setLanguagesList] = useState();

  const removeLanguageSet = (indexToRemove) => {
    setLanguagesList((prevArray) =>
      prevArray.filter((_, index) => index !== indexToRemove)
    );
  };

  const [selectedWorkPermittedCountries, setSelectedWorkPermittedCountries] =
    useState([]);

  const addWorkPermitCountry = (event) => {
    console.log("Added country");
    const country = event.target.value;
    if (!selectedWorkPermittedCountries.includes(country)) {
      setSelectedWorkPermittedCountries((prevArray) => [...prevArray, country]);
    }
  };

  const removeCountryFromPermissionList = (indexToRemove) => {
    console.log("Removed Country");
    setSelectedWorkPermittedCountries((prevArray) =>
      prevArray.filter((_, index) => index !== indexToRemove)
    );
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
  } = useForm();

  useEffect(() => {
    // Set default values for form fields when experienceInfo is available
    if (userDetailsData) {
      setValue("gender", userDetailsData.gender);
      setValue("maritalstatus", userDetailsData.maritalstatus);
      setValue("day", userDetailsData.dob.day);
      setValue("month", userDetailsData.dob.month);
      setValue("dobyear", userDetailsData.dob.year);
      setValue("careerbreak", userDetailsData.careerbreak);
      setValue("careerbreakreason", userDetailsData.careerbreakreason);
      setValue(
        "startYear",
        userDetailsData.breakDuration.startYear
      );
      setValue(
        "startMonth",
        userDetailsData.breakDuration.startMonth
      );
      setValue(
        "endYear",
        userDetailsData.breakDuration.endYear
      );
      setValue(
        "endMonth",
        userDetailsData.breakDuration.endMonth
      );
      setValue("permanentaddress", userDetailsData.permanentaddress);
      setShowCareerExtraSections(
        userDetailsData.careerbreak === "yes" ? true : false
      );
      setShowCareerEndSection(
        userDetailsData.currentlyonbreak === "yes" ? true : false
      );
      setSelectedWorkPermittedCountries(
        userDetailsData.workPermitCountries
      );
      setLanguagesList(userDetailsData.languages);

      userDetailsData.languages.forEach((language, index) => {
        setValue(`language${index}-name`, language.languagename);
        setValue(`language${index}-proficiency`, language.proficiency);
        setValue(`language${index}-ability-read`, language.read);
        setValue(`language${index}-ability-write`, language.write);
        setValue(`language${index}-ability-speak`, language.speak);
      });
    }
  }, [userDetailsData, setValue]);

  const languagesSubmission = () => {
    console.log("Language processing is on the way");
    const updatedLanguages = languagesList.map((language, index) => {
      const languageName = getValues(`language${index}-name`);
      const proficiency = getValues(`language${index}-proficiency`);
      const read = getValues(`language${index}-ability-read`);
      const write = getValues(`language${index}-ability-write`);
      const speak = getValues(`language${index}-ability-speak`);

      return {
        ...language,
        languagename: languageName,
        proficiency: proficiency,
        read: read,
        write: write,
        speak: speak,
      };
    });

    return updatedLanguages;
  };

  const { handleFormSubmission} = useFormHandler();
  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const updatedState = {
      gender: data.gender,
      maritalstatus: data.maritalstatus,
      dob: {
        day: data.day,
        month: data.month,
        dobyear: data.dobyear,
      },
      careerbreak: data.careerbreak,
      careerbreakreason: data.careerbreakreason,
      breakDuration: {
        startYear: data.startYear,
        startMonth: data.startMonth,
        endYear: data.endYear,
        endMonth: data.endMonth,
      },
      currentlyonbreak: data.currentlyonbreak,
      workPermitCountries: selectedWorkPermittedCountries,
      permanentaddress: data.permanentaddress,
      languages: languagesSubmission(),
    };
    setUserDetailsData(updatedState);
    handleFormSubmission("personaldetails",updatedState);
    console.log(updatedState);
  };

  return (
    languagesList && (
      <div className="details-modal-container modal-container">
        <form
          className="details-form user-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <button className="close-modal" onClick={closeModal}></button>
          <h3>Add Details</h3>
          <div className="radio-group-div row">
            <p className="radio-group-question form-question">Gender</p>
            <div className="form-answer">
              <label className="form-input-group">
                <input
                  type="radio"
                  name="gender"
                  id="g-male"
                  value="Male"
                  {...register("gender", {
                    required: "Select your gender",
                  })}
                />{" "}
                <label htmlFor="g-male" className="label-content">
                  Male
                </label>
              </label>
              <label className="form-input-group">
                <input
                  type="radio"
                  name="gender"
                  id="g-female"
                  value="Female"
                  {...register("gender", {
                    required: "Select your gender",
                  })}
                />{" "}
                <label htmlFor="g-female" className="label-content">
                  Female
                </label>
              </label>
              <label className="form-input-group">
                <input
                  type="radio"
                  name="gender"
                  id="g-other"
                  value="Other"
                  {...register("gender", {
                    required: "Select your gender",
                  })}
                />{" "}
                <label htmlFor="g-other" className="label-content">
                  Other
                </label>
              </label>
            </div>
            {errors.gender && (
              <p className="error-field">{errors.gender.message}</p>
            )}{" "}
          </div>
          <div className="radio-group-div row">
            <p className="radio-group-question form-question">Marital Status</p>
            <div className="form-answer">
              <label className="form-input-group">
                <input
                  type="radio"
                  name="marital-status"
                  id="mt-op1"
                  value="Single"
                  {...register("maritalstatus", {
                    required: "Select your marital status",
                  })}
                />{" "}
                <label htmlFor="mt-op1" className="label-content">
                  Single
                </label>
              </label>
              <label className="form-input-group">
                <input
                  type="radio"
                  name="marital-status"
                  id="mt-op2"
                  value="Married"
                  {...register("maritalstatus", {
                    required: "Select your marital status",
                  })}
                />{" "}
                <label htmlFor="mt-op2" className="label-content">
                  Married
                </label>
              </label>
              <label className="form-input-group">
                <input
                  type="radio"
                  name="marital-status"
                  id="mt-op3"
                  value="Widowed"
                  {...register("maritalstatus", {
                    required: "Select your marital status",
                  })}
                />{" "}
                <label htmlFor="mt-op3" className="label-content">
                  Widowed
                </label>
              </label>
              <label className="form-input-group">
                <input
                  type="radio"
                  name="current-employment"
                  id="mt-op4"
                  value="Divorsed"
                  {...register("maritalstatus", {
                    required: "Select your marital status",
                  })}
                />{" "}
                <label htmlFor="mt-op4" className="label-content">
                  Divorsed
                </label>
              </label>
              <label className="form-input-group">
                <input
                  type="radio"
                  name="current-employment"
                  id="mt-op5"
                  value="Seperated"
                  {...register("maritalstatus", {
                    required: "Select your marital status",
                  })}
                />{" "}
                <label htmlFor="mt-op5" className="label-content">
                  Seperated
                </label>
              </label>
            </div>
            {errors.maritalstatus && (
              <p className="error-field">{errors.maritalstatus.message}</p>
            )}
          </div>
          <div className="input-group-div row">
            <p className="input-group-question form-question">Date Of Birth</p>
            <div className="form-answer">
              <input
                type="number"
                name="dob-day"
                placeholder="Day"
                {...register("day", {
                  required: "Day in Date of Birth cannot be empty",
                })}
              />
              <input
                type="text"
                name="dob-month"
                placeholder="Month"
                {...register("month", {
                  required: "Month in Date of Birth cannot be empty",
                })}
              />
              <input
                type="number"
                name="dob-year"
                placeholder="Year"
                {...register("dobyear", {
                  required: "Year in Date of Birth cannot be empty",
                })}
              />
            </div>
            {errors.day && (
              <p className="error-field">{errors.day.message}</p>
            )}
            {errors.month && (
              <p className="error-field">{errors.month.message}</p>
            )}
            {errors.dobyear && (
              <p className="error-field">{errors.dobyear.message}</p>
            )}
          </div>
          <div className="radio-group-div row">
            <p className="radio-group-question form-question">
              Have you taken a career break?
            </p>
            <div className="form-answer">
              <label className="form-input-group" htmlFor="cb-yes">
                <input
                  type="radio"
                  name="career-break"
                  id="cb-yes"
                  value="yes"
                  {...register("careerbreak", {
                    required: "Select if you have a career break",
                  })}
                  onChange={hanldeCareerBreakChange}
                />{" "}
                <label htmlFor="cb-yes" className="label-content">
                  Yes
                </label>
              </label>
              <label className="form-input-group" htmlFor="cb-no">
                <input
                  type="radio"
                  name="career-break"
                  id="cb-no"
                  value="no"
                  {...register("careerbreak", {
                    required: "Select if you have a career break",
                  })}
                  onChange={hanldeCareerBreakChange}
                />{" "}
                <label htmlFor="cb-no" className="label-content">
                  No
                </label>
              </label>
            </div>
            {errors.careerbreak && (
              <p className="error-field">{errors.careerbreak.message}</p>
            )}
          </div>
          {showCareerExtraSections && (
            <>
              <div className="input-group-div row">
                <p className="input-group-question form-question">
                  Reason for break
                </p>
                <div className="form-answer">
                  <label className="form-input-group">
                    <input
                      type="radio"
                      name="break-reason"
                      id="cbr-child-care"
                      value="Child Care"
                      {...register("careerbreakreason", {
                        required: showCareerEndSection ? (
                          "Select your reason for career break"
                        ) : (
                          <></>
                        ),
                      })}
                    />{" "}
                    <label htmlFor="cbr-child-care" className="label-content">
                      Child Care
                    </label>
                  </label>
                  <label className="form-input-group">
                    <input
                      type="radio"
                      name="break-reason"
                      id="cbr-education"
                      value="Education"
                      {...register("careerbreakreason", {
                        required: showCareerEndSection ? (
                          "Select your reason for career break"
                        ) : (
                          <></>
                        ),
                      })}
                    />{" "}
                    <label htmlFor="cbr-Education" className="label-content">
                      Education
                    </label>
                  </label>
                  <label className="form-input-group">
                    <input
                      type="radio"
                      name="break-reason"
                      id="cbr-Medical"
                      value="Medical"
                      {...register("careerbreakreason", {
                        required: showCareerEndSection ? (
                          "Select your reason for career break"
                        ) : (
                          <></>
                        ),
                      })}
                    />{" "}
                    <label htmlFor="cbr-Medical" className="label-content">
                      Medical
                    </label>
                  </label>
                  <label className="form-input-group">
                    <input
                      type="radio"
                      name="break-reason"
                      id="cbr-Layoff"
                      value="Layoff"
                      {...register("careerbreakreason", {
                        required: showCareerEndSection ? (
                          "Select your reason for career break"
                        ) : (
                          <></>
                        ),
                      })}
                    />{" "}
                    <label htmlFor="cbr-Layoff" className="label-content">
                      Layoff
                    </label>
                  </label>
                  <label className="form-input-group">
                    <input
                      type="radio"
                      name="break-reason"
                      id="cbr-Personal"
                      value="Personal"
                      {...register("careerbreakreason", {
                        required: showCareerEndSection ? (
                          "Select your reason for career break"
                        ) : (
                          <></>
                        ),
                      })}
                    />{" "}
                    <label htmlFor="cbr-Personal" className="label-content">
                      Personal
                    </label>
                  </label>
                </div>
                {errors.careerbreakreason && (
                  <p className="error-field">
                    {errors.careerbreakreason.message}
                  </p>
                )}
              </div>
              <div className="select-input-div row">
                <p className="form-group-question form-question">
                  Break started from
                </p>

                <div className="form-answer">
                  <select
                    name="cb-time-year"
                    id="cb-started-year"
                    {...register("startYear", {
                      required: showCareerEndSection ? (
                        "Select career break start year"
                      ) : (
                        <></>
                      ),
                    })}
                  >
                    <option value="" disabled selected>
                      Year
                    </option>
                    {issuedYear.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <select
                    name="cb-time-month"
                    id="cb-started-month"
                    {...register("startMonth", {
                      required: showCareerEndSection ? (
                        "Select career break start month"
                      ) : (
                        <></>
                      ),
                    })}
                  >
                    <option value="" disabled selected>
                      Month
                    </option>
                    {months.map((month, index) => (
                      <option key={index} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.startYear && (
                  <p className="error-field">
                    {errors.startYear.message}
                  </p>
                )}
                {errors.startMonth && (
                  <p className="error-field">
                    {errors.startMonth.message}
                  </p>
                )}
              </div>
              <div className="select-input-div row">
                <div className="form-answer">
                  <input
                    type="checkbox"
                    name="career-currentlyonbreak"
                    id="currently-on-break"
                    onClick={() =>
                      setShowCareerEndSection(!showCareerEndSection)
                    }
                    {...register("currentlyonbreak")}
                  />
                  <label htmlFor="currently-on-break">
                    {" "}
                    Currently on break ?{" "}
                  </label>
                </div>
              </div>

              {!showCareerEndSection && (
                <div className="select-input-div row">
                  <p className="form-group-question form-question">
                    Break Ended in
                  </p>

                  <div className="form-answer">
                    <select
                      name="cbr-end-year"
                      id="careerendyear"
                      {...register("endYear", {
                        required: showCareerEndSection ? (
                          "Select Details issued year"
                        ) : (
                          <></>
                        ),
                      })}
                    >
                      <option value="" disabled selected>
                        Year
                      </option>
                      {issuedYear.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <select
                      name="cbr-end-month"
                      id="careerendmonth"
                      {...register("endMonth", {
                        required: showCareerEndSection ? (
                          "Select Details issued month"
                        ) : (
                          <></>
                        ),
                      })}
                    >
                      <option value="" disabled selected>
                        Month
                      </option>
                      {months.map((month, index) => (
                        <option key={index} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>

                  {errors.endYear && (
                    <p className="error-field">
                      {errors.endYear.message}
                    </p>
                  )}
                  {errors.endMonth && (
                    <p className="error-field">
                      {errors.endMonth.message}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
          <div className="text-input-div row">
            <p className="text-question form-question">
              Work Permits in countries
            </p>
            <div className="form-answer">
              <select
                name="work-permit-country"
                onChange={(event) => addWorkPermitCountry(event)}
                value={""}
              >
                <option value="" disabled selected>
                  Select Country
                </option>
                {countryOptions.map((country, index) => (
                  <option value={country.label}>
                    <label htmlFor={country.label}>{country.label}</label>
                  </option>
                ))}
              </select>
            </div>
            <div className="selected-countries">
              {selectedWorkPermittedCountries.map((country, index) => (
                <div className="country-each" id={country + "-" + index}>
                  {country}{" "}
                  <button
                    onClick={() => removeCountryFromPermissionList(index)}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="text-input-div row">
            <p className="text-question form-question">Permanent Address</p>
            <div className="form-answer">
              <input
                type="text"
                name="permanent-address"
                placeholder="Your permanent address"
                {...register("permanentaddress", {
                  required: "Provide your permanent address",
                })}
              />
            </div>
            {errors.permanentaddress && (
              <p className="error-field">{errors.permanentaddress.message}</p>
            )}
          </div>
          <div className="text-input-div row">
            <p className="text-question form-question">Language Proficiency</p>
            <p>
              Strengthen your resume by letting recruiters know you can
              communicate in multiple languages
            </p>
            <div className="form-answer" id="languages-list">
              <div className="language-set">
                {languagesList.map((language, index) => (
                  <div id={"language-set" + index}>
                    <div className="form-answer">
                      <input
                        type="text"
                        name="language-name"
                        placeholder="Language"
                        {...register(`language${index}-name`, {
                          required: true,
                        })}
                      />

                      <select
                        name="language-proficiency"
                        {...register(`language${index}-proficiency`, {
                          required: true,
                        })}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Proficient">Proficient</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>

                    <div className="form-answer language-box">
                      <div className="language-efficient">
                        <div className="efficiency-to-read efficiency">
                          <input
                            type="checkbox"
                            name=""
                            id={"read-" + index}
                            {...register(`language${index}-ability-read`)}
                          />
                          <label htmlFor={"read-" + index}>Read</label>
                        </div>
                        <div className="efficiency-ro-write efficiency">
                          <input
                            type="checkbox"
                            name=""
                            id={"write-" + index}
                            {...register(`language${index}-ability-write`)}
                          />
                          <label htmlFor={"write-" + index}>Write</label>
                        </div>
                        <div className="efficiency-to-speak efficiency">
                          <input
                            type="checkbox"
                            name=""
                            id={"speak-" + index}
                            {...register(`language${index}-ability-speak`)}
                          />
                          <label htmlFor={"speak-" + index}>Speak</label>
                        </div>
                      </div>
                      <button
                        className="remove-language"
                        id={index}
                        onClick={() => removeLanguageSet(index)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="add-language"
              id="add-language"
              onClick={() => addDefaultLanguageObject()}
            >
              Add Language
            </button>
          </div>
          <div className="submit-div row">
            <button className="cancel" onClick={closeModal}>
              Cancel
            </button>
            <button className="submit">Submit</button>
          </div>
        </form>
      </div>
    )
  );
}
