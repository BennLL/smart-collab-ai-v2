import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className="fixed top-4 right-4 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}

export default ThemeToggle;