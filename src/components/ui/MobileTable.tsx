import React from 'react';
import { MdCalendarToday, MdEmail, MdPhone, MdPerson, MdMoreVert, MdCheckCircle, MdPending, MdCancel } from 'react-icons/md';

interface Subscriber {
  _id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  subscription: {
    status: "active" | "pending" | "cancelled" | "expired";
    plan?: string;
    startDate?: string;
    endDate?: string;
    amount?: number;
    currency?: string;
  };
  createdAt: string;
  lastActive?: string;
}

interface MobileTableProps {
  subscribers: Subscriber[];
  onActionClick?: (subscriber: Subscriber) => void;
}

const MobileTable: React.FC<MobileTableProps> = ({ subscribers, onActionClick }) => {

  const getDisplayName = (subscriber: Subscriber) => {
    if (subscriber.firstName && subscriber.lastName) {
      return `${subscriber.firstName} ${subscriber.lastName}`;
    }
    if (subscriber.firstName) {
      return subscriber.firstName;
    }
    return subscriber.username || "Unknown";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <MdCheckCircle className="w-3 h-3 text-green-500" />;
      case "pending":
        return <MdPending className="w-3 h-3 text-yellow-500" />;
      case "cancelled":
        return <MdCancel className="w-3 h-3 text-red-500" />;
      case "expired":
        return <MdCancel className="w-3 h-3 text-gray-500" />;
      default:
        return <MdPerson className="w-3 h-3 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 dark:text-green-400";
      case "pending":
        return "text-yellow-600 dark:text-yellow-400";
      case "cancelled":
        return "text-red-600 dark:text-red-400";
      case "expired":
        return "text-gray-600 dark:text-gray-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-900/50 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <span>Subscriber</span>
          <span>Status</span>
        </div>
      </div>

      {/* Body */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {subscribers.map((subscriber) => (
          <div
            key={subscriber._id}
            className="px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              {/* Left side - Avatar and Info */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">
                    {getDisplayName(subscriber).charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-white truncate">
                      {getDisplayName(subscriber)}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      •
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {subscriber.subscription.plan || "Standard"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      @{subscriber.username}
                    </span>
                    {subscriber.subscription.amount && (
                      <>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                          {subscriber.subscription.currency || "$"}{subscriber.subscription.amount}
                        </span>
                      </>
                    )}
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(subscriber.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right side - Status and Action */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="flex items-center gap-1">
                  {getStatusIcon(subscriber.subscription.status)}
                  <span className={`text-xs font-medium capitalize ${getStatusColor(subscriber.subscription.status)}`}>
                    {subscriber.subscription.status}
                  </span>
                </div>
                <button
                  onClick={() => onActionClick?.(subscriber)}
                  className="p-0.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <MdMoreVert className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileTable; 