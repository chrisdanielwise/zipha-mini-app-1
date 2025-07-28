"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
import { useProgress } from "../../../hooks/useProgress";
import WaterDropCard from "../../../components/ui/WaterDropCard";
import MobileTable from "../../../components/ui/MobileTable";
import SubscriberActionModal from "../../../components/ui/SubscriberActionModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const itemsPerPage = 20;
  const progress = useProgress();

  // Helper function to format the raw subscriber data
  const getFormattedSubscribers = useCallback((rawSubscribers: any): Subscriber[] => {
    return rawSubscribers.map((user: any, index: number) => {
      let amount = "$0"; // Default amount

      // Determine amount based on subscription type
      switch (user.subscription?.type) {
        case "one_month":
          amount = `$${63}`;
          break;
        case "three_months":
          amount = `$${160}`;
          break;
        case "six_months":
          amount = `$${300}`;
          break;
        case "twelve_months":
          amount = `$${500}`;
          break;
        case "mentorship_price_list":
          amount = "$300";
          break;
        case "one_on_one_price_list":
          amount = "$1100";
          break;
        case "bootcamp_payment":
          amount = "$79.99";
          break;
        case "$10,000 - $49,000":
          amount = "$1000";
          break;
        default:
          amount = "$0"; // Keep default for unknown or negotiated types
          break;
      }

      return {
        _id: user._id || index,
        username: user.username || "No username",
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        subscription: {
            status: user.subscription?.status || "unknown",
            plan: user.subscription?.type || "None",
            amount: parseFloat(amount.replace('$', '')),
            currency: '$',
        },
        createdAt: user.groupMembership?.joinedAt
          ? new Date(user.groupMembership.joinedAt).toISOString()
          : new Date().toISOString()
      };
    });
  }, []);

  // Effect to fetch and format subscribers when the component mounts
  const fetchAndSetSubscribers = useCallback(async () => {
      try {
        setLoading(true);
        progress.start();
        
        const response = await fetch("/api/subscribers");
        progress.set(0.6);
        
        const data = await response.json();
        progress.set(0.9);
        
        if (response.ok && data.success && data.subscribers) {
          const formattedData = getFormattedSubscribers(data.subscribers);
          setSubscribers(formattedData);
        } else {
          toast.error("Failed to fetch subscribers");
        }
      } catch (error) {
        console.error("Error fetching subscribers:", error);
        toast.error("Error fetching subscribers");
      } finally {
        progress.finish();
        setLoading(false);
      }
    }, [progress, getFormattedSubscribers]);

  useEffect(() => {
    fetchAndSetSubscribers();
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

  const handleActionClick = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setIsModalOpen(true);
  };

  const handleModalAction = (action: string, subscriber: Subscriber) => {
    console.log(`${action} action for:`, subscriber);
    // Handle different actions here
    switch (action) {
      case 'view':
        // Navigate to profile or show profile modal
        toast.info(`Viewing profile for ${subscriber.username}`);
        break;
      case 'edit':
        // Open edit modal or navigate to edit page
        toast.info(`Editing ${subscriber.username}`);
        break;
      case 'message':
        // Open message modal or navigate to messaging
        toast.info(`Sending message to ${subscriber.username}`);
        break;
      case 'suspend':
        // Toggle account status
        // This is a mock implementation. You'd likely make an API call here.
        toast.success(`Account status toggled for ${subscriber.username}`);
        break;
      case 'delete':
        // Show confirmation then delete
        toast.error(`Deleting ${subscriber.username}`);
        break;
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubscriber(null);
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
      {/* Desktop - 4 separate cards */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Mobile - Single combined card */}
      <div className="md:hidden">
        <WaterDropCard>
          {/* Header with gradient background */}
          <div className="relative mb-6 p-4 -m-4 rounded-xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-blue-400/10 border border-blue-200/20 dark:border-blue-700/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent mb-1">
                  Subscriber Overview
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">Real-time subscription metrics</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                <FaUsers className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Total Subscribers */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-md">
                    <FaUsers className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Total</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
                  </div>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-600 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>

            {/* Active Subscribers */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-4 rounded-xl border border-green-200/50 dark:border-green-700/50 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                    <FaUserCheck className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">Active</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.active}</p>
                  </div>
                </div>
                <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-1.5 rounded-full" style={{ width: `${stats.total > 0 ? (stats.active / stats.total) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>

            {/* Pending Subscribers */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 p-4 rounded-xl border border-yellow-200/50 dark:border-yellow-700/50 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-md">
                    <FaUserClock className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">Pending</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.pending}</p>
                  </div>
                </div>
                <div className="w-full bg-yellow-200 dark:bg-yellow-800 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-600 h-1.5 rounded-full" style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>

            {/* Active Rate */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-4 rounded-xl border border-purple-200/50 dark:border-purple-700/50 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold text-white">%</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Active Rate</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.activeRate}%</p>
                  </div>
                </div>
                <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-1.5 rounded-full" style={{ width: `${stats.activeRate}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Summary */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-gray-600 dark:text-gray-300">Live tracking</span>
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                Updated now
              </div>
            </div>
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
              onClick={fetchAndSetSubscribers}
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
          <>
            {/* Mobile Table View */}
            <div className="md:hidden">
              <MobileTable 
                subscribers={currentSubscribers}
                onActionClick={handleActionClick}
              />
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Subscriber
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {currentSubscribers.map((subscriber) => (
                      <tr key={subscriber._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                              <span className="text-white text-sm font-semibold">
                                {getDisplayName(subscriber).charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-800 dark:text-white">
                                {getDisplayName(subscriber)}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                @{subscriber.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            {subscriber.email && (
                              <div className="flex items-center gap-1 text-sm text-gray-800 dark:text-white">
                                <MdEmail className="w-4 h-4 text-gray-400" />
                                <span className="truncate max-w-[150px]">{subscriber.email}</span>
                              </div>
                            )}
                            {subscriber.phoneNumber && (
                              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <MdPhone className="w-4 h-4 text-gray-400" />
                                <span>{subscriber.phoneNumber}</span>
                              </div>
                            )}
                            {!subscriber.email && !subscriber.phoneNumber && (
                              <span className="text-sm text-gray-400 dark:text-gray-500">No contact info</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-800 dark:text-white">
                            {subscriber.subscription.plan || "Standard"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {subscriber.subscription.amount ? (
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium text-gray-800 dark:text-white">
                                {subscriber.subscription.currency || "$"}{subscriber.subscription.amount}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(subscriber.subscription.status)}>
                            {getStatusIcon(subscriber.subscription.status)}
                            {subscriber.subscription.status.charAt(0).toUpperCase() + subscriber.subscription.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <MdCalendarToday className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-800 dark:text-white">
                              {formatDate(subscriber.createdAt)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                              <MdPerson className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleActionClick(subscriber)}
                              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <MdMoreVert className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
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

      {/* Action Modal */}
      <SubscriberActionModal
        isOpen={isModalOpen}
        subscriber={selectedSubscriber}
        onClose={closeModal}
        onAction={handleModalAction}
      />
    </div>
  );
};

export default SubscribersPage;