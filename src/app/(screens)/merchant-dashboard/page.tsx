"use client";

import { useState, useMemo } from "react";
import { 
  MdOutlineAdd, 
  MdSearch,
  MdEdit,
  MdPerson,
  MdEmail,
  MdPhone,
  MdAccessTime,
  MdCheckCircle,
  MdCancel,
  MdBarChart,
  MdTrendingUp,
  MdGroup,
} from "react-icons/md";
import { FaUsers, FaUserTie, FaChartLine, FaHeadset, FaCrown, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WaterDropCard from "../../../components/ui/WaterDropCard";

interface CSR {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: "active" | "inactive" | "busy";
  assignedAreas: string[];
  joinedDate: string;
  totalChats: number;
  resolvedChats: number;
  avgResponseTime: string;
  rating: number;
}

interface PerformanceData {
  csrId: number;
  name: string;
  chatsHandled: number;
  avgResponseTime: string;
  customerRating: number;
  resolutionRate: number;
}

const MerchantDashboard = () => {
  const [activeTab, setActiveTab] = useState<"manage" | "performance">("manage");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "busy">("all");
  const [performanceView, setPerformanceView] = useState<"csr" | "team">("csr");

  // Mock CSR data
  const [csrs] = useState<CSR[]>([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@company.com",
      phone: "+1 234 567 8901",
      avatar: "AJ",
      status: "active",
      assignedAreas: ["Technical Support", "Billing"],
      joinedDate: "2024-01-15",
      totalChats: 245,
      resolvedChats: 230,
      avgResponseTime: "2.5 min",
      rating: 4.8
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@company.com",
      phone: "+1 234 567 8902",
      avatar: "BS",
      status: "busy",
      assignedAreas: ["Sales", "General Inquiry"],
      joinedDate: "2024-02-20",
      totalChats: 189,
      resolvedChats: 175,
      avgResponseTime: "3.2 min",
      rating: 4.6
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol@company.com",
      phone: "+1 234 567 8903",
      avatar: "CD",
      status: "active",
      assignedAreas: ["Technical Support"],
      joinedDate: "2024-03-10",
      totalChats: 156,
      resolvedChats: 148,
      avgResponseTime: "2.1 min",
      rating: 4.9
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david@company.com",
      phone: "+1 234 567 8904",
      avatar: "DW",
      status: "inactive",
      assignedAreas: ["Billing", "Refunds"],
      joinedDate: "2024-01-05",
      totalChats: 98,
      resolvedChats: 92,
      avgResponseTime: "4.1 min",
      rating: 4.3
    }
  ]);

  // Mock performance data
  const performanceData: PerformanceData[] = csrs.map(csr => ({
    csrId: csr.id,
    name: csr.name,
    chatsHandled: csr.totalChats,
    avgResponseTime: csr.avgResponseTime,
    customerRating: csr.rating,
    resolutionRate: Math.round((csr.resolvedChats / csr.totalChats) * 100)
  }));

  // Filter CSRs
  const filteredCSRs = useMemo(() => {
    return csrs.filter(csr => {
      const matchesSearch = 
        csr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        csr.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        csr.assignedAreas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === "all" || csr.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [csrs, searchTerm, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalCSRs = csrs.length;
    const activeCSRs = csrs.filter(csr => csr.status === "active").length;
    const busyCSRs = csrs.filter(csr => csr.status === "busy").length;
    const totalChats = csrs.reduce((sum, csr) => sum + csr.totalChats, 0);
    const avgRating = csrs.reduce((sum, csr) => sum + csr.rating, 0) / csrs.length;
    
    return { totalCSRs, activeCSRs, busyCSRs, totalChats, avgRating: Math.round(avgRating * 10) / 10 };
  }, [csrs]);

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case "active":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`;
      case "busy":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300`;
      case "inactive":
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <MdCheckCircle className="w-3 h-3" />;
      case "busy":
        return <MdAccessTime className="w-3 h-3" />;
      case "inactive":
        return <MdCancel className="w-3 h-3" />;
      default:
        return <MdPerson className="w-3 h-3" />;
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 mt-4 w-full max-w-7xl mx-auto pb-8 px-2 sm:px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Welcome Section */}
      <div className="mb-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2">Merchant Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Manage your customer service representatives and monitor performance</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
        <WaterDropCard>
          <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0 mb-2 sm:mb-0">
              <FaUsers className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Total CSRs</h3>
              <p className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">{stats.totalCSRs}</p>
            </div>
          </div>
        </WaterDropCard>
        
        <WaterDropCard>
          <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 mb-2 sm:mb-0">
              <MdCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Active</h3>
              <p className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">{stats.activeCSRs}</p>
            </div>
          </div>
        </WaterDropCard>
        
        <WaterDropCard>
          <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center flex-shrink-0 mb-2 sm:mb-0">
              <MdAccessTime className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Busy</h3>
              <p className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">{stats.busyCSRs}</p>
            </div>
          </div>
        </WaterDropCard>
        
        <WaterDropCard>
          <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 mb-2 sm:mb-0">
              <FaHeadset className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Total Chats</h3>
              <p className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">{stats.totalChats}</p>
            </div>
          </div>
        </WaterDropCard>
        
        <WaterDropCard>
          <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mb-2 sm:mb-0">
              <FaChartLine className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Avg Rating</h3>
              <p className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">{stats.avgRating}</p>
            </div>
          </div>
        </WaterDropCard>
      </div>

      {/* Main Content */}
      <WaterDropCard className="relative overflow-visible">
        {/* Tab Navigation */}
        <div className="flex flex-col gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("manage")}
              className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === "manage"
                  ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              }`}
            >
              <FaUserTie className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Manage CSRs</span>
              <span className="sm:hidden">Manage</span>
            </button>
            <button
              onClick={() => setActiveTab("performance")}
              className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === "performance"
                  ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              }`}
            >
              <MdBarChart className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Performance Overview</span>
              <span className="sm:hidden">Performance</span>
            </button>
          </div>

          {activeTab === "performance" && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">View by:</span>
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-full sm:w-auto">
                <button
                  onClick={() => setPerformanceView("csr")}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition-colors ${
                    performanceView === "csr"
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                  }`}
                >
                  CSR
                </button>
                <button
                  onClick={() => setPerformanceView("team")}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition-colors ${
                    performanceView === "team"
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                  }`}
                >
                  Team
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Manage CSRs Tab */}
        {activeTab === "manage" && (
          <div>
            {/* Controls */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search CSRs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive" | "busy")}
                  className="px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="busy">Busy</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <button className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <MdOutlineAdd className="w-4 h-4" />
                Assign New CSR
              </button>
            </div>

            {/* CSR List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredCSRs.map((csr) => (
                <div key={csr.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {csr.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white">{csr.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <MdEmail className="w-4 h-4" />
                            {csr.email}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                            <MdPhone className="w-4 h-4" />
                            {csr.phone}
                          </p>
                        </div>
                        <span className={getStatusBadge(csr.status)}>
                          {getStatusIcon(csr.status)}
                          {csr.status.charAt(0).toUpperCase() + csr.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Assigned Areas:</p>
                        <div className="flex flex-wrap gap-1">
                          {csr.assignedAreas.map((area, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-semibold text-gray-800 dark:text-white">{csr.totalChats}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Total Chats</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-800 dark:text-white">{csr.avgResponseTime}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Avg Response</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-800 dark:text-white">{csr.rating}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button className="flex-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-1">
                          <FaEye className="w-3 h-3" />
                          View Profile
                        </button>
                        <button className="flex-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-1">
                          <MdEdit className="w-3 h-3" />
                          Edit
                        </button>
                        <button className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                          <FaEyeSlash className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCSRs.length === 0 && (
              <div className="text-center py-12">
                <FaUserTie className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No CSRs found
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your search or filters" 
                    : "Assign your first CSR to get started"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Performance Overview Tab */}
        {activeTab === "performance" && (
          <div>
            {performanceView === "csr" ? (
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-4">Individual CSR Performance</h3>
                
                {/* Mobile Card View */}
                <div className="block sm:hidden space-y-3">
                  {performanceData.map((data) => (
                    <div key={data.csrId} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          {data.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white text-sm">{data.name}</h4>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Chats Handled</p>
                          <p className="font-semibold text-gray-800 dark:text-white">{data.chatsHandled}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Response Time</p>
                          <p className="font-semibold text-gray-800 dark:text-white">{data.avgResponseTime}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Rating</p>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-gray-800 dark:text-white">{data.customerRating}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-xs ${i < Math.floor(data.customerRating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Resolution Rate</p>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-800 dark:text-white text-sm">{data.resolutionRate}%</span>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                              <div 
                                className="bg-green-500 h-1.5 rounded-full" 
                                style={{ width: `${data.resolutionRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          CSR
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Chats Handled
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Avg Response Time
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Customer Rating
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Resolution Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {performanceData.map((data) => (
                        <tr key={data.csrId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-sm font-semibold">
                                {data.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="font-medium text-gray-800 dark:text-white">{data.name}</span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-800 dark:text-white font-semibold">{data.chatsHandled}</span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-800 dark:text-white">{data.avgResponseTime}</span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-800 dark:text-white font-semibold">{data.customerRating}</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={`text-sm ${i < Math.floor(data.customerRating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-800 dark:text-white font-semibold">{data.resolutionRate}%</span>
                              <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{ width: `${data.resolutionRate}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-4">Team Performance Overview</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-6">
                  <WaterDropCard>
                    <div className="text-center">
                      <MdTrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">94%</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Team Resolution Rate</p>
                    </div>
                  </WaterDropCard>
                  <WaterDropCard>
                    <div className="text-center">
                      <MdAccessTime className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">2.7 min</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Avg Response Time</p>
                    </div>
                  </WaterDropCard>
                  <WaterDropCard>
                    <div className="text-center">
                      <FaChartLine className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">4.7</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Team Rating</p>
                    </div>
                  </WaterDropCard>
                  <WaterDropCard>
                    <div className="text-center">
                      <MdGroup className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 mx-auto mb-2" />
                      <p className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">688</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Chats</p>
                    </div>
                  </WaterDropCard>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 sm:p-6">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white mb-4">Team Performance Trends</h4>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">This Week vs Last Week</span>
                      <span className="text-xs sm:text-sm font-semibold text-green-600 dark:text-green-400">+12% improvement</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Customer Satisfaction</span>
                      <span className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400">4.7/5.0 ⭐</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Peak Hours</span>
                      <span className="text-xs sm:text-sm font-semibold text-purple-600 dark:text-purple-400">2PM - 5PM</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </WaterDropCard>
    </div>
  );
};

export default MerchantDashboard; 