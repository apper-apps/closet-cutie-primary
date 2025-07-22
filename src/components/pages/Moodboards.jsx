import { motion } from "framer-motion";
import MoodboardList from "@/components/organisms/MoodboardList";

const Moodboards = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-background to-surface pb-20 px-4"
    >
      <div className="max-w-7xl mx-auto pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-display text-gray-800 mb-3">
            Aesthetic Moodboards 🎨
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create dreamy visual boards to capture your style inspiration and aesthetic vibes
          </p>
        </motion.div>

        {/* Moodboard List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MoodboardList />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Moodboards;