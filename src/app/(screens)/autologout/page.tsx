"use client";

import { useState, memo } from "react";
import Header from "../../../components/Header";
import Link from "next/link";
import { MdArrowBackIos } from "react-icons/md";

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
    <main>
      <Header />
      <div className="top-nav">
        <div>
          <Link href="/settings">
            <MdArrowBackIos className="t-i" />
          </Link>
          <p>Auto-LogOut Settings</p>
        </div>
      </div>

      {settingsOptions.map(({ key, title, description }) => (
        <div className="subsc-table pack-table act" key={key}>
          <div className="barcharts">
            <div className="proff">
              <div className="s-l">
                <div className="sl-auto">
                  <p>{title}</p>
                  <p className="p">{description}</p>
                </div>
                <input
                  type="checkbox"
                  id={key}
                  checked={settings[key]}
                  onChange={() => handleToggle(key)}
                  className="check-it"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
};

export default memo(AutoLogout);