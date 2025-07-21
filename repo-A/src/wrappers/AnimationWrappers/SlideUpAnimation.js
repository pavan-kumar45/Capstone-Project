import { motion } from "framer-motion";
const SlideUpAnimation = ({ delay, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 45, transition: { duration: 0 } }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: delay },
      }}
    >
      {children}
    </motion.div>
  );
};
export default SlideUpAnimation;
