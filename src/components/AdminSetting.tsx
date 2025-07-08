"use client";

import { useState } from "react";

export default function AdminSetting() {
  const [status, setStatus] = useState("Active");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen1, setModalOpen1] = useState(false);
  const [role, setRole] = useState<string>("");
  const [permissions, setPermissions] = useState<string[]>([]);

  const handleCreateClick = () => setModalOpen(true);
  const handleEditClick = () => setModalOpen1(true);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    if (selectedRole !== "admin") {
      setPermissions([]); // Reset if not admin
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

  const handlePermissionsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setPermissions((prev) =>
      Array.from(new Set([...prev, ...selectedOptions]))
    );
  };

  const removePermission = (permission: string) => {
    setPermissions((prev) => prev.filter((p) => p !== permission));
  };

  const handleAddAdmin = () => {
    console.log("Role:", role);
    console.log("Permissions:", permissions);
    console.log("Status:", status);
    setModalOpen(false);
  };

  return (
    <div>
      <div className="sets">
        <h5>Admin/Super Admin Management*</h5>
        <button className="create" onClick={handleCreateClick}>
          Create new+ Admin
        </button>
      </div>

      <div className="table">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>admin@gmail.com</td>
              <td>Johndoe</td>
              <td>Super Admin</td>
              <td>Active</td>
              <td>
                <button className="e-btn" onClick={handleEditClick}>
                  Edit
                </button>
                <button className="e-btn">Login details</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="modal s-modal settings-m">
          <div className="d-overlay" onClick={() => setModalOpen(false)} />
          <div className="modal-content">
            <h2>Add New Admin</h2>
            <form>
              <input type="text" placeholder="Enter full name" />
              <input type="email" placeholder="Enter email" />
              <input type="text" placeholder="Username" />
              <input type="password" placeholder="Enter password" />
              <input type="password" placeholder="Confirm password" />
              <select value={role} onChange={handleRoleChange}>
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="super admin">Super Admin</option>
              </select>
              <input type="tel" placeholder="Enter phone number" />

              {role === "admin" && (
                <label>
                  Permissions:
                  <select
                    multiple
                    value={permissions}
                    onChange={handlePermissionsChange}
                    style={{ width: "100%", height: "100px" }}
                  >
                    <option value="view/edit">View/Edit</option>
                    <option value="delete report">Delete Report</option>
                    <option value="manage users">Manage Users</option>
                    <option value="add services">Add Services</option>
                  </select>
                </label>
              )}

              {permissions.length > 0 && (
                <ul>
                  {permissions.map((permission) => (
                    <li key={permission}>
                      {permission}
                      <button
                        type="button"
                        onClick={() => removePermission(permission)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "red",
                          cursor: "pointer",
                          marginLeft: "8px",
                        }}
                      >
                        X
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="status">
                <label>
                  <input
                    type="radio"
                    name="status"
                    checked={status === "Active"}
                    onChange={() => handleStatusChange("Active")}
                  />
                  Active
                </label>
                <label>
                  <input
                    type="radio"
                    name="status"
                    checked={status === "Inactive"}
                    onChange={() => handleStatusChange("Inactive")}
                  />
                  Inactive
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="button" onClick={handleAddAdmin}>
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {modalOpen1 && (
        <div className="modal s-modal s-m">
          <div className="d-overlay" onClick={() => setModalOpen1(false)} />
          <div className="modal-content user-modal serv-modal">
            <h2>Edit</h2>
            <form>
              <label>
                <p>Full name</p>
                <input type="text" defaultValue="John Doe" />
              </label>
              <label>
                <p>Email</p>
                <input type="email" defaultValue="john@gmail.com" />
              </label>
              <label>
                <p>Username</p>
                <input type="text" defaultValue="@johndoe" />
              </label>
              <label>
                <p>Password</p>
                <input type="password" defaultValue="xxxxxx" />
              </label>
              {/* Add more fields as needed */}
              <div className="modal-actions">
                <button type="button" onClick={() => setModalOpen1(false)}>
                  Cancel
                </button>
                <button type="submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
 