"use client";

import { useState, useMemo, useEffect, memo } from "react";
import Image from "next/image";
import dp from "@/app/Assets/dp1.jpeg";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import Header from "src/components/Header";
import GenericTable from "src/components/table";


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
    <main>
      <Header />

      <section className="barcharts">
        <div className="proff">
          <h3>User Profile</h3>
          <div className="prof">
            <Image src={dp} alt="User DP" />
            <div>
              <h4>Lucia John Doe</h4>
              <p>@johndoe</p>
            </div>
          </div>
          <h5>Phone: <span>+23465799887</span></h5>
          <h5>Account status: <span>Active</span></h5>
          <h5>Registration date: <span>2023-05-01</span></h5>
        </div>
      </section>

      <section className="barcharts">
        <div className="proff">
          <h3>User Summary</h3>

          {[
            { label: "Active Subscription", value: "3" },
            { label: "Total Expenditure", value: "$685" },
            { label: "Days remaining across all plans", value: "132 days" },
            { label: "Frequently used service", value: "VIP 3 Months" },
          ].map(({ label, value }, idx) => (
            <div className="user-check" key={idx}>
              <IoCheckmarkDoneCircleSharp className="us-i" />
              <p>{label}: <span>{value}</span></p>
            </div>
          ))}
        </div>
      </section>

      <section className="subsc-table">
        <div className="barcharts">
          <div className="proff">
            <h3>Subscription Overview</h3>
            <GenericTable<Subscription>
              columns={columns}
              data={filteredData}
              itemsPerPage={5}
              renderCell={renderSubscriptionCells}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default memo(UserProfile);