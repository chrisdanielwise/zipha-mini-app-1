"use client";

import { useState, memo } from "react";
import Link from "next/link";
import { MdArrowBackIos, MdShowChart, MdAttachMoney, MdAnalytics, MdPeople } from "react-icons/md";
import Card from "../../../components/ui/Card";

interface ToggleSwitchProps {
    label: string;
    icon: React.ReactElement;
    isActive: boolean;
    onToggle: (active: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, icon, isActive, onToggle }) => {
    return (
        <div
            className={`flex items-center justify-between mb-4 p-4 rounded-2xl shadow-water bg-glass-gradient backdrop-blur-lg transition-all duration-200 cursor-pointer select-none border border-white/30 hover:shadow-lg`}
            onClick={() => onToggle(!isActive)}
        >
            <div className="flex items-center gap-3">
                <span className="text-2xl text-water-dark bg-white/40 rounded-full p-2 shadow-water">{icon}</span>
                <span className="font-medium text-water-dark text-base drop-shadow-sm">{label}</span>
            </div>
            <button
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${isActive ? "bg-water-dark" : "bg-water-light"}`}
                aria-pressed={isActive}
                tabIndex={0}
            >
                <span
                    className={`absolute left-1 top-1 w-5 h-5 rounded-full bg-white shadow-water transition-transform duration-200 ${isActive ? "translate-x-5" : "translate-x-0"}`}
                />
            </button>
        </div>
    );
};

const DashboardSettings = () => {
    const [showRevenue, setShowRevenue] = useState(false);
    const [showProfit, setShowProfit] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [showSocialMedia, setShowSocialMedia] = useState(false);

    return (
        <div className="flex flex-col gap-8 mt-4 max-w-xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
                <Link href='/settings' className="inline-flex items-center justify-center rounded-full bg-glass p-2 shadow-water hover:bg-water-light transition">
                    <MdArrowBackIos className="text-xl text-water-dark" />
                </Link>
                <h1 className="text-2xl font-bold text-water-dark drop-shadow-sm">Dashboard Settings</h1>
            </div>
            <Card className="flex flex-col gap-4 p-6">
                <ToggleSwitch
                    label="Show Revenue"
                    icon={<MdAttachMoney />}
                    isActive={showRevenue}
                    onToggle={setShowRevenue}
                />
                <ToggleSwitch
                    label="Show Profit"
                    icon={<MdShowChart />}
                    isActive={showProfit}
                    onToggle={setShowProfit}
                />
                <ToggleSwitch
                    label="Show Analytics"
                    icon={<MdAnalytics />}
                    isActive={showAnalytics}
                    onToggle={setShowAnalytics}
                />
                <ToggleSwitch
                    label="Show Social Media Account"
                    icon={<MdPeople />}
                    isActive={showSocialMedia}
                    onToggle={setShowSocialMedia}
                />
            </Card>
        </div>
    );
};

export default memo(DashboardSettings);
