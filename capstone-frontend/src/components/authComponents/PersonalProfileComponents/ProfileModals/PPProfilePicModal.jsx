import React, { useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { useRecoilState } from "recoil";
import { picModal } from "@/store/atoms/UserEntityModals";
import { userProfileStore } from "@/store/atoms/ProfileEntities/UserPersonalProfileDetailsStore";
import useFormHandler from "@/utils/CommonAPI";
import styles from './ModalStyles.module.css'; // Importing styles
import style from '../PPStyle.module.css';

export default function PPProfilePicModal() {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [profileData, setProfileData] = useRecoilState(userProfileStore);
  const [defaultImg, setDefaultImg] = useState(null);
  const { handleFormSubmission } = useFormHandler();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handlePreview = (event) => {
    event.preventDefault();
    if (editorRef) {
      const canvas = editorRef.getImageScaledToCanvas();
      const croppedImg = canvas.toDataURL();
      console.log(croppedImg);
      setCroppedImage(croppedImg);
    }
  };
  let editorRef;

  const closeModal = (event) => {
    event.preventDefault();
    setPicModalDisplay(false);
  };

  const handleSave = (event) => {
    event.preventDefault();
    setDefaultImg(croppedImage);
    setProfileData((prevState) => ({
      ...prevState,
      userProfilePicLink: croppedImage,
    }));
    console.log(profileData);
    handleFormSubmission("profile", profileData);
  };

  const [picModalDisplay, setPicModalDisplay] = useRecoilState(picModal);

  return (
    profileData && (
      <div className={`${styles['pic-modal-container']} ${styles['modal-container']}`}>
        <form className={`${style['pic-form']} ${styles['user-form']}`}>
          <button className={styles['close-modal']} onClick={closeModal}></button>
          <h3>Update Profile</h3>
          <p className={styles['modal-info']}>
            Profiles with photo have higher chances of getting noticed by recruiters.
          </p>

          <div className={style['image-div']}>
            <div className={`${style['left-image-div']} ${style['img-div']}`}>
              <div>
                <AvatarEditor
                  ref={(ref) => (editorRef = ref)}
                  image={image ? image : profileData.userProfilePicLink}
                  width={150}
                  height={150}
                  border={50}
                  color={[156, 156, 156, 0.9]} // RGBA
                  scale={scale}
                  onZoomChange={setScale}
                />
              </div>
            </div>
            <div className={`${style['right-image-div']} ${style['img-div']}`}>
              <div>
                <img
                  src={croppedImage ? croppedImage : profileData.userProfilePicLink}
                  alt="Cropped"
                  className={style['cropped-img']}
                />
              </div>
            </div>
          </div>

          <div className={style['upload-img-buttons']}>
            <div>
              <label htmlFor="file-upload" className={style['custom-file-upload']}>
                <i className="fas fa-upload"></i>Upload Photo
              </label>
              <input
                className={style["file-upload"]}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <button onClick={handlePreview} className={style['preview-img-button']}>
              Preview Image
            </button>
          </div>

          <p className={style['modal-pic-info']}>
            By uploading your photograph, you certify that naukri.com has the right to display this photograph to recruiters and that the uploaded file does not violate our{" "}
            <a className={style['terms-service']}>Terms of services.</a>
          </p>

          <div className={`${styles['submit-div']} ${styles['row']}`}>
            <button className={styles['cancel']} onClick={closeModal}>
              Cancel
            </button>
            <button className={styles['submit']} onClick={handleSave}>
              Submit
            </button>
          </div>
        </form>
      </div>
    )
  );
}

