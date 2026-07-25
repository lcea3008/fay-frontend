import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
    size?: "sm" | "md";
}

export default function Chip({ active = false, size = "md", className, children, ...props }: ChipProps) {
    return (
        <button
            type="button"
            className={cn(
                "rounded-lg border transition-colors",
                size === "sm" ? "px-3 py-1.5 text-xs" : "px-3 py-1.5 text-sm",
                active
                    ? "border-fay-accent bg-fay-accent text-white"
                    : "border-fay-border text-fay-gray hover:border-fay-accent/50",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
