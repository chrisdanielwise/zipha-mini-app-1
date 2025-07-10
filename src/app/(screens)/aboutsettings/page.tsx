"use client";

import { memo } from "react";
import Link from "next/link";
import { MdKeyboardArrowRight, MdArrowBackIos } from "react-icons/md";
import Card from "../../../components/ui/Card";

const AboutSettings = () => {
  return (
    <div className="flex flex-col gap-8 mt-4 max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/settings">
          <MdArrowBackIos className="text-2xl text-water-dark hover:text-water-light transition" />
        </Link>
        <span className="text-2xl font-bold text-water-dark">About</span>
      </div>
      <Card className="flex flex-col gap-2 p-6">
        <h1 className="text-lg font-semibold text-water-dark mb-2">Zipha Version 7.20</h1>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-water-light rounded-xl px-3 transition">
            <span className="text-water-dark text-base">Terms & Conditions</span>
            <MdKeyboardArrowRight className="text-2xl text-water-dark/60" />
          </div>
          <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-water-light rounded-xl px-3 transition">
            <span className="text-water-dark text-base">Privacy Policy</span>
            <MdKeyboardArrowRight className="text-2xl text-water-dark/60" />
          </div>
          <a href="https://t.me/your_bot_username" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between py-2 cursor-pointer hover:bg-water-light rounded-xl px-3 transition">
            <span className="text-water-dark text-base">Version Upgrade</span>
            <MdKeyboardArrowRight className="text-2xl text-water-dark/60" />
          </a>
        </div>
      </Card>
    </div>
  );
};

export default memo(AboutSettings);