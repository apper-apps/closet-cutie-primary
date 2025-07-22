import { useState, useRef } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const MoodboardCanvas = ({ moodboard, onUpdate, outfits = [] }) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const canvasRef = useRef(null);

  const handleDragStart = (outfit) => {
    setDraggedItem(outfit);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedItem || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newItem = {
      id: Date.now(),
      type: "outfit",
      outfitId: draggedItem.Id,
      x: x - 50,
      y: y - 50,
      width: 100,
      height: 100,
      imageUrl: draggedItem.imageUrl
    };

    const updatedItems = [...(moodboard.items || []), newItem];
    onUpdate({ ...moodboard, items: updatedItems });
    setDraggedItem(null);
  };

  const addDecoration = (type) => {
    if (!canvasRef.current) return;

    const decoration = {
      id: Date.now(),
      type: "decoration",
      decorationType: type,
      x: Math.random() * 200 + 100,
      y: Math.random() * 200 + 100,
      rotation: Math.random() * 360
    };

    const updatedDecorations = [...(moodboard.decorations || []), decoration];
    onUpdate({ ...moodboard, decorations: updatedDecorations });
  };

  const removeItem = (itemId) => {
    const updatedItems = moodboard.items?.filter(item => item.id !== itemId) || [];
    const updatedDecorations = moodboard.decorations?.filter(dec => dec.id !== itemId) || [];
    onUpdate({ 
      ...moodboard, 
      items: updatedItems,
      decorations: updatedDecorations 
    });
  };

  return (
    <div className="space-y-6">
      {/* Decoration Toolbar */}
      <Card className="p-4">
        <h3 className="font-display text-lg mb-3 text-gray-800">Decorations ✨</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { type: "heart", emoji: "💖", label: "Hearts" },
            { type: "sparkle", emoji: "✨", label: "Sparkles" },
            { type: "star", emoji: "⭐", label: "Stars" },
            { type: "flower", emoji: "🌸", label: "Flowers" },
            { type: "bow", emoji: "🎀", label: "Bows" }
          ].map((decoration) => (
            <Button
              key={decoration.type}
              size="sm"
              variant="outline"
              onClick={() => addDecoration(decoration.type)}
              className="flex items-center gap-2"
            >
              <span className="text-lg">{decoration.emoji}</span>
              {decoration.label}
            </Button>
          ))}
        </div>
      </Card>

      {/* Canvas */}
      <Card className="relative min-h-[400px] bg-gradient-to-br from-surface to-white">
        <div
          ref={canvasRef}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative w-full h-full p-6 min-h-[400px] rounded-2xl"
          style={{ 
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 182, 217, 0.1) 2px, transparent 0)`,
            backgroundSize: "50px 50px"
          }}
        >
          {/* Outfit Items */}
          {moodboard.items?.map((item) => (
            <motion.div
              key={item.id}
              drag
              dragMomentum={false}
              style={{
                position: "absolute",
                left: item.x,
                top: item.y,
                width: item.width,
                height: item.height
              }}
              className="group cursor-move"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative w-full h-full">
                <img
                  src={item.imageUrl}
                  alt="Outfit item"
                  className="w-full h-full object-cover rounded-xl shadow-lg"
                />
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ApperIcon name="X" size={12} />
                </button>
              </div>
            </motion.div>
          ))}

          {/* Decorations */}
          {moodboard.decorations?.map((decoration) => (
            <motion.div
              key={decoration.id}
              drag
              dragMomentum={false}
              style={{
                position: "absolute",
                left: decoration.x,
                top: decoration.y,
                transform: `rotate(${decoration.rotation}deg)`
              }}
              className="group cursor-move text-2xl select-none"
              whileHover={{ scale: 1.2 }}
            >
              <div className="relative">
                <span>
                  {decoration.decorationType === "heart" && "💖"}
                  {decoration.decorationType === "sparkle" && "✨"}
                  {decoration.decorationType === "star" && "⭐"}
                  {decoration.decorationType === "flower" && "🌸"}
                  {decoration.decorationType === "bow" && "🎀"}
                </span>
                <button
                  onClick={() => removeItem(decoration.id)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                >
                  <ApperIcon name="X" size={8} />
                </button>
              </div>
            </motion.div>
          ))}

          {/* Empty state */}
          {(!moodboard.items || moodboard.items.length === 0) && 
           (!moodboard.decorations || moodboard.decorations.length === 0) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <ApperIcon name="ImagePlus" className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">Drag outfits here to create magic! ✨</p>
                <p className="text-sm">Add decorations to make it extra cute 💖</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Outfit Picker */}
      {outfits.length > 0 && (
        <Card className="p-4">
          <h3 className="font-display text-lg mb-3 text-gray-800">Your Closet</h3>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {outfits.map((outfit) => (
              <motion.div
                key={outfit.Id}
                draggable
                onDragStart={() => handleDragStart(outfit)}
                whileHover={{ scale: 1.05 }}
                className="aspect-square cursor-grab active:cursor-grabbing"
              >
                <img
                  src={outfit.imageUrl}
                  alt={outfit.notes || "Outfit"}
                  className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                />
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MoodboardCanvas;