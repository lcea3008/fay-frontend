import { forwardRef, useId, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const CAMPO_BASE =
    "w-full rounded-lg border border-fay-border bg-fay-surface px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-fay-gray focus:border-fay-accent disabled:cursor-not-allowed disabled:opacity-50";

interface ConLabel {
    label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & ConLabel>(
    ({ label, id, className, ...props }, ref) => {
        const autoId = useId();
        const inputId = id ?? autoId;
        return (
            <div>
                {label && (
                    <label htmlFor={inputId} className="mb-1.5 block text-xs text-fay-gray">
                        {label}
                    </label>
                )}
                <input ref={ref} id={inputId} className={cn(CAMPO_BASE, className)} {...props} />
            </div>
        );
    }
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & ConLabel>(
    ({ label, id, className, ...props }, ref) => {
        const autoId = useId();
        const inputId = id ?? autoId;
        return (
            <div>
                {label && (
                    <label htmlFor={inputId} className="mb-1.5 block text-xs text-fay-gray">
                        {label}
                    </label>
                )}
                <textarea ref={ref} id={inputId} className={cn(CAMPO_BASE, className)} {...props} />
            </div>
        );
    }
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & ConLabel>(
    ({ label, id, className, children, ...props }, ref) => {
        const autoId = useId();
        const inputId = id ?? autoId;
        return (
            <div>
                {label && (
                    <label htmlFor={inputId} className="mb-1.5 block text-xs text-fay-gray">
                        {label}
                    </label>
                )}
                <select ref={ref} id={inputId} className={cn(CAMPO_BASE, className)} {...props}>
                    {children}
                </select>
            </div>
        );
    }
);
Select.displayName = "Select";
