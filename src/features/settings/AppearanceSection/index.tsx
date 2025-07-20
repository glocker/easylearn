import ThemeSelector from "./ThemeSelector";
import LanguageSelector from "./LanguageSelector";
import { UserProfile } from "@/shared/utils/firebase";

interface AppearanceSectionProps {
  theme: string;
  language: string;
  onThemeChange: (theme: string) => void;
  onLanguageChange: (language: string) => void;
}

const AppearanceSection = ({
  theme,
  language,
  onThemeChange,
  onLanguageChange,
}: AppearanceSectionProps) => {
  return (
    <div className="mt-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Appearance</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <ThemeSelector currentTheme={theme} onThemeChange={onThemeChange} />
        <LanguageSelector
          currentLanguage={language}
          onLanguageChange={onLanguageChange}
        />
      </div>
    </div>
  );
};

export default AppearanceSection;
