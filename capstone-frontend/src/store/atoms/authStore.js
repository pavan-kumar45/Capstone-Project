import { atom } from "recoil";

export const userloggedInStatus = atom({
  key: "userloggedInStatus",
  default: true, // Initial user logged in state
});

export const userDetails = atom({
  key: "userDetails",
  default: null, // Initial user information from
});
