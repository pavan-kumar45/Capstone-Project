import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useForm } from "react-hook-form";
import { profileModal } from "@/store/atoms/UserEntityModals";
import { userBasicDetailsStore } from "@/store/atoms/ProfileEntities/UserPersonalProfileDetailsStore";
import countryCodeVsPhoneCode from "../../../../../public/data/CountryCode";
import ReactCountryFlag from "react-country-flag";
import { IoNavigateCircleSharp } from "react-icons/io5";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import countryOptions from "../../../../../public/data/Country";
import useFormHandler from "@/utils/CommonAPI";
import styles from './ModalStyles.module.css'; // Importing styles

export default function PPProfileModal() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryFlag, setCountryFlag] = useState("IN");

  const [profileModalDisplay, setProfileModalDisplay] = useRecoilState(profileModal);

  const [userBasicDetails, setUserBasicDetails] = useRecoilState(userBasicDetailsStore);

  const [phoneNumberClassName, setPhoneNumberClassName] = useState(
    userBasicDetails.mobilenumber.verified
      ? styles['phone-verified-visible']
      : styles['phone-verified-invisible']
  );
  const [emailClassName, setEmailClassName] = useState(
    userBasicDetails.email.verified
      ? styles['email-verified-visible']
      : styles['email-verified-invisible']
  );

  const changeCountryFlag = (event) => {
    const a = event.target.value;
    if (event.target.value === userBasicDetails.mobilenumber.countrycode) {
      setPhoneNumberClassName(styles['phone-verified-visible']);
    } else {
      setPhoneNumberClassName(styles['phone-verified-invisible']);
    }
    console.log(countryCodeVsPhoneCode[a]);
    setCountryFlag(countryCodeVsPhoneCode[a]);
    setValue("countrycode", a);
  };

  const closeModal = (event) => {
    event.preventDefault();
    setProfileModalDisplay(false);
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setValue("state", event.target.value);
  };
  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
    setValue("city", event.target.value);
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
    setValue("country", event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    if (event.target.value === userBasicDetails.mobilenumber.number) {
      setPhoneNumberClassName(styles['phone-verified-visible']);
    } else {
      setPhoneNumberClassName(styles['phone-verified-invisible']);
    }
  };

  const handleEmailChange = (event) => {
    if (event.target.value === userBasicDetails.email.address) {
      setEmailClassName(styles['email-verified-visible']);
    } else {
      setEmailClassName(styles['email-verified-invisible']);
    }
  };

  useEffect(() => {
    if (userBasicDetails != null) {
      setSelectedState(userBasicDetails.currentlocation.state);
      setSelectedCity(userBasicDetails.currentlocation.city);
      setSelectedCountry(userBasicDetails.currentlocation.country);
      setValue("state", userBasicDetails.currentlocation.state);
      setValue("city", userBasicDetails.currentlocation.city);
      setValue("country", userBasicDetails.currentlocation.country);
    }
  }, [userBasicDetails]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    defaultValues: {
      id: userBasicDetails.id,
      fullname: userBasicDetails.fullname,
      countrycode: userBasicDetails.mobilenumber.countrycode,
      number: userBasicDetails.mobilenumber.number,
      email: userBasicDetails.email.address,
      country: selectedCountry,
      otheraddress: userBasicDetails.currentlocation.address,
      state: selectedState,
      city: selectedCity,
      currency: userBasicDetails.expectedCTC.currency,
      amount: userBasicDetails.expectedCTC.amount,
      portfolio: userBasicDetails.portfolioLink,
      github: userBasicDetails.githubLink,
      linkedin: userBasicDetails.linkedinLink,
    },
  });

  const { handleFormSubmission } = useFormHandler();

  const OnSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUserBasicDetails((prevUserBasicDetails) => ({
      ...prevUserBasicDetails,
      fullname: data.fullname,
      expectedCTC: {
        ...prevUserBasicDetails.expectedCTC,
        currency: data.currency,
        amount: data.amount,
      },
      currentlocation: {
        ...prevUserBasicDetails.currentlocation,
        country: data.country,
        state: data.state,
        city: data.city,
        address: data.otheraddress,
      },
      mobilenumber: {
        ...prevUserBasicDetails.mobilenumber,
        countrycode: data.countrycode,
        number: data.number,
      },
      email: {
        ...prevUserBasicDetails.email,
        address: data.email,
      },
      githublink: data.github,
      linkedinlink: data.linkedin,
      portfoliolink: data.portfolio,
    }));
    handleFormSubmission("basicDetails", userBasicDetails);
    console.log(userBasicDetails);
  };

  return (
    userBasicDetails && (
      <div className={`${styles['profile-modal-container']} ${styles['modal-container']}`}>
        <form
          className={`${styles['profile-form']} ${styles['user-form']}`}
          onSubmit={handleSubmit(OnSubmit)}
        >
          <button className={styles['close-modal']} onClick={closeModal}></button>
          <h3>Update Profile</h3>

          <div className={`${styles['text-group-div']} ${styles['row']}`} id="user-name">
            <p className={`${styles['text-group-question']} ${styles['form-question']}`}>
              Name <span className={styles['required-field']}>*</span>
            </p>

            <div className={styles['form-answer']}>
              <input
                type="text"
                name="fullname"
                placeholder="Enter your name"
                {...register("fullname", {
                  required: "Name cannot be empty!",
                })}
              />
            </div>
            {errors.fullname && (
              <p className={styles['error-field']}>{errors.fullname.message}</p>
            )}
          </div>

          <div className={`${styles['radio-group-div']} ${styles['row']}`} id="user-experience">
            <p className={`${styles['radio-group-question']} ${styles['form-question']}`}>
              Overall Experience
            </p>
            <div className={`${styles['form-answer']} ${styles['modal-designation-details']}`}>
              <p>
                {userBasicDetails.experience.years} Years{" "}
                {userBasicDetails.experience.months} Months
              </p>
              <p className={styles['designation-info']}>
                This is calculated based on your complete working years across multiple companies.
              </p>
            </div>
          </div>

          <div className={`${styles['text-group-div']} ${styles['row']}`} id="user-phonenumber">
            <p className={`${styles['text-group-question']} ${styles['form-question']}`}>
              Phone Number{" "}
              <RiVerifiedBadgeFill className={phoneNumberClassName} />
              <span className={styles['required-field']}>*</span>
            </p>
            <p className={styles['verification-info']}>
              If you change your phone number or email, you will lose your verification badge. Please visit your personal account settings to get them reverified.
            </p>

            <div className={styles['form-answer']}>
              <div className={styles['special-input']}>
                <ReactCountryFlag
                  countryCode={countryFlag}
                  svg
                  style={{
                    width: "2em",
                    height: "2em",
                  }}
                  title={countryFlag}
                  className={styles['country-flag']}
                />
                <input
                  type="text"
                  name="mobilenumber.countrycode"
                  className={styles['short-input']}
                  {...register("countrycode", {
                    required: "Enter your country code",
                  })}
                  onChange={changeCountryFlag}
                />
              </div>

              <input
                type="text"
                name="mobilenumber.number"
                placeholder="94-9494-9453"
                {...register("number", {
                  required: "Enter a valid phone number",
                  pattern: /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/,
                })}
                onChange={handlePhoneNumberChange}
              />
            </div>
            {errors.countrycode && (
              <p className={styles['error-field']}>{errors.countrycode.message}</p>
            )}
            {errors.number && (
              <p className={styles['error-field']}>{errors.number.message}</p>
            )}
          </div>

          <div className={`${styles['text-group-div']} ${styles['row']}`} id="user-email">
            <p className={`${styles['text-group-question']} ${styles['form-question']}`}>
              Email Address
              <RiVerifiedBadgeFill className={emailClassName} />
              <span className={styles['required-field']}>*</span>
            </p>
            <div className={styles['form-answer']}>
              <input
                type="email"
                name="email.address"
                placeholder="Email Address"
                {...register("email", {
                  required: "Enter a valid email address",
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                })}
                onChange={handleEmailChange}
              />
            </div>
            {errors.email && (
              <p className={styles['error-field']}>{errors.email.message}</p>
            )}
          </div>

          <div className={`${styles['select-input-div']} ${styles['row']}`} id="user-location">
            <p className={`${styles['select-group-question']} ${styles['form-question']}`}>
              Your Current Location
            </p>

            <div className={styles['form-answer']}>
              <select
                name="currentlocation.country"
                id="country"
                {...register("country", {
                  required: "Select your country",
                })}
                onChange={handleCountryChange}
                value={selectedCountry}
              >
                <option value="">Select Country</option>
                {countryOptions.map((country, index) => (
                  <option
                    key={index}
                    value={country.value}
                    selected={country.value === selectedCountry}
                  >
                    {country.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="state"
                placeholder="Enter State "
                {...register("state", {
                  required: "Enter your state",
                })}
                autoComplete="nope"
                onChange={handleStateChange}
                value={selectedState}
                className={styles['state-input']}
              />

              <input
                type="text"
                name="city"
                placeholder="Enter City "
                {...register("city")}
                autoComplete="nope"
                list={selectedCountry === "India" ? "cities" : ""}
                value={selectedCity}
                onChange={handleCityChange}
              />
            </div>
            {errors.country && (
              <p className={styles['error-field']}>{errors.country.message}</p>
            )}
            {errors.state && (
              <p className={styles['error-field']}>{errors.state.message}</p>
            )}
            {errors.city && (
              <p className={styles['error-field']}>{errors.city.message}</p>
            )}
          </div>

          <div className={`${styles['text-group-div']} ${styles['row']}`} id="user-expected-ctc">
            <p className={`${styles['text-group-question']} ${styles['form-question']}`}>
              Expected CTC
            </p>
            <div className={styles['form-answer']}>
              <select
                name="expectedCTC.currency"
                id="currency"
                className={styles['short-input']}
                {...register("currency", {
                  required: "Select appropriate currency",
                })}
              >
                <option
                  value="$"
                  selected={userBasicDetails.expectedCTC.currency === "$"}
                >
                  $
                </option>
                <option
                  value="₹"
                  selected={userBasicDetails.expectedCTC.currency === "₹"}
                >
                  ₹
                </option>
              </select>
              <input
                type="text"
                name="expectedCTC.amount"
                placeholder="Your Expected CTC"
                {...register("amount", {
                  required: "Enter your Expected CTC",
                })}
              />
            </div>
            {errors.currency && (
              <p className={styles['error-field']}>{errors.currency.message}</p>
            )}
            {errors.amount && (
              <p className={styles['error-field']}>{errors.amount.message}</p>
            )}
          </div>

          <div className={`${styles['text-group-div']} ${styles['row']}`} id="user-linkedin">
            <p className={`${styles['text-group-question']} ${styles['form-question']} ${styles['redirect-link-text']}`}>
              LinkedIn Account Link
              <a
                href={userBasicDetails.linkedinLink}
                target="_blank"
                title="Go To LinkedIn"
              >
                <IoNavigateCircleSharp className={styles['redirectLink']} />
              </a>
            </p>
            <div className={styles['form-answer']}>
              <input
                type="text"
                name="linkedinlink"
                placeholder="Your LinkedIn Account"
                {...register("linkedin", {
                  required: "Provide your LinkedIn profile link",
                })}
              />
            </div>
            {errors.linkedin && (
              <p className={styles['error-field']}>{errors.linkedin.message}</p>
            )}
          </div>

          <div className={`${styles['text-group-div']} ${styles['row']}`} id="user-portfolio">
            <p className={`${styles['text-group-question']} ${styles['form-question']} ${styles['redirect-link-text']}`}>
              Personal Portfolio Link
              <a
                href={userBasicDetails.portfolioLink}
                target="_blank"
                title="Go To Portfolio"
              >
                <IoNavigateCircleSharp className={styles['redirectLink']} />
              </a>
            </p>
            <div className={styles['form-answer']}>
              <input
                type="text"
                name="portfoliolink"
                placeholder="Personal Portfolio"
                {...register("portfolio")}
              />
            </div>
          </div>

          <div className={`${styles['text-group-div']} ${styles['row']}`} id="user-github">
            <p className={`${styles['text-group-question']} ${styles['form-question']} ${styles['redirect-link-text']}`}>
              Github Account Link
              <a
                href={userBasicDetails.githubLink}
                target="_blank"
                title="Go To Github"
              >
                <IoNavigateCircleSharp className={styles['redirectLink']} />
              </a>
            </p>
            <div className={styles['form-answer']}>
              <input
                type="text"
                name="githublink"
                placeholder="Your Github Account"
                {...register("github")}
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
    )
  );
}
