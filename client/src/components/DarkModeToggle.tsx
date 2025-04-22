import React, { useEffect, useState } from "react";
import { darkModeService } from "../services/darkModeService";

const DarkModeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const loadDarkModePreference = async () => {
      try {
        const preference = await darkModeService.getDarkModePreference();
        setIsDarkMode(preference);
        document.body.classList.toggle("dark-mode", preference);
      } catch (error) {
        console.error("Error loading dark mode preference:", error);
      }
    };

    loadDarkModePreference();
  }, []);

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.body.classList.toggle("dark-mode", newMode);

    try {
      await darkModeService.saveDarkModePreference(newMode);
    } catch (error) {
      console.error("Failed to update dark mode preference:", error);
      // Revert the toggle if the save fails
      setIsDarkMode(!newMode);
      document.body.classList.toggle("dark-mode", !newMode);
    }
  };

  return (
    <button 
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? "☀️" : "🌙"}
    </button>
  );
};

export default DarkModeToggle;
