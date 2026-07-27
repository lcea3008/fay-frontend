import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

interface ThemeStore {
    theme: Theme;
    autoMode: boolean;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    toggleAutoMode: () => void;
    applyTheme: (theme: Theme) => void;
    getSystemTheme: () => Theme;
    initializeTheme: () => void;
}

// Detecta la hora para tema automático
const getTimeBasedTheme = (): Theme => {
    const hour = new Date().getHours();
    // Oscuro: 20:00 (8pm) - 07:00 (7am)
    // Claro: 07:00 - 20:00
    return hour >= 20 || hour < 7 ? 'dark' : 'light';
};

// Aplica el tema al HTML
const applyThemeToDOM = (theme: Theme) => {
    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    html.classList.add(theme);
    html.setAttribute('data-theme', theme);
};

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set, get) => ({
            theme: 'dark',
            autoMode: false,

            setTheme: (theme: Theme) => {
                set({ theme });
                applyThemeToDOM(theme);
            },

            toggleTheme: () => {
                const currentTheme = get().theme;
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                get().setTheme(newTheme);
            },

            toggleAutoMode: () => {
                set((state) => ({
                    autoMode: !state.autoMode,
                }));
            },

            applyTheme: (theme: Theme) => {
                applyThemeToDOM(theme);
                set({ theme });
            },

            getSystemTheme: () => {
                return getTimeBasedTheme();
            },

            initializeTheme: () => {
                const { theme, autoMode } = get();

                if (autoMode) {
                    const systemTheme = getTimeBasedTheme();
                    applyThemeToDOM(systemTheme);
                    set({ theme: systemTheme });
                } else {
                    applyThemeToDOM(theme);
                }
            },
        }),
        {
            name: 'fay-theme-store',
            version: 1,
        }
    )
);
