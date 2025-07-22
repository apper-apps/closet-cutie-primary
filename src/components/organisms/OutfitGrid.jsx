import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OutfitCard from "@/components/molecules/OutfitCard";
import SearchBar from "@/components/molecules/SearchBar";
import FilterTags from "@/components/molecules/FilterTags";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import * as outfitService from "@/services/api/outfitService";
import { toast } from "react-toastify";

const OutfitGrid = ({ onAddOutfit, onEditOutfit }) => {
  const [outfits, setOutfits] = useState([]);
  const [filteredOutfits, setFilteredOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const styleTags = [
    { name: "Coquette", icon: "🎀", color: "pink" },
    { name: "Y2K", icon: "✨", color: "purple" },
    { name: "Cottagecore", icon: "🌸", color: "green" },
    { name: "Dark Academia", icon: "📚", color: "brown" },
    { name: "Minimalist", icon: "⚪", color: "gray" },
    { name: "Vintage", icon: "👗", color: "amber" },
    { name: "Streetwear", icon: "🧢", color: "blue" },
    { name: "Glam", icon: "💎", color: "gold" }
  ];

  const loadOutfits = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await outfitService.getAll();
      setOutfits(data);
      setFilteredOutfits(data);
    } catch (err) {
      setError("Failed to load your fabulous outfits. Let's try again! 💖");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOutfits();
  }, []);

  useEffect(() => {
    filterOutfits();
  }, [searchQuery, selectedTags, outfits]);

  const filterOutfits = () => {
    let filtered = [...outfits];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(outfit =>
        (outfit.notes && outfit.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (outfit.category && outfit.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (outfit.tags && outfit.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(outfit =>
        outfit.tags && selectedTags.some(selectedTag =>
          outfit.tags.some(tag => tag.toLowerCase().includes(selectedTag.toLowerCase()))
        )
      );
    }

    setFilteredOutfits(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleTagToggle = (tagName) => {
    setSelectedTags(prev =>
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const handleDelete = async (outfitId) => {
    try {
      await outfitService.deleteOutfit(outfitId);
      setOutfits(prev => prev.filter(o => o.Id !== outfitId));
      toast.success("Outfit deleted! Making room for new looks ✨");
    } catch (err) {
      toast.error("Couldn't delete outfit. Try again, cutie! 💖");
    }
  };

  const handleRate = async (outfitId, rating) => {
    try {
      const updated = await outfitService.updateOutfit(outfitId, { rating });
      setOutfits(prev => prev.map(o => o.Id === outfitId ? updated : o));
      
      const ratingMessages = {
        1: "Noted! We all have off days 😅",
        2: "It's okay, we can work with this! 😊",
        3: "Cute choice! Looking good 😍",
        4: "Yes queen! You're on fire! 🔥",
        5: "STUNNING! Absolute perfection! ✨"
      };
      
      toast.success(ratingMessages[rating]);
    } catch (err) {
      toast.error("Couldn't save rating. Try again! 💖");
    }
  };

  if (loading) return <Loading type="grid" />;
  if (error) return <Error message={error} onRetry={loadOutfits} />;

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search your fabulous closet... ✨"
        />
        
        <div className="space-y-2">
          <h3 className="font-display text-lg text-gray-800">Filter by Aesthetic 🎨</h3>
          <FilterTags
            tags={styleTags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
          />
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {filteredOutfits.length === 0 ? (
          <Empty
            title={searchQuery || selectedTags.length > 0 ? "No matches found!" : "Your closet is waiting! 💖"}
            description={
              searchQuery || selectedTags.length > 0 
                ? "Try different filters or add some new pieces to your collection ✨"
                : "Upload your first outfit photo and start building your dream virtual closet!"
            }
            actionText="Add First Outfit"
            onAction={onAddOutfit}
            icon="Plus"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredOutfits.map((outfit, index) => (
              <motion.div
                key={outfit.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <OutfitCard
                  outfit={outfit}
                  onEdit={onEditOutfit}
                  onDelete={handleDelete}
                  onRate={handleRate}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OutfitGrid;