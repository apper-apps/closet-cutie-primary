import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isThisWeek, isThisMonth } from "date-fns";
import OutfitCard from "@/components/molecules/OutfitCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import * as outfitService from "@/services/api/outfitService";

const LookbookTimeline = ({ onAddOutfit }) => {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const loadOutfits = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await outfitService.getAll();
      // Sort by date added, newest first
      const sorted = data.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      setOutfits(sorted);
    } catch (err) {
      setError("Failed to load your lookbook history. Let's try again! 💖");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOutfits();
  }, []);

  const filterOutfits = () => {
    switch (filter) {
      case "thisWeek":
        return outfits.filter(outfit => isThisWeek(new Date(outfit.dateAdded)));
      case "thisMonth":
        return outfits.filter(outfit => isThisMonth(new Date(outfit.dateAdded)));
      case "favorites":
        return outfits.filter(outfit => outfit.rating >= 4);
      default:
        return outfits;
    }
  };

  const filteredOutfits = filterOutfits();

  const getStats = () => {
    const totalOutfits = outfits.length;
    const favorites = outfits.filter(o => o.rating >= 4).length;
    const thisMonth = outfits.filter(o => isThisMonth(new Date(o.dateAdded))).length;
    const mostWornCategory = outfits.length > 0 ? 
      outfits.reduce((acc, outfit) => {
        acc[outfit.category] = (acc[outfit.category] || 0) + 1;
        return acc;
      }, {}) : {};
    
    const topCategory = Object.keys(mostWornCategory).reduce((a, b) => 
      mostWornCategory[a] > mostWornCategory[b] ? a : b, "None"
    );

    return { totalOutfits, favorites, thisMonth, topCategory };
  };

  if (loading) return <Loading type="grid" />;
  if (error) return <Error message={error} onRetry={loadOutfits} />;

  if (outfits.length === 0) {
    return (
      <Empty
        title="Your lookbook is waiting! 📖"
        description="Start documenting your style journey and create beautiful fashion memories!"
        actionText="Add First Look"
        onAction={onAddOutfit}
        icon="BookOpen"
      />
    );
  }

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-display text-gray-800">
          Your Style Story 📖
        </h2>
        <p className="text-gray-600">
          Every outfit tells a story - here's yours!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="text-2xl font-bold text-primary mb-1">{stats.totalOutfits}</div>
          <div className="text-sm text-gray-600">Total Looks</div>
        </Card>
        
        <Card className="p-4 text-center bg-gradient-to-br from-accent/10 to-secondary/10">
          <div className="text-2xl font-bold text-accent mb-1">{stats.favorites}</div>
          <div className="text-sm text-gray-600">Favorites ❤️</div>
        </Card>
        
        <Card className="p-4 text-center bg-gradient-to-br from-secondary/10 to-primary/10">
          <div className="text-2xl font-bold text-secondary mb-1">{stats.thisMonth}</div>
          <div className="text-sm text-gray-600">This Month</div>
        </Card>
        
        <Card className="p-4 text-center bg-gradient-to-br from-success/10 to-primary/10">
          <div className="text-lg font-bold text-gray-700 mb-1">{stats.topCategory}</div>
          <div className="text-sm text-gray-600">Top Category</div>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { key: "all", label: "All Time", icon: "Clock" },
          { key: "thisWeek", label: "This Week", icon: "Calendar" },
          { key: "thisMonth", label: "This Month", icon: "CalendarDays" },
          { key: "favorites", label: "Favorites", icon: "Heart" }
        ].map(({ key, label, icon }) => (
          <Button
            key={key}
            variant={filter === key ? "primary" : "outline"}
            size="sm"
            icon={icon}
            onClick={() => setFilter(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Timeline */}
      <AnimatePresence mode="wait">
        {filteredOutfits.length === 0 ? (
          <Empty
            title="No outfits found! 🔍"
            description="Try adjusting your filter or add more fabulous looks to your collection!"
            actionText="Add New Outfit"
            onAction={onAddOutfit}
            icon="Plus"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Group outfits by date */}
            {Object.entries(
              filteredOutfits.reduce((groups, outfit) => {
                const date = format(new Date(outfit.dateAdded), "yyyy-MM-dd");
                if (!groups[date]) {
                  groups[date] = [];
                }
                groups[date].push(outfit);
                return groups;
              }, {})
            ).map(([date, dayOutfits]) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Date Header */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                    <h3 className="font-display text-lg text-gray-800">
                      {format(new Date(date), "MMMM d, yyyy")}
                    </h3>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent"></div>
                  <span className="text-sm text-gray-500">
                    {dayOutfits.length} look{dayOutfits.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Outfits for this date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pl-6">
                  {dayOutfits.map((outfit, index) => (
                    <motion.div
                      key={outfit.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <OutfitCard
                        outfit={outfit}
                        showActions={false}
                        onRate={() => {}}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LookbookTimeline;