import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import * as moodboardService from "@/services/api/moodboardService";
import { toast } from "react-toastify";

const MoodboardList = () => {
  const [moodboards, setMoodboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadMoodboards = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await moodboardService.getAll();
      setMoodboards(data);
    } catch (err) {
      setError("Failed to load your beautiful moodboards. Let's try again! 💖");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoodboards();
  }, []);

  const handleDelete = async (moodboardId) => {
    try {
      await moodboardService.deleteMoodboard(moodboardId);
      setMoodboards(prev => prev.filter(m => m.Id !== moodboardId));
      toast.success("Moodboard deleted! Time for fresh inspiration ✨");
    } catch (err) {
      toast.error("Couldn't delete moodboard. Try again! 💖");
    }
  };

  const createNewMoodboard = async () => {
    try {
      const newMoodboard = {
        name: `Untitled Board ${Date.now()}`,
        items: [],
        decorations: []
      };
      
      const created = await moodboardService.createMoodboard(newMoodboard);
      navigate(`/moodboard/${created.Id}`);
      toast.success("New moodboard created! Let the magic begin ✨");
    } catch (err) {
      toast.error("Couldn't create moodboard. Try again! 💖");
    }
  };

  if (loading) return <Loading type="grid" />;
  if (error) return <Error message={error} onRetry={loadMoodboards} />;

  if (moodboards.length === 0) {
    return (
      <Empty
        title="No moodboards yet! 🎨"
        description="Create your first aesthetic board and start collecting all those dreamy vibes!"
        actionText="Create First Moodboard"
        onAction={createNewMoodboard}
        icon="Palette"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display text-gray-800 mb-2">Your Moodboards ✨</h2>
          <p className="text-gray-600">Curate your aesthetic dreams and style inspiration</p>
        </div>
        <Button 
          onClick={createNewMoodboard}
          icon="Plus"
          className="shrink-0"
        >
          New Board
        </Button>
      </div>

      {/* Moodboard Grid */}
      <AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moodboards.map((moodboard, index) => (
            <motion.div
              key={moodboard.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
<Card className="overflow-hidden group cursor-pointer transform transition-all duration-300 hover:shadow-xl">
                <div 
                  className="aspect-[4/3] relative bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4"
                  onClick={() => navigate(`/moodboard/${moodboard.Id}`)}
                >
                  {/* Preview of items */}
                  {moodboard.items && moodboard.items.length > 0 ? (
                    <div className="relative w-full h-full">
                      {/* Main feature image */}
                      {moodboard.items[0] && (
                        <img
                          src={moodboard.items[0].imageUrl}
                          alt=""
                          className="absolute top-3 left-3 w-20 h-20 object-cover rounded-xl shadow-lg border-2 border-white z-10"
                        />
                      )}
                      
                      {/* Secondary overlapping images */}
                      {moodboard.items.slice(1, 4).map((item, idx) => (
                        <img
                          key={idx}
                          src={item.imageUrl}
                          alt=""
                          className={`absolute w-14 h-14 object-cover rounded-lg shadow-md border border-white/50 ${
                            idx === 0 ? "top-6 right-4 rotate-6" :
                            idx === 1 ? "bottom-4 left-6 -rotate-3" :
                            "bottom-3 right-6 rotate-12"
                          }`}
                          style={{ zIndex: 9 - idx }}
                        />
                      ))}
                      
                      {/* Additional items indicator */}
                      {moodboard.items.length > 4 && (
                        <div className="absolute bottom-2 right-2 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                          +{moodboard.items.length - 3}
                        </div>
                      )}
                      
                      {/* Floating decorations */}
                      {moodboard.decorations?.slice(0, 3).map((decoration, idx) => (
                        <span
                          key={idx}
                          className={`absolute text-xl drop-shadow-sm ${
                            idx === 0 ? "top-1/4 left-1/2 -translate-x-1/2" :
                            idx === 1 ? "top-3/4 right-1/4" :
                            "bottom-1/4 left-1/4"
                          }`}
                          style={{ 
                            transform: `rotate(${decoration.rotation || 0}deg) ${idx === 0 ? 'translateX(-50%)' : ''}`,
                            zIndex: 15
                          }}
                        >
                          {decoration.decorationType === "heart" && "💖"}
                          {decoration.decorationType === "sparkle" && "✨"}
                          {decoration.decorationType === "star" && "⭐"}
                          {decoration.decorationType === "flower" && "🌸"}
                          {decoration.decorationType === "bow" && "🎀"}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <ApperIcon name="ImagePlus" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Empty board</p>
                      </div>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Button size="sm" variant="secondary" className="bg-white/90">
                      Open Board
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 truncate">
                        {moodboard.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {(moodboard.items?.length || 0) + (moodboard.decorations?.length || 0)} items
                      </p>
                    </div>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/moodboard/${moodboard.Id}`);
                        }}
                        icon="Edit"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(moodboard.Id);
                        }}
                        icon="Trash2"
                        className="text-error hover:bg-error/10"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default MoodboardList;