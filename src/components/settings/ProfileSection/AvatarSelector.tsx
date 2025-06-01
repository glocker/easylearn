import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { AVATARS, AVATAR_URL } from "@/components/settings/constants";
import { updateUserAvatar } from "@/utils/firebase";

interface AvatarSelectorProps {
  userId: string;
  currentAvatar: string | null;
}

const AvatarSelector = ({ userId, currentAvatar }: AvatarSelectorProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const avatarUrl = currentAvatar ? `${AVATAR_URL}${currentAvatar}` : null;

  const handleAvatarChange = async (
    uid: string,
    seed: string,
    index: number
  ) => {
    setSelectedAvatar(index);

    if (!uid) return;

    try {
      await updateUserAvatar(uid, seed);
      alert("Avatar successfully updated!");
    } catch (error) {
      console.error("Error while updating avatar occurred:", error);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Photo</h2>
      <div className="flex flex-wrap gap-4">
        <div className="w-24 h-24 rounded-full flex items-center justify-center border-2 border-blue-500">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={`Avatar ${currentAvatar}`}
              width={100}
              height={100}
              style={{ borderRadius: "50%" }}
            />
          )}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {AVATARS.map((avatar, index) => (
            <button
              key={avatar.id}
              onClick={() => handleAvatarChange(userId, avatar.seed, index)}
              className={`w-24 h-24 flex items-center justify-center border rounded-full
                ${
                  selectedAvatar === index
                    ? "border-blue-500"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              style={{ backgroundColor: "transparent" }}
            >
              <img
                src={`${AVATAR_URL}${avatar.seed}`}
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
  );
};

export default AvatarSelector;
