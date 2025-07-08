"use client";  

import { useAuth } from "@/context/AuthContext";
import { useState, memo } from "react";  

const GiftCoupon = () => {  
     const { user } = useAuth();
    const [checkboxes, setCheckboxes] = useState<{  
        vip1Month: boolean;  
        vip3Month: boolean;  
        vip6Month: boolean;  
        vip12Month: boolean;  
        groupMentorship: boolean;  
        oneOnOneMentorship: boolean;  
    }>({  
        vip1Month: false,  
        vip3Month: false,  
        vip6Month: false,  
        vip12Month: false,  
        groupMentorship: false,  
        oneOnOneMentorship: false,  
    });  

    const [showModal, setShowModal] = useState(false);  
    const [showCodeModal, setShowCodeModal] = useState(false);  
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);  
    const [code, setCode] = useState('');  

    const handleCheckboxChange = (key: keyof typeof checkboxes) => (event: React.ChangeEvent<HTMLInputElement>) => {  
        setCheckboxes({  
            ...checkboxes,  
            [key]: event.target.checked,  
        });  
    };  

    const handleProceed = () => {  
        const selected = Object.entries(checkboxes)  
            .filter(([, isChecked]) => isChecked)  
            .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim()); // Format keys to be more readable  

        if (selected.length === 0) {  
            alert("Please select at least one option.");  
            return;  
        }  

        setSelectedOptions(selected);  
        setShowModal(true);  
    };   
    
    const generateCoupon = async (selectedOptions: string[], adminUserId: number,userId:number) => {
        try {
          const res = await fetch("/api/coupon/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ selectedOptions, adminUserId,userId }),
          });
      
          const data = await res.json();
      
          if (!res.ok) throw new Error(data.error || "Failed to generate coupon");
      
          console.log("Coupon code generated:", data.couponCode);
          
        setCode(data.couponCode);  
        setShowCodeModal(true); // Show the code modal  
        //   return data.couponCode;
        } catch (error) {
          console.error("Error generating coupon:", error);
          alert("Failed to generate coupon.");
          return null;
        }
      };
      
      const handleGenerateClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
      
        const selected = Object.entries(checkboxes)
          .filter(([, isChecked]) => isChecked)
          .map(([key]) => key);
      
        if (selected.length === 0) {
          alert("Please select at least one option.");
          return;
        }
      
        const adminUserId = Number(process.env.NEXT_PUBLIC_USER_ID); // Or pass it as prop/state
        await generateCoupon(selected, adminUserId,user?.id);
      };
      
    const closeModal = () => {  
        setShowModal(false);  
        setSelectedOptions([]);  
        setCode('');  
        setCheckboxes({  
            vip1Month: false,  
            vip3Month: false,  
            vip6Month: false,  
            vip12Month: false,  
            groupMentorship: false,  
            oneOnOneMentorship: false,  
        });  
    };  
    
    const closeCodeModal = () => {  
        setShowCodeModal(false); 
        setShowModal(false);  
        setSelectedOptions([]);  
        setCode('');  
        setCheckboxes({  
            vip1Month: false,  
            vip3Month: false,  
            vip6Month: false,  
            vip12Month: false,  
            groupMentorship: false,  
            oneOnOneMentorship: false,  
        });   
    };  

    return (  
        <div>  
            <div className="subsc-table pack-table act">  
                <div className="barcharts">  
                    <div className="proff">  
                        <h3>Gift Coupon</h3>  
                        <div className="selection gift">  
                            <p>Select multiple options for combo gifting</p>  
                            <div className="select">  
                            {Object.keys(checkboxes).map((key) => (  
                                <label key={key}>  
                                    <input  
                                        type="checkbox"  
                                        checked={checkboxes[key as keyof typeof checkboxes]}  
                                        onChange={handleCheckboxChange(key as keyof typeof checkboxes)}  
                                    />  
                                    {key.replace(/([A-Z])/g, ' $1').trim()}  
                                </label>  
                            ))}  
                            </div>  
                        </div>  

                        <div className="app-btns">  
                            <button className="a-btn" onClick={handleProceed}>Proceed</button>  
                            <button onClick={closeModal}>Cancel</button>  
                        </div>  
                    </div>  
                </div>  
            </div>  

            {showModal && (  
                <div className="modal">  
                    <div className="modal-content">  
                        <h2>You have successfully selected:</h2>  
                        <ul>  
                            {selectedOptions.map(option => (  
                                <li key={option}>{option}</li>  
                            ))}  
                        </ul>  
                        <button onClick={handleGenerateClick}>Generate Code</button>  
                        <button onClick={closeModal}>Cancel</button>  
                    </div>  
                </div>  
            )}  
            
            {showCodeModal && (  
                <div className="modal">  
                    <div className="modal-content">  
                        <h2>Your generated code is:</h2>  
                        <p style={{color:'green'}}>{code}</p>  
                        <button onClick={closeCodeModal}>Ok</button>  
                    </div>  
                </div>  
            )}  
        </div>  
    );  
};  

export default memo(GiftCoupon);