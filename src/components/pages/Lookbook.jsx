import { useState } from "react";
import { motion } from "framer-motion";
import LookbookTimeline from "@/components/organisms/LookbookTimeline";
import OutfitUploadModal from "@/components/molecules/OutfitUploadModal";

const Lookbook = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleAddOutfit = () => {
    setShowUploadModal(true);
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-background to-surface pb-20 px-4"
    >
      <div className="max-w-7xl mx-auto pt-8">
        {/* Lookbook Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <LookbookTimeline onAddOutfit={handleAddOutfit} />
        </motion.div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <OutfitUploadModal
          onClose={handleCloseModal}
          onSuccess={() => {
            handleCloseModal();
            // Timeline will refresh automatically
          }}
        />
      )}
    </motion.div>
  );
};

export default Lookbook;