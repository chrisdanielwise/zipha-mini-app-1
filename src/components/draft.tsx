
"use client";
import { useState, useEffect, useRef, useMemo, memo } from "react";
import AdminHeader from "./adminheader";
import { IoIosArrowDown } from "react-icons/io";

const Settings = () => {
  const [drop, setDrop] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const options = ["King FTP", "Greysuit FX", "All Merchants"];
  const [selectedOption, setSelectedOption] = useState("All Merchants");
  const [modalOpen, setModalOpen] = useState(false);
  const [merchantName, setMerchantName] = useState("");

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Memoize filtered options
  const filteredOptions = useMemo(() => {
    return options.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, options]);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle dropdown toggle
  const handleDrop = () => {
    setDrop(prev => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDrop(false);
    }
  };

  // Add event listener when the component mounts, and remove when it unmounts
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle AdminHeader search
  const handleAdminSearch = (search: string) => {
    console.log("Admin Search Term:", search);
  };

  // Handle modal actions
  const handleCreateClick = () => {
    setModalOpen(true);
  };

  const handleAddMerchant = () => {
    if (merchantName.trim()) {
      console.log("New Merchant Name:", merchantName);
      setMerchantName(""); // Clear input
      setModalOpen(false); // Close modal
    }
  };

  // Dropdown rendering
  const renderDropdown = () => {
    return (
      <div className="dropdown" ref={dropdownRef}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          style={{
            width: "100%",
            padding: "5px",
            boxSizing: "border-box",
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginBottom: "5px",
            color: '#000'
          }}
        />
        <ul style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          border: "1px solid #ccc",
          borderRadius: "5px",
          overflowY: "auto",
        }}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                style={{
                  padding: "5px",
                  borderBottom: "1px solid #f0f0f0",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedOption(option);
                  setDrop(false);
                }}
              >
                {option}
              </li>
            ))
          ) : (
            <li style={{
              padding: "10px",
              color: "#999",
              textAlign: "center",
            }}>
              No results found
            </li>
          )}
        </ul>
      </div>
    );
  };

  return (
    <main>
      <AdminHeader onSearch={handleAdminSearch} />
      <div className="settings">
        <h6>Settings</h6>
        <div className="sets">
          <div className="all-s">
            <h4>{selectedOption}</h4>
            <div className="colored">
              < IoIosArrowDown className="c-i" onClick={handleDrop} />
              {drop && renderDropdown()}
            </div>
          </div>

          <button className="create" onClick={handleCreateClick}>
            Create new+
          </button>
        </div>

        {/* MODAL */}
        {modalOpen && (
          <div className="modal s-modal">
            <div className="modal-content">
              <h2>Add New Merchant</h2>
              <form>
                <label>
                  Merchant Name:
                  <input
                    type="text"
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    placeholder="Enter merchant name"
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
                    onClick={handleAddMerchant}
                    className="text-[#a677e8]"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="sets">
          <select name="" id="">
            <option value="">Language</option>
            <option value="">English</option>
          </select>
        </div>

        <div className="sets">
          <select name="" id="">
            <option value="">Notification Preference</option>
            <option value="">English</option>
          </select>
        </div>

        <div className="sets">
          <h3>Naira Price</h3>
          <div className="btns">
            <button style={{ backgroundColor: '#a677e8' }}>Add</button>
            <button>Remove</button>
          </div>
        </div>

        <h2>VIP Default Price</h2>

        <div className="sets">
          <h3>One Month</h3>
          <div className="btns">
            <button style={{ backgroundColor: '#a677e8' }}>Add</button>
            <button>Remove</button>
          </div>
        </div>

        <div className="sets">
          <h3>Three Months</h3>
          <div className="btns">
            <button style={{ backgroundColor: '#a677e8' }}>Add</button>
            <button>Remove</button>
          </div>
        </div>

        <div className="sets">
          <h3>Six Months</h3>
          <div className="btns">
            <button style={{ backgroundColor: '#a677e8' }}>Add</button>
            <button>Remove</button>
          </div>
        </div>

        <div className="sets">
          <h3>One Year</h3>
          <div className="btns">
            <button style={{ backgroundColor: '#a677e8' }}>Add</button>
            <button>Remove</button>
          </div>
        </div>

        <h2>VIP Discount Price</h2>

        <div className="sets">
          <h3>One Month</h3>
          <div className="btns">
            <button style={{ backgroundColor: '#a677e8' }}>Add</button>
            <button>Remove</button>
          </div>
        </div>

        <div className="sets">
          <h3>Three Months</h3>
          <div className="btns">
            <button style={{ backgroundColor: '#a677e8' }}>Add</button>
            <button>Remove</button>
          </div>
        </div>

        <div className="sets">
          <h3>Six Months</h3>
          <div className="btns">
            <button style={{ backgroundColor: '#a677e8' }}>Add</button>
            <button>Remove</button>
          </div>
        </div>

        <div className="sets">
          <h3>One Year</h3>
          <div className="btns">
            <button style={{ backgroundColor: '#a677e8' }}>Add</button>
            <button>Remove</button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default memo(Settings)