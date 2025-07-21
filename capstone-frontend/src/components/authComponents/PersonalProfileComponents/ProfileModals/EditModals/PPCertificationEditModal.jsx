import React, { useState, useEffect } from "react";
import { certificationEditModal } from "@/store/atoms/UserEntityModals";
import { useRecoilState } from "recoil";
import { userCertificationStore } from "@/store/atoms/ProfileEntities/UserPersonalProfileDetailsStore";
import { useForm } from "react-hook-form";
import useFormHandler from "@/utils/CommonAPI";
export default function PPCertificationEditModal({ certificationId }) {
  const currentYear = new Date().getFullYear();
  const issuedYear = Array.from(
    { length: currentYear - 1939 },
    (_, index) => 1940 + index
  ).reverse();
  const endingYears = Array.from(
    { length: currentYear + 7 - 1939 },
    (_, index) => 1940 + index
  ).reverse();

  const [certificationEditModalDisplay, setCertificationEditModalDisplay] =
    useRecoilState(certificationEditModal);

  const closeModal = (event) => {
    event.preventDefault();
    setCertificationEditModalDisplay(false);
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

  const [userCertificationData, setUserCertificationData] = useRecoilState(
    userCertificationStore
  );
  const [certificationInfo, setCertificationInfo] = useState();

  useEffect(() => {
    if (
      Array.isArray(userCertificationData) &&
      userCertificationData.length > 0
    ) {
      const certificationInfo = userCertificationData.find(
        (certification) => certification.id === certificationId
      );

      if (certificationInfo) {
        setCertificationInfo(certificationInfo);
        console.log("Certification Info:", certificationInfo);
      } else {
        console.log(
          "No Accomplishment found with certification ID:",
          certificationId
        );
      }
    } else {
      console.log("User Certification data is empty or not an array.");
    }

    console.log(certificationId);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  useEffect(() => {
    // Set default values for form fields when certificationInfo is available
    if (certificationInfo) {
      setValue("name", certificationInfo.name);
      setValue("type", certificationInfo.type);
      setValue(
        "description",
        certificationInfo.description
      );
      setValue(
        "year",
        certificationInfo.issuedDate.year
      );
      setValue(
        "month",
        certificationInfo.issuedDate.month
      );
      setValue(
        "relatedLink",
        certificationInfo.relatedLink
      );
    }
  }, [certificationInfo, setValue]);

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const updatedState = {
      id: certificationId,
      name: data.name,
      type: data.type,
      description: data.description,
      issuedDate: {
        year: data.year,
        month: data.month,
      },
      relatedLink: data.relatedLink,
    };
    const updatedCertificationData = userCertificationData.map(
      (certification) => {
        if (certification.id === certificationId) {
          return updatedState; // Replace the existing object with the new object directly
        }
        return certification; // Return unchanged object if employmentId doesn't match
      }
    );
    setUserCertificationData(updatedCertificationData);
    handleFormSubmission("certifications",userCertificationData);
    console.log(updatedCertificationData);
  };

  return (
    certificationInfo && (
      <div className="certification-modal-container modal-container">
        <form
          className="certification-form user-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <button className="close-modal" onClick={closeModal}></button>
          <h3>Add Accomplishment</h3>
          <div className="radio-group-div row">
            <p className="radio-group-question form-question">Accomplishment</p>
            <div className="form-answer">
              <select
                name="joining-year"
                id="jy"
                {...register("type", {
                  required: "Select your accomplishment",
                })}
              >
                <option value="" selected disabled>
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
          <div className="input-group-div row">
            <p className="input-group-question form-question">Title</p>
            <div className="form-answer">
              <input
                type="text"
                name="university-name"
                placeholder="Title of achieved accomplisment"
                {...register("name", {
                  required: "Certification name cannot be empty",
                })}
              />
            </div>
          </div>
          <div className="input-group-div row">
            <p className="input-group-question form-question">Description</p>
            <div className="form-answer">
              <textarea
                name="accomplisment-description"
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
          <div className="select-input-div row">
            <p className="form-group-question form-question">Accomplished on</p>

            <div className="form-answer">
              <div className="form-answer">
                <select
                  name="issued-year"
                  id="iy"
                  {...register("year", {
                    required: "Select certification issued year",
                  })}
                >
                  <option value="" disabled selected>
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
                  <option value="" disabled selected>
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
          </div>

          <div className="text-input-div row">
            <p className="text-question form-question">URL</p>
            <div className="form-answer">
              <input
                type="text"
                name="accomplishemt-url"
                placeholder="Any related link to your accomplishment"
                {...register("relatedLink")}
              />
            </div>
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
