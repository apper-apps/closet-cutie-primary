import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  icon,
  iconPosition = "left",
  loading = false,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:scale-105",
    secondary: "bg-gradient-to-r from-secondary to-primary/50 text-purple-700 hover:shadow-md hover:scale-105",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white hover:scale-105",
    ghost: "text-primary hover:bg-primary/10 hover:scale-105",
    danger: "bg-gradient-to-r from-error to-accent text-white hover:shadow-lg hover:scale-105"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <ApperIcon name={icon} className="w-4 h-4" />
          )}
          {children}
          {icon && iconPosition === "right" && (
            <ApperIcon name={icon} className="w-4 h-4" />
          )}
        </>
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;