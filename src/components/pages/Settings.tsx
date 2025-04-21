import { useState } from "react";
import {
  UserCircleIcon,
  ChevronDownIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const avatars = [
  { id: 1, icon: <UserCircleIcon className="w-12 h-12 text-blue-500" /> },
  // Add more avatars if needed
];

export const Settings = () => {
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [accountType, setAccountType] = useState("Student");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Personal Information
        </h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Profile Photo Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Profile Photo
            </h2>
            <div className="flex flex-wrap gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-2 border-blue-500">
                {avatars[selectedAvatar]?.icon || (
                  <UserCircleIcon className="w-12 h-12 text-blue-500" />
                )}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {avatars.map((avatar, index) => (
                  <button
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(index)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                      selectedAvatar === index
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {avatar.icon}
                  </button>
                ))}
                <button className="w-12 h-12 rounded-full flex items-center justify-center border border-dashed border-gray-300 hover:border-gray-400">
                  <PlusIcon className="w-6 h-6 text-gray-400" />
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
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full md:w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between"
              >
                <span>{accountType}</span>
                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
              </button>

              {isDropdownOpen && (
                <div className="absolute mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      setAccountType("Student");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50"
                  >
                    Student
                  </button>
                  <button
                    onClick={() => {
                      setAccountType("Teacher");
                      setIsDropdownOpen(false);
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
            {/* Theme settings content here */}
          </div>
        </div>
      </div>
    </div>
  );
};
