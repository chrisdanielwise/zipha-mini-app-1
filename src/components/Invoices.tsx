"use client";  

import React, { memo, useState, useMemo } from "react";  
import GenericTable from "./table";  
import { RiMenuUnfold2Fill } from "react-icons/ri";  
import Image, { StaticImageData } from "next/image"; // Import StaticImageData  
import dp from '../app/Assets/dp.jpg'; // Ensure this path is correct  

interface PaymentData {  
    id: number;  
    username: string;  
    package: string;  
    amount: string;  
    paymentMethod: string;  
    status?: string;  
    profilePicture: string | StaticImageData;  // Allow both types   
} 

// Function to render cells for PaymentData  
const renderPaymentCells = (row: PaymentData) => [  
    <td className="user" key="username" style={{display:'flex', alignItems:"start"}}>  
        <Image   
            src={row.profilePicture}   
            alt={`${row.username}'s profile`}   
            width={25}   
            height={25}   
            style={{ borderRadius: '50%', marginRight: 4}}   
        />  
        {row.username}  
    </td>,  
    <td key="package">{row.package}</td>,  
    <td key="amount">{row.amount}</td>,  
    <td key="paymentMethod">{row.paymentMethod}</td>,  
    <td key="status">{row.status}</td>,  
];  

const columns = [  
    { id: 'username', label: 'Username' },  
    { id: 'package', label: 'Package' },  
    { id: 'amount', label: 'Amount' },  
    { id: "paymentMethod", label: 'Pay. Method' },  
    { id: 'status', label: 'Status' },  
];  

const Invoices = () => {  
    const [data] = useState<PaymentData[]>([  
        { id: 1, username: "Greysuit FX", amount: "$2000", status: "Pending", package: "VIP 1 month", paymentMethod:'USTD', profilePicture: dp },  
        { id: 2, username: "Jane Doe", amount: "$1500", status: "Approved", package: "VIP 3 month", paymentMethod:'BTC', profilePicture: dp },  
        { id: 3, username: "John Smith", amount: "$3000", status: "Rejected", package: "VIP 1 month", paymentMethod:'BTC', profilePicture: dp },  
        { id: 4, username: "Chris Lee", amount: "$2500", status: "Pending", package: "VIP 2 month", paymentMethod:'USTD', profilePicture: dp },  
        { id: 5, username: "Emma Stone", amount: "$1800", status: "Pending", package: "VIP 6 month", paymentMethod:'BTC', profilePicture: dp },  
        { id: 6, username: "Michael Johnson", amount: "$2200", status: "Approved", package: "VIP 1 month", paymentMethod:'USTD', profilePicture: dp },  
        { id: 7, username: "Sarah Connor", amount: "$2100", status: "Pending", package: "VIP 3 month", paymentMethod:'USTD', profilePicture: dp },  
    ]);  
    
    const [filterStatus, setFilterStatus] = useState<string | null>(null);  
    
    const filteredData = useMemo(() => {  
        if (filterStatus === null) return data;  
        return data.filter(item => item.status === filterStatus);  
    }, [data, filterStatus]);  

    return (  
        <div>  
            <div className="w-flex">  
                <div>  
                    <h1>Invoices</h1>  
                    <p>{data.length} Invoices</p>  
                </div>  
                
                <div style={{ marginLeft: 'auto' }}>  
                    <label htmlFor="statusFilter">Filter by: </label>  
                    <select  
                        id="statusFilter"  
                        value={filterStatus || ''}  
                        onChange={(e) => setFilterStatus(e.target.value || null)}  
                    >  
                        <option value="">All</option>  
                        <option value="Pending">Pending</option>  
                        <option value="Approved">Approved</option>  
                        <option value="Rejected">Rejected</option>  
                    </select>  
                </div>  
            </div>  
            <GenericTable<PaymentData>  
                columns={columns}  
                data={filteredData}  
                itemsPerPage={5}  
                renderCell={renderPaymentCells}  
            />  
        </div>  
    );  
};  

export default memo(Invoices);