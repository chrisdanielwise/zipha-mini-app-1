"use client";  

import React, { memo, useState, useMemo } from "react";  
import GenericTable from "./table";  
import { RiMenuUnfold2Fill } from "react-icons/ri";  
import Image, { StaticImageData } from "next/image"; // Import StaticImageData  
import dp from '../app/Assets/dp1.jpeg'; // Updated to use available asset  

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
    <td className="flex items-center gap-3" key="username">  
        <Image   
            src={row.profilePicture}   
            alt={`${row.username}'s profile`}   
            width={32}   
            height={32}   
            className="rounded-full object-cover"   
        />  
        <span className="font-medium text-gray-800">{row.username}</span>  
    </td>,  
    <td key="package" className="text-gray-700">{row.package}</td>,  
    <td key="amount" className="font-semibold text-gray-800">{row.amount}</td>,  
    <td key="paymentMethod" className="text-gray-700">{row.paymentMethod}</td>,  
    <td key="status">
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        row.status === 'Approved' ? 'bg-green-100 text-green-800' :
        row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {row.status}
      </span>
    </td>,  
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
            <div className="flex items-center justify-between mb-4">  
                <div>  
                    <h3 className="text-lg font-semibold text-gray-800">Recent Invoices</h3>  
                    <p className="text-sm text-gray-600">{data.length} total invoices</p>  
                </div>  
                
                <div className="flex items-center gap-2">  
                    <label htmlFor="statusFilter" className="text-sm text-gray-600">Filter: </label>  
                    <select  
                        id="statusFilter"  
                        value={filterStatus || ''}  
                        onChange={(e) => setFilterStatus(e.target.value || null)}  
                        className="px-3 py-1 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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