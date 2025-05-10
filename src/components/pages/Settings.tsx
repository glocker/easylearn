import { useState, useEffect } from "react";
import {
  UserCircleIcon,
  ChevronDownIcon,
  PencilIcon,
  PlusIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import {
  fetchUserCourses,
  updateCourseNotifications,
  Course,
  getUserProfile,
  updateUserProfile,
  UserProfile,
} from "../../utils/firebase";
import { useAuth } from "../../contexts/AuthContext";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "de", label: "German" },
  { code: "ru", label: "Russian" },
];

const THEMES = [
  {
    id: "auto",
    icon: <ComputerDesktopIcon className="w-5 h-5" />,
    label: "Auto",
  },
  { id: "light", icon: <SunIcon className="w-5 h-5" />, label: "Light" },
  { id: "dark", icon: <MoonIcon className="w-5 h-5" />, label: "Dark" },
];

const NOTIFICATION_HOURS = Array.from(
  { length: 24 },
  (_, i) => i.toString().padStart(2, "0") + ":00"
);

const TIMEZONES = Array.from({ length: 25 }, (_, i) => ({
  offset: i - 12,
  label: `(GMT${i - 12 >= 0 ? "+" : ""}${i - 12}:00)`,
  cities: getCitiesForTimezone(i - 12), // Returns cities for the given timezone
}));

const AVATAR_URL: string = "https://api.dicebear.com/9.x/dylan/svg?seed=";

