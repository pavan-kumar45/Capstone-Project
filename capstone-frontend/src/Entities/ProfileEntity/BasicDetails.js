import { userBasicDetailStore } from "@/store/atoms/ProfileEntities/UserPersonalProfileDetailsStore"
import { useRecoilState } from "recoil"

export const useUserBasicDetails = () => {
    const [userBasicDetails, setUserBasicDetails] = useRecoilState(userBasicDetailStore);
  
    const setName = (name) => {
      setUserBasicDetails((prev) => ({ ...prev, name }));
    };
  
    const setFresherStatus = (fresher) => {
      setUserBasicDetails((prev) => ({
        ...prev,
        currentEmployment: { ...prev.currentEmployment, fresher },
      }));
    };
  
    const setCompanyName = (companyName) => {
      setUserBasicDetails((prev) => ({
        ...prev,
        currentEmployment: { ...prev.currentEmployment, companyName },
      }));
    };
  
    const setDesignation = (designation) => {
      setUserBasicDetails((prev) => ({
        ...prev,
        currentEmployment: { ...prev.currentEmployment, designation },
      }));
    };
  
    const setCTC = (CTC) => {
      setUserBasicDetails((prev) => ({
        ...prev,
        currentEmployment: { ...prev.currentEmployment, CTC },
      }));
    };
  
    const setCurrentLocation = (currentLocation) => {
      setUserBasicDetails((prev) => ({
        ...prev,
        currentEmployment: { ...prev.currentEmployment, currentLocation },
      }));
    };
  
    const setNoticePeriod = (noticePeriod) => {
      setUserBasicDetails((prev) => ({
        ...prev,
        currentEmployment: { ...prev.currentEmployment, noticePeriod },
      }));
    };
  
    const setExpectedLastWorkingDay = (expectedLastWorkingDay) => {
      setUserBasicDetails((prev) => ({
        ...prev,
        currentEmployment: { ...prev.currentEmployment, expectedLastWorkingDay },
      }));
    };
  
    const setMobileNumber = (mobileNumber) => {
      setUserBasicDetails((prev) => ({ ...prev, mobileNumber }));
    };
  
    const setEmailAddress = (emailAddress) => {
      setUserBasicDetails((prev) => ({ ...prev, emailAddress }));
    };
  
    const setUserProfileImage = (userProfileImage) => {
      setUserBasicDetails((prev) => ({ ...prev, userProfileImage }));
    };
  
    const setUserProfileCompletion = (userProfileCompletion) => {
      setUserBasicDetails((prev) => ({ ...prev, userProfileCompletion }));
    };
  
    const getName = () => userBasicDetails.name;
    const getFresherStatus = () => userBasicDetails.currentEmployment.fresher;
    const getCompanyName = () => userBasicDetails.currentEmployment.companyName;
    const getDesignation = () => userBasicDetails.currentEmployment.designation;
    const getCTC = () => userBasicDetails.currentEmployment.CTC;
    const getCurrentLocation = () => userBasicDetails.currentEmployment.currentLocation;
    const getNoticePeriod = () => userBasicDetails.currentEmployment.noticePeriod;
    const getExpectedLastWorkingDay = () => userBasicDetails.currentEmployment.expectedLastWorkingDay;
    const getMobileNumber = () => userBasicDetails.mobileNumber;
    const getEmailAddress = () => userBasicDetails.emailAddress;
    const getUserProfileImage = () => userBasicDetails.userProfileImage;
    const getUserProfileCompletion = () => userBasicDetails.userProfileCompletion;
  
    return {
      setName,
      setFresherStatus,
      setCompanyName,
      setDesignation,
      setCTC,
      setCurrentLocation,
      setNoticePeriod,
      setExpectedLastWorkingDay,
      setMobileNumber,
      setEmailAddress,
      setUserProfileImage,
      setUserProfileCompletion,
      getName,
      getFresherStatus,
      getCompanyName,
      getDesignation,
      getCTC,
      getCurrentLocation,
      getNoticePeriod,
      getExpectedLastWorkingDay,
      getMobileNumber,
      getEmailAddress,
      getUserProfileImage,
      getUserProfileCompletion,
    };
  };