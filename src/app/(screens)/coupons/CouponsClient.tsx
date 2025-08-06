"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { 
  MdOutlineAdd, 
  MdSearch, 
  MdFilterList, 
  MdRefresh,
  MdDelete,
  MdContentCopy,
  MdCheckCircle,
} from "react-icons/md";
import { FaGift, FaCheck, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useProgress } from "../../../hooks/useProgress";
import Card from "../../../components/ui/Card";
import WaterDropCard from "../../../components/ui/WaterDropCard";
import GenericTable from "../../../components/table";
import GiftCoupon from "../../../components/GiftCoupon";

interface Coupon {
  id: string;
  couponCode: string;
  couponId: string;
  username: string;
  services: string;
  redeemed: boolean;
  createdAt: string;
  status: "Active" | "Redeemed";
}

const CouponsClient = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "redeemed">("all");
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const progress = useProgress();

  // Fetch coupons data
  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);
      progress.start();
      
      const response = await fetch("/api/coupon");
      progress.set(0.7);
      
      const data = await response.json();
      progress.set(0.9);
      
      if (response.ok) {
        setCoupons(data.coupons || []);
        progress.finish();
      } else {
        progress.finish();
        toast.error("Failed to fetch coupons");
      }
    } catch (error) {
      progress.finish();
      console.error("Error fetching coupons:", error);
      toast.error("Error fetching coupons");
    } finally {
      setLoading(false);
    }
  }, []); // Removed progress from dependencies

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  // Filter and search coupons
  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const matchesSearch = 
        coupon.couponCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.services.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "all" || 
        (statusFilter === "active" && !coupon.redeemed) ||
        (statusFilter === "redeemed" && coupon.redeemed);
      
      return matchesSearch && matchesStatus;
    });
  }, [coupons, searchTerm, statusFilter]);

  // Copy coupon code to clipboard
  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Coupon code copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy coupon code");
    }
  };

  // Delete coupon
  const deleteCoupon = async (couponCode: string) => {
    try {
      progress.start();
      
      const response = await fetch("/api/coupon", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponCode }),
      });
      
      progress.set(0.8);

      if (response.ok) {
        progress.finish();
        toast.success("Coupon deleted successfully");
        fetchCoupons(); // Refresh the list
        setIsDeleteModalOpen(false);
        setSelectedCoupon(null);
      } else {
        progress.finish();
        toast.error("Failed to delete coupon");
      }
    } catch (error) {
      progress.finish();
      console.error("Error deleting coupon:", error);
      toast.error("Error deleting coupon");
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter(c => !c.redeemed).length;
    const redeemed = coupons.filter(c => c.redeemed).length;
    const redemptionRate = total > 0 ? Math.round((redeemed / total) * 100) : 0;
    
    return { total, active, redeemed, redemptionRate };
  }, [coupons]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 mt-4 w-full max-w-7xl mx-auto pb-8 px-2 sm:px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Welcome Section */}
      <div className="mb-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2">Coupon Management</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Manage gift coupons and track redemptions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
        <WaterDropCard>
          <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-2 sm:mb-0 flex-shrink-0">
              <FaGift className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Total Coupons</h3>
              <p className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </WaterDropCard>
        
        <WaterDropCard>
          <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-2 sm:mb-0 flex-shrink-0">
              <MdCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Active Coupons</h3>
              <p className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">{stats.active}</p>
            </div>
          </div>
        </WaterDropCard>
        
        <WaterDropCard>
          <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-2 sm:mb-0 flex-shrink-0">
              <FaCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Redeemed</h3>
              <p className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">{stats.redeemed}</p>
            </div>
          </div>
        </WaterDropCard>
        
        <WaterDropCard>
          <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-2 sm:mb-0 flex-shrink-0">
              <span className="text-xs sm:text-sm font-bold text-white">%</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Redemption Rate</h3>
              <p className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">{stats.redemptionRate}%</p>
            </div>
          </div>
        </WaterDropCard>
      </div>

      {/* Coupons Section */}
      <WaterDropCard>
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                Coupons ({filteredCoupons.length})
              </h3>
            </div>
            <button
              onClick={() => setIsGenerateModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <MdOutlineAdd className="w-4 h-4" />
              Generate Coupon
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "redeemed")}
              className="px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="redeemed">Redeemed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="text-center py-12">
            <FaGift className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No coupons found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filters" 
                : "Generate your first coupon to get started"}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-3">
              {filteredCoupons.map((coupon) => (
                <div key={coupon.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
                          {coupon.couponCode}
                        </span>
                        <button
                          onClick={() => copyToClipboard(coupon.couponCode)}
                          className="p-1 text-gray-400 hover:text-blue-500 transition"
                          title="Copy code"
                        >
                          <MdContentCopy className="text-sm" />
                        </button>
                      </div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white mb-1">
                        {coupon.username || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                        {coupon.services}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        coupon.redeemed 
                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      }`}>
                        {coupon.redeemed ? <FaTimes className="text-xs" /> : <FaCheck className="text-xs" />}
                        {coupon.status}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedCoupon(coupon);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                        title="Delete coupon"
                      >
                        <MdDelete className="text-sm" />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Created: {formatDate(coupon.createdAt)}
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
                      Coupon Code
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Services
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCoupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-mono">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                            {coupon.couponCode}
                          </span>
                          <button
                            onClick={() => copyToClipboard(coupon.couponCode)}
                            className="p-1 text-gray-400 hover:text-blue-500 transition"
                            title="Copy code"
                          >
                            <MdContentCopy className="text-sm" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">
                        {coupon.username || "Unknown"}
                      </td>
                      <td className="px-4 sm:px-6 py-4 max-w-xs">
                        <div className="truncate text-sm text-gray-800 dark:text-white" title={coupon.services}>
                          {coupon.services}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          coupon.redeemed 
                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        }`}>
                          {coupon.redeemed ? <FaTimes className="text-xs" /> : <FaCheck className="text-xs" />}
                          {coupon.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(coupon.createdAt)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedCoupon(coupon);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                          title="Delete coupon"
                        >
                          <MdDelete className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </WaterDropCard>

      {/* Generate Coupon Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3 flex-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <FaGift className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">
                      Generate Gift Coupon
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      Create custom coupons for your subscribers
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                >
                  <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <GiftCoupon />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
            <div className="p-4 sm:p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <MdDelete className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">Delete Coupon</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">Coupon Code:</p>
                <p className="font-mono text-sm sm:text-base text-gray-800 dark:text-white break-all">{selectedCoupon.couponCode}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedCoupon(null);
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteCoupon(selectedCoupon.couponCode)}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsClient; 