import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { NOTIFICATION_HOURS } from "../../constants";

interface StudyReminderTimePickerProps {
  notificationTime: string;
  onTimeChange: (time: string) => void;
}

const StudyReminderTimePicker = ({
  notificationTime,
  onTimeChange,
}: StudyReminderTimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Study Reminders</h2>
      <div className="relative dropdown-container">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full md:w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between"
        >
          <span>{notificationTime}</span>
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        </button>

        {isOpen && (
          <div className="absolute mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {NOTIFICATION_HOURS.map((time) => (
              <button
                key={time}
                onClick={() => {
                  onTimeChange(time);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50"
              >
                {time}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyReminderTimePicker;