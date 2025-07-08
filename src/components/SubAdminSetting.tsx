"use client";
import { useState, useEffect, useRef, useMemo, memo } from "react";

export default function SubAdminSetting(){
    const [status, setStatus] = useState("Active");
    const [modalOpen, setModalOpen] = useState(false);
    const [role, setRole] = useState<string>(""); // Assume role state exists  
    const [permissions, setPermissions] = useState<string[]>([]);  
    const [modalOpen1, setModalOpen1] = useState(false);

    const handleCreateClick = () => {
        setModalOpen(true);
      };

     
      const handleEditClick = () => {
        setModalOpen1(true);
      };

      const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
      };

      const handlePermissionsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {  
        // Current selected options  
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);  
        
        // Update permissions: include newly selected ones or exclude them if already selected  
        setPermissions(prevPermissions => {  
          const newPermissions = selectedOptions.filter(option => !prevPermissions.includes(option));  
          return Array.from(new Set([...prevPermissions, ...newPermissions]));  
        });  
      };
      const removePermission = (permissionToRemove: string) => {  
        setPermissions(prevPermissions =>   
          prevPermissions.filter(permission => permission !== permissionToRemove)  
        );  
      };

      const handleAddAdmin = () => {
        console.log("Role:", role);
        console.log("Permissions:", permissions);
        console.log("Status:", status);
        setModalOpen(false); // Close modal
      };

  


    return(
        <div>
            <div className="sets">
                <h5>Sub Admin Management*</h5>

                <button className="create" onClick={handleCreateClick}>
                    Create new+ Sub Admin
                </button>
            </div>

            <div className="table">
            <table className="merchant-table">
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Status</th>
                    <th>Merc. Assigned</th>
                    <th>Action</th>
                                        
                </tr>

                <tr>
                    <td>John Doe</td>
                    <td>admin@gmail.com</td>
                    <td>Johndoe</td>
                    <td>xxxxxx</td>
                    <td>Active</td>
                    <td>Vendor A</td>
                    <td>
                        <button className="e-btn" onClick={handleEditClick}>Edit/view</button>
                    </td>
                </tr>

                <tr>
                    <td>John Doe</td>
                    <td>admin@gmail.com</td>
                    <td>Johndoe</td>
                    <td>xxxxxx</td>
                    <td>Active</td>
                    <td>Vendor A</td>
                    <td>
                        <button className="e-btn">Edit/view</button>
                    </td>
                </tr>
            </table>
            </div>

            {/* MODAL */}
            {modalOpen && (
            <div className="modal s-modal settings-m">
                <div className="d-overlay" onClick={() => setModalOpen(false)}></div>
                <div className="modal-content">
                <h2>Add New Admin</h2>
                <form>
                    <label>
                    <input
                        type="text"
                        placeholder="Enter full name"
                        style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px",
                        boxSizing: "border-box",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        }}
                    />
                    </label>

                    <label>
                    <input
                        type="email"
                        placeholder="Enter email"
                        style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px",
                        boxSizing: "border-box",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        }}
                    />
                    </label>

                    <label>
                    <input
                        type="text"
                        placeholder="Username"
                        style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px",
                        boxSizing: "border-box",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        }}
                    />
                    </label>

                    <label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px",
                        boxSizing: "border-box",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        }}
                    />
                    </label>

                    <label>
                    <input
                        type="password"
                        placeholder="Confirm password"
                        style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px",
                        boxSizing: "border-box",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        }}
                    />
                    </label>

                    

                    <label>
                    <input
                        type="tel"
                        placeholder="Enter phone number"
                        style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px",
                        boxSizing: "border-box",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        }}
                    />
                    </label>


                <label>
                    Assigned Merchant:
                    <select>
                        <option value="">Select merchant</option>
                        <option value="Vendor1">Vendor1</option>
                        <option value="Vendor2">Vendor2</option>
                    </select>
                </label>


                    
                    <label>  
                        Permissions (multiselect):  
                        <select  
                        multiple  
                        value={permissions}  
                        onChange={handlePermissionsChange}  
                        style={{ width: "100%", height: "90px" }}  
                        >  
                        <option value="View users">View users</option>  
                      <option value="Approve request">Approve request</option>  
                      <option value="generate reports">Generate reports</option>  
                    </select>   
                    </label>  
                    

                    
                    {/* <p>Selected Permissions:</p>   */}
                    {permissions.length > 0 ? ( <> 
                        <ul style={{color:'#333', fontSize:'13px', fontWeight:400}}>  
                        {permissions.map(permission => (  
                            <li key={permission} style={{ display: 'flex', justifyContent: 'space-between' }}>  
                            {permission}  
                            <button   
                                onClick={() => removePermission(permission)}   
                                style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}  
                            >  
                                X  
                            </button>  
                            </li>  
                        ))}  
                        </ul> 

                        
                        </>
                    ) : (  
                        // <p style={{color:'#333'}}>No permissions selected</p>  
                        null
                    )}  
                    
                    <div className="status" style={{marginTop:'8px'}}>
                        <input
                            type="radio"
                            name="status"
                            checked={status === "Active"}
                            onChange={() => handleStatusChange("Active")}
                        />
                        <span>Active</span>
                        <input
                            type="radio"
                            name="status"
                            checked={status === "Inactive"}
                            onChange={() => handleStatusChange("Inactive")}
                        />
                        <span>Inactive</span>
                        </div>
                    

                    <div className="modal-actions">
                    <button onClick={() => setModalOpen(false)}>
                        Cancel
                    </button>
                    <button
                    onClick={handleAddAdmin} 
                        className="text-[#a677e8]"
                    >
                        Add
                    </button>
                    </div>
                </form>
                </div>
            </div>
            )}


            {/* MODAL2 */}
            {modalOpen1 && (
                <div className="modal s-modal s-m">
                    <div className="d-overlay" onClick={() => setModalOpen1(false)}></div>
                        <div className="modal-content user-modal serv-modal">
                        <h2>Edit</h2>
                        <form>
                
                            <label style={{flexWrap:'wrap'}}>
                                <p style={{color:'#333', width:'100%',margin:0,fontWeight:400}}>Full name</p>
                                <input
                                    type="text"
                                    value="John Doe"
                                    style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginBottom: "10px",
                                    boxSizing: "border-box",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    }}
                                />
                            </label>

                            <label style={{flexWrap:'wrap'}}>
                                <p style={{color:'#333', width:'100%',margin:0,fontWeight:400}}>Email</p>
                                <input
                                    type="email"
                                    value="john@gmail.com"
                                    style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginBottom: "10px",
                                    boxSizing: "border-box",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    }}
                                />
                            </label>

                            <label style={{flexWrap:'wrap'}}>
                                <p style={{color:'#333', width:'100%',margin:0,fontWeight:400}}>Username</p>
                                <input
                                    type="text"
                                    value="@johndoe"
                                    style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginBottom: "10px",
                                    boxSizing: "border-box",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    }}
                                />
                            </label>

                            <label style={{flexWrap:'wrap'}}>
                                <p style={{color:'#333', width:'100%',margin:0,fontWeight:400}}>Password</p>
                                <input
                                    type="password"
                                    value="xxxxxx"
                                    style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginBottom: "10px",
                                    boxSizing: "border-box",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    }}
                                />
                            </label>


                            <label style={{flexWrap:'wrap'}}>
                                <p style={{color:'#333', width:'100%',margin:0,fontWeight:400}}>Merchant Assigned</p>
                                <input
                                    type="text"
                                    value="Vendor A"
                                    style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginBottom: "10px",
                                    boxSizing: "border-box",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    }}
                                />
                            </label>

                            <label style={{flexWrap:'wrap'}}>
                                <p style={{color:'#333', width:'100%',margin:0,fontWeight:400}}>Phone number</p>
                                <input
                                    type="text"
                                    value="09152673883"
                                    style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginBottom: "10px",
                                    boxSizing: "border-box",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    }}
                                />
                            </label>


                            <label style={{flexWrap:'wrap'}}>
                                <p style={{color:'#333', width:'100%',margin:0,fontWeight:400}}>Status</p>
                                <input
                                    type="text"
                                    value="Active"
                                    style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginBottom: "10px",
                                    boxSizing: "border-box",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    }}
                                />
                            </label>
                            
                            <div className="modal-actions">
                            <button onClick={() => setModalOpen1(false)}>
                                Cancel
                            </button>
                            <button
                                
                                className="text-[#a677e8]"
                            >
                                Update
                            </button>
                            </div>
                        </form>
                        </div>
                    
                </div>
            )}
        </div>
    )
}