import { Course, UserProfile } from "@/utils/firebase";

export interface DropdownState {
  accountType: boolean;
  theme: boolean;
  language: boolean;
  notification: boolean;
  timezone: boolean;
}

export interface SettingsProps {
  userId?: string;
}

export interface ThemeOption {
  id: string;
  icon: JSX.Element;
  label: string;
}

export interface LanguageOption {
  code: string;
  label: string;
}

export interface TimezoneOption {
  offset: number;
  label: string;
  cities: string[];
}

export interface AvatarOption {
  id: number;
  seed: string;
}
