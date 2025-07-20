import AvatarSelector from "@/entities/user/ui/AvatarSelector";
import UsernameEditor from "@/entities/user/ui/UsernameEditor";
import EmailEditor from "@/entities/user/ui/EmailEditor";
import AccountTypeSelector from "@/entities/user/ui/AccountTypeSelector";

interface ProfileSectionProps {
  userId: string;
  avatar: string | null;
  username: string;
  email: string;
  accountType: string;
  onAccountTypeChange: (type: string) => void;
}

const ProfileSection = ({
  userId,
  avatar,
  username,
  email,
  accountType,
  onAccountTypeChange,
}: ProfileSectionProps) => {
  // Placeholder functions for edit actions
  const handleUsernameEdit = () => {
    console.log("Edit username");
  };

  const handleEmailEdit = () => {
    console.log("Edit email");
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Personal Information</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <AvatarSelector userId={userId} currentAvatar={avatar} />
        <UsernameEditor username={username} onEdit={handleUsernameEdit} />
        <EmailEditor email={email} onEdit={handleEmailEdit} />
        <AccountTypeSelector accountType={accountType} onAccountTypeChange={onAccountTypeChange} />
      </div>
    </div>
  );
};

export default ProfileSection;