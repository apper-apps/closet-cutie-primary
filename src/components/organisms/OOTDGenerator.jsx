import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import * as outfitService from "@/services/api/outfitService";

const OOTDGenerator = ({ onViewCloset }) => {
  const [outfits, setOutfits] = useState([]);
  const [currentOutfit, setCurrentOutfit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shuffling, setShuffling] = useState(false);

  const loadOutfits = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await outfitService.getAll();
      setOutfits(data);
      if (data.length > 0) {
        setCurrentOutfit(getRandomOutfit(data));
      }
    } catch (err) {
      setError("Failed to load your outfits. Let's try again! 💖");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOutfits();
  }, []);

  const getRandomOutfit = (outfitList = outfits) => {
    if (outfitList.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * outfitList.length);
    return outfitList[randomIndex];
  };

  const generateCommentary = (outfit) => {
    if (!outfit) return "Loading your fabulous look! ✨";

    const commentaries = {
      "coquette": [
        "Serving soft girl realness 🌸",
        "You're giving princess vibes today! 👑",
        "Coquette queen energy activated! 🎀"
      ],
      "y2k": [
        "You're giving early 2000s romcom queen 💄👠",
        "Bringing back the Y2K magic! ✨",
        "Total butterfly clip princess vibes! 🦋"
      ],
      "cottagecore": [
        "Forest fairy aesthetic on point! 🌿",
        "Cottage living your best life! 🏡",
        "Giving main character in a cozy novel! 📚"
      ],
      "streetwear": [
        "Street style icon status unlocked! 🔥",
        "Urban princess energy! 👟",
        "Casual but make it fashion! ✨"
      ],
      "glam": [
        "Absolutely stunning! Red carpet ready! 💎",
        "Glamour goddess mode activated! ✨",
        "You're literally glowing! 🌟"
      ],
      "vintage": [
        "Retro queen serving looks! 👗",
        "Time travel chic! Love it! 🕰️",
        "Old Hollywood glamour vibes! 🎭"
      ],
      "default": [
        "Looking absolutely gorgeous today! 💖",
        "Main character energy activated! ✨",
        "You're serving looks and I'm here for it! 🔥",
        "Outfit perfection achieved! 👑",
        "Style icon status: CONFIRMED! ⭐"
      ]
    };

    // Try to match outfit tags with commentary themes
    let matchedCommentary = commentaries.default;
    
    if (outfit.tags && outfit.tags.length > 0) {
      const tag = outfit.tags[0].toLowerCase();
      for (const [key, value] of Object.entries(commentaries)) {
        if (tag.includes(key) || key.includes(tag)) {
          matchedCommentary = value;
          break;
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * matchedCommentary.length);
    return matchedCommentary[randomIndex];
  };

  const handleShuffle = () => {
    if (outfits.length === 0) return;
    
    setShuffling(true);
    
    // Create magical shuffle effect
    setTimeout(() => {
      const newOutfit = getRandomOutfit();
      setCurrentOutfit(newOutfit);
      setShuffling(false);
    }, 500);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadOutfits} />;

  if (outfits.length === 0) {
    return (
      <Empty
        title="No outfits to suggest! 💔"
        description="Add some gorgeous pieces to your closet first, then come back for your daily style magic!"
        actionText="Build Your Closet"
        onAction={onViewCloset}
        icon="Shirt"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-display text-gray-800">
          Today's Look ✨
        </h2>
        <p className="text-gray-600">
          Your personal style oracle has spoken!
        </p>
      </div>

      {/* Main OOTD Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentOutfit?.Id || "loading"}
          initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.9, rotateY: -90 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden bg-gradient-to-br from-surface to-white relative">
            {shuffling && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center z-10 backdrop-blur-sm">
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl"
                >
                  ✨
                </motion.div>
              </div>
            )}
            
            <div className="aspect-square md:aspect-[4/3] relative overflow-hidden">
              <img
                src={currentOutfit?.imageUrl}
                alt={currentOutfit?.notes || "Today's outfit"}
                className="w-full h-full object-cover"
              />
              
              {/* Sparkle overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-4 right-4 text-2xl"
              >
                💖
              </motion.div>
              
              <motion.div
                animate={{ y: [0, -15, 0], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute bottom-4 left-4 text-xl"
              >
                ✨
              </motion.div>
            </div>

            <div className="p-6 space-y-4">
              {/* Commentary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <h3 className="text-xl font-display text-gray-800 mb-2">
                  {generateCommentary(currentOutfit)}
                </h3>
                {currentOutfit?.notes && (
                  <p className="text-gray-600 italic">
                    "{currentOutfit.notes}"
                  </p>
                )}
              </motion.div>

              {/* Outfit Details */}
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary">{currentOutfit?.category}</Badge>
                {currentOutfit?.tags?.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline">#{tag}</Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center pt-2">
                <Button
                  onClick={handleShuffle}
                  disabled={shuffling}
                  icon="Shuffle"
                  size="lg"
                  className="flex-1 max-w-xs"
                >
                  {shuffling ? "Casting Magic..." : "Shuffle Look"}
                </Button>
                
                <Button
                  onClick={onViewCloset}
                  variant="outline"
                  icon="Shirt"
                  size="lg"
                >
                  My Closet
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {outfits.length}
          </div>
          <div className="text-sm text-gray-600">Total Looks</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-accent mb-1">
            {outfits.filter(o => o.rating >= 4).length}
          </div>
          <div className="text-sm text-gray-600">Fave Pieces</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-secondary mb-1">
            {new Set(outfits.flatMap(o => o.tags || [])).size}
          </div>
          <div className="text-sm text-gray-600">Style Tags</div>
        </Card>
      </div>
    </div>
  );
};

export default OOTDGenerator;