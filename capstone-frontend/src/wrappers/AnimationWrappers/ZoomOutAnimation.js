import { motion } from "framer-motion";
const ZoomOutAnimation = ({ delay, children }) => {
  return (
    <motion.div
    initial={{ opacity: 0, zoom: 0.5, transition: { duration: 0 } }}
    whileInView={{ opacity: 1, zoom:1, transition: { duration: 0.5, delay:delay } }}
  >
      {children}
    </motion.div>
  );
};
export default ZoomOutAnimation;
