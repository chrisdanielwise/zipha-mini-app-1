
"use client";
import { useState, useEffect, useRef, useMemo, memo } from "react";
export default function MerchantSetting(){
    const [merchantPermission, setMerchantPermission] = useState<string[]>([]);  
    const [services, setServices] = useState<string[]>([]); 
    const [status, setStatus] = useState("Active");
    const [modalOpen1, setModalOpen1] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);


    const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {  
        // Current selected options  
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);  
        
        // Update permissions: include newly selected ones or exclude them if already selected  
        setServices(prevService => {  
          const newService = selectedOptions.filter(option => !prevService.includes(option));  
          return Array.from(new Set([...prevService, ...newService]));  
        });  
      }; 

      const handleEditClick = () => {
        setModalOpen(true);
      };
    
    
    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
    };
    
      const handleMerchantPermissions = (e: React.ChangeEvent<HTMLSelectElement>) => {  
        // Current selected options  
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);  
        
        // Update permissions: include newly selected ones or exclude them if already selected  
        setMerchantPermission(prevMerchantPermission => {  
          const newMerchantPermission = selectedOptions.filter(option => !prevMerchantPermission.includes(option));  
          return Array.from(new Set([...prevMerchantPermission, ...newMerchantPermission]));  
        });  
      }; 
     

        const removeMerchantPermission = (merchantPermissionToRemove: string) => {  
            setMerchantPermission(prevMerchantPermission =>   
            prevMerchantPermission.filter(merchantPermission => merchantPermission !== merchantPermissionToRemove)  
            );  
        }; 

        const removeService = (servicesToRemove: string) => {  
            setServices(prevServices =>   
              prevServices.filter(services => services !== servicesToRemove)  
            );  
          }; 

        const handleCreateMerchant = () => {
            setModalOpen1(true);
        };

        const handleAddAdmin = () => {
            console.log("Permissions:", merchantPermission);
            console.log("Services:", services);
            console.log("Status:", status);
            setModalOpen1(false); // Close modal
          };

    return(
        <div>
            <div className="sets">
              <h5>Merchant Management*</h5>

              <button className="create" onClick={handleCreateMerchant}>
                Create new+ Merchant
              </button>
            </div>


         {/*Merchant MODAL */}
        {modalOpen1 && (
          <div className="modal s-modal settings-m">
            <div className="d-overlay" onClick={() => setModalOpen1(false)}></div>
            <div className="modal-content">
              <h2>Add New Merchant</h2>
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
                    Services (multiselect):  
                    <select  
                      multiple  
                      value={services}  
                      onChange={handleServiceChange}  
                      style={{ width: "100%", height: "90px" }}  
                    > 
                    <option value="mentorship">Mentorship</option>
                    <option value="training">Training</option>
                    <option value="vip">VIP</option>
                  </select>
                </label>


                {services.length > 0 ? ( <> 
                    <ul style={{color:'#333', fontSize:'13px', fontWeight:400}}>  
                      {services.map(services => (  
                        <li key={services} style={{ display: 'flex', justifyContent: 'space-between' }}>  
                          {services}  
                          <button   
                            onClick={() => removeService(services)}   
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

                  
                  <label>  
                    Permissions (multiselect):  
                    <select  
                      multiple  
                      value={merchantPermission}  
                      onChange={handleMerchantPermissions}  
                      style={{ width: "100%", height: "100px" }}  
                    >  
                      <option value="View report">View report</option>  
                      <option value="User management">User management</option>  
                      <option value="Manage services">Manage services</option>  
                    </select>  
                  </label>  
                 

                 
                  {/* <p>Selected Permissions:</p>   */}
                  {merchantPermission.length > 0 ? ( <> 
                    <ul style={{color:'#333', fontSize:'13px', fontWeight:400}}>  
                      {merchantPermission.map(merchantPermission => (  
                        <li key={merchantPermission} style={{ display: 'flex', justifyContent: 'space-between' }}>  
                          {merchantPermission}  
                          <button   
                            onClick={() => removeMerchantPermission(merchantPermission)}   
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
                  <button onClick={() => setModalOpen1(false)}>
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

        

        <div className="table">
          <table className="merchant-table">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Password</th>
              <th>Service</th>
              <th>Status</th>
              <th>Action</th>
                                    
            </tr>

            <tr>
              <td>John Doe</td>
              <td>john@gmail.com</td>
              <td>Johndoe</td>
              <td>XXXXXX</td>
              <td>Mentorship</td>
              <td>Active</td>
              <td>
                <button className="e-btn" onClick={handleEditClick}>Edit/view</button>
                </td>
            </tr>


            <tr>
              <td>John Doe</td>
              <td>john@gmail.com</td>
              <td>Johndoe</td>
              <td>XXXXXX</td>
              <td>Mentorship</td>
              <td>Active</td>
              <td>
                <button className="e-btn">Edit/view</button>
                </td>
            </tr>

          </table>


          {/* MODAL2 */}
          {modalOpen && (
                <div className="modal s-modal s-m">
                    <div className="d-overlay" onClick={() => setModalOpen(false)}></div>
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
                                <p style={{color:'#333', width:'100%',margin:0,fontWeight:400}}>Service</p>
                                <input
                                    type="text"
                                    value="Mentorship"
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
                            <button onClick={() => setModalOpen(false)}>
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
        </div>
    )
}