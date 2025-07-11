"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthStore } from "@/store/authStore";
import {
  getUserProfile,
  updateUserProfile,
  UserProfile,
} from "@/utils/firebase";
import { getDefaultTimezone } from "./utils";

// Import component sections
import ProfileSection from "./ProfileSection";
import AppearanceSection from "./AppearanceSection";
import NotificationsSection from "./NotificationsSection";
import TimezoneSection from "./TimezoneSection";
import AccountPrivacySection from "./AccountPrivacySection";

export default function Settings() {
  const { user } = useAuth();
  const { setUser } = useAuthStore();

  // State for settings
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [theme, setTheme] = useState("auto");
  const [language, setLanguage] = useState("en");
  const [notificationTime, setNotificationTime] = useState("08:00");
  const [timezone, setTimezone] = useState(getDefaultTimezone());
  const [error, setError] = useState<string | null>(null);
  const [showRealName, setShowRealName] = useState(false);
  const [showInSearch, setShowInSearch] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    const loadUserProfile = async () => {
      const profile = await getUserProfile(user.uid);
      if (profile) {
        setTheme(profile.settings.theme);
        setLanguage(profile.settings.language);
        setTimezone(profile.settings.timezone);
        setNotificationTime(profile.settings.notifications.studyReminders);
        setUser(profile); // Save profile in zustand
        setIsProfileLoaded(true);
      }
    };
    loadUserProfile();
  }, [user?.uid, setUser]);

  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/signin";
    }
    return null;
  }

  // Update settings in the database
  const updateSettings = async (updates: Partial<UserProfile["settings"]>) => {
    if (!user?.uid) return;

    try {
      await updateUserProfile(user.uid, {
        settings: updates,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error("Failed to update settings:", error);
      setError("Failed to update settings. Please try again.");
    }
  };

  // Handle theme change
  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    await updateSettings({
      theme: newTheme as UserProfile["settings"]["theme"],
    });
  };

  // Handle language change
  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage);
    await updateSettings({
      language: newLanguage,
    });
  };

  // Handle notification time change
  const handleNotificationTimeChange = async (newTime: string) => {
    setNotificationTime(newTime);
    await updateSettings({
      notifications: {
        studyReminders: newTime,
      },
    });
  };

  // Handle timezone change
  const handleTimezoneChange = async (newTimezone: string) => {
    setTimezone(newTimezone);
    await updateSettings({
      timezone: newTimezone,
    });
  };

  // Handle account type change
  const handleAccountTypeChange = async (newType: string) => {
    // Update account type in profile
    if (user?.uid) {
      try {
        await updateUserProfile(user.uid, {
          accountType: newType,
          updatedAt: Date.now(),
        });
      } catch (error) {
        console.error("Failed to update account type:", error);
        setError("Failed to update account type. Please try again.");
      }
    }
  };

  if (!isProfileLoaded) {
    return <div>Загрузка настроек...</div>; // можно спиннер
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && <div className="text-red-600 mb-4">{error}</div>}

        <ProfileSection
          userId={user.uid}
          avatar={user.avatar}
          username={user.username}
          email={user.email}
          accountType={user.accountType}
          onAccountTypeChange={handleAccountTypeChange}
        />

        <AppearanceSection
          theme={theme}
          language={language}
          onThemeChange={handleThemeChange}
          onLanguageChange={handleLanguageChange}
        />

        <NotificationsSection
          userId={user.uid}
          notificationTime={notificationTime}
          onNotificationTimeChange={handleNotificationTimeChange}
        />

        <TimezoneSection
          timezone={timezone}
          onTimezoneChange={handleTimezoneChange}
        />

        <AccountPrivacySection
          showRealName={showRealName}
          showInSearch={showInSearch}
          onShowRealNameChange={setShowRealName}
          onShowInSearchChange={setShowInSearch}
        />
      </div>
    </div>
  );
}
