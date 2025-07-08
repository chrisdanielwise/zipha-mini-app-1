"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { FaMailBulk, FaUser  } from "react-icons/fa";
import { FaComment } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { FaBell } from "react-icons/fa6";
import Link from "next/link";

interface AdminHeaderProps {
  onSearch: (searchTerm: string) => void;
}

export default function AdminHeader({ onSearch }: AdminHeaderProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Handle search input changes
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target; // Destructure target value
    setSearchTerm(value);
    onSearch(value); // Pass the search term to the parent or handle it locally
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Optionally, you can trigger a search here if needed
  };

  return (
    <header className="header">
      <div className="h-main">
        <div className="h-l">
          <h3>Admin</h3>
        </div>

        <div className="h-l">
          <form className="mr-2" onSubmit={handleSubmit}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <IoSearch className="h-i" style={{ marginRight: "5px" }} aria-label="Search" />
              <input
                type="search"
                placeholder="Search"
                className="rounded-lg text-sm pl-1 bg-transparent py-2"
                style={{ border: "1px solid #ccc", width: "200px" }}
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Search input"
              />
            </div>
          </form>
          <Link href='/notification'><FaBell className="h-i" aria-label="Notifications" /></Link>
          <FaComment className="h-i" aria-label="Comments" />
          <FaUser  className="h-i" aria-label="User  Profile" />
        </div>
      </div>
    </header>
  );
}