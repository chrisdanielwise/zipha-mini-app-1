"use client";

import { useState, memo } from "react";
import Header from "../../../components/Header";
import Link from "next/link";
import { MdArrowBackIos, MdKeyboardArrowRight } from "react-icons/md";

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
        <main>
            <Header />
            <div className="top-nav">
                <div>
                    <Link href='/settings'>
                        <MdArrowBackIos className="t-i" />
                    </Link>
                    <p>Login Settings</p>
                </div>
            </div>

            <section>
                <h1 className="sets">Password</h1>
                <div className="subsc-table pack-table act">
                    <div className="barcharts">
                        <div className="proff">
                            <div className="s-l" onClick={() => openModal(<ChangePasswordForm closeModal={closeModal} />)}>
                                <p>Change Password</p>
                                <MdKeyboardArrowRight className="arr-i" />
                            </div>
                            <div className="s-l" onClick={() => openModal(<ForgotPasswordForm closeModal={closeModal} />)}>
                                <p>Forgot Password</p>
                                <MdKeyboardArrowRight className="arr-i" />
                            </div>
                            <Link href='/autologout' className="s-l">
                                <div>
                                    <p>Auto-logout settings</p>
                                </div>
                                <MdKeyboardArrowRight className="arr-i" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h1 className="sets">Pattern</h1>
                <div className="subsc-table pack-table act">
                    <div className="barcharts">
                        <div className="proff">
                            <div className="s-l" onClick={() => openModal(<FeatureUnavailable closeModal={closeModal} />)}>
                                <p>Set up pattern</p>
                                <MdKeyboardArrowRight className="arr-i" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h1 className="sets">Biometrics</h1>
                <div className="subsc-table pack-table act">
                    <div className="barcharts">
                        <div className="proff">
                            <div className="s-l" onClick={() => openModal(<FeatureUnavailable closeModal={closeModal} />)}>
                                <p>Login with fingerprint</p>
                                <MdKeyboardArrowRight className="arr-i" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lightweight modal confirmation */}
            {showModal && (
                <div className="confirmation-container">
                    <div className="modal-content">
                        {modalContent}
                        <button className="modal-close-btn" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </main>
    );
};

// 🔹 Change Password Form
const ChangePasswordForm = ({ closeModal }: { closeModal: () => void }) => {
    return (
        <div>
            <h2>Change Password</h2>
            <input type="password" placeholder="Current Password" />
            <input type="password" placeholder="New Password" />
            <input type="password" placeholder="Confirm Password" />
            <button className="submit-btn">Change Password</button>
        </div>
    );
};

// 🔹 Forgot Password Form
const ForgotPasswordForm = ({ closeModal }: { closeModal: () => void }) => {
    return (
        <div>
            <h2>Forgot Password</h2>
            <input type="email" placeholder="Enter your email" />
            <button className="submit-btn">Reset Password</button>
        </div>
    );
};

// 🔹 Feature Unavailable Alert
const FeatureUnavailable = ({ closeModal }: { closeModal: () => void }) => {
    return (
        <div>
            <h2>Coming Soon</h2>
            <p>This feature will be available in version 2.</p>
        </div>
    );
};

export default memo(LoginSettings);