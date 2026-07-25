import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "neutral" | "accent" | "muted" | "danger";

const ESTILOS: Record<BadgeVariant, string> = {
    neutral: "bg-white text-fay-black",
    accent: "bg-fay-accent text-white",
    muted: "bg-fay-surface-2 text-fay-gray",
    danger: "bg-fay-danger text-white",
};

interface BadgeProps {
    variant?: BadgeVariant;
    className?: string;
    children: ReactNode;
}

export default function Badge({ variant = "neutral", className, children }: BadgeProps) {
    return (
        <span className={cn("rounded-md px-2 py-1 text-[10px] font-medium tracking-wide", ESTILOS[variant], className)}>
            {children}
        </span>
    );
}
