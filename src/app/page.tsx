"use client";
import { useState, useEffect, useRef, useMemo,memo } from "react";
import Header from "../components/Header";
import prof from '../app/Assets/2-removebg-preview.png'
import Image from "next/image";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaUsers } from "react-icons/fa";
import { FaUsersCog } from "react-icons/fa";
import { FaUsersLine } from "react-icons/fa6";
import { FaUsersSlash } from "react-icons/fa6";
import { FaUsersRays } from "react-icons/fa6";
import BarChartPage from "../components/BarChartPage";
import LineChartPage from "../components/LineChartPage";
import Invoices from "../components/Invoices";
import DoughnutChartPage from "../components/DoughnutChartPage"; 

const profitData: Record<string, { amount: string; text: string }> = {
  all: { amount: "$50,500.00", text: "+20% since last month" },
  weekly: { amount: "$12,233.20", text: "+14% since last week" },
  monthly: { amount: "$45,000.00", text: "+18% since last month" },
};


const Home = () => {

  const [selectedOption, setSelectedOption] = useState("weekly");
  const [menuOpen, setMenuOpen] = useState(false);


  const handleOptionClick = (option: keyof typeof profitData) => {
    setSelectedOption(option);
    setMenuOpen(false);
  };

  return (
    
        <main>
          <Header/>

          <div className="overview">
            <h3>Overview</h3>
            <div className="over-flex">
            <div className="s-layout">
              <div className="s-layout-c">
                {[
                  { icon: FaUsers, number: "1,500", label: "Users" },
                  { icon: FaUsersCog, number: "200", label: "Active sub" },
                  { icon: FaUsersLine, number: "10", label: "Pending" },
                  { icon: FaUsersSlash, number: "20", label: "Expired sub" },
                  { icon: FaUsersRays, number: "50", label: "New Sub" }
                ].map((item, index) => (
                  <div
                    className={`scl1 ${index === 0 ? "sc1" : index === 1 ? "b" : index === 2 ? "c" : index === 3 ? "d" : "e"}`}
                    key={index}
                  >
                    <div className="scl1-c">
                      <div className="i-txt">
                        <div className="i-circ">
                          <item.icon className="cc-i" />
                        </div>
                        <p>{item.label}</p>
                      </div>
                      
                      <h3>{item.number}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>


              <div className="profit">
                <div className="p-top">
                  <div className="pt-l">
                    <FaMoneyBill1Wave className="pt-i" />
                    <span>Profit</span>
                  </div>
                  <div className="dropdown-container" style={{position:'relative'}}>
                    <HiOutlineDotsVertical
                      className="pr-i"
                      onClick={() => setMenuOpen(!menuOpen)}
                    />
                    {menuOpen && (
                      <div className="dropdown-menu" style={{backgroundColor:'#141313',fontSize:'14px', fontWeight:400, padding:'5px', borderRadius:'3px', position:'absolute', right:0, top:'15px'}}>
                        {Object.keys(profitData).map((key) => (
                          <div
                            key={key}
                            className="dropdown-item"
                            onClick={() => handleOptionClick(key as keyof typeof profitData)}
                          >
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <Image src={prof} alt="Profit chart" />
                <p>{profitData[selectedOption].text}</p>
                <h2>{profitData[selectedOption].amount}</h2>
              </div>
            </div>
          </div>
        

          <div className="barcharts">
            <div className="barr">
              <BarChartPage/>
            </div>
            
          </div>

          <div className="barcharts">
            <div className="barr">
              <LineChartPage/>
            </div>
            
          </div>

          <div className="barcharts">
            <div className="barr">
              <Invoices/>
            </div>
            
          </div>

          <div className="barcharts" style={{marginBottom:'30px'}}>
            <div className="barr">
              <DoughnutChartPage/>
            </div>
            
          </div>

        </main>
  );
}

export default memo(Home);