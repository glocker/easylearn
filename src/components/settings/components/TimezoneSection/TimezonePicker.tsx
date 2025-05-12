import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { TIMEZONES } from "../../constants";

interface TimezonePickerProps {
  timezone: string;
  onTimezoneChange: (timezone: string) => void;
}

const TimezonePicker = ({ timezone, onTimezoneChange }: TimezonePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative dropdown-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between"
      >
        <span>{timezone}</span>
        <ChevronDownIcon className="w-5 h-5 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
          {TIMEZONES.map((tz) => (
            <button
              key={tz.offset}
              onClick={() => {
                onTimezoneChange(`${tz.label} ${tz.cities[0]}`);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50"
            >
              {`${tz.label} ${tz.cities.join(", ")}`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimezonePicker;