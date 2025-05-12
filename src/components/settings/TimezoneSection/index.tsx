import TimezonePicker from "./TimezonePicker";

interface TimezoneSectionProps {
  timezone: string;
  onTimezoneChange: (timezone: string) => void;
}

const TimezoneSection = ({ timezone, onTimezoneChange }: TimezoneSectionProps) => {
  return (
    <div className="mt-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Timezone</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <TimezonePicker timezone={timezone} onTimezoneChange={onTimezoneChange} />
      </div>
    </div>
  );
};

export default TimezoneSection;