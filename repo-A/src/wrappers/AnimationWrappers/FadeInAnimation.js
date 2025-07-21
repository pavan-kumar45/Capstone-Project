import { motion } from "framer-motion";
const FadeInAnimation = ({ delay, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, transition: { duration: 0 } }}
      whileInView={{
        opacity: 1,
        transition: { duration: 0.7, delay: delay, easing: "easeInOutCubic" },
      }}
    >
      {children}
    </motion.div>
  );
};
export default FadeInAnimation;
