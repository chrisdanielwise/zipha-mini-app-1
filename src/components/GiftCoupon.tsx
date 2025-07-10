"use client";  

import { useState, memo } from "react";  

const GiftCoupon = () => {
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
      
        const adminUserId = Number(process.env.NEXT_PUBLIC_USER_ID) || 1;
        const userId = Math.floor(Math.random() * 1000000); // Generate random user ID for coupon
        await generateCoupon(selected, adminUserId, userId);
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
        <div className="space-y-6">  
            {/* Main Content */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">  
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Select Services</h3>  
                    <p className="text-gray-600 dark:text-gray-300">Choose the services you want to include in this gift coupon</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">  
                    {Object.keys(checkboxes).map((key) => (  
                        <label key={key} className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer transition-all duration-200 hover:shadow-md">
                            <input  
                                type="checkbox"  
                                checked={checkboxes[key as keyof typeof checkboxes]}  
                                onChange={handleCheckboxChange(key as keyof typeof checkboxes)}
                                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />  
                            <span className="ml-3 text-sm font-medium text-gray-800 dark:text-white">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>  
                        </label>  
                    ))}  
                </div>  

                <div className="flex gap-3 justify-center">  
                    <button 
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleProceed}
                        disabled={Object.values(checkboxes).every(v => !v)}
                    >
                        Continue to Generate
                    </button>  
                    <button 
                        onClick={closeModal}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>  
                </div>  
            </div>  

            {/* Confirmation Modal */}
            {showModal && (  
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm">  
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">  
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Confirm Selection</h2>
                            <p className="text-gray-600 dark:text-gray-300">You have selected the following services:</p>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">  
                            <ul className="space-y-2">  
                                {selectedOptions.map(option => (  
                                    <li key={option} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        {option}
                                    </li>  
                                ))}  
                            </ul>  
                        </div>
                        
                        <div className="flex gap-3">  
                            <button 
                                onClick={handleGenerateClick}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all duration-200 shadow-sm"
                            >
                                Generate Coupon Code
                            </button>  
                            <button 
                                onClick={closeModal}
                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Back
                            </button>  
                        </div>  
                    </div>  
                </div>  
            )}  
            
            {/* Success Modal */}
            {showCodeModal && (  
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm">  
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">  
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Coupon Generated!</h2>
                            <p className="text-gray-600 dark:text-gray-300">Your gift coupon code is ready</p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 mb-6 border border-green-200 dark:border-green-800">  
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Coupon Code:</p>
                            <p className="font-mono text-2xl font-bold text-green-600 dark:text-green-400 text-center tracking-wider">
                                {code}
                            </p>  
                        </div>
                        
                        <button 
                            onClick={closeCodeModal}
                            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 shadow-sm"
                        >
                            Done
                        </button>  
                    </div>  
                </div>  
            )}  
        </div>  
    );  
};  

export default memo(GiftCoupon);