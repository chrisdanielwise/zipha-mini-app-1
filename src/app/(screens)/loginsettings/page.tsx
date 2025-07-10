"use client";

import { useState, memo } from "react";
import Link from "next/link";
import { MdArrowBackIos, MdKeyboardArrowRight } from "react-icons/md";
import Card from "../../../components/ui/Card";

const LoginSettings = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);

    const openModal = (content: React.ReactNode) => {
        setModalContent(content);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalContent(null);
    };

    return (
        <div className="flex flex-col gap-8 mt-4 max-w-xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
                <Link href='/settings'>
                    <MdArrowBackIos className="text-2xl text-water-dark hover:text-water-light transition" />
                </Link>
                <span className="text-2xl font-bold text-water-dark">Login Settings</span>
            </div>
            <Card className="flex flex-col gap-2 p-6">
                <h2 className="text-lg font-semibold text-water-dark mb-2">Password</h2>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-water-light rounded-xl px-3 transition" onClick={() => openModal(<ChangePasswordForm closeModal={closeModal} />)}>
                        <span className="text-water-dark text-base">Change Password</span>
                        <MdKeyboardArrowRight className="text-2xl text-water-dark/60" />
                    </div>
                    <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-water-light rounded-xl px-3 transition" onClick={() => openModal(<ForgotPasswordForm closeModal={closeModal} />)}>
                        <span className="text-water-dark text-base">Forgot Password</span>
                        <MdKeyboardArrowRight className="text-2xl text-water-dark/60" />
                    </div>
                    <Link href='/autologout' className="flex items-center justify-between py-2 hover:bg-water-light rounded-xl px-3 transition">
                        <span className="text-water-dark text-base">Auto-logout settings</span>
                        <MdKeyboardArrowRight className="text-2xl text-water-dark/60" />
                    </Link>
                </div>
            </Card>
            <Card className="flex flex-col gap-2 p-6">
                <h2 className="text-lg font-semibold text-water-dark mb-2">Pattern</h2>
                <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-water-light rounded-xl px-3 transition" onClick={() => openModal(<FeatureUnavailable closeModal={closeModal} />)}>
                    <span className="text-water-dark text-base">Set up pattern</span>
                    <MdKeyboardArrowRight className="text-2xl text-water-dark/60" />
                </div>
            </Card>
            <Card className="flex flex-col gap-2 p-6">
                <h2 className="text-lg font-semibold text-water-dark mb-2">Biometrics</h2>
                <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-water-light rounded-xl px-3 transition" onClick={() => openModal(<FeatureUnavailable closeModal={closeModal} />)}>
                    <span className="text-water-dark text-base">Login with fingerprint</span>
                    <MdKeyboardArrowRight className="text-2xl text-water-dark/60" />
                </div>
            </Card>
            {/* Lightweight modal confirmation */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="rounded-3xl bg-glass-gradient shadow-water backdrop-blur-lg border border-white/30 p-8 min-w-[320px] max-w-[90vw] flex flex-col items-center">
                        {modalContent}
                        <button className="mt-4 px-4 py-2 rounded-xl bg-water-light text-water-dark font-semibold hover:bg-water-dark hover:text-white transition" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// 🔹 Change Password Form
const ChangePasswordForm = ({ closeModal }: { closeModal: () => void }) => {
    return (
        <div className="flex flex-col gap-3 w-full">
            <h2 className="text-lg font-bold text-water-dark">Change Password</h2>
            <input type="password" placeholder="Current Password" className="rounded-xl border border-water-light px-3 py-2" />
            <input type="password" placeholder="New Password" className="rounded-xl border border-water-light px-3 py-2" />
            <input type="password" placeholder="Confirm Password" className="rounded-xl border border-water-light px-3 py-2" />
            <button className="mt-2 px-4 py-2 rounded-xl bg-water-light text-water-dark font-semibold hover:bg-water-dark hover:text-white transition">Change Password</button>
        </div>
    );
};

// 🔹 Forgot Password Form
const ForgotPasswordForm = ({ closeModal }: { closeModal: () => void }) => {
    return (
        <div className="flex flex-col gap-3 w-full">
            <h2 className="text-lg font-bold text-water-dark">Forgot Password</h2>
            <input type="email" placeholder="Enter your email" className="rounded-xl border border-water-light px-3 py-2" />
            <button className="mt-2 px-4 py-2 rounded-xl bg-water-light text-water-dark font-semibold hover:bg-water-dark hover:text-white transition">Reset Password</button>
        </div>
    );
};

// 🔹 Feature Unavailable Alert
const FeatureUnavailable = ({ closeModal }: { closeModal: () => void }) => {
    return (
        <div className="flex flex-col gap-2 w-full items-center">
            <h2 className="text-lg font-bold text-water-dark">Coming Soon</h2>
            <p className="text-water-dark/80">This feature will be available in version 2.</p>
        </div>
    );
};

export default memo(LoginSettings);