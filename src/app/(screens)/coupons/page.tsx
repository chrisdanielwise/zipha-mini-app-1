"use client";

import { useState, useEffect, useMemo } from "react";
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

const CouponsPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "redeemed">("all");
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // Fetch coupons data
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/coupon");
      const data = await response.json();
      
      if (response.ok) {
        setCoupons(data.coupons || []);
      } else {
        toast.error("Failed to fetch coupons");
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Error fetching coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

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
      const response = await fetch("/api/coupon", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponCode }),
      });

      if (response.ok) {
        toast.success("Coupon deleted successfully");
        fetchCoupons(); // Refresh the list
        setIsDeleteModalOpen(false);
        setSelectedCoupon(null);
      } else {
        toast.error("Failed to delete coupon");
      }
    } catch (error) {
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
    <div className="flex flex-col gap-8 mt-4 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Welcome Section */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Coupon Management</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage gift coupons and track redemptions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <WaterDropCard>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <FaGift className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Coupons</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{stats.total}</p>
          </div>
        </WaterDropCard>
        
        <WaterDropCard>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <MdCheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Active Coupons</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{stats.active}</p>
          </div>
        </WaterDropCard>
        
        <WaterDropCard>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <FaCheck className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Redeemed</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{stats.redeemed}</p>
          </div>
        </WaterDropCard>
        
        <WaterDropCard>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <span className="text-sm font-bold text-white">%</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Redemption Rate</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{stats.redemptionRate}%</p>
          </div>
        </WaterDropCard>
      </div>

      {/* Coupons Table */}
      <WaterDropCard>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Coupons ({filteredCoupons.length})
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "redeemed")}
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="redeemed">Redeemed</option>
            </select>
            <button
              onClick={() => setIsGenerateModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <MdOutlineAdd className="w-4 h-4" />
              Generate
            </button>
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
          <GenericTable
            columns={[
              { id: "couponCode", label: "Coupon Code" },
              { id: "username", label: "User" },
              { id: "services", label: "Services" },
              { id: "status", label: "Status" },
              { id: "createdAt", label: "Created" },
              { id: "actions", label: "Actions" }
            ]}
            data={filteredCoupons}
            itemsPerPage={10}
            renderCell={(coupon) => [
              <td key={`code-${coupon.id}`} className="font-mono">
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
              </td>,
              <td key={`user-${coupon.id}`}>
                {coupon.username || "Unknown"}
              </td>,
              <td key={`services-${coupon.id}`} className="max-w-xs">
                <div className="truncate" title={coupon.services}>
                  {coupon.services}
                </div>
              </td>,
              <td key={`status-${coupon.id}`}>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  coupon.redeemed 
                    ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                }`}>
                  {coupon.redeemed ? <FaTimes className="text-xs" /> : <FaCheck className="text-xs" />}
                  {coupon.status}
                </span>
              </td>,
              <td key={`date-${coupon.id}`} className="text-sm text-gray-600 dark:text-gray-300">
                {formatDate(coupon.createdAt)}
              </td>,
              <td key={`actions-${coupon.id}`}>
                <div className="flex items-center gap-2">
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
                </div>
              </td>
            ]}
          />
        )}
      </WaterDropCard>

      {/* Generate Coupon Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <FaGift className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      Generate Gift Coupon
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Create custom coupons for your subscribers
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <GiftCoupon />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <MdDelete className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Delete Coupon</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Coupon Code:</p>
                <p className="font-mono text-gray-800 dark:text-white">{selectedCoupon.couponCode}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedCoupon(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteCoupon(selectedCoupon.couponCode)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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

export default CouponsPage; 