import { userDataStore } from "@/store/atoms/ProfileEntities/UserPersonalProfileDetailsStore";
import { useRecoilState } from "recoil";

const useFormHandler = () => {
  const [userOverallData, setUserOverallData] = useRecoilState(userDataStore);
  const handleFormSubmission = async (key, data) => {
    try {
      console.log("Whole Page Submission is invoked.");

      setUserOverallData((prevData) => ({
        ...prevData,
        [key]: data,
      }));
      console.log(userOverallData);
    } catch (err) {
      console.log(err);
    }
  };

  return {
    handleFormSubmission,
  };
};

export default useFormHandler;