const avatars = [
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

export const Settings = () => {
  const { user } = useAuth();

  if (!user) {
    window.location.href = "/auth/signin";
    return null;
  }

  // TODO: State in db or zustand
  const [avatar, setAvatar] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [accountType, setAccountType] = useState("Student");
  const [theme, setTheme] = useState("auto");
  const [language, setLanguage] = useState("en");
  const [notificationTime, setNotificationTime] = useState("08:00");
  const [timezone, setTimezone] = useState(getDefaultTimezone());
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courseNotifications, setCourseNotifications] = useState<
    Record<string, boolean>
  >({});

  const [isDropdownOpen, setIsDropdownOpen] = useState({
    accountType: false,
    theme: false,
    language: false,
    notification: false,
    timezone: false,
  });

  const [showRealName, setShowRealName] = useState(false);
  const [showInSearch, setShowInSearch] = useState(false);

  useEffect(() => {
    const coursesSection = document.getElementById("courses-section");

    if (!coursesSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
          if (!courses.length && !isLoading) {
            fetchCourses();
          }
        }
      },
      {
        threshold: 0.1,
        root: null,
      }
    );

    observer.observe(coursesSection);

    return () => {
      if (coursesSection) {
        observer.unobserve(coursesSection);
      }
    };
  }, [courses.length, isLoading]);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user?.uid) return;

      const profile = await getUserProfile(user.uid);
      if (profile) {
        setTheme(profile.settings.theme);
        setLanguage(profile.settings.language);
        setTimezone(profile.settings.timezone);
        setNotificationTime(profile.settings.notifications.studyReminders);
        setAccountType(profile.accountType);
        setAvatar(profile.settings.avatar);
      }
    };

    loadUserProfile();
  }, [user?.uid]);

  const handleCourseNotificationToggle = async (courseId: string) => {
    if (!user?.uid) return;

    const newEnabled = !courseNotifications[courseId];

    // Optimistic update
    setCourseNotifications((prev) => ({
      ...prev,
      [courseId]: newEnabled,
    }));

    try {
      const success = await updateCourseNotifications(
        user.uid,
        courseId,
        newEnabled
      );
      if (!success) {
        // Revert on failure
        setCourseNotifications((prev) => ({
          ...prev,
          [courseId]: !newEnabled,
        }));
      }
    } catch (error) {
      console.error("Failed to update notification settings:", error);
      // Revert on error
      setCourseNotifications((prev) => ({
        ...prev,
        [courseId]: !newEnabled,
      }));
    }
  };

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const userCourses = await fetchUserCourses();
      setCourses(userCourses);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".dropdown-container")) {
      setIsDropdownOpen({
        accountType: false,
        theme: false,
        language: false,
        notification: false,
        timezone: false,
      });
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateSettings = async (updates: Partial<UserProfile["settings"]>) => {
    if (!user?.uid) return;

    try {
      await updateUserProfile(user.uid, {
        settings: updates,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    await updateSettings({
      theme: newTheme as UserProfile["settings"]["theme"],
    });
  };

  const avatarUrl = avatar
    ? `${AVATAR_URL}${encodeURIComponent(avatar)}`
    : null;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Personal Information
        </h1>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Profile Photo Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Profile Photo
            </h2>
            <div className="flex flex-wrap gap-4">
              <div className="w-24 h-24 rounded-full flex items-center justify-center border-2 border-blue-500">
                {avatarUrl && (
                  <img
                    src={avatarUrl}
                    alt="Аватар"
                    width={100}
                    height={100}
                    style={{ borderRadius: "50%" }}
                  />
                )}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {avatars.map((avatar, index) => (
                  <button
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(index)}
                    className={`w-24 h-24 flex items-center justify-center border rounded-full
        ${
          selectedAvatar === index
            ? "border-blue-500"
            : "border-gray-200 hover:border-gray-400"
        }`}
                    style={{ backgroundColor: "transparent" }}
                  >
                    <img
                      src={`${AVATAR_URL}${encodeURIComponent(avatar.seed)}`}
                      alt={`Avatar ${avatar.seed}`}
                      className="rounded-full"
                      width={64}
                      height={64}
                    />
                  </button>
                ))}
                <button className="w-12 h-12 rounded-full flex items-center justify-center border border-dashed border-gray-300 hover:border-gray-400">
                  <PlusIcon className="w-12 h-12 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Username Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Username</h2>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">admin</span>
              <button className="text-blue-500 hover:text-blue-600 flex items-center gap-1">
                <PencilIcon className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>

          {/* Email Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Email</h2>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">admin@gmail.com</span>
              <button className="text-blue-500 hover:text-blue-600 flex items-center gap-1">
                <PencilIcon className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>

          {/* Account Type Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Account Type
            </h2>
            <div className="relative">
              <button
                onClick={() =>
                  setIsDropdownOpen((prev) => ({
                    ...prev,
                    accountType: !prev.accountType,
                  }))
                }
                className="w-full md:w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between"
              >
                <span>{accountType}</span>
                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
              </button>

              {isDropdownOpen.accountType && (
                <div className="absolute mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      setAccountType("Student");
                      setIsDropdownOpen((prev) => ({
                        ...prev,
                        accountType: false,
                      }));
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50"
                  >
                    Student
                  </button>
                  <button
                    onClick={() => {
                      setAccountType("Teacher");
                      setIsDropdownOpen((prev) => ({
                        ...prev,
                        accountType: false,
                      }));
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50"
                  >
                    Teacher
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Theme Section */}
        <div className="mt-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">
            Appearance
          </h1>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Theme</h2>
              <div className="relative dropdown-container">
                <button
                  onClick={() =>
                    setIsDropdownOpen((prev) => ({
                      ...prev,
                      theme: !prev.theme,
                    }))
                  }
                  className="w-full md:w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {THEMES.find((t) => t.id === theme)?.icon}
                    <span>{THEMES.find((t) => t.id === theme)?.label}</span>
                  </div>
                  <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                </button>

                {isDropdownOpen.theme && (
                  <div className="absolute mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {THEMES.map((themeOption) => (
                      <button
                        key={themeOption.id}
                        onClick={() => {
                          handleThemeChange(themeOption.id);
                          setIsDropdownOpen((prev) => ({
                            ...prev,
                            theme: false,
                          }));
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

            {/* Language Section */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Language
              </h2>
              <div className="relative dropdown-container">
                <button
                  onClick={() =>
                    setIsDropdownOpen((prev) => ({
                      ...prev,
                      language: !prev.language,
                    }))
                  }
                  className="w-full md:w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between"
                >
                  <span>
                    {LANGUAGES.find((l) => l.code === language)?.label}
                  </span>
                  <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                </button>

                {isDropdownOpen.language && (
                  <div className="absolute mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsDropdownOpen((prev) => ({
                            ...prev,
                            language: false,
                          }));
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50"
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="mt-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">
            Notifications
          </h1>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Study Reminders
              </h2>
              <div className="relative dropdown-container">
                <button
                  onClick={() =>
                    setIsDropdownOpen((prev) => ({
                      ...prev,
                      notification: !prev.notification,
                    }))
                  }
                  className="w-full md:w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between"
                >
                  <span>{notificationTime}</span>
                  <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                </button>

                {isDropdownOpen.notification && (
                  <div className="absolute mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {NOTIFICATION_HOURS.map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          setNotificationTime(time);
                          setIsDropdownOpen((prev) => ({
                            ...prev,
                            notification: false,
                          }));
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Course Notifications Section */}
            <div id="courses-section" className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Course Updates
                </h2>
              </div>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : courses.length > 0 ? (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-medium">
                          {course.title}
                        </span>
                        {course.description && (
                          <span className="text-gray-500 text-sm">
                            {course.description}
                          </span>
                        )}
                        {course.category && (
                          <span className="text-gray-500 text-xs">
                            {course.category}
                          </span>
                        )}
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={courseNotifications[course.id] || false}
                          onChange={() =>
                            handleCourseNotificationToggle(course.id)
                          }
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No courses available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timezone Section */}
        <div className="mt-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">
            Timezone
          </h1>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="relative dropdown-container">
              <button
                onClick={() =>
                  setIsDropdownOpen((prev) => ({
                    ...prev,
                    timezone: !prev.timezone,
                  }))
                }
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between"
              >
                <span>{timezone}</span>
                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
              </button>

              {isDropdownOpen.timezone && (
                <div className="absolute mt-1 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
                  {TIMEZONES.map((tz) => (
                    <button
                      key={tz.offset}
                      onClick={() => {
                        setTimezone(`${tz.label} ${tz.cities[0]}`);
                        setIsDropdownOpen((prev) => ({
                          ...prev,
                          timezone: false,
                        }));
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50"
                    >
                      {`${tz.label} ${tz.cities.join(", ")}`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account and Privacy Section */}
        <div className="mt-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">
            Account and Privacy
          </h1>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-8">
            {/* Password Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Create EasyLearn Password
              </h2>
              <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                Create
              </button>
            </div>

            {/* Google Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Connect Google Account
              </h2>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <GlobeAltIcon className="w-5 h-5 text-blue-500" />
                Connect Google
              </button>
            </div>

            {/* Privacy Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Privacy
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">
                    Show your real name in EasyLearn
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={showRealName}
                      onChange={(e) => setShowRealName(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">
                    Show your profile in Google search results
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={showInSearch}
                      onChange={(e) => setShowInSearch(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Account Deletion Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Delete Account
              </h2>
              <p className="text-gray-600 mb-4">
                All your data will be deleted and this action cannot be undone.
              </p>
              <button className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getCitiesForTimezone(offset: number): string[] {
  const timezoneMap: Record<string, string[]> = {
    "-12": ["Baker Island"],
    "-11": ["Pago Pago"],
    "-10": ["Honolulu"],
    "-9": ["Anchorage"],
    "-8": ["Los Angeles", "Vancouver"],
    "-7": ["Denver", "Phoenix"],
    "-6": ["Chicago", "Mexico City"],
    "-5": ["New York", "Toronto"],
    "-4": ["Santiago", "Halifax"],
    "-3": ["São Paulo", "Buenos Aires"],
    "-2": ["Fernando de Noronha"],
    "-1": ["Praia"],
    "0": ["London", "Lisbon"],
    "1": ["Berlin", "Paris"],
    "2": ["Helsinki", "Cairo"],
    "3": ["Moscow", "Istanbul"],
    "4": ["Dubai", "Baku"],
    "5": ["Karachi", "Tashkent"],
    "6": ["Dhaka", "Almaty"],
    "7": ["Bangkok", "Jakarta"],
    "8": ["Singapore", "Beijing"],
    "9": ["Tokyo", "Seoul"],
    "10": ["Sydney", "Melbourne"],
    "11": ["Noumea"],
    "12": ["Auckland", "Fiji"],
  };

  return timezoneMap[offset.toString()] || ["UTC"];
}

function getDefaultTimezone(): string {
  const offset = -(new Date().getTimezoneOffset() / 60);
  const cities = getCitiesForTimezone(offset);
  return `(GMT${offset >= 0 ? "+" : ""}${offset}:00) ${cities[0]}`;
}
