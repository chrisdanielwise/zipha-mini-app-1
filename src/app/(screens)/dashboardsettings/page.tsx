"use client";

import { useState, memo } from "react";
import Header from "../../../components/Header";
import Link from "next/link";
import { MdArrowBackIos } from "react-icons/md";

interface ToggleSwitchProps {
    label: string;
    isActive: boolean;
    onToggle: (active: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, isActive, onToggle }) => {
    return (
        <div className="s-l">
            <div>
                <p>{label}</p>
            </div>
            <div 
                className={`toggle ${isActive ? "active" : ""}`} 
                onClick={() => onToggle(!isActive)}
            >
                <div className="toggle-handle"></div>
            </div>
        </div>
    );
};

const DashboardSettings = () => {
    const [showRevenue, setShowRevenue] = useState(false);
    const [showProfit, setShowProfit] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [showSocialMedia, setShowSocialMedia] = useState(false);

    return (
        <main>
            <Header />
            <div className="top-nav">
                <div>
                    <Link href='/settings'>
                        <MdArrowBackIos className="t-i"/>
                    </Link>
                    <p>Dashboard Settings</p>
                </div>
            </div>

            <div className="subsc-table pack-table act">
                <div className="barcharts">
                    <div className="proff">
                        <ToggleSwitch 
                            label="Show Revenue" 
                            isActive={showRevenue} 
                            onToggle={setShowRevenue} 
                        />
                        <ToggleSwitch 
                            label="Show Profit" 
                            isActive={showProfit} 
                            onToggle={setShowProfit} 
                        />
                        <ToggleSwitch 
                            label="Show Analytics" 
                            isActive={showAnalytics} 
                            onToggle={setShowAnalytics} 
                        />
                        <ToggleSwitch 
                            label="Show Social Media Account" 
                            isActive={showSocialMedia} 
                            onToggle={setShowSocialMedia} 
                        />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default memo(DashboardSettings);
