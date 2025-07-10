"use client";

import { useState, memo } from "react";
import Link from "next/link";
import { MdArrowBackIos } from "react-icons/md";
import Card from "../../../components/ui/Card";

interface ToggleSwitchProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, isActive, onClick }) => {
    return (
        <div className="flex items-center justify-between w-full py-3">
            <span className="text-water-dark text-base font-medium">{label}</span>
            <button
                className={`w-12 h-6 rounded-full transition-colors duration-300 flex items-center px-1 ${isActive ? "bg-red-500" : "bg-gray-300"}`}
                onClick={onClick}
                aria-pressed={isActive}
            >
                <span
                    className={`h-5 w-5 rounded-full bg-white shadow-water transition-transform duration-300 ${isActive ? "translate-x-6" : "translate-x-0"}`}
                />
            </button>
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
        <div className="flex flex-col gap-8 mt-4 max-w-xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
                <Link href='/settings'>
                    <MdArrowBackIos className="text-2xl text-water-dark hover:text-water-light transition"/>
                </Link>
                <span className="text-2xl font-bold text-water-dark">Deactivate Account</span>
            </div>

            <Card className="flex flex-col gap-2 p-6">
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
            </Card>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="rounded-3xl bg-glass-gradient shadow-water backdrop-blur-lg border border-white/30 p-8 min-w-[320px] max-w-[90vw] flex flex-col items-center">
                        <h2 className="text-lg font-bold text-water-dark mb-4">Confirm Deactivation</h2>
                        <p className="text-water-dark/80 mb-6 text-center">
                            Are you sure you want to {activeOption?.toLowerCase()} your account?
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowConfirmation(false)}
                                className="px-4 py-2 rounded-xl bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmActivation}
                                className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(DeactivateAccount);
