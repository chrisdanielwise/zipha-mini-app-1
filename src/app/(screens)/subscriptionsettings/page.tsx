"use client";

import { useState, memo, FC } from "react";
import Link from "next/link";
import { MdArrowBackIos } from "react-icons/md";
import Card from "../../../components/ui/Card";

interface ToggleSwitchProps {
  label: string;
}

const ToggleSwitch: FC<ToggleSwitchProps> = ({ label }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="flex items-center justify-between w-full py-2">
      <span className="text-water-dark text-base font-medium">{label}</span>
      <button
        className={`w-12 h-6 rounded-full transition-colors duration-300 flex items-center px-1 ${isActive ? "bg-water-light" : "bg-gray-300"}`}
        onClick={() => setIsActive(!isActive)}
        aria-pressed={isActive}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white shadow-water transition-transform duration-300 ${isActive ? "translate-x-6" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
};

const SubscriptionSettings: FC = () => {
  return (
    <div className="flex flex-col gap-8 mt-4 max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/settings">
          <MdArrowBackIos className="text-2xl text-water-dark hover:text-water-light transition" />
        </Link>
        <span className="text-2xl font-bold text-water-dark">Subscription</span>
      </div>
      <Card className="flex flex-col gap-4 p-6">
        <ToggleSwitch label="Pause all subscription" />
        <ToggleSwitch label="Activate all subscription" />
      </Card>
    </div>
  );
};

export default memo(SubscriptionSettings);