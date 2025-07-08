"use client";
import { useState, useEffect, useRef, useMemo, memo } from "react";

export default function GeneralSetting(){
    const [status, setStatus] = useState("Active");
    const [smsStatus, setSmsStatus] = useState("Activate");
    const [securityStatus, setSecurityStatus] = useState("Active");

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
    };

    const handleSmsChange = (newSmsStatus: string) => {
        setSmsStatus(newSmsStatus);
    };

    const handleSecurityChange = (newStatus: string) => {
        setSecurityStatus(newStatus);
    };



    return(
        <div>
            <div className="sets">
                <h5>General Settings*</h5>
            </div>


            <div className="settings-s">
                <div className="set-form">
                <h2>Custom Theme</h2>
               
                <form>
                    <label>
                        <select>
                            <option value="">Select Theme</option>
                            <option value="default">Default</option>
                            <option value="Black">Black</option>
                            <option value="white">White</option>
                        </select>
                    </label>

                    <h2>Payment Gateways:</h2>
                    <div className="payment">
                        <input type="checkbox" name="" id="" />
                        <span>Strip</span>
                    </div>
                    <div className="payment">
                        <input type="checkbox" name="" id="" />
                        <span>Paypal</span>
                    </div>
                    <div className="payment">
                        <input type="checkbox" name="" id="" />
                        <span>Crypto</span>
                    </div>

                    <h2>Notification Settings</h2>
                    <label htmlFor="">Email Notification

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
                    </label>



                    <label htmlFor="">SMS Notification

                    <div className="status" style={{marginTop:'8px'}}>
                        <input
                            type="radio"
                            name="smsStatus"
                            checked={smsStatus === "Activate"}
                            onChange={() => handleSmsChange("Activate")}
                        />
                        <span>Active</span>
                        <input
                            type="radio"
                            name="smsStatus"
                            checked={smsStatus === "Inactivate"}
                            onChange={() => handleSmsChange("Inactivate")}
                        />
                        <span>Inactive</span>
                        </div>
                    </label>

                    <h2>Alert For:</h2>
                    <div className="payment">
                        <input type="checkbox" name="" id="" />
                        <span>Low Engagement</span>
                    </div>
                    <div className="payment">
                        <input type="checkbox" name="" id="" />
                        <span>Payment Issues</span>
                    </div>
                    <div className="payment">
                        <input type="checkbox" name="" id="" />
                        <span>User Feedback</span>
                    </div>

                    <h2>Security Settings</h2>
                    <label htmlFor="">Two Factor Authentication:

                    <div className="status" style={{marginTop:'8px'}}>
                        <input
                            type="radio"
                            name="settingStatus"
                            checked={securityStatus === "Active"}
                            onChange={() => handleSecurityChange("Active")}
                        />
                        <span>Active</span>
                        <input
                            type="radio"
                            name="settingStatus"
                            checked={securityStatus === "Inactive"}
                            onChange={() => handleSecurityChange("Inactive")}
                        />
                        <span>Inactive</span>
                        </div>
                    </label>
                    

                    
                </form>
                </div>
            </div>
        
        </div>
    )
}