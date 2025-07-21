import { TbWorldSearch } from "react-icons/tb";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { LuFilter } from "react-icons/lu";
import "./ComponentsStyle.css";
import SlideUpAnimation from "@/wrappers/AnimationWrappers/SlideUpAnimation";
import SlideRightAnimation from "@/wrappers/AnimationWrappers/SlideRightAnimation";

export default function AboutUs() {
  return (
    <main className="aboutus-content main-content">
      <div className="aboutus-leftcontent">
        <SlideUpAnimation delay={0}>
          <h1 className="special-heading">Empowering Talent Acquisition</h1>
        </SlideUpAnimation>
        <SlideUpAnimation delay={0.1}>
          <h1 className="aboutus-heading">
            Uniting Human Expertise with AI Innovation
          </h1>
        </SlideUpAnimation>
        <SlideUpAnimation delay={0.2}>
          <p>
            Pioneering the future of recruitment, we merge human acumen with
            cutting-edge AI to revolutionize talent discovery, fostering
            diverse, efficient, and inclusive hiring solutions for tomorrow's
            workforce.{" "}
          </p>
        </SlideUpAnimation>
      </div>

      <div className="aboutus-rightcontent">
        <div className="aboutus-keypoints">
          <SlideRightAnimation delay={0.2}>
            <div className="box keypoint1">
              <div className="left-key">
                <div className="icon-holder">
                  <TbWorldSearch className="icon icon1" />
                </div>
              </div>
              <div className="right-key">
                <div className="keypoint icon1">Search Candidates</div>
                <div className="keypoint-desc">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Exercitationem, neque.
                </div>
              </div>
            </div>
          </SlideRightAnimation>

          <SlideRightAnimation delay={0.3}>
            <div className="box keypoint2">
              <div className="left-key">
                <div className="icon-holder">
                  <AiOutlineThunderbolt className="icon icon2" />
                </div>
              </div>
              <div className="right-key">
                <div className="keypoint icon2">AI based evaluation</div>
                <div className="keypoint-desc">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Labore, consequuntur.
                </div>
              </div>
            </div>
          </SlideRightAnimation>

          <SlideRightAnimation delay={0.4}>
            <div className="box keypoint3">
              <div className="left-key">
                <div className="icon-holder">
                  <LuFilter className="icon icon3" />
                </div>
              </div>
              <div className="right-key">
                <div className="keypoint icon3">Skill Based Filtter</div>
                <div className="keypoint-desc">
                  Lorem ipsum dolor sit amet cons ectetur adipisicing elit.
                  Minima, omnis!
                </div>
              </div>
            </div>
          </SlideRightAnimation>
        </div>
      </div>
    </main>
  );
}
