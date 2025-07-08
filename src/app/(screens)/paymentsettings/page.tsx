"use client";

import { memo } from "react";
import Header from "../../../components/Header";
import Link from "next/link";
import { MdArrowBackIos, MdKeyboardArrowRight } from "react-icons/md";

const PaymentSettings = () => {
    return (
        <main>
            <Header />
            <div className="top-nav">
                <div>
                    <Link href='/settings'>
                        <MdArrowBackIos className="t-i" />
                    </Link>
                    <p>Payment Settings</p>
                </div>
            </div>

            <h1 className="sets">Payment Method</h1>
            <div className="subsc-table pack-table act">
                <div className="barcharts">
                    <div className="proff">
                        <div className="s-l">
                            <div>
                                <p>Crypto</p>
                            </div>
                            <MdKeyboardArrowRight className="arr-i" />
                        </div>
                        <div className="s-l">
                            <div>
                                <p>USDT</p>
                            </div>
                            <MdKeyboardArrowRight className="arr-i" />
                        </div>
                        <div className="s-l">
                            <div>
                                <p>BTC</p>
                            </div>
                            <MdKeyboardArrowRight className="arr-i" />
                        </div>
                        <div className="s-l">
                            <div>
                                <p>Ton</p>
                            </div>
                            <MdKeyboardArrowRight className="arr-i" />
                        </div>
                    </div>
                </div>
            </div>

            <h1 className="sets">Foreign Payment</h1>
            <div className="subsc-table pack-table act">
                <div className="barcharts">
                    <div className="proff">
                        <div className="s-l">
                            <div>
                                <p>Tap Tap Send</p>
                            </div>
                            <MdKeyboardArrowRight className="arr-i" />
                        </div>
                        <div className="s-l">
                            <div>
                                <p>Skrill</p>
                            </div>
                            <MdKeyboardArrowRight className="arr-i" />
                        </div>
                        <div className="s-l">
                            <div>
                                <p>PayPal</p>
                            </div>
                            <MdKeyboardArrowRight className="arr-i" />
                        </div>
                    </div>
                </div>
            </div>

            <h1 className="sets">Local Payment</h1>
            <div className="subsc-table pack-table act">
                <div className="barcharts">
                    <div className="proff">
                        <div className="s-l">
                            <div>
                                <p>Naira Payment</p>
                            </div>
                            <MdKeyboardArrowRight className="arr-i" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default memo(PaymentSettings);