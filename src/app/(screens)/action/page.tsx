"use client";

import { useState, memo, useEffect } from "react";
import GiftCoupon from "../../../components/GiftCoupon";
import Card from "../../../components/ui/Card";

/**
 * Action page – lets an admin:
 *  • pick discount levels
 *  • choose which services the discount applies to
 *  • update the NGN ↔ USD rate ("nairaPrice") in the settings collection
*/
const Action = () => {
  /* ─────────────────────── Checkbox / radio state ─────────────────────── */
  const userId = 1; // TODO: Replace with actual user context
 
  const [selectAll, setSelectAll] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    vip1Month: false,
    vip3Month: false,
    vip6Month: false,
    vip12Month: false,
    groupMentorship: false,
    oneOnOneMentorship: false,
  });
  const [selectedDiscount, setSelectedDiscount] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState("all");

  /* ────────────────────────── Modal state ─────────────────────────────── */
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  /* ──────────────────────── Naira-rate state ──────────────────────────── */
  const [nairaPrice, setNairaPrice] = useState<number | null>(null);
  const [inputRate, setInputRate] = useState("");           // text-field value

  /* ─────────────────────────── Helpers ────────────────────────────────── */

  /** POSTs updates to /api/settings/update */
  const updateNairaPrice = async (
    userId: number,
    callbackQuery: string,
    newValue: number
  ) => {
    const res = await fetch("/api/subscription/naira-price", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, callbackQuery, newValue }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update setting");
    return data.settings; // latest settings from the server
  };

  useEffect(() => {
    const fetchNairaPrice = async () => {
      try {
        const res = await fetch("/api/subscription/naira-price");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch naira price");
        setNairaPrice(data.nairaPrice); // or adjust depending on your response structure
      } catch (error) {
        console.error("Error fetching naira price:", error);
      }
    };

    fetchNairaPrice();
  }, []); // ✅ empty dependency array ensures it runs once
  /* ───────────────────────── Change handlers ──────────────────────────── */
  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    setCheckboxes({
      vip1Month: isChecked,
      vip3Month: isChecked,
      vip6Month: isChecked,
      vip12Month: isChecked,
      groupMentorship: isChecked,
      oneOnOneMentorship: isChecked,
    });
  };
  
  const handleCheckboxChange =
    (key: keyof typeof checkboxes) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const updated = { ...checkboxes, [key]: e.target.checked };
      setCheckboxes(updated);
      setSelectAll(Object.values(updated).every(Boolean));
    };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedDiscount(value);
    setSelectAll(true);
    setCheckboxes({
      vip1Month: true,
      vip3Month: true,
      vip6Month: true,
      vip12Month: true,
      groupMentorship: true,
      oneOnOneMentorship: true,
    });
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputRate(e.target.value);
  };

  /* ───────────────────────── Action handlers ──────────────────────────── */

  /** Called when the "Save" button beside the rate input is pressed */
  const handleSaveRate = async () => {
    const value:number = parseFloat(inputRate);
    if (isNaN(value)) {
      console.log("Invalid rate input");
      return;
    }
  
    if (!userId) {
      console.error("No user ID found");
      return;
    }
  
    try {
      const updatedSettings = await updateNairaPrice(userId, "nairaPrice", value);
      console.log("Updated settings:", updatedSettings); 
      setNairaPrice(value);
      setInputRate("");
    } catch (err) {
      console.error("Failed to update setting:", err);
    }
  };
  

  /** Approve discount / services combo (only shows modal in this snippet) */
  const handleApprove = async () => {
    console.log("handleApprove triggered"); // add this first
    const isCheckboxSelected = Object.values(checkboxes).includes(true);
    const isRadioSelected = selectedDiscount !== null;
  
    if (!isCheckboxSelected || !isRadioSelected || !userId) {
      setModalMessage("Please select at least one option for discount price and service.");
      setShowModal(true);
      return;
    }
  
    try {
      const discountValue = selectedDiscount === "reset" ? 0 : parseInt(selectedDiscount)/100;
      const applyToAll = selectedService === "all";
  
      console.log("Parsed discount value:", discountValue);
      console.log("Apply to all:", applyToAll);
  
      const targetDurations = applyToAll
        ? ["vip1Month", "vip3Month", "vip6Month", "vip12Month"]
        : Object.entries(checkboxes)
            .filter(([_, isChecked]) => isChecked)
            .map(([key]) => key);
  
      console.log("Target durations:", targetDurations);
  
      const res = await fetch("/api/subscription/discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discount: discountValue,
          applyToAll, // ✅ this was missing!
          targetDurations,
        }),
      });
      console.log("API response status:", res.status);
  
      if (!res.ok) throw new Error("Failed to update discounts");
  
      const data = await res.json();
      console.log("API response data:", data);
  
      setModalMessage("Approved and updated.");
      setShowModal(true);
    } catch (err) {
      console.error("Failed to update discounts:", err);
      setModalMessage("Failed to update discounts.");
      setShowModal(true);
    }
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDiscount(null);
    setCheckboxes({
      vip1Month: false,
      vip3Month: false,
      vip6Month: false,
      vip12Month: false,
      groupMentorship: false,
      oneOnOneMentorship: false,
    });
    setSelectAll(false);
  };

  const handleCancel = () => {
    setSelectedDiscount(null);
    setCheckboxes({
      vip1Month: false,
      vip3Month: false,
      vip6Month: false,
      vip12Month: false,
      groupMentorship: false,
      oneOnOneMentorship: false,
    });
    setSelectAll(false);
  };

  return (
    <div className="flex flex-col gap-8 mt-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-water-dark mb-2">Admin Actions</h1>

      {/* Naira Price Section */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-water-dark mb-4">Naira Price Settings</h2>
        <div className="flex items-center gap-4">
          <span className="text-water-dark/80">Current Rate: {nairaPrice ? `₦${nairaPrice}` : "Loading..."}</span>
          <input
            type="number"
            placeholder="Enter new rate"
            value={inputRate}
            onChange={handleRateChange}
            className="rounded-xl border border-water-light px-3 py-2 flex-1"
          />
          <button
            onClick={handleSaveRate}
            className="px-4 py-2 rounded-xl bg-water-light text-water-dark font-semibold hover:bg-water-dark hover:text-white transition"
          >
            Save Rate
          </button>
        </div>
      </Card>

      {/* Discount Settings */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-water-dark mb-4">Discount Settings</h2>
        
        {/* Discount Options */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-water-dark mb-3">Select Discount Level</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["10", "20", "30", "40", "50", "60", "70", "80", "90", "reset"].map((discount) => (
              <label key={discount} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="discount"
                  value={discount}
                  checked={selectedDiscount === discount}
                  onChange={handleRadioChange}
                  className="w-4 h-4 text-water-dark"
                />
                <span className="text-water-dark">
                  {discount === "reset" ? "Reset" : `${discount}%`}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Service Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-water-dark mb-3">Apply to Services</h3>
          <div className="flex items-center gap-3 mb-3">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAllChange}
              className="w-4 h-4 text-water-dark"
            />
            <span className="text-water-dark font-medium">Select All</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(checkboxes).map(([key, checked]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={handleCheckboxChange(key as keyof typeof checkboxes)}
                  className="w-4 h-4 text-water-dark"
                />
                <span className="text-water-dark">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleApprove}
            className="px-6 py-2 rounded-xl bg-water-dark text-white font-semibold hover:bg-water-light hover:text-water-dark transition"
          >
            Approve
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-2 rounded-xl bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </Card>

      {/* Gift Coupon Section */}
      <Card className="p-6">
        <GiftCoupon />
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="rounded-3xl bg-glass-gradient shadow-water backdrop-blur-lg border border-white/30 p-8 min-w-[320px] max-w-[90vw] flex flex-col items-center">
            <h2 className="text-lg font-bold text-water-dark mb-4">Action Result</h2>
            <p className="text-water-dark/80 mb-6 text-center">{modalMessage}</p>
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 rounded-xl bg-water-light text-water-dark font-semibold hover:bg-water-dark hover:text-white transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Action);