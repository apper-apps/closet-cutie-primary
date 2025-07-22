import { useState } from "react";
import { motion } from "framer-motion";
import OutfitGrid from "@/components/organisms/OutfitGrid";
import Button from "@/components/atoms/Button";
import OutfitUploadModal from "@/components/molecules/OutfitUploadModal";

const Closet = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingOutfit, setEditingOutfit] = useState(null);

  const handleAddOutfit = () => {
    setEditingOutfit(null);
    setShowUploadModal(true);
  };

  const handleEditOutfit = (outfit) => {
    setEditingOutfit(outfit);
    setShowUploadModal(true);
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
    setEditingOutfit(null);
  };

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
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-display text-gray-800 mb-2">
              Your Closet 👗
            </h1>
            <p className="text-gray-600">
              Organize and discover your fabulous fashion collection
            </p>
          </div>
          
          <Button
            onClick={handleAddOutfit}
            icon="Plus"
            size="lg"
            className="shrink-0"
          >
            Add Outfit
          </Button>
        </motion.div>

        {/* Outfit Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <OutfitGrid
            onAddOutfit={handleAddOutfit}
            onEditOutfit={handleEditOutfit}
          />
        </motion.div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <OutfitUploadModal
          outfit={editingOutfit}
          onClose={handleCloseModal}
          onSuccess={() => {
            handleCloseModal();
            // Refresh will happen automatically through the grid component
          }}
        />
      )}
    </motion.div>
  );
};

export default Closet;