"use client";

import * as React from "react";
import { useEffect, useState, useMemo, memo } from "react";
import Header from "../../../components/Header";
import dynamic from "next/dynamic";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoFilterOutline } from "react-icons/io5";
import Link from "next/link";

const GenericTable = dynamic(() => import("../../../components/table"), {
  ssr: false,
}) as <T>(props: import("../../../components/table").GenericTableProps<T>) => React.ReactElement;

interface UserData {
  id: number;
  name: string;
  username: string;
  amount: string;
  service: string;
  status: string;
  date: string;
  payment: string;
}
 interface RawUser {
  firstName?: string;
  lastName?: string;
  username?: string;
  subscriptionStatus?: string;
  subscriptionType?: string;
  expirationDate?: number;
  createdAt?: string;
  [key: string]: any;
}



const Subscribers = () => {
  const [data, setData] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterService, setFilterService] = useState<string>("All");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const itemsPerPage = 7;
  async function getSubscribers(): Promise<RawUser[] | null> {
    try {
      const res = await fetch("/api/subscribers");
      const data = await res.json();
      return data.success ? data.subscribers : null;
    } catch (err) {
      console.error("Error fetching subscribers:", err);
      return null;
    }
  }
  useEffect(() => {
    const fetchSubscribers = async () => {
      const subscribers = await getSubscribers();
      if (!subscribers) return;

      const formatted: UserData[] = subscribers.map((user, index) => ({
        id: index + 1,
        name: user.fullName || "No name",
        username: user.username || "No username",
        amount: "$0", // or use a real amount if you have it
        service: user.subscription?.type || "None",
        status: user.subscription?.status || "Unknown",
        date: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString("en-GB")
          : "N/A",
        payment: "Unknown", // or use a real payment field if you have it
      }));

      setData(formatted);
    };

    fetchSubscribers();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = !searchTerm || Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesFilter =
        filterService === "All" ||
        (filterService === "Vip" && item.service.toLowerCase().includes("vip")) ||
        (filterService === "Mentorship" && item.service.toLowerCase().includes("mentorship"));

      return matchesSearch && matchesFilter;
    });
  }, [data, searchTerm, filterService]);

  const columns = [
    { id: "name", label: "Full Name" },
    { id: "username", label: "Username" },
    { id: "service", label: "Service" },
    { id: "amount", label: "Amount" },
    { id: "payment", label: "Payment method" },
    { id: "date", label: "Date" },
    { id: "status", label: "Status" },
    { id: "action", label: "Action" },
  ];

  const renderCell = (row: UserData) => [
    <td key="name">{row.name}</td>,
    <td key="username">{row.username}</td>,
    <td key="service">{row.service}</td>,
    <td key="amount">{row.amount}</td>,
    <td key="payment">{row.payment}</td>,
    <td key="date">{row.date}</td>,
    <td key="status">{row.status}</td>,
    <td key="action">
      <Link href='/userprofile' className="btn renew-btn" onClick={() => setModalOpen(true)}>
        View
      </Link>
    </td>,
  ];

  return (
    <main>
      <Header />
      <div className="sub-table">
        <div className="barcharts">
          <div className="barr">
            <div className="w-flex">
              <div>
                <h1>Subscribers</h1>
                <p>{filteredData.length} Subscription(s)</p>
              </div>

              <div style={{ position: "relative" }}>
                <IoFilterOutline
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ cursor: "pointer", fontSize: "24px" }}
                />
                {dropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      backgroundColor: "white",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      borderRadius: "4px",
                      zIndex: 1000,
                      marginTop: "5px",
                      color: "#141313",
                    }}
                  >
                    {["All", "Vip", "Mentorship"].map((option) => (
                      <p
                        style={{ color: "#000", padding: "0 3px" }}
                        key={option}
                        className={filterService === option ? "active-filter" : ""}
                        onClick={() => setFilterService(option)}
                      >
                        {option}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <GenericTable<UserData>
              columns={columns}
              data={filteredData}
              renderCell={renderCell}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default memo(Subscribers);
 