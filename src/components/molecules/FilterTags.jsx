import { motion } from "framer-motion";
import Badge from "@/components/atoms/Badge";

const FilterTags = ({ tags, selectedTags, onTagToggle, className = "" }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag.name);
        return (
          <motion.button
            key={tag.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTagToggle(tag.name)}
            className="focus:outline-none"
          >
            <Badge
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? "bg-gradient-to-r from-primary to-accent text-white border-transparent shadow-md" 
                  : "hover:bg-primary/10"
              }`}
            >
              <span className="mr-1">{tag.icon}</span>
              {tag.name}
            </Badge>
          </motion.button>
        );
      })}
    </div>
  );
};

export default FilterTags;