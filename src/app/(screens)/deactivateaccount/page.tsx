"use client";

import { useState, memo } from "react";
import Header from "../../../components/Header";
import Link from "next/link";
import { MdArrowBackIos } from "react-icons/md";

interface ToggleSwitchProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, isActive, onClick }) => {
    return (
        <div className="s-l">
            <div>
                <p>{label}</p>
            </div>
            <div 
                className={`toggle ${isActive ? "active" : ""}`} 
                onClick={onClick} 
            >
                <div className="toggle-handle"></div>
            </div>
        </div>
    );
};

const DeactivateAccount = () => {
    const [activeOption, setActiveOption] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleToggle = (option: string) => {
        if (activeOption === option) {
            // If already active, deactivate immediately
            setActiveOption(null);
        } else {
            // If activating, show confirmation
            setActiveOption(option);
            setShowConfirmation(true);
        }
    };

    const confirmActivation = () => {
        // Here we assume the account deactivation logic will be implemented
        setShowConfirmation(false);
    };

    return (
        <main>
            <Header />
            <div className="top-nav">
                <div>
                    <Link href='/settings'>
                        <MdArrowBackIos className="t-i"/>
                    </Link>
                    <p>Deactivate Account</p>
                </div>
            </div>

            <div className="subsc-table pack-table act">
                <div className="barcharts">
                    <div className="proff">
                        <ToggleSwitch 
                            label="Temporal Deactivate"
                            isActive={activeOption === "Temporal"}
                            onClick={() => handleToggle("Temporal")}
                        />
                        <ToggleSwitch 
                            label="Permanent Deactivate"
                            isActive={activeOption === "Permanent"}
                            onClick={() => handleToggle("Permanent")}
                        />
                    </div>
                </div>
            </div>

            {/* Confirmation - Lightweight */}
            {showConfirmation && (
                <div className="confirmation-container">
                    <p>Are you sure you want to {activeOption?.toLowerCase()} your account?</p>
                    <div className="confirmation-buttons">
                        <button onClick={() => setShowConfirmation(false)}>Cancel</button>
                        <button onClick={confirmActivation}>Confirm</button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default memo(DeactivateAccount);
