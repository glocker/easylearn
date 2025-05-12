import { PencilIcon } from "@heroicons/react/24/outline";

interface EmailEditorProps {
  email: string;
  onEdit: () => void;
}

const EmailEditor = ({ email, onEdit }: EmailEditorProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Email</h2>
      <div className="flex items-center justify-between">
        <span className="text-gray-700">{email}</span>
        <button 
          onClick={onEdit}
          className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
        >
          <PencilIcon className="w-4 h-4" />
          Edit
        </button>
      </div>
    </div>
  );
};

export default EmailEditor;