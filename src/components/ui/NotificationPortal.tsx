import { useEffect } from "react";
import { createPortal } from "react-dom";

interface NotificationPortalProps {
  message: string;
  onClose: () => void;
  type?: "success" | "error";
  duration?: number;
}

export const NotificationPortal = ({
  message,
  onClose,
  type = "success",
  duration = 3000,
}: NotificationPortalProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return createPortal(
    <div
      className={`fixed top-6 right-6 z-50 px-6 py-4 rounded shadow-lg text-white font-medium transition-all
        ${type === "success" ? "bg-green-600" : "bg-red-600"}
      `}
      role="alert"
    >
      {message}
      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200 font-bold"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>,
    document.body
  );
};
