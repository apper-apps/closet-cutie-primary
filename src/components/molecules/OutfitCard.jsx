import { motion } from "framer-motion";
import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const OutfitCard = ({ outfit, onEdit, onDelete, onRate, showActions = true }) => {
  const [rating, setRating] = useState(outfit.rating || 0);

  const handleRate = (newRating) => {
    setRating(newRating);
    onRate(outfit.Id, newRating);
  };

  const getEmojiRating = (rating) => {
    const emojis = ["", "😐", "😊", "😍", "🔥", "✨"];
    return emojis[rating] || "";
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden group relative">
        <div className="aspect-square relative overflow-hidden">
          <img
            src={outfit.imageUrl}
            alt={outfit.notes || "Outfit"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Overlay actions */}
          {showActions && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onEdit(outfit)}
                icon="Edit"
                className="bg-white/90 text-gray-700 hover:bg-white"
              />
              <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(outfit.Id)}
                icon="Trash2"
                className="bg-white/90 text-red-600 hover:bg-white"
              />
            </div>
          )}

          {/* Rating display */}
          {rating > 0 && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-white/90 text-lg">
                {getEmojiRating(rating)}
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4 space-y-3">
          {/* Category badge */}
          <Badge variant="secondary" className="text-xs">
            {outfit.category}
          </Badge>

          {/* Notes */}
          {outfit.notes && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {outfit.notes}
            </p>
          )}

          {/* Tags */}
          {outfit.tags && outfit.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {outfit.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {outfit.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{outfit.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Rating stars */}
          {showActions && (
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRate(star)}
                  className="p-1"
                >
                  <ApperIcon
                    name="Heart"
                    size={16}
                    className={`transition-colors ${
                      star <= rating
                        ? "text-accent fill-current"
                        : "text-gray-300 hover:text-accent"
                    }`}
                  />
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default OutfitCard;