"use client";
import { useState, useEffect, useRef, useMemo,memo } from "react";
import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";
import { FiUser } from "react-icons/fi";
import Sidebar from "./sidebar";

const Header = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    
      // Open the sidebar
  const openSidebar = () => setSidebarOpen(true);
  // Toggle the sidebar (for close button inside sidebar)
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  // Hide Telegram's native buttons on mount
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.MainButton.hide();
      tg.BackButton.hide();
    }
  }, []);

  // Close the Mini App
  const handleClose = () => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) tg.close();
  };
    return (
      <header>
        <nav>
            <div className="menu" onClick={openSidebar}>
                <HiMiniBars3CenterLeft className="h-i" onClick={toggleSidebar}/>
            </div>
            

            <div className="navlists">
                <div className="circ">
                    <IoSearchOutline className="h-i"/>
                </div>

                <div className="circ">
                    <IoMoonOutline className="h-i"/>
                </div>

                <div className="circ">
                    <GoBell className="h-i"/>
                </div>

                <div className="circ">
                    <FiUser className="h-i"/>
                </div>
                {/* Close button for Mini App */}
            </div>
        </nav>

        <div className="sidebarcomponent">
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
        </div>
      </header>
  );
}

export default memo(Header);