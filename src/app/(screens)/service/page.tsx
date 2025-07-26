"use client";

import { memo, useState, useEffect, useRef, useMemo } from "react";
import { 
  MdOutlineAdd, 
  MdSearch, 
  MdDelete,
  MdEdit,
  MdSave,
  MdCancel,
  MdAccessTime,
  MdAttachMoney,
  MdVisibility,
  MdVisibilityOff,
  MdArrowDropDown,
  MdRefresh,
  MdClose,
  MdCheck,
} from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { FaTrashAlt, FaTags, FaCheck, FaTimes, FaCrown, FaUserGraduate, FaPlus, FaEye, FaEyeSlash, FaPercentage } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WaterDropCard from "../../../components/ui/WaterDropCard";
import CreateServiceModal from "../../../components/ui/CreateServiceModal";
import CreatePackageModal from "../../../components/ui/CreatePackageModal";
import DeleteConfirmModal from "../../../components/ui/DeleteConfirmModal";

interface PackageItem {
  id: number;
  name: string;
  duration: string;
  originalFee: string;
  currentFee: string;
  discount: number;
  isLive: boolean;
  type: string;
}

interface Service {
  id: number;
  name: string;
  packages: PackageItem[];
}

const Service = () => {
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      name: "VIP Membership",
      packages: [
        { id: 1, name: "VIP Basic", duration: "1 month", originalFee: "2000", currentFee: "2000", discount: 0, isLive: true, type: "vip" },
        { id: 2, name: "VIP Premium", duration: "2 months", originalFee: "3500", currentFee: "3500", discount: 0, isLive: true, type: "vip" },
        { id: 3, name: "VIP Elite", duration: "3 months", originalFee: "5000", currentFee: "5000", discount: 0, isLive: false, type: "vip" },
      ]
    },
    {
      id: 2,
      name: "Mentorship Program",
      packages: [
        { id: 4, name: "1-on-1 Mentoring", duration: "3 months", originalFee: "4000", currentFee: "4000", discount: 0, isLive: true, type: "mentor" },
        { id: 5, name: "Group Mentorship", duration: "1 month", originalFee: "1500", currentFee: "1500", discount: 0, isLive: true, type: "mentor" },
      ]
    }
  ]);

  const [isCreateServiceModalOpen, setIsCreateServiceModalOpen] = useState(false);
  const [isCreatePackageModalOpen, setIsCreatePackageModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);
  const [selectedServiceForPackage, setSelectedServiceForPackage] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string; type: 'service' | 'package' } | null>(null);
  const [bulkDiscountMode, setBulkDiscountMode] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState<Set<number>>(new Set());
  const [openDiscountDropdown, setOpenDiscountDropdown] = useState<number | null>(null);

  // Discount options
  const discountOptions = [10, 20, 30, 40, 50];

  // Calculate statistics
  const stats = useMemo(() => {
    const allPackages = services.flatMap(service => service.packages);
    const totalServices = services.length;
    const totalPackages = allPackages.length;
    const avgPrice = allPackages.length > 0 
      ? Math.round(allPackages.reduce((acc, pkg) => acc + parseFloat(pkg.currentFee), 0) / allPackages.length)
      : 0;
    
    return { totalServices, totalPackages, avgPrice };
  }, [services]);

  // Filter services and packages
  const filteredServices = useMemo(() => {
    return services.map(service => ({
      ...service,
      packages: service.packages.filter(pkg => {
        const matchesSearch = !searchTerm || 
          pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.duration.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.currentFee.includes(searchTerm);
        
        const matchesType = serviceTypeFilter === "all" || serviceTypeFilter === pkg.type;
        
        return matchesSearch && matchesType;
      })
    })).filter(service => service.packages.length > 0 || !searchTerm);
  }, [services, searchTerm, serviceTypeFilter]);

  // Handle create service
  const handleCreateService = (serviceName: string) => {
    const newService: Service = {
      id: Date.now(),
      name: serviceName,
      packages: []
    };

    setServices([...services, newService]);
    toast.success("Service created successfully");
  };

  // Handle create package
  const handleCreatePackage = (packageData: { name: string; duration: string; fee: string }, serviceId: number) => {
    const newPkg: PackageItem = {
      id: Date.now(),
      name: packageData.name,
      duration: packageData.duration,
      originalFee: packageData.fee,
      currentFee: packageData.fee,
      discount: 0,
      isLive: false,
      type: services.find(s => s.id === serviceId)?.name.toLowerCase().replace(/\s+/g, '_') || 'general'
    };

    setServices(services.map(service => 
      service.id === serviceId 
        ? { ...service, packages: [...service.packages, newPkg] }
        : service
    ));

    setSelectedServiceForPackage(null);
    toast.success("Package created successfully");
  };

  // Handle package live status toggle
  const togglePackageLiveStatus = (serviceId: number, packageId: number) => {
    setServices(services.map(service => 
      service.id === serviceId 
        ? {
            ...service,
            packages: service.packages.map(pkg => 
              pkg.id === packageId 
                ? { ...pkg, isLive: !pkg.isLive }
                : pkg
            )
          }
        : service
    ));
    
    const pkg = services.find(s => s.id === serviceId)?.packages.find(p => p.id === packageId);
    toast.success(`Package ${pkg?.isLive ? 'taken offline' : 'went live'}`);
  };

  // Handle discount application
  const applyDiscount = (serviceId: number, packageId: number, discount: number) => {
    setServices(services.map(service => 
      service.id === serviceId 
        ? {
            ...service,
            packages: service.packages.map(pkg => 
              pkg.id === packageId 
                ? { 
                    ...pkg, 
                    discount,
                    currentFee: (parseFloat(pkg.originalFee) * (1 - discount / 100)).toString()
                  }
                : pkg
            )
          }
        : service
    ));
    toast.success(`${discount}% discount applied`);
  };

  // Handle bulk discount
  const applyBulkDiscount = (discount: number) => {
    if (selectedPackages.size === 0) {
      toast.error("Please select packages first");
      return;
    }

    setServices(services.map(service => ({
      ...service,
      packages: service.packages.map(pkg => 
        selectedPackages.has(pkg.id)
          ? { 
              ...pkg, 
              discount,
              currentFee: (parseFloat(pkg.originalFee) * (1 - discount / 100)).toString()
            }
          : pkg
      )
    })));

    setSelectedPackages(new Set());
    setBulkDiscountMode(false);
    toast.success(`${discount}% discount applied to ${selectedPackages.size} packages`);
  };

  // Reset all discounts
  const resetAllDiscounts = () => {
    setServices(services.map(service => ({
      ...service,
      packages: service.packages.map(pkg => ({
        ...pkg,
        discount: 0,
        currentFee: pkg.originalFee
      }))
    })));
    setSelectedPackages(new Set());
    setBulkDiscountMode(false);
    toast.success("All discounts reset to original prices");
  };

  // Handle package selection for bulk operations
  const togglePackageSelection = (packageId: number) => {
    const newSelection = new Set(selectedPackages);
    if (newSelection.has(packageId)) {
      newSelection.delete(packageId);
    } else {
      newSelection.add(packageId);
    }
    setSelectedPackages(newSelection);
  };

  // Select all packages
  const selectAllPackages = () => {
    const allPackageIds = services.flatMap(service => service.packages.map(pkg => pkg.id));
    setSelectedPackages(new Set(allPackageIds));
  };

  // Handle delete
  const handleDelete = (id: number, name: string, type: 'service' | 'package') => {
    setDeleteTarget({ id, name, type });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'service') {
      setServices(services.filter(service => service.id !== deleteTarget.id));
      toast.success("Service deleted successfully");
    } else {
      setServices(services.map(service => ({
        ...service,
        packages: service.packages.filter(pkg => pkg.id !== deleteTarget.id)
      })));
      toast.success("Package deleted successfully");
    }

    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const getServiceIcon = (type: string) => {
    if (type.includes('vip')) return <FaCrown className="w-5 h-5 text-yellow-500" />;
    if (type.includes('mentor')) return <FaUserGraduate className="w-5 h-5 text-blue-500" />;
    return <FaTags className="w-5 h-5 text-gray-500" />;
  };

  const getServiceColor = (type: string) => {
    if (type.includes('vip')) return "from-yellow-400 to-orange-500";
    if (type.includes('mentor')) return "from-blue-400 to-cyan-500";
    return "from-gray-400 to-gray-500";
  };

  return (
    <div className="flex flex-col gap-6 mt-4 max-w-7xl mx-auto pb-8 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Welcome Section */}
      <div className="mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">Service Management</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Create and manage your services and packages</p>
      </div>

      {/* Statistics Cards */}
      {/* Desktop - 3 separate cards */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
        <WaterDropCard>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <FaTags className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Services</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{stats.totalServices}</p>
          </div>
        </WaterDropCard>
        
        <WaterDropCard>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <FaPlus className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Packages</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{stats.totalPackages}</p>
          </div>
        </WaterDropCard>
        
        <WaterDropCard>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <MdAttachMoney className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Avg. Price</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mb-3">${stats.avgPrice}</p>
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
                  Service Overview
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">Real-time service metrics</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                <FaTags className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Total Services */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-md">
                    <FaTags className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Total Services</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalServices}</p>
                  </div>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-600 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>

            {/* Total Packages */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-4 rounded-xl border border-green-200/50 dark:border-green-700/50 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                    <FaPlus className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">Total Packages</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalPackages}</p>
                  </div>
                </div>
                <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-1.5 rounded-full" style={{ width: `${stats.totalServices > 0 ? (stats.totalPackages / (stats.totalServices * 3)) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>

            {/* Avg Price */}
            <div className="relative group col-span-2">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-4 rounded-xl border border-purple-200/50 dark:border-purple-700/50 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
                    <MdAttachMoney className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Average Price</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">${stats.avgPrice}</p>
                  </div>
                </div>
                <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-1.5 rounded-full" style={{ width: `${Math.min((stats.avgPrice / 5000) * 100, 100)}%` }}></div>
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

      {/* Controls Section */}
      <WaterDropCard className="relative overflow-visible">
        <div className="flex flex-col gap-4 mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
              Services & Packages
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={serviceTypeFilter}
                onChange={(e) => setServiceTypeFilter(e.target.value)}
                className="px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="vip">VIP</option>
                <option value="mentor">Mentorship</option>
              </select>
            </div>
            <button
              onClick={() => setIsCreateServiceModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <MdOutlineAdd className="w-4 h-4" />
              Create Service
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setBulkDiscountMode(!bulkDiscountMode)}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                bulkDiscountMode 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <FaPercentage className="w-4 h-4" />
              Bulk Discount
            </button>
            
            {bulkDiscountMode && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={selectAllPackages}
                    className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Select All
                  </button>
                  
                  {selectedPackages.size > 0 && (
                    <span className="px-3 py-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      {selectedPackages.size} selected
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Apply Discount:</span>
                  <div className="flex flex-wrap gap-2">
                    {discountOptions.map(discount => (
                      <button
                        key={discount}
                        onClick={() => applyBulkDiscount(discount)}
                        className="px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-900/50 font-medium"
                      >
                        {discount}%
                      </button>
                    ))}
                    <button
                      onClick={resetAllDiscounts}
                      className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-900/50 font-medium"
                    >
                      Reset All
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-4 relative">
          {filteredServices.map((service) => (
            <div key={service.id} className="border border-gray-200 dark:border-gray-700 rounded-xl relative">
              {/* Service Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getServiceColor(service.name.toLowerCase())} flex items-center justify-center flex-shrink-0`}>
                      {getServiceIcon(service.name.toLowerCase())}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white truncate">{service.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{service.packages.length} packages</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => {
                        setSelectedServiceForPackage(service.id);
                        setIsCreatePackageModalOpen(true);
                      }}
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <FaPlus className="w-3 h-3" />
                      <span className="hidden sm:inline">Add Package</span>
                      <span className="sm:hidden">Add</span>
                    </button>
                    <button
                      onClick={() => handleDelete(service.id, service.name, 'service')}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                    >
                      <MdDelete className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Packages */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700 relative">
                {service.packages.map((pkg) => (
                  <div key={pkg.id} className="px-3 sm:px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex flex-col gap-3">
                      {/* Package Info */}
                      <div className="flex items-start gap-3">
                        {bulkDiscountMode && (
                          <input
                            type="checkbox"
                            checked={selectedPackages.has(pkg.id)}
                            onChange={() => togglePackageSelection(pkg.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mt-1"
                          />
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                            <h5 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">{pkg.name}</h5>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                pkg.isLive 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                              }`}>
                                {pkg.isLive ? <FaEye className="w-3 h-3" /> : <FaEyeSlash className="w-3 h-3" />}
                                {pkg.isLive ? 'Live' : 'Offline'}
                              </span>
                              {pkg.discount > 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                                  <FaPercentage className="w-3 h-3" />
                                  {pkg.discount}% OFF
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <MdAccessTime className="w-4 h-4" />
                              {pkg.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <MdAttachMoney className="w-4 h-4" />
                              {pkg.discount > 0 ? (
                                <>
                                  <span className="line-through text-gray-400">${pkg.originalFee}</span>
                                  <span className="font-semibold text-green-600">${pkg.currentFee}</span>
                                </>
                              ) : (
                                <span className="font-semibold">${pkg.currentFee}</span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 ml-auto">
                        {/* Live/Offline Toggle */}
                        <button
                          onClick={() => togglePackageLiveStatus(service.id, pkg.id)}
                          className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                            pkg.isLive
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                          }`}
                        >
                          {pkg.isLive ? 'End Live' : 'Go Live'}
                        </button>

                        {/* Discount Dropdown */}
                        <div className="relative">
                          <button 
                            onClick={() => setOpenDiscountDropdown(openDiscountDropdown === pkg.id ? null : pkg.id)}
                            className="px-2 sm:px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs sm:text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 flex items-center gap-1"
                          >
                            <FaPercentage className="w-3 h-3" />
                            <span className="hidden sm:inline">Discount</span>
                            <MdArrowDropDown className={`w-4 h-4 transition-transform ${openDiscountDropdown === pkg.id ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {openDiscountDropdown === pkg.id && (
                            <>
                              {/* Backdrop to close dropdown */}
                              <div 
                                className="fixed inset-0 z-[9998]" 
                                onClick={() => setOpenDiscountDropdown(null)}
                              />
                              
                              {/* Dropdown Menu */}
                              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[9999] animate-in fade-in-0 zoom-in-95 duration-100">
                                <div className="p-2 space-y-1 min-w-[120px]">
                                  {discountOptions.map(discount => (
                                    <button
                                      key={discount}
                                      onClick={() => {
                                        applyDiscount(service.id, pkg.id, discount);
                                        setOpenDiscountDropdown(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                    >
                                      {discount}%
                                    </button>
                                  ))}
                                  <hr className="border-gray-200 dark:border-gray-600 my-1" />
                                  <button
                                    onClick={() => {
                                      applyDiscount(service.id, pkg.id, 0);
                                      setOpenDiscountDropdown(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                  >
                                    Reset
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Edit Button */}
                        <button
                          onClick={() => setEditingPackage(pkg)}
                          className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                        >
                          <MdEdit className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(pkg.id, pkg.name, 'package')}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                        >
                          <MdDelete className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <FaTags className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No services found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {searchTerm || serviceTypeFilter !== "all" 
                ? "Try adjusting your search or filters" 
                : "Create your first service to get started"}
            </p>
          </div>
        )}
      </WaterDropCard>

      {/* Modals */}
      <CreateServiceModal
        isOpen={isCreateServiceModalOpen}
        onClose={() => setIsCreateServiceModalOpen(false)}
        onSubmit={handleCreateService}
      />

      <CreatePackageModal
        isOpen={isCreatePackageModalOpen}
        onClose={() => setIsCreatePackageModalOpen(false)}
        onSubmit={handleCreatePackage}
        services={services}
        selectedServiceId={selectedServiceForPackage}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={`Delete ${deleteTarget?.type === 'service' ? 'Service' : 'Package'}`}
        itemName={deleteTarget?.name || ''}
        itemType={deleteTarget?.type === 'service' ? 'Service' : 'Package'}
      />
    </div>
  );
};

export default Service;