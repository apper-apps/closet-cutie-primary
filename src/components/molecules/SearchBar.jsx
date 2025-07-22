import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const SearchBar = ({ onSearch, placeholder = "Search your fabulous closet...", className = "" }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
        />
        <Input
          value={query}
          onChange={handleSearch}
          placeholder={placeholder}
          className="pl-12 pr-4 bg-white/80 backdrop-blur-sm border-primary/20 focus:border-accent shadow-sm"
        />
      </div>
    </div>
  );
};

export default SearchBar;