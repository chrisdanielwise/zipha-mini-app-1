import React, { useEffect } from 'react';
import { FaEye, FaEdit, FaEnvelope, FaPause, FaTrash, FaTimes } from 'react-icons/fa';

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

interface SubscriberActionModalProps {
  isOpen: boolean;
  subscriber: Subscriber | null;
  onClose: () => void;
  onAction: (action: string, subscriber: Subscriber) => void;
}

const SubscriberActionModal: React.FC<SubscriberActionModalProps> = ({
  isOpen,
  subscriber,
  onClose,
  onAction
}) => {
  const getDisplayName = (subscriber: Subscriber) => {
    if (subscriber.firstName && subscriber.lastName) {
      return `${subscriber.firstName} ${subscriber.lastName}`;
    }
    if (subscriber.firstName) {
      return subscriber.firstName;
    }
    return subscriber.username || "Unknown";
  };

  const handleAction = (action: string) => {
    if (subscriber) {
      onAction(action, subscriber);
    }
    onClose();
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !subscriber) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-300 ease-out"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full mx-4 transform transition-all duration-300 ease-out scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: isOpen ? 'modalEnter 0.3s ease-out' : 'modalExit 0.2s ease-in'
        }}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {getDisplayName(subscriber).charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {getDisplayName(subscriber)}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{subscriber.username}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-2">
          <button
            onClick={() => handleAction('view')}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            <FaEye className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-800 dark:text-white">View Profile</span>
          </button>
          
          <button
            onClick={() => handleAction('edit')}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            <FaEdit className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-gray-800 dark:text-white">Edit Subscriber</span>
          </button>
          
          <button
            onClick={() => handleAction('message')}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            <FaEnvelope className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-800 dark:text-white">Send Message</span>
          </button>
          
          <button
            onClick={() => handleAction('suspend')}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            <FaPause className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-800 dark:text-white">
              {subscriber.subscription.status === 'active' ? 'Suspend' : 'Activate'} Account
            </span>
          </button>
          
          <button
            onClick={() => handleAction('delete')}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            <FaTrash className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-600 dark:text-red-400">Delete Subscriber</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes modalExit {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default SubscriberActionModal; 