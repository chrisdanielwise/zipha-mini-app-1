"use client";

import { useState, memo, useEffect } from "react";
import Header from "../../../components/Header";
import GiftCoupon from "../../../components/GiftCoupon";
import { useAuth } from "@/app/context/AuthContext";
/**
 * Action page – lets an admin:
 *  • pick discount levels
 *  • choose which services the discount applies to
 *  • update the NGN ↔ USD rate (“nairaPrice”) in the settings collection
*/
const Action = () => {
  /* ─────────────────────── Checkbox / radio state ─────────────────────── */
  const { user } = useAuth();
  const userId = user?.id
 
  
  // console.log(nairaPrice)
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

  /* ─────────────────────────── UI markup ─────────────────────────────── */

  return (
    <main>
      <Header />
      <h1 className="action">Action </h1>

      {/* ───── Discount section ───── */}
      <div className="subsc-table pack-table act">
        <div className="barcharts">
          <div className="proff">
            <h3>Discount Prices</h3>

            {/* Radio buttons – choose % off */}
            <div className="discount">
              {["10%", "20%", "30%", "40%", "50%"].map((percent) => (
                <label key={percent}>
                  <input
                    type="radio"
                    name="discount"
                    value={percent}
                    checked={selectedDiscount === percent}
                    onChange={handleRadioChange}
                  />
                  <div className="off">{percent} off</div>
                </label>
              ))}
              <label>
                <input
                  type="radio"
                  name="discount"
                  value="reset"
                  checked={selectedDiscount === "reset"}
                  onChange={handleRadioChange}
                />
                <div className="off">Reset All</div>
              </label>
            </div>

            {/* Example extra component (already imported) */}
            {/* <GiftCoupon /> */}

            {/* Service dropdown */}
            <div className="action-services">
              <h4>Services</h4>
              <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="Vip Signal">Vip Signal</option>
                  <option value="1-on-1 Mentorship">1-on-1 Mentorship</option>
                  <option value="Group Mentorship">Group Mentorship</option>
                </select>

            </div>

            {/* Checkboxes */}
            <div className="selection"> 
              <h6>Select Services</h6>
              <div className="select">
              {
                (selectedService === "Vip Signal" || selectedService === "all") && (
                  <label>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                    />
                    Select All
                  </label>
                )
              }
                {Object.entries(checkboxes)
                  .filter(([key]) => {
                    if (selectedService === "all") return true;
                    if (selectedService === "Vip Signal") return key.startsWith("vip");
                    if (selectedService === "1-on-1 Mentorship")
                      return key === "oneOnOneMentorship";
                    if(selectedService === "Group Mentorship") return key === "groupMentorship" 
                    return false;
                  })
                  .map(([key, value]) => (
                    <label key={key}>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={handleCheckboxChange(key as any)}
                      />
                      {key
                        .replace(/vip(\d+)Month/, "VIP $1 Month")
                        .replace("groupMentorship", "Group Mentorship")
                        .replace("oneOnOneMentorship", "1-on-1 Mentorship")}
                    </label>
                ))}

              </div>
            </div>

            {/* Action buttons */}
            <div className="app-btns">
              <button className="a-btn" onClick={handleApprove}>
                Approve
              </button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>{modalMessage}</p>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}

      {/* ───── NGN Rate section ───── */}
      <div className="subsc-table pack-table act">
        <div className="barcharts">
          <div className="proff">
            <h3>Naira Rate</h3>

            <div className="current">
              <b>Current Rate</b>
              <div className="rate">
                <span>₦{nairaPrice}</span>
              </div>
              <b>to $1</b>
            </div>

            <div className="current">
              <b>Rate Update</b>
              <div className="rate">
                <span>₦</span>
                <input
                  type="text"
                  value={inputRate}
                  onChange={handleRateChange}
                />
              </div>
              <button onClick={handleSaveRate}>Save</button>
            </div>
          </div>
        </div>
      </div>
     <GiftCoupon/>
    </main>
  );
};

export default memo(Action);