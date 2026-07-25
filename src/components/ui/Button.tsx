import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANTES: Record<ButtonVariant, string> = {
    primary: "bg-fay-accent text-white hover:scale-[1.02]",
    ghost: "text-fay-gray hover:text-white",
    danger: "bg-fay-danger text-white hover:scale-[1.02]",
};

const TAMANOS: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-sm",
};

const BASE =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-transform disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100";

function buttonClasses(variant: ButtonVariant, size: ButtonSize, fullWidth: boolean, className?: string) {
    return cn(BASE, VARIANTES[variant], TAMANOS[size], fullWidth && "w-full", className);
}

interface ButtonOwnProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    loading?: boolean;
}

type ButtonProps = ButtonOwnProps & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = "primary", size = "md", fullWidth = false, loading = false, disabled, className, children, ...props }, ref) => (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={buttonClasses(variant, size, fullWidth, className)}
            {...props}
        >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {children}
        </button>
    )
);
Button.displayName = "Button";

type LinkButtonProps = Omit<ButtonOwnProps, "loading"> & LinkProps;

export function LinkButton({
    variant = "primary",
    size = "md",
    fullWidth = false,
    className,
    children,
    ...props
}: LinkButtonProps) {
    return (
        <Link className={buttonClasses(variant, size, fullWidth, className)} {...props}>
            {children}
        </Link>
    );
}
