import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const NavigationTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { 
      path: "/closet", 
      icon: "Shirt", 
      label: "Closet",
      emoji: "👗"
    },
    { 
      path: "/", 
      icon: "Sparkles", 
      label: "OOTD",
      emoji: "✨"
    },
    { 
      path: "/moodboards", 
      icon: "Palette", 
      label: "Moodboards",
      emoji: "🎨"
    },
{ 
      path: "/lookbook", 
      icon: "BookOpen", 
      label: "Lookbook",
      emoji: "📖"
    },
    { 
      path: "/calendar", 
      icon: "CalendarDays", 
      label: "Calendar",
      emoji: "📅"
    }
  ];

  const currentPath = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-primary/20 safe-area-pb">
      <div className="flex items-center justify-around py-2 px-4 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = currentPath === tab.path;
          
          return (
            <motion.button
              key={tab.path}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center gap-1 py-2 px-3 min-w-[60px]"
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0
                }}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isActive 
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg" 
                    : "text-gray-500 hover:bg-primary/10 hover:text-primary"
                }`}
              >
                <ApperIcon name={tab.icon} size={20} />
              </motion.div>
              
              <motion.span
                animate={{
                  opacity: isActive ? 1 : 0.7,
                  scale: isActive ? 1.05 : 1
                }}
                className={`text-xs font-medium ${
                  isActive ? "text-primary" : "text-gray-500"
                }`}
              >
                {tab.label}
              </motion.span>

              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-primary to-accent rounded-full"
                  initial={false}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default NavigationTabs;