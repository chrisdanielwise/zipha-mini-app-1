"use client";
import { useState } from "react";
import { IoIosCheckmark } from "react-icons/io";

// Pricing map
const PRICING_OPTIONS: Record<string, string[]> = {
  mentorship: ["$1000"],
  training: ["$300/month", "$800/quarterly", "$1950/year"],
  vip: ["$350/month", "$900/quarterly", "$2050/year"],
};

// Mock data for table
const mockServices = [
  {
    name: "VIP",
    vendor: "Vendor A",
    type: "Subscription",
    pricing: PRICING_OPTIONS["vip"].join(", "),
    status: "Active",
  },
  {
    name: "Mentorship",
    vendor: "Vendor B",
    type: "One Time",
    pricing: "$500",
    status: "Active",
  },
];

export default function ServiceSetting() {
  const [merchantPermission, setMerchantPermission] = useState<string[]>([]);
  const [allServices, setAllServices] = useState(false);
  const [services, setServices] = useState<string>("");
  const [status, setStatus] = useState("Active");
  const [modalOpen1, setModalOpen1] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setServices(value);
    setAllServices(value !== "");
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

  const handleAddAdmin = () => {
    console.log("Permissions:", merchantPermission);
    console.log("Services:", services);
    console.log("Status:", status);
    setModalOpen1(false);
  };

  return (
    <div>
      <div className="sets">
        <h5>Service Management*</h5>
        <button className="create" onClick={() => setModalOpen1(true)}>
          Create new+ Service
        </button>
      </div>

      {/* Create Service Modal */}
      {modalOpen1 && (
        <div className="modal s-modal settings-m">
          <div className="d-overlay" onClick={() => setModalOpen1(false)}></div>
          <div className="modal-content">
            <h2>Create New Service</h2>
            <form>
              <label>
                Services name:
                <select value={services} onChange={handleServiceChange}>
                  <option value="">Select service</option>
                  {Object.keys(PRICING_OPTIONS).map((key) => (
                    <option key={key} value={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </option>
                  ))}
                </select>
              </label>

              {allServices && (
                <label>
                  Pricing:
                  <ul className="pricing">
                    {PRICING_OPTIONS[services]?.map((price, idx) => (
                      <li key={idx}>
                        <IoIosCheckmark className="ser-i" /> {price}
                      </li>
                    ))}
                  </ul>
                </label>
              )}

              <label>
                Assigned Vendor:
                <select>
                  <option value="">Select merchant</option>
                  <option value="Vendor1">Vendor1</option>
                  <option value="Vendor2">Vendor2</option>
                </select>
              </label>

              <input type="password" placeholder="Enter password" />
              <input type="password" placeholder="Confirm password" />
              <input type="tel" placeholder="Enter phone number" />

              <label>
                Services type:
                <select>
                  <option value="">Select service type</option>
                  <option value="one-time">One time</option>
                  <option value="subscription">Subscription</option>
                </select>
              </label>

              <textarea placeholder="Description"></textarea>

              <div className="status">
                <label>
                  <input
                    type="radio"
                    name="status"
                    checked={status === "Active"}
                    onChange={() => handleStatusChange("Active")}
                  />
                  <span>Active</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="status"
                    checked={status === "Inactive"}
                    onChange={() => handleStatusChange("Inactive")}
                  />
                  <span>Inactive</span>
                </label>
              </div>

              <div className="modal-actions">
                <button onClick={() => setModalOpen1(false)}>Cancel</button>
                <button onClick={handleAddAdmin} className="text-[#a677e8]">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Table */}
      <div className="table">
        <table className="merchant-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Vendor</th>
              <th>Type</th>
              <th>Pricing</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {mockServices.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.vendor}</td>
                <td>{item.type}</td>
                <td>{item.pricing}</td>
                <td>{item.status}</td>
                <td>
                  <button className="e-btn" onClick={() => setModalOpen(true)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {modalOpen && (
        <div className="modal s-modal s-m">
          <div className="d-overlay" onClick={() => setModalOpen(false)}></div>
          <div className="modal-content user-modal serv-modal">
            <h2>Edit</h2>
            <form>
              <label>
                <p>Service</p>
                <input type="text" value="Mentorship" />
              </label>
              <label>
                <p>Vendor</p>
                <input type="text" value="Vendor A" />
              </label>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
