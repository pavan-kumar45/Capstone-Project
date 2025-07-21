import React, { useState, useEffect } from "react";
import { educationEditModal } from "@/store/atoms/UserEntityModals";
import { useRecoilState } from "recoil";
import { userEducationStore } from "@/store/atoms/ProfileEntities/UserPersonalProfileDetailsStore";
import { useForm } from "react-hook-form";
import useFormHandler from "@/utils/CommonAPI";

export default function PPEducationEditModal({ educationId }) {
  const currentYear = new Date().getFullYear();
  const startingYears = Array.from(
    { length: currentYear - 1939 },
    (_, index) => 1940 + index
  ).reverse();
  const endingYears = Array.from(
    { length: currentYear + 7 - 1939 },
    (_, index) => 1940 + index
  ).reverse();

  const [educationEditModalDisplay, setEducationEditModalDisplay] =
    useRecoilState(educationEditModal);

  const closeModal = (event) => {
    event.preventDefault();
    setEducationEditModalDisplay(false);
  };
  const [showSection, setShowSection] = useState(false);

  const [userEducationData, setUserEducationData] =
    useRecoilState(userEducationStore);
  const [educationInfo, setEducationInfo] = useState();

  useEffect(() => {
    if (Array.isArray(userEducationData) && userEducationData.length > 0) {
      const educationInfo = userEducationData.find(
        (education) => education.educationId === educationId
      );

      if (educationInfo) {
        setEducationInfo(educationInfo);
        console.log("Education Info:", educationInfo);
      } else {
        console.log("No Education found with employment ID:", educationId);
      }
    } else {
      console.log("User Education data is empty or not an array.");
    }

    console.log(educationId);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  useEffect(() => {
    // Set default values for form fields when educationInfo is available
    if (educationInfo) {
      setValue("educationName", educationInfo.educationName);
      setValue("universityName", educationInfo.universityName);
      setValue("course", educationInfo.course);
      setValue("specialization", educationInfo.specialization);
      setValue("courseType", educationInfo.courseType);
      setValue(
        "startYear",
        educationInfo.courseDuration.startYear
      );
      setValue(
        "endYear",
        educationInfo.courseDuration.endYear
      );
      setValue("gradingSystem", educationInfo.gradingSystem);
      setValue("marksObtained", educationInfo.marksObtained);
      setValue("educationId", educationInfo.educationId);
    }
  }, [educationInfo, setValue]);

  const { handleFormSubmission} = useFormHandler();

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
      marksObtained: data.marksObtained,
    };
    const updatedEducationData = userEducationData.map((education) => {
      if (education.educationId === educationId) {
        return updatedState; // Replace the existing object with the new object directly
      }
      return education; // Return unchanged object if employmentId doesn't match
    });
    setUserEducationData(updatedEducationData);
    handleFormSubmission("education",userEducationData);
    console.log(updatedEducationData);
  };

  return (
    educationInfo && (
      <div className="education-modal-container modal-container">
        <form
          className="education-form user-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <button className="close-modal" onClick={closeModal}></button>
          <h3>Add Education</h3>
          <div className="radio-group-div row">
            <p className="radio-group-question form-question">Education</p>
            <div className="form-answer">
              <select
                name="educationName"
                id="et"
                {...register("educationName", {
                  required: "Select your education",
                })}
              >
                <option value="">Select Education</option>
                <option value="PhD/Doctorate">Doctorate/PhD</option>
                <option value="Masters/Post Graduation">
                  Masters / Post-Graduation
                </option>
                <option value="Graduation/Diploma">Graduation / Diploma</option>
                <option value="Class 12th">Class XII</option>
                <option value="Class 10th">Class X</option>
              </select>
            </div>
            {errors.educationName && (
              <p className="error-field">{errors.educationName.message}</p>
            )}
          </div>
          <div className="radio-group-div row">
            <p className="radio-group-question form-question">
              University / Institute
            </p>
            <div className="form-answer">
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
              <p className="error-field">{errors.universityName.message}</p>
            )}
          </div>
          <div className="text-input-div row">
            <p className="text-question form-question">Course</p>
            <div className="form-answer">
              <input
                type="text"
                name="university-name"
                placeholder="Type your course"
                {...register("course", {
                  required: "Select your course ",
                })}
              />
            </div>
          </div>
          <div className="text-input-div row">
            <p className="text-question form-question">Specialization</p>
            <div className="form-answer">
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
              <p className="error-field">{errors.specialization.message}</p>
            )}
          </div>
          <div className="form-input-div row">
            <p className="form-group-question form-question">Course Type</p>

            <div className="form-answer">
              <label className="form-input-group">
                <input
                  type="radio"
                  name="education-type"
                  id="et-ft"
                  value="Full Time"
                  {...register("courseType", {
                    required: "Select your course type",
                  })}
                />{" "}
                <label htmlFor="et-ft" className="label-content">
                  Full-Time
                </label>
              </label>
              <label className="form-input-group">
                <input
                  type="radio"
                  name="education-type"
                  id="et-pt"
                  value="Part Time"
                  {...register("courseType", {
                    required: "Select your course type",
                  })}
                />{" "}
                <label htmlFor="et-pt" className="label-content">
                  Part time
                </label>
              </label>
              <label className="form-input-group">
                <input
                  type="radio"
                  name="education-type"
                  id="et-dl"
                  value="Correspondence/Distance Learning"
                  {...register("courseType", {
                    required: "Select your course type",
                  })}
                />{" "}
                <label htmlFor="et-dl" className="label-content">
                  Correspondence/Distance Learning
                </label>
              </label>
            </div>
          </div>
          <div className="form-input-div row">
            <p className="form-group-question form-question">Course Duration</p>

            <div className="form-answer">
              <div className="form-answer">
                <select
                  name="starting-year"
                  id="ey"
                  {...register("startYear", {
                    required: "Select your course begin year",
                  })}
                >
                  <option value="" disabled selected>
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
                  <option value="" disabled selected>
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
          </div>
          <div className="form-input-div row">
            <p className="form-group-question form-question">Course Grading</p>

            <div className="form-answer">
              <div className="form-answer">
                <select
                  name="grading-system"
                  id="ey"
                  {...register("gradingSystem", {
                    required: "Select your grading system",
                  })}
                >
                  <option value="" disabled selected>
                    Grading System
                  </option>
                  <option value="Scale 10 Grading System">
                    Scale 10 Grading System
                  </option>
                  <option value="Scale 4 Grading System">
                    Scale 4 Grading System
                  </option>
                  <option value="% marks of 100 Maximum">
                    % marks of 100 Maximum
                  </option>
                  <option value="Course requires a pass">
                    Course requires a pass
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div className="text-input-div row">
            <p className="text-question form-question">Marks</p>
            <div className="form-answer">
              <input
                type="text"
                name="marksObtained"
                placeholder="Enter your marks"
                {...register("marksObtained", {
                  required: "Enter your marks for the course",
                })}
              />
            </div>
          </div>

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
