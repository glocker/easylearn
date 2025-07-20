import StudyReminderTimePicker from "./StudyReminderTimePicker";
import CourseNotificationsList from "./CourseNotificationsList";

interface NotificationsSectionProps {
  userId: string;
  notificationTime: string;
  onNotificationTimeChange: (time: string) => void;
}

const NotificationsSection = ({
  userId,
  notificationTime,
  onNotificationTimeChange,
}: NotificationsSectionProps) => {
  return (
    <div className="mt-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Notifications</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <StudyReminderTimePicker
          notificationTime={notificationTime}
          onTimeChange={onNotificationTimeChange}
        />
        <CourseNotificationsList userId={userId} />
      </div>
    </div>
  );
};

export default NotificationsSection;