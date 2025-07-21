import { motion } from "framer-motion";
import CountUp from "react-countup";
import SlideLeftAnimation from "@/wrappers/AnimationWrappers/SlideLeftAnimation";
import SlideRightAnimation from "@/wrappers/AnimationWrappers/SlideRightAnimation";
import SlideUpAnimation from "@/wrappers/AnimationWrappers/SlideUpAnimation";
import Slider from "react-slick";

export default function ChooseUs() {
  return (
    <div className="chooseus-content main-content">
      <div className="chooseus-leftcontent">
        <div className="count-part">
          <SlideLeftAnimation delay={0.1}>
            <div className="count count1">
              <div className="num">
                <div className="countup">
                  <CountUp end={10} enableScrollSpy />
                </div>
                M
              </div>
              <div className="desc">Job Candidates</div>
            </div>
          </SlideLeftAnimation>

          <SlideLeftAnimation delay={0.3}>
            <div className="count count2">
              <div className="num">
                <div className="countup">
                  <CountUp end={88} enableScrollSpy />
                </div>
                %
              </div>
              <div className="desc">Accuracy AI recommendations</div>
            </div>
          </SlideLeftAnimation>
        </div>
        <div className="count-part">
          <SlideRightAnimation delay={0.2}>
            <div className="count count3">
              <div className="num">
                <div className="countup">
                  <CountUp end={90} enableScrollSpy />
                </div>
                %
              </div>
              <div className="desc">Time saved as low as 24 hrs</div>
            </div>
          </SlideRightAnimation>

          <SlideRightAnimation delay={0.4}>
            <div className="count count4">
              <div className="num">
                <div className="countup">
                  <CountUp end={10} enableScrollSpy />
                </div>
                %
              </div>
              <div className="desc">Effective cost as low as $100</div>
            </div>
          </SlideRightAnimation>
        </div>
      </div>
      <div className="chooseus-rightcontent">
        <SlideUpAnimation delay={0.1}>
          <h1 className="chooseus-special-content">Job Circuit</h1>
        </SlideUpAnimation>

        <SlideUpAnimation delay={0.2}>
          <h1 className="chooseus-heading">
            is the platform that is trusted by the top companies
          </h1>
        </SlideUpAnimation>

        <SlideUpAnimation delay={0.3}>
          <p>
            We partnered with high level companies and help tthem to ease the
            process of recruiting by providing them professionals experted in
            all necessary skills
          </p>
        </SlideUpAnimation>
      </div>
    </div>
  );
}
