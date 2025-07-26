"use client";

import { memo, FC, useState } from "react";
import Link from "next/link";
import { MdArrowBackIos } from "react-icons/md";
import Card from "../../components/ui/Card";
import LayoutWrapper from "../../components/ui/LayoutWrapper";

interface ToggleSwitchProps {
  label: string;
  isActive: boolean;
  onToggle: () => void;
}

const ToggleSwitch: FC<ToggleSwitchProps> = ({ label, isActive, onToggle }) => {
  return (
    <div className="flex items-center justify-between w-full py-3">
      <span className="text-water-dark text-base font-medium">{label}</span>
      <button
        className={`w-12 h-6 rounded-full transition-colors duration-300 flex items-center px-1 ${isActive ? "bg-water-dark" : "bg-gray-300"}`}
        onClick={onToggle}
        aria-pressed={isActive}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white shadow-water transition-transform duration-300 ${isActive ? "translate-x-6" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
};

const ThemePage: FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <LayoutWrapper>
      <div className="flex flex-col gap-4 sm:gap-6 mt-4 w-full max-w-4xl mx-auto pb-8 px-2 sm:px-4">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/settings">
            <MdArrowBackIos className="text-2xl text-water-dark hover:text-water-light transition" />
          </Link>
          <span className="text-2xl font-bold text-water-dark">Theme</span>
        </div>

        <Card className="flex flex-col gap-2 p-6">
          <ToggleSwitch
            label="Dark Mode"
            isActive={theme === "dark"}
            onToggle={() => setTheme("dark")}
          />
          <ToggleSwitch
            label="Light Mode"
            isActive={theme === "light"}
            onToggle={() => setTheme("light")}
          />
        </Card>
      </div>
    </LayoutWrapper>
  );
};

export default memo(ThemePage);