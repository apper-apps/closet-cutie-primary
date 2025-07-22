import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MoodboardCanvas from "@/components/molecules/MoodboardCanvas";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import * as moodboardService from "@/services/api/moodboardService";
import * as outfitService from "@/services/api/outfitService";
import { toast } from "react-toastify";

const MoodboardEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [moodboard, setMoodboard] = useState(null);
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [boardName, setBoardName] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [moodboardData, outfitsData] = await Promise.all([
        moodboardService.getById(parseInt(id)),
        outfitService.getAll()
      ]);
      
      setMoodboard(moodboardData);
      setOutfits(outfitsData);
      setBoardName(moodboardData.name);
    } catch (err) {
      setError("Failed to load moodboard. Let's try again! 💖");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!moodboard) return;
    
    try {
      setSaving(true);
      const updatedMoodboard = {
        ...moodboard,
        name: boardName,
        lastModified: new Date().toISOString()
      };
      
      await moodboardService.updateMoodboard(moodboard.Id, updatedMoodboard);
      setMoodboard(updatedMoodboard);
      toast.success("Moodboard saved! Looking gorgeous ✨");
    } catch (err) {
      toast.error("Couldn't save moodboard. Try again! 💖");
    } finally {
      setSaving(false);
    }
  };

  const handleMoodboardUpdate = (updatedMoodboard) => {
    setMoodboard(updatedMoodboard);
  };

  if (loading) return <Loading type="moodboard" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!moodboard) return <Error message="Moodboard not found" onRetry={() => navigate("/moodboards")} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-background to-surface pb-20 px-4"
    >
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="ghost"
              icon="ArrowLeft"
              onClick={() => navigate("/moodboards")}
            >
              Back
            </Button>
            
            <Input
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="Name your moodboard..."
              className="font-display text-lg border-none bg-transparent focus:bg-white/50 rounded-xl"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              loading={saving}
              icon="Save"
              disabled={!boardName.trim()}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </motion.div>

        {/* Canvas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MoodboardCanvas
            moodboard={moodboard}
            onUpdate={handleMoodboardUpdate}
            outfits={outfits}
          />
        </motion.div>

        {/* Help text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20"
        >
          <div className="flex items-start gap-3">
            <ApperIcon name="Info" className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="text-sm text-gray-700">
              <p className="font-medium mb-1">How to create magic:</p>
              <ul className="space-y-1 text-gray-600">
                <li>• Drag outfits from your closet onto the canvas</li>
                <li>• Add decorations using the toolbar above</li>
                <li>• Move items around by dragging them</li>
                <li>• Click the X to remove items you don't want</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MoodboardEditor;