import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { THEMES } from "@/components/settings/constants";

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const ThemeSelector = ({ currentTheme, onThemeChange }: ThemeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Theme</h2>
      <div className="relative dropdown-container">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full md:w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            {THEMES.find((t) => t.id === currentTheme)?.icon}
            <span>{THEMES.find((t) => t.id === currentTheme)?.label}</span>
          </div>
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        </button>

        {isOpen && (
          <div className="absolute mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {THEMES.map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => {
                  onThemeChange(themeOption.id);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
              >
                {themeOption.icon}
                <span>{themeOption.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSelector;
