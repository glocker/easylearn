import { PlusIcon } from "@heroicons/react/24/outline";
import { AVATARS, AVATAR_URL } from "@/constants";
import { updateUserAvatar } from "@/utils/firebase";
import { useAuthStore } from "@/store/authStore";

interface AvatarSelectorProps {
  userId: string;
}

const AvatarSelector = ({ userId }: AvatarSelectorProps) => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const currentAvatarSeed = user?.avatar;
  const selectedAvatarIndex = AVATARS.findIndex(
    (avatar) => avatar.seed === currentAvatarSeed
  );

  const handleAvatarChange = async (seed: string) => {
    if (!userId || !user) return;

    setUser({ ...user, avatar: seed });

    try {
      await updateUserAvatar(userId, seed);
    } catch (error) {
      console.error("Error updating avatar:", error);
      setUser({ ...user, avatar: currentAvatarSeed });
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Photo</h2>
      <div className="flex flex-wrap gap-4">
        <div className="w-24 h-24 rounded-full flex items-center justify-center border-2 border-blue-500">
          {currentAvatarSeed && (
            <img
              src={`${AVATAR_URL}${currentAvatarSeed}`}
              alt={`Avatar ${currentAvatarSeed}`}
              className="rounded-full"
              width={64}
              height={64}
            />
          )}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {AVATARS.map((avatar, index) => (
            <button
              key={avatar.id}
              onClick={() => handleAvatarChange(avatar.seed)}
              className={`w-24 h-24 flex items-center justify-center border rounded-full
                ${
                  selectedAvatarIndex === index
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
