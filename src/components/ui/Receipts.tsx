"use client";

import { useState } from 'react';
import { FileText, Download, Eye, Search, Filter, Calendar, DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react';

type ReceiptStatus = 'paid' | 'pending' | 'overdue';

interface Receipt {
  id: string;
  customer: string;
  email: string;
  plan: string;
  amount: number;
  status: ReceiptStatus;
  date: string;
  dueDate: string;
}

const receiptsData: Receipt[] = [
  {
    id: 'INV-001',
    customer: 'John Smith',
    email: 'john.smith@email.com',
    plan: 'Premium Plan',
    amount: 49.99,
    status: 'paid',
    date: '2024-01-15',
    dueDate: '2024-01-15'
  },
  {
    id: 'INV-002',
    customer: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    plan: 'Basic Plan',
    amount: 19.99,
    status: 'paid',
    date: '2024-01-14',
    dueDate: '2024-01-14'
  },
  {
    id: 'INV-003',
    customer: 'Mike Wilson',
    email: 'mike.w@email.com',
    plan: 'Enterprise Plan',
    amount: 99.99,
    status: 'pending',
    date: '2024-01-13',
    dueDate: '2024-01-20'
  },
  {
    id: 'INV-004',
    customer: 'Emily Davis',
    email: 'emily.d@email.com',
    plan: 'Premium Plan',
    amount: 49.99,
    status: 'overdue',
    date: '2024-01-12',
    dueDate: '2024-01-12'
  },
  {
    id: 'INV-005',
    customer: 'David Brown',
    email: 'david.b@email.com',
    plan: 'Basic Plan',
    amount: 19.99,
    status: 'paid',
    date: '2024-01-11',
    dueDate: '2024-01-11'
  },
  {
    id: 'INV-006',
    customer: 'Lisa Anderson',
    email: 'lisa.a@email.com',
    plan: 'Premium Plan',
    amount: 49.99,
    status: 'paid',
    date: '2024-01-10',
    dueDate: '2024-01-10'
  }
];

const statusConfig = {
  paid: { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/20', icon: CheckCircle },
  pending: { color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/20', icon: Clock },
  overdue: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/20', icon: XCircle }
};

export default function Receipts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredReceipts = receiptsData.filter(receipt => {
    const matchesSearch = receipt.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || receipt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: ReceiptStatus) => {
    const Icon = statusConfig[status].icon;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Receipts</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Subscription invoices and payments</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search receipts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Receipts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Receipt ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredReceipts.map((receipt) => (
                <tr key={receipt.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-800 dark:text-white">{receipt.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-white">{receipt.customer}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{receipt.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-800 dark:text-white">{receipt.plan}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-800 dark:text-white">{receipt.amount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[receipt.status].bg} ${statusConfig[receipt.status].color}`}>
                      {getStatusIcon(receipt.status)}
                      {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-800 dark:text-white">{receipt.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Receipts</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{receiptsData.length}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Paid</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">
            {receiptsData.filter(r => r.status === 'paid').length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
          <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
            {receiptsData.filter(r => r.status === 'pending').length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">
            {receiptsData.filter(r => r.status === 'overdue').length}
          </p>
        </div>
      </div>
    </div>
  );
} 