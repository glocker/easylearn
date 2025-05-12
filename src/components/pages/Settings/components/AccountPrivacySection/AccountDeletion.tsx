interface AccountDeletionProps {
  onDelete: () => void;
}

const AccountDeletion = ({ onDelete }: AccountDeletionProps) => {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-2">Delete Account</h2>
      <p className="text-gray-600 mb-4">
        All your data will be deleted and this action cannot be undone.
      </p>
      <button
        onClick={onDelete}
        className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
      >
        Delete Account
      </button>
    </div>
  );
};

export default AccountDeletion;