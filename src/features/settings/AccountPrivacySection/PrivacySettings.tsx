interface PrivacySettingsProps {
  showRealName: boolean;
  showInSearch: boolean;
  onShowRealNameChange: (show: boolean) => void;
  onShowInSearchChange: (show: boolean) => void;
}

const PrivacySettings = ({
  showRealName,
  showInSearch,
  onShowRealNameChange,
  onShowInSearchChange,
}: PrivacySettingsProps) => {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Privacy</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Show your real name in EasyLearn</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showRealName}
              onChange={(e) => onShowRealNameChange(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Show your profile in Google search results</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showInSearch}
              onChange={(e) => onShowInSearchChange(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;