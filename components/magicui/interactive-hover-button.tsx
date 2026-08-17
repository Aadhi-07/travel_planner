import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-auto cursor-pointer overflow-hidden rounded-full border-0 bg-[#c86d51] hover:bg-[#b55c41] active:scale-[0.97] p-3.5 px-8 text-center font-bold text-[#fdfbf7] shadow-lg shadow-[#c86d51]/30 transition-all duration-200",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        <span className="inline-block transition-all duration-300 group-hover:-translate-x-1">
          {children}
        </span>
        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
