interface PasswordManagementProps {
  onCreate: () => void;
}

const PasswordManagement = ({ onCreate }: PasswordManagementProps) => {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Create EasyLearn Password</h2>
      <button
        onClick={onCreate}
        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        Create
      </button>
    </div>
  );
};

export default PasswordManagement;