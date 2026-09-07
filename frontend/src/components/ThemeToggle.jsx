import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      style={{
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
        borderRadius: "999px",
        padding: "8px 12px",
        cursor: "pointer",
        color: "var(--color-text)",
      }}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}