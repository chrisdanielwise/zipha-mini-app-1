"use client";

import { useState, memo } from "react";
import Link from "next/link";
import { MdArrowBackIos } from "react-icons/md";
import Card from "../../../components/ui/Card";

const AutoLogout = () => {
  const [settings, setSettings] = useState({
    passwordFree: false,
    sixtyMinute: false,
    alwaysPassword: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const settingsOptions = [
    {
      key: "passwordFree",
      title: "Password-Free Login",
      description: "You can log in without entering the password",
    },
    {
      key: "sixtyMinute",
      title: "60-Minute Password-Free Login",
      description:
        "You can log in without entering the password in the next 60 mins",
    },
    {
      key: "alwaysPassword",
      title: "Password Always Needed Login",
      description: "You need to enter password every time you log in",
    },
  ] as const;

  return (
    <div className="flex flex-col gap-8 mt-4 max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/settings">
          <MdArrowBackIos className="text-2xl text-water-dark hover:text-water-light transition" />
        </Link>
        <span className="text-2xl font-bold text-water-dark">Auto-LogOut Settings</span>
      </div>
      {settingsOptions.map(({ key, title, description }) => (
        <Card className="flex items-center justify-between gap-4 p-6" key={key}>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-water-dark">{title}</span>
            <span className="text-water-dark/80 text-sm">{description}</span>
          </div>
          <input
            type="checkbox"
            id={key}
            checked={settings[key]}
            onChange={() => handleToggle(key)}
            className="w-6 h-6 accent-water-light border-water-dark rounded-lg shadow-water focus:ring-2 focus:ring-water-light"
          />
        </Card>
      ))}
    </div>
  );
};

export default memo(AutoLogout);