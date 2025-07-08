"use client";

import { useState, memo, FC } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import { MdArrowBackIos } from "react-icons/md";

interface ToggleSwitchProps {
  label: string;
}

const ToggleSwitch: FC<ToggleSwitchProps> = ({ label }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="s-l">
      <div>
        <p>{label}</p>
      </div>
      <div
        className={`toggle ${isActive ? "active" : ""}`}
        onClick={() => setIsActive(!isActive)}
      >
        <div className="toggle-handle" />
      </div>
    </div>
  );
};

const SubscriptionSettings: FC = () => {
  return (
    <main>
      <Header />
      <div className="top-nav">
        <div>
          <Link href="/settings">
            <MdArrowBackIos className="t-i" />
          </Link>
          <p>Subscription</p>
        </div>
      </div>

      <div className="subsc-table pack-table act">
        <div className="barcharts">
          <div className="proff">
            <ToggleSwitch label="Pause all subscription" />
            <ToggleSwitch label="Activate all subscription" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default memo(SubscriptionSettings);