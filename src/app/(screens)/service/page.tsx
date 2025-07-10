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
} from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { FaTrashAlt, FaTags, FaCheck, FaTimes, FaCrown, FaUserGraduate } from "react-icons/fa";
import GenericTable from "../../../components/table";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from "../../../components/ui/Card";
import WaterDropCard from "../../../components/ui/WaterDropCard";

interface PackageItem {
  id: number;
  packages?: string;
  name?: string;
  duration: string;
  fee: string;
  type?: string;
}

interface Service {
  id: number;
  name: string;
  packages: PackageItem[];
}

const Service = () => {
  const [packageData, setPackageData] = useState<Record<string, PackageItem[]>>({
    vip: [
      { id: 1, packages: "VIP", fee: "2000", duration: "1 month", type: "vip" },
      { id: 2, packages: "VIP", fee: "2500", duration: "2 months", type: "vip" },
      { id: 3, packages: "VIP", fee: "2200", duration: "3 months", type: "vip" },
      { id: 4, packages: "VIP", fee: "2100", duration: "6 months", type: "vip" },
    ],
    mentor: [
      { id: 1, packages: "1-on-1", fee: "2000", duration: "3 months", type: "mentor" },
      { id: 2, packages: "G mentorship", fee: "2500", duration: "1 month", type: "mentor" },
    ],
  });

  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ id: number; type: string } | null>(null);
  const [newServiceName, setNewServiceName] = useState("");
  const [newPackages, setNewPackages] = useState<PackageItem[]>([]);
  const [addTargetType, setAddTargetType] = useState<string | null>(null);
  const [saveConfirm, setSaveConfirm] = useState<{ id: number; newFee: string; type: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; type: string; name: string } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleAddPackage = () => {
    setNewPackages([...newPackages, { id: Date.now(), name: "", duration: "", fee: "" }]);
  };

  const handleAddToExistingService = () => {
    if (!addTargetType || newPackages.length === 0) return;
    setPackageData(prev => {
      const current = prev[addTargetType] || [];
      const updated = [...current, ...newPackages.map(pkg => ({ ...pkg, type: addTargetType }))];
      return { ...prev, [addTargetType]: updated };
    });
    setIsModalOpen(false);
    setAddTargetType(null);
    setNewPackages([]);
    toast.success("Package(s) added to existing service");
  };

  const handlePackageChange = (index: number, field: string, value: string) => {
    const updatedPackages = [...newPackages];
    updatedPackages[index] = { ...updatedPackages[index], [field]: value };
    setNewPackages(updatedPackages);
  };

  const handleSaveService = () => {
    if (!newServiceName || newPackages.length === 0) return;
    const newService: Service = {
      id: services.length + 1,
      name: newServiceName,
      packages: newPackages.map(pkg => ({ ...pkg, type: newServiceName.toLowerCase() })),
    };
    setServices([...services, newService]);
    setIsModalOpen(false);
    setNewServiceName("");
    setNewPackages([]);
    toast.success("New service created successfully");
  };

  const handleFeeChange = (e: React.ChangeEvent<HTMLInputElement>, id: number, type: string) => {
    const value = e.target.value;
    setPackageData(prev => {
      const updated = prev[type]?.map(item => item.id === id ? { ...item, fee: value } : item) || [];
      return { ...prev, [type]: updated };
    });

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSaveConfirm({ id, newFee: value, type });
    }, 5000);
  };

  const handleUpdateFee = async () => {
    if (!saveConfirm) return;
    const { id, newFee, type } = saveConfirm;

    await fetch("/api/subscription/pricing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, newFee, type }),
    });
    setEditingItem(null);
    setSaveConfirm(null);
    toast.success("Fee updated");
  };

  const handleDeleteRow = (id: number, type: string) => {
    const item = packageData[type]?.find(item => item.id === id);
    if (item) {
      setDeleteTarget({ 
        id, 
        type, 
        name: item.packages || item.name || "Unknown Service" 
      });
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    
    setPackageData(prev => {
      const updated = prev[deleteTarget.type]?.filter(item => item.id !== deleteTarget.id) || [];
      return { ...prev, [deleteTarget.type]: updated };
    });
    
    toast.success("Service package deleted successfully");
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const allPackages = Object.values(packageData).flat();
    const totalPackages = allPackages.length + services.reduce((acc, service) => acc + service.packages.length, 0);
    const totalServices = Object.keys(packageData).length + services.length;
    const avgPrice = allPackages.length > 0 
      ? Math.round(allPackages.reduce((acc, pkg) => acc + parseFloat(pkg.fee || "0"), 0) / allPackages.length)
      : 0;
    
    return { totalServices, totalPackages, avgPrice };
  }, [packageData, services]);

  // Filter packages based on search and type
  const getFilteredPackages = (packages: PackageItem[], type: string) => {
    if (!searchTerm && serviceTypeFilter === "all") return packages;
    
    return packages.filter(pkg => {
      const matchesSearch = !searchTerm || 
        (pkg.packages || pkg.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.duration.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.fee.includes(searchTerm);
      
      const matchesType = serviceTypeFilter === "all" || serviceTypeFilter === type;
      
      return matchesSearch && matchesType;
    });
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "vip":
        return <FaCrown className="w-5 h-5 text-yellow-500" />;
      case "mentor":
        return <FaUserGraduate className="w-5 h-5 text-blue-500" />;
      default:
        return <FaTags className="w-5 h-5 text-gray-500" />;
    }
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case "vip":
        return "from-yellow-400 to-orange-500";
      case "mentor":
        return "from-blue-400 to-cyan-500";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  const renderTable = (label: string, type: string, data: PackageItem[]) => {
    const filteredData = getFilteredPackages(data, type);
    
    if (filteredData.length === 0 && (searchTerm || serviceTypeFilter !== "all")) {
      return null; // Don't render empty filtered tables
    }

    return (
      <WaterDropCard key={`service-${type}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getServiceColor(type)} flex items-center justify-center shadow-lg`}>
              {getServiceIcon(type)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">{label}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {filteredData.length} package{filteredData.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
            <button 
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
              onClick={() => { setIsModalOpen(true); setAddTargetType(type); }}
            >
              <MdOutlineAdd className="w-4 h-4" /> 
              <span className="hidden sm:inline">Add Package</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
        
        {filteredData.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shadow-lg">
              <FaTags className="text-4xl text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
              No packages available
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {searchTerm || serviceTypeFilter !== "all" 
                ? "Try adjusting your search or filters" 
                : "Add your first package to get started"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <GenericTable
                columns={[
                  { id: "packages", label: "Package" },
                  { id: "duration", label: "Duration" },
                  { id: "fee", label: "Fee" },
                  { id: "actions", label: "Actions" }
                ]}
                data={filteredData}
                itemsPerPage={10}
                renderCell={(row) => [
                  <td key={`packages-${row.id}`} className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getServiceColor(type)} flex items-center justify-center`}>
                        {getServiceIcon(type)}
                      </div>
                      <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-semibold text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600">
                        {row.packages || row.name}
                      </span>
                    </div>
                  </td>,
                  <td key={`duration-${row.id}`} className="text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <MdAccessTime className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{row.duration}</span>
                    </div>
                  </td>,
                  <td key={`fee-${row.id}`}>
                    {editingItem?.id === row.id && editingItem?.type === type ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-600">
                          <MdAttachMoney className="w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            value={row.fee}
                            onChange={(e) => handleFeeChange(e, row.id, type)}
                            className="w-20 rounded border-none bg-transparent text-gray-800 dark:text-white font-semibold focus:ring-0 focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={handleUpdateFee}
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition"
                          title="Save"
                        >
                          <MdSave className="text-lg" />
                        </button>
                        <button
                          onClick={() => setEditingItem(null)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition"
                          title="Cancel"
                        >
                          <MdCancel className="text-lg" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2 border border-green-200 dark:border-green-800">
                          <MdAttachMoney className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                            {row.fee}
                          </span>
                        </div>
                      </div>
                    )}
                  </td>,
                  <td key={`actions-${row.id}`}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingItem({ id: row.id, type })}
                        className="p-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200 shadow-sm"
                        title="Edit price"
                      >
                        <MdEdit className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDeleteRow(row.id, type)}
                        className="p-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 shadow-sm"
                        title="Delete package"
                      >
                        <MdDelete className="text-lg" />
                      </button>
                    </div>
                  </td>
                ]}
              />
            </div>

            {/* Mobile Compact Card View */}
            <div className="md:hidden space-y-3">
              {filteredData.map((row) => (
                <div
                  key={row.id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:shadow-md transition-all duration-200"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${getServiceColor(type)} flex items-center justify-center`}>
                        {getServiceIcon(type)}
                      </div>
                      <span className="text-sm font-semibold text-gray-800 dark:text-white">
                        {row.packages || row.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingItem({ id: row.id, type })}
                        className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition"
                        title="Edit price"
                      >
                        <MdEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRow(row.id, type)}
                        className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition"
                        title="Delete package"
                      >
                        <MdDelete className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <MdAccessTime className="w-3 h-3" />
                      <span>{row.duration}</span>
                    </div>
                    
                    {editingItem?.id === row.id && editingItem?.type === type ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={row.fee}
                          onChange={(e) => handleFeeChange(e, row.id, type)}
                          className="w-16 rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-xs"
                        />
                        <button
                          onClick={handleUpdateFee}
                          className="p-1 text-green-600 hover:text-green-700 transition"
                          title="Save"
                        >
                          <MdSave className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setEditingItem(null)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition"
                          title="Cancel"
                        >
                          <MdCancel className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <MdAttachMoney className="w-3 h-3 text-green-600 dark:text-green-400" />
                        <span className="font-bold text-green-600 dark:text-green-400 text-sm">
                          {row.fee}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </WaterDropCard>
    );
  };

  return (
    <div className="flex flex-col gap-8 mt-4 max-w-7xl mx-auto pb-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Welcome Section */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Service Management</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your subscription services and pricing</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <FaCheck className="w-5 h-5 text-white" />
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
              <span className="text-sm font-bold text-white">$</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Avg. Price</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mb-3">${stats.avgPrice}</p>
          </div>
        </WaterDropCard>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {addTargetType ? `Add Package to ${addTargetType.toUpperCase()}` : "Create New Service"}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setAddTargetType(null);
                    setNewServiceName("");
                    setNewPackages([]);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {!addTargetType && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter service name..."
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Packages
                  </h3>
                  <button
                    onClick={handleAddPackage}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
                  >
                    <MdOutlineAdd className="text-lg" />
                    Add Package
                  </button>
                </div>
                
                {newPackages.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl">
                    <FaTags className="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No packages added yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Click "Add Package" to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {newPackages.map((pkg, index) => (
                      <div key={pkg.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Package Name
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. VIP Premium"
                              value={pkg.name}
                              onChange={(e) => handlePackageChange(index, "name", e.target.value)}
                              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Duration
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 1 month"
                              value={pkg.duration}
                              onChange={(e) => handlePackageChange(index, "duration", e.target.value)}
                              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                          </div>
                          <div className="w-full sm:w-32">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Fee ($)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 99"
                              value={pkg.fee}
                              onChange={(e) => handlePackageChange(index, "fee", e.target.value)}
                              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                          </div>
                          <div className="flex items-end">
                            <button
                              onClick={() => {
                                const updated = newPackages.filter((_, i) => i !== index);
                                setNewPackages(updated);
                              }}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                              title="Remove package"
                            >
                              <MdDelete className="text-lg" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setAddTargetType(null);
                    setNewServiceName("");
                    setNewPackages([]);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={addTargetType ? handleAddToExistingService : handleSaveService}
                  disabled={(!addTargetType && !newServiceName) || newPackages.length === 0}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {addTargetType ? "Add to Service" : "Create Service"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {renderTable("VIP Services", "vip", packageData.vip)}
        {renderTable("Mentorship Services", "mentor", packageData.mentor)}
        {services.map(service => renderTable(service.name, service.name.toLowerCase(), service.packages))}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <MdDelete className="text-2xl text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Delete Service Package
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  You are about to delete:
                </p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {deleteTarget.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Service Type: {deleteTarget.type.toUpperCase()}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteTarget(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                >
                  Delete Package
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Service);