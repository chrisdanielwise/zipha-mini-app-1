import { useState } from "react";
import { MdClose } from "react-icons/md";
import { FaPlus } from "react-icons/fa";

interface Service {
  id: number;
  name: string;
}

interface CreatePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (packageData: { name: string; duration: string; fee: string }, serviceId: number) => void;
  services: Service[];
  selectedServiceId?: number | null;
}

const CreatePackageModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  services, 
  selectedServiceId 
}: CreatePackageModalProps) => {
  const [packageData, setPackageData] = useState({
    name: "",
    duration: "",
    fee: "",
  });
  const [serviceId, setServiceId] = useState<number>(selectedServiceId || 0);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!packageData.name.trim() || !packageData.duration.trim() || !packageData.fee.trim() || !serviceId) {
      return;
    }
    onSubmit(packageData, serviceId);
    setPackageData({ name: "", duration: "", fee: "" });
    setServiceId(0);
    onClose();
  };

  const handleClose = () => {
    setPackageData({ name: "", duration: "", fee: "" });
    setServiceId(selectedServiceId || 0);
    onClose();
  };

  const selectedService = services.find(s => s.id === serviceId);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <FaPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                  Create New Package
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedService ? `Add to ${selectedService.name}` : "Add a new package"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MdClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Service Selection */}
          {!selectedServiceId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Service *
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={0}>Choose a service...</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Package Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Package Name *
            </label>
            <input
              type="text"
              value={packageData.name}
              onChange={(e) => setPackageData({...packageData, name: e.target.value})}
              placeholder="e.g., Premium Plan, Basic Package"
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus={!!selectedServiceId}
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duration *
            </label>
            <input
              type="text"
              value={packageData.duration}
              onChange={(e) => setPackageData({...packageData, duration: e.target.value})}
              placeholder="e.g., 3 months, 1 year, 30 days"
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price ($) *
            </label>
            <input
              type="number"
              value={packageData.fee}
              onChange={(e) => setPackageData({...packageData, fee: e.target.value})}
              placeholder="e.g., 299, 99, 1500"
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              step="0.01"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter the base price for this package
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!packageData.name.trim() || !packageData.duration.trim() || !packageData.fee.trim() || !serviceId}
              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Create Package
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePackageModal; 