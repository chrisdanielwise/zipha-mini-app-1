"use client";

import { useState, useMemo, useEffect, memo } from "react";
import Image from "next/image";
import dp from "@/app/Assets/dp1.jpeg";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import Card from "../../../components/ui/Card";
import GenericTable from "../../../components/table";

interface Subscription {
  id: number;
  service: string;
  amount: string;
  date: string;
  paymentMethod: string;
  duration: string;
}

const renderSubscriptionCells = (row: Subscription) => [
  <td className="user" key="service">{row.service}</td>,
  <td key="amount">{row.amount}</td>,
  <td key="date">{row.date}</td>,
  <td key="paymentMethod">{row.paymentMethod}</td>,
  <td key="duration">{row.duration}</td>,
];

const columns = [
  { id: 'service', label: 'Service' },
  { id: 'amount', label: 'Amount' },
  { id: 'date', label: 'Date' },
  { id: 'paymentMethod', label: 'Pay. Method' },
  { id: 'duration', label: 'Duration' },
];

const UserProfile = () => {
  const [data] = useState<Subscription[]>([
    { id: 1, service: "VIP 1 month", amount: "$2000", date: "02/3/24", paymentMethod: 'USTD', duration: '4 days remaining' },
    { id: 2, service: "Group mentorship", amount: "$1500", date: "02/3/24", paymentMethod: 'BTC', duration: '2 weeks remaining' },
    { id: 3, service: "1-on-1 mentorship", amount: "$3000", date: "02/3/24", paymentMethod: 'BTC', duration: '10 days remaining' },
    { id: 4, service: "VIP 1 month", amount: "$2500", date: "02/3/24", paymentMethod: 'USTD', duration: '3 months remaining' },
    { id: 5, service: "Group mentorship", amount: "$1800", date: "02/3/24", paymentMethod: 'BTC', duration: '1 days remaining' },
    { id: 6, service: "VIP 3 month", amount: "$2200", date: "02/3/24", paymentMethod: 'USTD', duration: '1 week remaining' },
    { id: 7, service: "VIP 6 month", amount: "$2100", date: "02/3/24", paymentMethod: 'USTD', duration: '2 days remaining' },
  ]);

  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const filteredData = useMemo(() => {
    if (filterStatus === null) return data;
    return data.filter(item => item.service === filterStatus);
  }, [data, filterStatus]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (window.Telegram?.WebApp && (window.Telegram.WebApp as any).expand)
    ) {
      (window.Telegram.WebApp as any).expand(); // Ensure full-screen view
    }
  }, []);

  return (
    <div className="flex flex-col gap-8 mt-4 max-w-3xl mx-auto">
      <Card className="flex flex-col items-center gap-4 p-6">
        <h3 className="text-2xl font-bold text-water-dark mb-2">User Profile</h3>
        <div className="flex items-center gap-4">
          <Image src={dp} alt="User DP" className="rounded-full w-20 h-20 object-cover border-4 border-water-light" />
          <div>
            <h4 className="text-xl font-semibold text-water-dark">Lucia John Doe</h4>
            <p className="text-water-dark/80">@johndoe</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-6 mt-2">
          <span className="text-water-dark/80 text-base">Phone: <span className="font-semibold">+23465799887</span></span>
          <span className="text-water-dark/80 text-base">Account status: <span className="font-semibold">Active</span></span>
          <span className="text-water-dark/80 text-base">Registration date: <span className="font-semibold">2023-05-01</span></span>
        </div>
      </Card>
      <Card className="flex flex-col gap-3 p-6">
        <h3 className="text-xl font-bold text-water-dark mb-2">User Summary</h3>
        {[
          { label: "Active Subscription", value: "3" },
          { label: "Total Expenditure", value: "$685" },
          { label: "Days remaining across all plans", value: "132 days" },
          { label: "Frequently used service", value: "VIP 3 Months" },
        ].map(({ label, value }, idx) => (
          <div className="flex items-center gap-3" key={idx}>
            <IoCheckmarkDoneCircleSharp className="text-xl text-water-light" />
            <p className="text-water-dark/90">{label}: <span className="font-semibold">{value}</span></p>
          </div>
        ))}
      </Card>
      <Card className="p-6">
        <h3 className="text-xl font-bold text-water-dark mb-4">Subscription Overview</h3>
        <GenericTable<Subscription>
          columns={columns}
          data={filteredData}
          itemsPerPage={5}
          renderCell={renderSubscriptionCells}
        />
      </Card>
    </div>
  );
};

export default memo(UserProfile);