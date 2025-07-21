import { motion } from "framer-motion";
import SlideUpAnimation from "@/wrappers/AnimationWrappers/SlideUpAnimation";
export default function LogoSlider() {
  const images = {
    image1: "../image1.png",
    image2: "../image2.png",
    image3: "../image3.png",
    image4: "../image4.png",
    image5: "../image5.png",
    image6: "../image6.png",
    image7: "../image7.png",
    image8: "../image8.png",
    image9: "../image9.png",
  };

  return (
    <div className="logoslider-content main-content">
      <div className="logoslider-leftcontent">
        <SlideUpAnimation delay={0.1}>
          <div className="logoslider-heading logoslider-child">
            <h1 className="logoslider-specialcontent">Join</h1>
            <h1>Now</h1>
          </div>
        </SlideUpAnimation>

        <SlideUpAnimation delay={0.2}>
          <div className="logoslider-desc logoslider-child">
            Join the best AI powered platform that enhances your business,
            values your time and reduces your hiring process as low as possible.
            Find out our partners on the right.
          </div>
        </SlideUpAnimation>
      </div>
      <div className="logoslider-rightcontent">
        <div className="main-image-gallery">
          <SlideUpAnimation delay={0.2}>
            <img src={images.image1} alt="" className="logos" loading="lazy" />
          </SlideUpAnimation>

          <SlideUpAnimation delay={0.3}>
            <img src={images.image2} alt="" className="logos" loading="lazy" />
          </SlideUpAnimation>

          <SlideUpAnimation delay={0.4}>
            <img src={images.image3} alt="" className="logos" loading="lazy" />
          </SlideUpAnimation>

          <SlideUpAnimation delay={0.2}>
            <img src={images.image4} alt="" className="logos" loading="lazy" />
          </SlideUpAnimation>

          <SlideUpAnimation delay={0.3}>
            <img src={images.image5} alt="" className="logos" loading="lazy" />
          </SlideUpAnimation>

          <SlideUpAnimation delay={0.4}>
            <img src={images.image6} alt="" className="logos" loading="lazy" />
          </SlideUpAnimation>

          <SlideUpAnimation delay={0.2}>
            <img src={images.image7} alt="" className="logos" loading="lazy" />
          </SlideUpAnimation>

          <SlideUpAnimation delay={0.3}>
            <img src={images.image8} alt="" className="logos" loading="lazy" />
          </SlideUpAnimation>

          <SlideUpAnimation delay={0.4}>
            <img src={images.image9} alt="" className="logos" loading="lazy" />
          </SlideUpAnimation>
        </div>
      </div>
    </div>
  );
}
