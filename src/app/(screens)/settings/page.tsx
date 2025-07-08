"use client";

import { memo } from "react";
import Header from "../../../components/Header";
import Link from "next/link";
import { RiLoginBoxFill } from "react-icons/ri";
import { MdPayments, MdKeyboardArrowRight, MdDashboard, MdCorporateFare, MdOutlineSignalWifiStatusbar4Bar, MdInfo } from "react-icons/md";
import { IoIosColorPalette, IoMdNotifications } from "react-icons/io";
import { FaMailBulk } from "react-icons/fa";
import { GiUnplugged } from "react-icons/gi";

// Types for Link Props (Optional if you want to type specific properties)
interface LinkProps {
    href: string;
    label: string;
    icon: JSX.Element;
}

const Settings = () => {
    const settingsLinks: LinkProps[] = [
        { href: '/loginsettings', label: 'Login Settings', icon: <RiLoginBoxFill className="sl-i" /> },
        { href: '/paymentsettings', label: 'Payment Settings', icon: <MdPayments className="sl-i" /> },
        { href: '/dashboardsettings', label: 'Dashboard Settings', icon: <MdDashboard className="sl-i" /> },
        { href: '/', label: 'Notification', icon: <IoMdNotifications className="sl-i" /> },
        { href: '/theme', label: 'Themes', icon: <IoIosColorPalette className="sl-i" /> },
        { href: '/', label: 'My Company Status', icon: <MdCorporateFare className="sl-i" /> },
        { href: '/', label: 'Bulk Message', icon: <FaMailBulk className="sl-i" /> },
        { href: '/subscriptionsettings', label: 'Subscription Status', icon: <MdOutlineSignalWifiStatusbar4Bar className="sl-i" /> },
        { href: '/deactivateaccount', label: 'Deactivate Account', icon: <GiUnplugged className="sl-i" /> },
        { href: '/aboutsettings', label: 'About', icon: <MdInfo className="sl-i" /> },
    ];

    return (
        <main>
            <Header />
            <h1 className="action">Settings</h1>

            {settingsLinks.map((link, index) => (
                <div key={index} className="subsc-table pack-table act">
                    <div className="barcharts">
                        <div className="proff">
                            <Link href={link.href} className="s-l">
                                <div>
                                    {link.icon}
                                    <p>{link.label}</p>
                                </div>
                                <MdKeyboardArrowRight className="arr-i" />
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            <div className="subsc-table pack-table act">
                <div className="barcharts">
                    <div className="proff">
                        <Link href='/aboutsettings' className="s-l">
                            <div>
                                <MdInfo className="sl-i" />
                                <p>About</p>
                            </div>
                            <div>
                                <span>version 7.02</span>
                                <MdKeyboardArrowRight className="arr-i" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default memo(Settings);