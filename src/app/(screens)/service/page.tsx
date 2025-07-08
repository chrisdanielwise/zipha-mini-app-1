"use client";

import { memo, useState, useEffect, useRef } from "react";
import Header from "../../../components/Header";
import { MdOutlineAdd } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { FaTrashAlt } from "react-icons/fa";
import GenericTable from "../../../components/table";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [editingItem, setEditingItem] = useState<{ id: number; type: string } | null>(null);
  const [newServiceName, setNewServiceName] = useState("");
  const [newPackages, setNewPackages] = useState<PackageItem[]>([]);
  const [addTargetType, setAddTargetType] = useState<string | null>(null);
  const [saveConfirm, setSaveConfirm] = useState<{ id: number; newFee: string; type: string } | null>(null);
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
    setPackageData(prev => {
      const updated = prev[type]?.filter(item => item.id !== id) || [];
      return { ...prev, [type]: updated };
    });
  };

  const renderTable = (label: string, type: string, data: PackageItem[]) => (
    <div className="subsc-table pack-table" key={`service-${type}`}>
      <div className="barcharts">
        <div className="proff">
          <div className="serv-flex">
            <h3>{label}</h3>
            <div className="btn" onClick={() => { setIsModalOpen(true); setAddTargetType(type); }}>
              <MdOutlineAdd className="a-i" /> Add Package
            </div>
          </div>
          <GenericTable
            columns={[
              { id: "packages", label: "Packages" },
              { id: "duration", label: "Duration" },
              { id: "fee", label: "Fee" },
              { id: "actions", label: "Actions" }
            ]}
            data={data}
            itemsPerPage={5}
            renderCell={(row) => [
              <td key={`packages-${row.id}`}>{row.packages || row.name}</td>,
              <td key={`duration-${row.id}`}>{row.duration}</td>,
              <td key={`fee-${row.id}`}>
                {editingItem?.id === row.id && editingItem?.type === type ? (
                  <input
                    type="text"
                    value={row.fee}
                    onChange={(e) => handleFeeChange(e, row.id, type)}
                  />
                ) : (
                  `$${row.fee}`
                )}
              </td>,
              <td key={`actions-${row.id}`} style={{ display: "flex", gap: "2rem" }}>
                <FiEdit style={{ cursor: "pointer" }} onClick={() => setEditingItem({ id: row.id, type })} />
                <FaTrashAlt style={{ cursor: "pointer", color: "red" }} onClick={() => handleDeleteRow(row.id, type)} />
              </td>
            ]}
          />
        </div>
      </div>
    </div>
  );

  return (
    <main>
      <Header />
      <div className="barcharts">
        <div className="proff">
          <div className="serv-flex">
            <div>
              <h4>Services</h4>
              <h5>{services.length + Object.keys(packageData).length} Services</h5>
            </div>
            <div className="btn" onClick={() => { setIsModalOpen(true); setAddTargetType(null); }}>
              <MdOutlineAdd className="a-i" /> New Service
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
            className="modal"
            style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
            zIndex: 1000,
            boxSizing: "border-box",
            }}
        >
            <div
            className="modal-content"
            style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                padding: "1rem",
                width: "100%",
                maxWidth: "500px",
                maxHeight: "90vh",
                overflowY: "auto",
                boxSizing: "border-box",
            }}
            >
            {addTargetType ? <h3>Add Package to {addTargetType}</h3> : <h3>Add New Service</h3>}
            {!addTargetType && (
              <input
                type="text"
                placeholder="Service Name"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
              /> 
            )}
            {newPackages.map((pkg, index) => (
              <div key={index} className="package-inputs">
                <input
                  type="text"
                  placeholder="Package Name"
                  value={pkg.name}
                  onChange={(e) => handlePackageChange(index, "name", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Duration"
                  value={pkg.duration}
                  onChange={(e) => handlePackageChange(index, "duration", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Fee"
                  value={pkg.fee}
                  onChange={(e) => handlePackageChange(index, "fee", e.target.value)}
                />
              </div>
            ))}
            <button onClick={handleAddPackage}>Add Package</button>
            {addTargetType ? (
              <button onClick={handleAddToExistingService}>Save to Existing</button>
            ) : (
              <button onClick={handleSaveService}>Create Service</button>
            )}
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {saveConfirm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirm Fee Update</h3>
            <p>Do you want to save the updated price: {saveConfirm.newFee}?</p>
            <button onClick={handleUpdateFee}>Yes, Save</button>
            <button onClick={() => setSaveConfirm(null)}>Cancel</button>
          </div>
        </div>
      )}

      {Object.entries(packageData).map(([type, data]) =>
        renderTable(type.charAt(0).toUpperCase() + type.slice(1) + " Signals", type, data)
      )}

      {services.map((service) =>
        renderTable(service.name, service.name.toLowerCase(), service.packages)
      )}
    </main>
  );
};

export default memo(Service);