import { motion } from 'framer-motion';

const FramerMotion = () => {
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return <motion.div initial="hidden" animate="visible" variants={variants} />;
};

export default FramerMotion;
