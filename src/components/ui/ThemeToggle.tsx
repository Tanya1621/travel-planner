

"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

export function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");

        const initialTheme: Theme =
            savedTheme === "light" || savedTheme === "dark"
                ? savedTheme
                : window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light";

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTheme(initialTheme);
        document.documentElement.classList.toggle(
            "dark",
            initialTheme === "dark",
        );
    }, []);

    function toggleTheme() {
        const nextTheme = theme === "dark" ? "light" : "dark";

        setTheme(nextTheme);
        document.documentElement.classList.toggle(
            "dark",
            nextTheme === "dark",
        );
        localStorage.setItem("theme", nextTheme);
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            aria-pressed={theme === "dark"}
            className="rounded-lg border border-border bg-surface p-2 text-foreground"
        >
            {theme === "dark" ? (
                <Sun size={18} />
            ) : (
                <Moon size={18} />
            )}
        </button>
    );
}
