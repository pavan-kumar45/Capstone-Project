
import SlideUpAnimation from "@/wrappers/AnimationWrappers/SlideUpAnimation";
import SlideRightAnimation from "@/wrappers/AnimationWrappers/SlideRightAnimation";
import SlideLeftAnimation from "@/wrappers/AnimationWrappers/SlideLeftAnimation";
import FadeInAnimation from "@/wrappers/AnimationWrappers/FadeInAnimation";
import "./ComponentsStyle.css";

export default function OnBoardingContent() {
  return (
    <main className="onboarding-content main-content">
      <div className="onboarding-text-content">
        <SlideUpAnimation delay={0}>
          <p className="onboarding-heading">Reduce your hiring process</p>
        </SlideUpAnimation>

        <SlideUpAnimation delay={0.1}>
          <p className="onboarding-heading">as low as possible</p>
        </SlideUpAnimation>

        <SlideUpAnimation delay={0.2}>
          <p className="onboarding-tag">
            Explore large number of professionals filtered by our AI tool to
            enhance your business
          </p>{" "}
        </SlideUpAnimation>

        <div className="onboarding-buttons">
          <SlideLeftAnimation delay={0.3}>
            <button type="button" className="free button">
              Try for Free
            </button>
          </SlideLeftAnimation>

          <SlideRightAnimation delay={0.3}>
            <button type="button" className="demo button">
              Request Free Demo
            </button>
          </SlideRightAnimation>
        </div>
      </div>

      <FadeInAnimation delay={0.4}>
        <div className="onboarding-image-content">
          <img
            src="../onboardingSvg.svg"
            alt="Isometric Image svg"
            loading="lazy"
            className="onboarding-image"
          />
        </div>
      </FadeInAnimation>
    </main>
  );
}
