"use client";

import { memo, FC } from "react";
import Link from "next/link";
import { MdArrowBackIos } from "react-icons/md";
import Header from "src/components/Header";
import { useTheme } from "@/app/context/ThemeContext";


interface ToggleSwitchProps {
  label: string;
  isActive: boolean;
  onToggle: () => void;
}

const ToggleSwitch: FC<ToggleSwitchProps> = ({ label, isActive, onToggle }) => {
  return (
    <div className="s-l">
      <div>
        <p>{label}</p>
      </div>
      <div
        className={`toggle ${isActive ? "active" : ""}`}
        onClick={onToggle}
      >
        <div className="toggle-handle" />
      </div>
    </div>
  );
};

const Theme: FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <main>
      <Header />
      <div className="top-nav">
        <div>
          <Link href="/settings">
            <MdArrowBackIos className="t-i" />
          </Link>
          <p>Theme</p>
        </div>
      </div>

      <div className="subsc-table pack-table act">
        <div className="barcharts">
          <div className="proff">
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
          </div>
        </div>
      </div>
    </main>
  );
};

export default memo(Theme);