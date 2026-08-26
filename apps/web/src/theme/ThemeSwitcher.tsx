import { Monitor, Moon, Sun } from "lucide-react";
import { THEME_CHOICES, type ThemeChoice, useTheme } from "./ThemeProvider";

const THEME_LABELS: Record<ThemeChoice, string> = {
  light: "Deschisă",
  dark: "Întunecată",
  system: "Sistem",
};

export function ThemeSwitcher() {
  const { choice, setChoice } = useTheme();
  return (
    <div className="theme-switcher" role="group" aria-label="Temă">
      {THEME_CHOICES.map((item) => (
        <button
          key={item}
          type="button"
          aria-pressed={choice === item}
          aria-label={THEME_LABELS[item]}
          onClick={() => setChoice(item)}
        >
          {item === "light" ? <Sun size={18} aria-hidden /> : null}
          {item === "dark" ? <Moon size={18} aria-hidden /> : null}
          {item === "system" ? <Monitor size={18} aria-hidden /> : null}
          <span className="theme-switcher-label">{THEME_LABELS[item]}</span>
        </button>
      ))}
    </div>
  );
}
