import { motion } from "framer-motion";
const SlideLeftAnimation = ({ delay, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50, transition: { duration: 0 } }}
      whileInView={{
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, delay: delay },
      }}
    >
      {children}
    </motion.div>
  );
};
export default SlideLeftAnimation;
