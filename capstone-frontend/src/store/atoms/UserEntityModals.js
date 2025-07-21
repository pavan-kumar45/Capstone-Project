import { atom } from "recoil";

export const experienceModal = atom({
  key: "experienceModal",
  default: false,
});
export const educationModal = atom({
  key: "educationModal",
  default: false,
});
export const certificationModal = atom({
  key: "certificationModal",
  default: false,
});
export const skillModal = atom({
  key: "skillModal",
  default: false,
});
export const summaryModal = atom({
  key: "summaryModal",
  default: false,
});
export const profileModal = atom({
  key: "profileModal",
  default:false
})
export const picModal = atom({
  key: "picModal",
  default:false
})
export const resumeModal = atom({
  key: "resumeModal",
  default:false
})


// Edit Modals
export const experienceEditModal = atom({
  key: "experienceEditModal",
  default:false
})
export const educationEditModal = atom({
  key: "educationEditModal",
  default:false
})
export const certificationEditModal = atom({
  key: "certificationEditModal",
  default:false
})
export const detailsEditModal = atom({
  key: "detailsEditModal",
  default:false
})