import { motion } from "framer-motion";

const Loading = ({ type = "grid" }) => {
  if (type === "grid") {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 glass-card"
            >
              <div className="p-3 space-y-2">
                <div className="h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl animate-pulse" />
                <div className="h-3 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full animate-pulse" />
                <div className="h-2 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-full animate-pulse w-2/3" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "moodboard") {
    return (
      <div className="p-6 space-y-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl glass-card p-6"
        >
          <div className="grid grid-cols-3 gap-4 h-full">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-primary/20 border-t-accent rounded-full"
      />
    </div>
  );
};

export default Loading;