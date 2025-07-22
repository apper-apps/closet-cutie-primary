import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  variant = "default",
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-surface/80 border border-primary/10",
    glass: "bg-surface/60 backdrop-blur-sm border border-white/20",
    gradient: "bg-gradient-to-br from-surface to-white border border-primary/20"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;