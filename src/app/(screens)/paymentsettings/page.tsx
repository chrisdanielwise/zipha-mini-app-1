"use client";

import { memo } from "react";
import Link from "next/link";
import { MdArrowBackIos, MdKeyboardArrowRight } from "react-icons/md";
import Card from "../../../components/ui/Card";

const PaymentSettings = () => {
    return (
        <div className="flex flex-col gap-8 mt-4 max-w-xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
                <Link href='/settings'>
                    <MdArrowBackIos className="text-2xl text-water-dark hover:text-water-light transition" />
                </Link>
                <span className="text-2xl font-bold text-water-dark">Payment Settings</span>
            </div>
            <Card className="flex flex-col gap-2 p-6">
                <h2 className="text-lg font-semibold text-water-dark mb-2">Payment Method</h2>
                {["Crypto", "USDT", "BTC", "Ton"].map((method) => (
                    <div key={method} className="flex items-center justify-between py-2 cursor-pointer hover:bg-water-light rounded-xl px-3 transition">
                        <span className="text-water-dark text-base">{method}</span>
                        <MdKeyboardArrowRight className="text-2xl text-water-dark/60" />
                    </div>
                ))}
            </Card>
            <Card className="flex flex-col gap-2 p-6">
                <h2 className="text-lg font-semibold text-water-dark mb-2">Foreign Payment</h2>
                {["Tap Tap Send", "Skrill", "PayPal"].map((method) => (
                    <div key={method} className="flex items-center justify-between py-2 cursor-pointer hover:bg-water-light rounded-xl px-3 transition">
                        <span className="text-water-dark text-base">{method}</span>
                        <MdKeyboardArrowRight className="text-2xl text-water-dark/60" />
                    </div>
                ))}
            </Card>
            <Card className="flex flex-col gap-2 p-6">
                <h2 className="text-lg font-semibold text-water-dark mb-2">Local Payment</h2>
                {["Naira Payment"].map((method) => (
                    <div key={method} className="flex items-center justify-between py-2 cursor-pointer hover:bg-water-light rounded-xl px-3 transition">
                        <span className="text-water-dark text-base">{method}</span>
                        <MdKeyboardArrowRight className="text-2xl text-water-dark/60" />
                    </div>
                ))}
            </Card>
        </div>
    );
};

export default memo(PaymentSettings);