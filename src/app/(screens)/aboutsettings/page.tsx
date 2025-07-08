"use client";

import { useState, memo } from "react";
import Header from "../../../components/Header";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdArrowBackIos } from "react-icons/md";

const AboutSettings = () => {
  return (
    <main>
      <Header />
      <div className="top-nav">
        <div>
          <Link href="/settings">
            <MdArrowBackIos className="t-i" />
          </Link>
          <p>About</p>
        </div>
      </div>
      <h1 className="sets">Zipha Version 7.20</h1>

      <div className="subsc-table pack-table act">
        <div className="barcharts">
          <div className="proff">
            <div className="s-l">
              <div>
                <p>Terms & Conditions</p>
              </div>
              <MdKeyboardArrowRight className="arr-i" />
            </div>

            <div className="s-l">
              <div>
                <p>Privacy Policy</p>
              </div>
              <MdKeyboardArrowRight className="arr-i" />
            </div>

            {/* 👉 Updated Version Upgrade block to link to Telegram */}
            <a href="https://t.me/your_bot_username" target="_blank" rel="noopener noreferrer" className="s-l">
              <div>
                <p>Version Upgrade</p>
              </div>
              <MdKeyboardArrowRight className="arr-i" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default memo(AboutSettings);