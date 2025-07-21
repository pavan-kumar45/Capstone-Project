import React, { useEffect, useState } from "react";
import { skillModal } from "@/store/atoms/UserEntityModals";
import { userSkillsStore } from "@/store/atoms/ProfileEntities/UserPersonalProfileDetailsStore";
import { useRecoilState } from "recoil";
import styles from './ModalStyles.module.css'; // Importing styles

export default function PPSkillModal() {
  const [skillModalDisplay, setSkillModalDisplay] = useRecoilState(skillModal);

  const closeModal = () => {
    setSkillModalDisplay(false);
  };

  const [primarySkillsData, setPrimarySkillsData] = useState();
  const [secondarySkillsData, setSecondarySkillsData] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [psVisible, setPsVisible] = useState(true);
  const [filteredPrimarySkills, setFilteredPrimarySkills] = useState([]);
  const [filteredSecondarySkills, setFilteredSecondarySkills] = useState([]);
  const [defaultSkillStore, setDefaultSkillStore] = useRecoilState(userSkillsStore);
  const [defaultPrimarySkills, setDefaultPrimarySkills] = useState();
  const [defaultSecondarySkills, setDefaultSecondarySkills] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();

  const handleSkills = (skillCat, event) => {
    event.preventDefault();
    if (psVisible && skillCat === "ss") {
      setPsVisible(false);
    } else if (!psVisible && skillCat === "ps") {
      setPsVisible(true);
    }
  };

  useEffect(() => {
    if (defaultSkillStore != null)
      console.log("Skill Store", defaultSkillStore);
    const filteredDefaultPrimarySkills = defaultSkillStore.filter(
      (skill) => skill.skillType === "primary"
    );
    console.log("Filtered DPS", filteredDefaultPrimarySkills);
    const filteredDefaultSecondarySkills = defaultSkillStore.filter(
      (skill) => skill.skillType === "secondary"
    );
    console.log("Filtered DSS", filteredDefaultSecondarySkills);
    setDefaultPrimarySkills(filteredDefaultPrimarySkills);
    setDefaultSecondarySkills(filteredDefaultSecondarySkills);
  }, [defaultSkillStore]);

  useEffect(() => {
    function fetchUserPersonalData() {
      fetch("/data/Skills.json", { cache: "no-store" })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("--------------------------------------------");
          console.log("This is all skills data", data);
          console.log("--------------------------------------------");
          setSkillsData(data);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }

    const setSkillsData = (skillsData) => {
      const filteredPrimarySkills = skillsData.filter(
        (skill) => skill.skillType === "primary"
      );
      const filteredSecondarySkills = skillsData.filter(
        (skill) => skill.skillType === "secondary"
      );

      console.log("PS", filteredPrimarySkills);
      console.log("SS", filteredSecondarySkills);

      setPrimarySkillsData(filteredPrimarySkills);
      setSecondarySkillsData(filteredSecondarySkills);
      setFilteredPrimarySkills(filteredPrimarySkills);
      setFilteredSecondarySkills(filteredSecondarySkills);
    };

    fetchUserPersonalData();
  }, []);

  const handleSearchChange = (event) => {
    event.preventDefault();
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    if (searchTerm.trim() === "") {
      setFilteredPrimarySkills(primarySkillsData);
      setFilteredSecondarySkills(secondarySkillsData);
    } else {
      const filteredPrimarySkills = primarySkillsData.filter((skill) =>
        skill.skillName.toLowerCase().includes(searchTerm)
      );
      setFilteredPrimarySkills(filteredPrimarySkills);

      const filteredSecondarySkills = secondarySkillsData.filter((skill) =>
        skill.skillName.toLowerCase().includes(searchTerm)
      );
      setFilteredSecondarySkills(filteredSecondarySkills);
    }
  };

  const includedInSkillStore = (skillDataParam) => {
    return defaultSkillStore.some((skill) => skill.skillId === skillDataParam);
  };

  const handleSkillSelectionChange = (skillId) => {
    if (includedInSkillStore(skillId)) {
      // Skill is already in the defaultSkillStore, so remove it
      setDefaultSkillStore(
        defaultSkillStore.filter((skill) => skill.skillId !== skillId)
      );
    } else {
      // Skill is not in the defaultSkillStore, so add it
      const skillToAdd = psVisible
        ? filteredPrimarySkills.find((skill) => skill.skillId === skillId)
        : filteredSecondarySkills.find((skill) => skill.skillId === skillId);
      if (skillToAdd) {
        setDefaultSkillStore([...defaultSkillStore, skillToAdd]);
        console.log("Changed Skill Store", defaultSkillStore);
      }
    }

    console.log("This is new default Skill Store", defaultSkillStore);
  };

  const handleSubmitForm = (event) => {
    event.preventDefault();
    console.log("Submitting Skills", defaultSkillStore);
    setIsSubmitting(true);
    if (defaultSkillStore.length === 0) {
      setError("At least one skill is expected to be selected");
      setIsSubmitting(false);
    } else {
      setDefaultSkillStore(defaultSkillStore);
      setIsSubmitting(false);
      closeModal();
    }
  };

  const clearSkill = (skillId) => {
    setDefaultSkillStore(
      defaultSkillStore.filter((skill) => skill.skillId !== skillId)
    );
  };

  return (
    primarySkillsData &&
    secondarySkillsData && (
      <div className={`${styles['skill-modal-container']} ${styles['modal-container']}`}>
        <form className={`${styles['skill-form']} ${styles['user-form']}`} onSubmit={handleSubmitForm}>
          <button className={styles['close-modal']} onClick={closeModal}></button>
          <h3>Add Skills</h3>
          <div className={`${styles['row']} ${styles['skill-tabs']}`}>
            <button
              className={psVisible ? `${styles['skillButton']} ${styles['skill-active']}` : styles['skillButton']}
              onClick={(event) => handleSkills("ps", event)}
            >
              Primary Skills
            </button>
            <button
              className={!psVisible ? `${styles['skillButton']} ${styles['skill-active']}` : styles['skillButton']}
              onClick={(event) => handleSkills("ss", event)}
            >
              Secondary Skills
            </button>
          </div>
          <div className={`${styles['input-group-div']} ${styles['row']}`}>
            <div className={styles['form-answer']}>
              <input
                type="text"
                name="skill-search"
                placeholder="Search for skills"
                className={styles['skill-search']}
                onChange={handleSearchChange}
                value={searchTerm}
                autoComplete="off"
              />
            </div>
          </div>
          <div className={`${styles['skills-scroll-div']} ${styles['row']}`}>
            {psVisible ? (
              <ul className={`${styles['row']} ${styles['primary-skills']} ${styles['skills-data']}`}>
                {filteredPrimarySkills.map((primarySkills) => (
                  <li
                    key={primarySkills.skillId}
                    className={styles['skills-list-content']}
                  >
                    <input
                      type="checkbox"
                      id={`checkbox-${primarySkills.skillId}`}
                      checked={includedInSkillStore(primarySkills.skillId)}
                      onChange={() => handleSkillSelectionChange(primarySkills.skillId)}
                    />
                    <label htmlFor={`checkbox-${primarySkills.skillId}`}>
                      {primarySkills.skillName}
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className={`${styles['row']} ${styles['secondary-skills']} ${styles['skills-data']}`}>
                {filteredSecondarySkills.map((secondarySkills) => (
                  <li
                    key={secondarySkills.skillId}
                    className={styles['skills-list-content']}
                  >
                    <input
                      type="checkbox"
                      id={`checkbox-${secondarySkills.skillId}`}
                      checked={includedInSkillStore(secondarySkills.skillId)}
                      onChange={() => handleSkillSelectionChange(secondarySkills.skillId)}
                    />
                    <label htmlFor={`checkbox-${secondarySkills.skillId}`}>
                      {secondarySkills.skillName}
                    </label>
                  </li>
                ))}
              </ul>
            )}

            <div className={styles['extra-skills-content']}></div>
          </div>
          <div className={`${styles['row']} ${styles['default-skills']}`}>
            {psVisible ? (
              <div className={styles['default-primary-skills']}>
                <ul className={`${styles['row']} ${styles['skill-row']}`}>
                  {defaultPrimarySkills &&
                    defaultPrimarySkills.map((primarySkill) => (
                      <li
                        key={primarySkill.skillId}
                        className={styles['skillname-inmodal']}
                      >
                        {primarySkill.skillName}
                        <span
                          className={styles['clear-skill']}
                          onClick={() => clearSkill(primarySkill.skillId)}
                        >
                          &times;
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            ) : (
              <div className={styles['default-secondary-skills']}>
                <ul className={`${styles['row']} ${styles['skill-row']}`}>
                  {defaultSecondarySkills &&
                    defaultSecondarySkills.map((secondarySkill) => (
                      <li
                        key={secondarySkill.skillId}
                        className={styles['skillname-inmodal']}
                      >
                        {secondarySkill.skillName}
                        <span
                          className={styles['clear-skill']}
                          onClick={() => clearSkill(secondarySkill.skillId)}
                        >
                          &times;
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>

          {error && <p className={styles['error-field']}>{error}</p>}

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
