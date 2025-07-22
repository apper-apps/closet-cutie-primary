import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import * as outfitService from "@/services/api/outfitService";
import { toast } from "react-toastify";

const OutfitUploadModal = ({ outfit = null, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    imageUrl: outfit?.imageUrl || "",
    category: outfit?.category || "",
    notes: outfit?.notes || "",
    tags: outfit?.tags || []
  });
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = [
    { name: "Top", icon: "👕" },
    { name: "Bottom", icon: "👖" },
    { name: "Dress", icon: "👗" },
    { name: "Shoes", icon: "👠" },
    { name: "Accessories", icon: "👜" },
    { name: "Outerwear", icon: "🧥" },
    { name: "Full Outfit", icon: "✨" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.imageUrl || !formData.category) {
      toast.error("Please add an image and select a category! 💖");
      return;
    }

    try {
      setLoading(true);
      
      const outfitData = {
        ...formData,
        dateAdded: outfit ? outfit.dateAdded : new Date().toISOString(),
        rating: outfit ? outfit.rating : 0,
        wornDates: outfit ? outfit.wornDates : []
      };

      if (outfit) {
        await outfitService.updateOutfit(outfit.Id, outfitData);
        toast.success("Outfit updated! Looking fabulous ✨");
      } else {
        await outfitService.createOutfit(outfitData);
        toast.success("New outfit added to your closet! 💖");
      }
      
      onSuccess();
    } catch (err) {
      toast.error("Couldn't save outfit. Try again! 💖");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <Card className="p-6 bg-gradient-to-br from-surface to-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display text-gray-800">
                {outfit ? "Edit Outfit ✏️" : "Add New Outfit ✨"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                icon="X"
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image URL */}
              <div>
                <Input
                  label="Image URL"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="Paste your outfit photo URL here..."
                  required
                />
                {formData.imageUrl && (
                  <div className="mt-3">
                    <img
                      src={formData.imageUrl}
                      alt="Outfit preview"
                      className="w-32 h-32 object-cover rounded-xl border-2 border-primary/20"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Category
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.name}
                      type="button"
                      variant={formData.category === category.name ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, category: category.name }))}
                      className="flex flex-col items-center gap-1 h-auto py-3"
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-xs">{category.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Where did you wear this? How did it make you feel? ✨"
                  rows={3}
                  className="w-full rounded-2xl border border-primary/20 bg-surface/80 px-4 py-3 text-sm transition-all duration-200 placeholder:text-gray-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Style Tags
                </label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add style tags (coquette, y2k, etc.)"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                    icon="Plus"
                    size="sm"
                  />
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1 cursor-pointer hover:bg-accent/20"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        #{tag}
                        <ApperIcon name="X" size={12} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  className="flex-1"
                >
                  {loading ? "Saving..." : (outfit ? "Update Outfit" : "Add to Closet")}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OutfitUploadModal;