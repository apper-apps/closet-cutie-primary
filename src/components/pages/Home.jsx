import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import OOTDGenerator from "@/components/organisms/OOTDGenerator";

const Home = () => {
  const navigate = useNavigate();

  const handleViewCloset = () => {
    navigate("/closet");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-background to-surface pb-20 px-4"
    >
      <div className="max-w-4xl mx-auto pt-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-display text-gray-800 mb-3">
            Closet Cutie ✨
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your dreamy virtual closet where fashion meets magic! 
            Get your daily dose of style inspiration and main character energy 💖
          </p>
        </motion.div>

        {/* OOTD Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <OOTDGenerator onViewCloset={handleViewCloset} />
        </motion.div>

        {/* Floating decorative elements */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0] 
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="fixed top-20 right-8 text-3xl opacity-20 pointer-events-none z-0"
        >
          🌸
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, -5, 0] 
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="fixed bottom-32 left-8 text-2xl opacity-20 pointer-events-none z-0"
        >
          🎀
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, -8, 0],
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="fixed top-1/2 left-4 text-xl opacity-15 pointer-events-none z-0"
        >
          💖
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;