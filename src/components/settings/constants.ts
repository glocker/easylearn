import {
  ComputerDesktopIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import {
  ThemeOption,
  LanguageOption,
  TimezoneOption,
  AvatarOption,
} from "./types";
import { getCitiesForTimezone } from "./utils";

export const AVATAR_URL: string =
  "https://api.dicebear.com/9.x/dylan/svg?seed=";

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English" },
  { code: "de", label: "German" },
  { code: "ru", label: "Russian" },
];

export const THEMES: ThemeOption[] = [
  {
    id: "auto",
    icon: ComputerDesktopIcon,
    label: "Auto",
  },
  { id: "light", icon: SunIcon, label: "Light" },
  { id: "dark", icon: MoonIcon, label: "Dark" },
];

export const NOTIFICATION_HOURS = Array.from(
  { length: 24 },
  (_, i) => i.toString().padStart(2, "0") + ":00"
);

export const TIMEZONES: TimezoneOption[] = Array.from(
  { length: 25 },
  (_, i) => ({
    offset: i - 12,
    label: `(GMT${i - 12 >= 0 ? "+" : ""}${i - 12}:00)`,
    cities: getCitiesForTimezone(i - 12),
  })
);

export const AVATARS: AvatarOption[] = [
  { id: 0, seed: "Sawyer" },
  { id: 1, seed: "Amaya" },
  { id: 2, seed: "George" },
  { id: 3, seed: "Aidan" },
  { id: 4, seed: "Alexander" },
  { id: 5, seed: "Liam" },
  { id: 6, seed: "Aiden" },
  { id: 7, seed: "Oliver" },
  { id: 8, seed: "Kingston" },
  { id: 9, seed: "Sarah" },
  { id: 10, seed: "Sadie" },
  { id: 11, seed: "Avery" },
  { id: 12, seed: "Leah" },
  { id: 13, seed: "Brooklynn" },
  { id: 14, seed: "Destiny" },
  { id: 15, seed: "Brian" },
  { id: 16, seed: "Ryan" },
  { id: 17, seed: "Vivian" },
  { id: 18, seed: "Wyatt" },
  { id: 19, seed: "Adrian" },
];
