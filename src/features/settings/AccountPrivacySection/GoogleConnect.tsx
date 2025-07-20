import { GlobeAltIcon } from "@heroicons/react/24/outline";

interface GoogleConnectProps {
  onConnect: () => void;
}

const GoogleConnect = ({ onConnect }: GoogleConnectProps) => {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Connect Google Account</h2>
      <button
        onClick={onConnect}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        <GlobeAltIcon className="w-5 h-5 text-blue-500" />
        Connect Google
      </button>
    </div>
  );
};

export default GoogleConnect;