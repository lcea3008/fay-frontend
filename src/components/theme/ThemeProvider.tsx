import { useEffect, type ReactNode } from "react";
import { useThemeStore } from "@/store/useThemeStore";

export function ThemeProvider({ children }: { children: ReactNode }) {
    const initializeTheme = useThemeStore((s) => s.initializeTheme);

    useEffect(() => {
        initializeTheme();
    }, [initializeTheme]);

    return <>{children}</>;
}
