"use client";

import { useState, useMemo } from "react";
import { 
  MdSearch, 
  MdFilterList,
  MdChat,
  MdPerson,
  MdAccessTime,
  MdCheckCircle,
  MdPending,
  MdPriorityHigh,
  MdAssignment,
  MdNotifications,
  MdTrendingUp,
  MdPhone,
  MdEmail,
} from "react-icons/md";
import { FaHeadset, FaUserTie, FaClock, FaExclamationTriangle, FaChartLine, FaUsers } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WaterDropCard from "../../../components/ui/WaterDropCard";

interface Chat {
  id: number;
  customerName: string;
  customerAvatar: string;
  subject: string;
  lastMessage: string;
  timestamp: string;
  status: "assigned" | "unassigned" | "urgent";
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  responseTime?: string;
}

interface CSRProfile {
  id: number;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  assignedAreas: string[];
  currentWorkload: number;
  maxWorkload: number;
  status: "available" | "busy" | "away";
  todayStats: {
    chatsHandled: number;
    avgResponseTime: string;
    customerRating: number;
    resolvedChats: number;
  };
}

const CSRDashboard = () => {
  const [activeFilter, setActiveFilter] = useState<"my-chats" | "unassigned" | "urgent">("my-chats");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock CSR Profile
  const csrProfile: CSRProfile = {
    id: 1,
    name: "Alice Johnson",
    avatar: "AJ",
    email: "alice@company.com",
    phone: "+1 234 567 8901",
    assignedAreas: ["Technical Support", "Billing", "Account Management"],
    currentWorkload: 7,
    maxWorkload: 12,
    status: "busy",
    todayStats: {
      chatsHandled: 23,
      avgResponseTime: "2.3 min",
      customerRating: 4.8,
      resolvedChats: 21
    }
  };

  // Mock Chat data
  const [chats] = useState<Chat[]>([
    {
      id: 1,
      customerName: "John Smith",
      customerAvatar: "JS",
      subject: "Payment Issue",
      lastMessage: "I can't process my payment for the premium plan...",
      timestamp: "2 min ago",
      status: "assigned",
      priority: "high",
      category: "Billing",
      responseTime: "1.5 min"
    },
    {
      id: 2,
      customerName: "Sarah Davis",
      customerAvatar: "SD",
      subject: "Technical Support",
      lastMessage: "The app keeps crashing when I try to upload files...",
      timestamp: "5 min ago",
      status: "assigned",
      priority: "medium",
      category: "Technical Support",
      responseTime: "3.2 min"
    },
    {
      id: 3,
      customerName: "Mike Wilson",
      customerAvatar: "MW",
      subject: "Account Verification",
      lastMessage: "I need help verifying my business account...",
      timestamp: "8 min ago",
      status: "unassigned",
      priority: "low",
      category: "Account Management"
    },
    {
      id: 4,
      customerName: "Emma Brown",
      customerAvatar: "EB",
      subject: "URGENT: Service Down",
      lastMessage: "Our entire team can't access the platform!",
      timestamp: "1 min ago",
      status: "urgent",
      priority: "urgent",
      category: "Technical Support"
    },
    {
      id: 5,
      customerName: "David Lee",
      customerAvatar: "DL",
      subject: "Refund Request",
      lastMessage: "I'd like to request a refund for my subscription...",
      timestamp: "12 min ago",
      status: "unassigned",
      priority: "medium",
      category: "Billing"
    },
    {
      id: 6,
      customerName: "Lisa Garcia",
      customerAvatar: "LG",
      subject: "Feature Request",
      lastMessage: "Could you add a dark mode to the dashboard?",
      timestamp: "15 min ago",
      status: "assigned",
      priority: "low",
      category: "General Inquiry",
      responseTime: "4.1 min"
    }
  ]);

  // Filter chats based on active filter
  const filteredChats = useMemo(() => {
    let filtered = chats;

    // Apply filter
    switch (activeFilter) {
      case "my-chats":
        filtered = chats.filter(chat => chat.status === "assigned");
        break;
      case "unassigned":
        filtered = chats.filter(chat => chat.status === "unassigned");
        break;
      case "urgent":
        filtered = chats.filter(chat => chat.status === "urgent" || chat.priority === "urgent");
        break;
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(chat =>
        chat.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [chats, activeFilter, searchTerm]);

  const getWorkloadColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return "text-red-500";
    if (percentage >= 70) return "text-yellow-500";
    return "text-green-500";
  };

  const getWorkloadBg = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPriorityBadge = (priority: string) => {
    const baseClasses = "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium";
    
    switch (priority) {
      case "urgent":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`;
      case "high":
        return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300`;
      case "medium":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300`;
      case "low":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300`;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case "available":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`;
      case "busy":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300`;
      case "away":
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300`;
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 mt-4 w-full max-w-7xl mx-auto pb-8 px-2 sm:px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* CSR Profile Header */}
      <WaterDropCard>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg flex-shrink-0">
              {csrProfile.avatar}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{csrProfile.name}</h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center sm:justify-start gap-1 mt-1">
                <MdEmail className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate">{csrProfile.email}</span>
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center sm:justify-start gap-1 mt-1">
                <MdPhone className="w-3 h-3 sm:w-4 sm:h-4" />
                {csrProfile.phone}
              </p>
            </div>
          </div>

          
          <div className="flex flex-col gap-4">
            <div className="text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-3">
                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Status:</span>
                <span className={getStatusBadge(csrProfile.status)}>
                  {csrProfile.status.charAt(0).toUpperCase() + csrProfile.status.slice(1)}
                </span>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-1">
                {csrProfile.assignedAreas.map((area, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-center">
              <div className="mb-2">
                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Current Workload</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-20 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3">
                  <div 
                    className={`h-2 sm:h-3 rounded-full ${getWorkloadBg(csrProfile.currentWorkload, csrProfile.maxWorkload)}`}
                    style={{ width: `${(csrProfile.currentWorkload / csrProfile.maxWorkload) * 100}%` }}
                  ></div>
                </div>
                <span className={`text-xs sm:text-sm font-semibold ${getWorkloadColor(csrProfile.currentWorkload, csrProfile.maxWorkload)}`}>
                  {csrProfile.currentWorkload}/{csrProfile.maxWorkload}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active Chats</p>
            </div>
          </div>
        </div>
      </WaterDropCard>

      {/* Today's Performance Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <WaterDropCard>
          <div className="text-center">
            <FaHeadset className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">{csrProfile.todayStats.chatsHandled}</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Chats Handled</p>
          </div>
        </WaterDropCard>
        
        <WaterDropCard>
          <div className="text-center">
            <FaClock className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mx-auto mb-2" />
            <p className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">{csrProfile.todayStats.avgResponseTime}</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Avg Response</p>
          </div>
        </WaterDropCard>
        
        <WaterDropCard>
          <div className="text-center">
            <FaChartLine className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">{csrProfile.todayStats.customerRating}</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Rating</p>
          </div>
        </WaterDropCard>
        
        <WaterDropCard>
          <div className="text-center">
            <MdCheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">{csrProfile.todayStats.resolvedChats}</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Resolved</p>
          </div>
        </WaterDropCard>
      </div>

      {/* Chat Management */}
      <WaterDropCard>
        {/* Quick Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Chat Management</h2>
            
            <div className="flex items-center gap-2">
              <MdNotifications className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {chats.filter(c => c.status === "urgent" || c.priority === "urgent").length} urgent
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setActiveFilter("my-chats")}
                className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                  activeFilter === "my-chats"
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                }`}
              >
                <MdPerson className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">My Chats ({chats.filter(c => c.status === "assigned").length})</span>
                <span className="sm:hidden">Mine ({chats.filter(c => c.status === "assigned").length})</span>
              </button>
              <button
                onClick={() => setActiveFilter("unassigned")}
                className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                  activeFilter === "unassigned"
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                }`}
              >
                <MdAssignment className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Unassigned ({chats.filter(c => c.status === "unassigned").length})</span>
                <span className="sm:hidden">Open ({chats.filter(c => c.status === "unassigned").length})</span>
              </button>
              <button
                onClick={() => setActiveFilter("urgent")}
                className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                  activeFilter === "urgent"
                    ? "bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                }`}
              >
                <MdPriorityHigh className="w-3 h-3 sm:w-4 sm:h-4" />
                Urgent ({chats.filter(c => c.status === "urgent" || c.priority === "urgent").length})
              </button>
            </div>
          </div>
        </div>

        {/* Chat List */}
        <div className="space-y-3">
          {filteredChats.map((chat) => (
            <div key={chat.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {chat.customerAvatar}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">{chat.customerName}</h4>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{chat.subject}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={getPriorityBadge(chat.priority)}>
                        {chat.priority === "urgent" && <FaExclamationTriangle className="w-3 h-3" />}
                        {chat.priority.charAt(0).toUpperCase() + chat.priority.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{chat.timestamp}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {chat.lastMessage}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <MdAssignment className="w-3 h-3" />
                        {chat.category}
                      </span>
                      {chat.responseTime && (
                        <span className="flex items-center gap-1">
                          <MdAccessTime className="w-3 h-3" />
                          Response: {chat.responseTime}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {chat.status === "unassigned" && (
                        <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                          Take Chat
                        </button>
                      )}
                      <button className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors flex items-center gap-1">
                        <MdChat className="w-3 h-3" />
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredChats.length === 0 && (
          <div className="text-center py-12">
            <FaHeadset className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No chats found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : `No ${activeFilter.replace('-', ' ')} at the moment`}
            </p>
          </div>
        )}
      </WaterDropCard>
    </div>
  );
};

export default CSRDashboard; 