"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  MdSearch, 
  MdRefresh,
  MdPerson,
  MdEmail,
  MdPhone,
  MdCalendarToday,
  MdCheckCircle,
  MdPending,
  MdCancel,
  MdMoreVert,
} from "react-icons/md";
import { FaUsers, FaUserCheck, FaUserClock, FaUserTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WaterDropCard from "../../../components/ui/WaterDropCard";

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

const SubscribersPage = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending" | "cancelled" | "expired">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Fetch subscribers data
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/subscribers");
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSubscribers(data.subscribers || []);
      } else {
        toast.error("Failed to fetch subscribers");
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast.error("Error fetching subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Filter and search subscribers
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((subscriber) => {
      const searchFields = [
        subscriber.username,
        subscriber.firstName,
        subscriber.lastName,
        subscriber.email,
        subscriber.phoneNumber,
        subscriber.subscription.plan
      ].filter(Boolean).join(" ").toLowerCase();
      
      const matchesSearch = searchFields.includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "all" || 
        subscriber.subscription.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [subscribers, searchTerm, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubscribers = filteredSubscribers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = subscribers.length;
    const active = subscribers.filter(s => s.subscription.status === "active").length;
    const pending = subscribers.filter(s => s.subscription.status === "pending").length;
    const cancelled = subscribers.filter(s => s.subscription.status === "cancelled").length;
    const expired = subscribers.filter(s => s.subscription.status === "expired").length;
    const activeRate = total > 0 ? Math.round((active / total) * 100) : 0;
    
    return { total, active, pending, cancelled, expired, activeRate };
  }, [subscribers]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <MdCheckCircle className="text-green-500" />;
      case "pending":
        return <MdPending className="text-yellow-500" />;
      case "cancelled":
        return <MdCancel className="text-red-500" />;
      case "expired":
        return <MdCancel className="text-gray-500" />;
      default:
        return <MdPerson className="text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case "active":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300`;
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`;
      case "expired":
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300`;
    }
  };

  const getDisplayName = (subscriber: Subscriber) => {
    if (subscriber.firstName && subscriber.lastName) {
      return `${subscriber.firstName} ${subscriber.lastName}`;
    }
    if (subscriber.firstName) {
      return subscriber.firstName;
    }
    return subscriber.username || "Unknown";
  };

  return (
    <div className="flex flex-col gap-8 mt-4 max-w-7xl mx-auto pb-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Welcome Section */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Subscribers</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage and monitor your subscription base</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <WaterDropCard>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <FaUsers className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Subscribers</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{stats.total}</p>
          </div>
        </WaterDropCard>
        
        <WaterDropCard>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <FaUserCheck className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Active</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{stats.active}</p>
          </div>
        </WaterDropCard>
        
        <WaterDropCard>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
              <FaUserClock className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Pending</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{stats.pending}</p>
          </div>
        </WaterDropCard>
        
        <WaterDropCard>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <span className="text-sm font-bold text-white">%</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Active Rate</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{stats.activeRate}%</p>
          </div>
        </WaterDropCard>
      </div>

      {/* Subscribers Section */}
      <WaterDropCard>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Subscribers ({filteredSubscribers.length})
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search subscribers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "pending" | "cancelled" | "expired")}
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
            </select>
            <button
              onClick={fetchSubscribers}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <MdRefresh className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="text-center py-12">
            <FaUsers className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No subscribers found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filters" 
                : "Subscribers will appear here once they sign up"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSubscribers.map((subscriber) => (
              <div
                key={subscriber._id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">
                        {getDisplayName(subscriber).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">
                        {getDisplayName(subscriber)}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        @{subscriber.username}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <MdMoreVert className="w-5 h-5" />
                  </button>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  {subscriber.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <MdEmail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{subscriber.email}</span>
                    </div>
                  )}
                  {subscriber.phoneNumber && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <MdPhone className="w-4 h-4 text-gray-400" />
                      <span>{subscriber.phoneNumber}</span>
                    </div>
                  )}
                </div>

                {/* Subscription Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Plan</span>
                    <span className="text-sm text-gray-800 dark:text-white font-semibold">
                      {subscriber.subscription.plan || "Standard"}
                    </span>
                  </div>
                  {subscriber.subscription.amount && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount</span>
                      <span className="text-sm text-gray-800 dark:text-white font-semibold">
                        {subscriber.subscription.currency || "$"}{subscriber.subscription.amount}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className={getStatusBadge(subscriber.subscription.status)}>
                    {getStatusIcon(subscriber.subscription.status)}
                    {subscriber.subscription.status.charAt(0).toUpperCase() + subscriber.subscription.status.slice(1)}
                  </span>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <MdCalendarToday className="w-3 h-3" />
                      <span>Joined {formatDate(subscriber.createdAt)}</span>
                    </div>
                    {subscriber.lastActive && (
                      <span>Active {formatDate(subscriber.lastActive)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Simple Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Previous
            </button>
            
            <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Next
            </button>
          </div>
        )}
      </WaterDropCard>
    </div>
  );
};

export default SubscribersPage; 
