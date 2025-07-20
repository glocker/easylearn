import PasswordManagement from "./PasswordManagement";
import GoogleConnect from "./GoogleConnect";
import PrivacySettings from "./PrivacySettings";
import AccountDeletion from "./AccountDeletion";

interface AccountPrivacySectionProps {
  showRealName: boolean;
  showInSearch: boolean;
  onShowRealNameChange: (show: boolean) => void;
  onShowInSearchChange: (show: boolean) => void;
}

const AccountPrivacySection = ({
  showRealName,
  showInSearch,
  onShowRealNameChange,
  onShowInSearchChange,
}: AccountPrivacySectionProps) => {
  // Placeholder functions for actions
  const handlePasswordCreate = () => {
    console.log("Create password");
  };

  const handleGoogleConnect = () => {
    console.log("Connect Google account");
  };

  const handleAccountDelete = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      console.log("Delete account confirmed");
    }
  };

  return (
    <div className="mt-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Account and Privacy</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-8">
        <PasswordManagement onCreate={handlePasswordCreate} />
        <GoogleConnect onConnect={handleGoogleConnect} />
        <PrivacySettings
          showRealName={showRealName}
          showInSearch={showInSearch}
          onShowRealNameChange={onShowRealNameChange}
          onShowInSearchChange={onShowInSearchChange}
        />
        <AccountDeletion onDelete={handleAccountDelete} />
      </div>
    </div>
  );
};

export default AccountPrivacySection;