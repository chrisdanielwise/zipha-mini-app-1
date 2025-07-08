"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard } from "react-icons/md";
import { PiPolygonBold } from "react-icons/pi";
import { FaSuitcase, FaUsers } from "react-icons/fa";
import { MdOutlineSignalWifi4Bar } from "react-icons/md";
import { TbNetwork } from "react-icons/tb";
import { MdOutlinePayments } from "react-icons/md";
import { BiSolidReport } from "react-icons/bi";
import { IoSettingsSharp } from "react-icons/io5";
import { RiCloseLine } from "react-icons/ri";
import { IoLogOutOutline } from "react-icons/io5";
import Image from "next/image";
import logo from "../app/Assets/unnamed.png"; // Your logo path
import './style.css';

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isSidebarOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();

  const NavLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
    <Link href={href} onClick={toggleSidebar} className={pathname === href ? "each-active each" : "each"}>
      <Icon className="d-i" />
      <h5>{label}</h5>
    </Link>
  );

  return (
    <div className={`side-m ${isSidebarOpen ? "open" : ""}`}>
      <div className="sidebar text-black flex items-center justify-center overflow-y-scroll">
        <div className="side w-[90%] mx-auto h-[95%] flex col">

          <section className="logout">
            {/* <RiCloseLine className="l-i" onClick={toggleSidebar} /> */}
            <h6 className="logg" onClick={toggleSidebar}>
              <IoLogOutOutline className="l-i" />
              <span>Log out</span>
            </h6>
          </section>

          <section className="s-logo">
            <Image src={logo} alt="Logo" />
          </section>

          <div>
            <NavLink href='/' icon={MdDashboard} label='Dashboard' />
            {/* <NavLink href='/onboarding' icon={BiSolidReport} label='Analytics' /> */}
            <NavLink href='/subscribers' icon={FaUsers} label='Subscribers' />
            <NavLink href='/action' icon={FaSuitcase} label='Action' />
            <NavLink href='/service' icon={TbNetwork} label='Services' />
            {/* <NavLink href='/payment' icon={MdOutlinePayments} label='Payment/Invoice' />
            <NavLink href='/services' icon={PiPolygonBold} label='Services' />
            <NavLink href='/finance' icon={FaUsers} label='My Company' /> */}
            <NavLink href='/settings' icon={IoSettingsSharp} label='Settings/Config' />
          </div>

        </div>
      </div>
    </div>
  );
}
