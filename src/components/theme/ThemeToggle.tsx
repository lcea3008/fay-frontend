import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/store/useThemeStore";

export function ThemeToggle() {
    const theme = useThemeStore((s) => s.theme);
    const toggleTheme = useThemeStore((s) => s.toggleTheme);

    return (
        <button
            type="button"
            aria-label={theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
            onClick={toggleTheme}
            className="text-fay-gray transition-colors hover:text-fay-white"
        >
            {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
        </button>
    );
}
