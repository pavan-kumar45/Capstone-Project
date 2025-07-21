import { atom } from "recoil";

export const assessmentQuestionNo = atom({
  key: "assessmentQuestionNo",
  default: null, // Initial user logged in state
});

export const storeQuestionData = atom({
  key: "storeQuestionData",
  default: null,
});

export const storeQuestionOnBoard = atom({
  key: "storeQuestionOnBoard",
  default: null, // Initial user logged in state
});

export const storeUserAnswerData = atom({
  key: "storeUseAnswerrData",
  default: [], //initially it will be a array of object
});

export const storeUserProfilePic = atom({
  key:"storeUserProfilePic",
  default:"../defaultProfilePic"
})
