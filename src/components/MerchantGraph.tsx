"use client";
import { useState,memo } from "react";
import { Tooltip as RechartsTooltip, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartJsTooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartJsTooltip, Legend);

type RevenueDataType = {
  [key: string]: { label: string; value: number }[];
};

const revenueData: RevenueDataType = {
  daily: [
    { label: "Day 1", value: 100 },
    { label: "Day 2", value: 150 },
    { label: "Day 3", value: 80 },
    { label: "Day 4", value: 200 },
    { label: "Day 5", value: 300 },
    { label: "Day 6", value: 250 },
    { label: "Day 7", value: 400 },
  ],
  weekly: [
    { label: "Week 1", value: 700 },
    { label: "Week 2", value: 1200 },
    { label: "Week 3", value: 900 },
    { label: "Week 4", value: 1600 },
  ],
  monthly: [
    { label: "Jan", value: 400 },
    { label: "Feb", value: 600 },
    { label: "March", value: 800 },
    { label: "April", value: 1000 },
    { label: "May", value: 1200 },
    { label: "June", value: 1400 },
    { label: "July", value: 1600 },
    { label: "Aug", value: 800 },
    { label: "Sept", value: 1000 },
    { label: "Oct", value: 1200 },
    { label: "Nov", value: 1400 },
    { label: "Dec", value: 1600 },
  ],
};

const ringData = [
  { name: "1 month", value: 25 },
  { name: "3 months", value: 35 },
  { name: "6 months", value: 20 },
  { name: "1 year", value: 20 },
];

const COLORS = ["#97deec", "#af7ff3", "#b6b7fd", "#47a5c4"];

const ringData2 = [
  { name: "VIP Signals", value: 30 },
  { name: "Mentorship", value: 25 },
  { name: "Account Flip", value: 15 },
  { name: "Affiliate", value: 40 },
];

const COLORS2 = ["#97deec", "#af7ff3", "#b6b7fd", "#47a5c4"];
interface PieLabelRenderProps {
  cx: number;          // The x-coordinate of the center of the pie chart
  cy: number;          // The y-coordinate of the center of the pie chart
  midAngle: number;    // The angle at which the label is placed
  innerRadius: number; // The inner radius of the pie slice
  outerRadius: number; // The outer radius of the pie slice
  percent: number;     // The percentage of the pie slice
}
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) / 2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize="12"
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

 const MerchantGraph =()=> {
  const [timeRange, setTimeRange] = useState<string>("monthly");
  const chartData = revenueData[timeRange];
  const datas = [
    { name: "Jan", Growth: 1000 },
    { name: "Feb", Growth: 3000 },
    { name: "Mar", Growth: 2000 },
    { name: "Apr", Growth: 4000 },
    { name: "May", Growth: 2000 },
    { name: "Jun", Growth: 5000 },
    { name: "Jul", Growth: 1000 },
    { name: "Aug", Growth: 3000 },
    { name: "Sep", Growth: 2000 },
    { name: "Oct", Growth: 4000 },
    { name: "Nov", Growth: 2000 },
    { name: "Dec", Growth: 5000 },
  ];

  const handleSearch = (searchTerm: string) => {
    console.log("Search Term:", searchTerm);
    // Implement search logic
};

  return (
    <main>
      <h2 className="rep">Visual Insight</h2>
      <div className="graph1">
        <div className="g-l gg">
          <h2>User Activities</h2>
          <ResponsiveContainer style={{ marginBottom: '20px' }} width="100%" height='90%'>
            <LineChart data={datas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Line
                type="monotone"
                dataKey="Growth"
                stroke="rgba(75, 192, 192, 0.8)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="g-r gg">
          <div className="rev flex justify-between items-center">
            <h2>Revenue</h2>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                marginLeft: "auto",
                background: "transparent",
                outline: "none",
                border: "2px solid #a677e8",
                borderRadius: '10px',
                fontSize: '14px',
              }}
            > 
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <Bar
            style={{ height: '92%' }}
            data={{
              labels: chartData.map((item) => item.label),
              datasets: [
                {
                  label: "Revenue ($)",
                  data: chartData.map((item) => item.value),
                  backgroundColor: "rgba(54, 162, 235, 0.6)",
                  borderColor: "rgba(54, 162, 235, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: "top",
                },
                tooltip: {
                  enabled: true,
                },
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                },
                y: {
                  grid: {
                    display: true,
                    color: "#e0e0e0",
                  },
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
      <div className="graph1">
        <div className="g-r gg">
            <h2>VIP Signal</h2>
          <ResponsiveContainer width="100%" height='90%'>
            <PieChart>
              <Pie
                data={ringData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                label={renderCustomLabel}
                labelLine={false}
              >
                {ringData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            {ringData.map((entry, index) => (
              <div key={entry.name} style={{ display: "flex", alignItems: "center", marginRight: "20px" }}>
                <div style={{ width: "15px", height: "15px", backgroundColor: COLORS[index % COLORS.length], marginRight: "8px" }}></div>
                <span style={{ fontSize: "14px", color: "#fff" }}>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="g-r gg">
        <h2>Overall Users</h2>
          <ResponsiveContainer width="100%" height='90%'>
            <PieChart>
              <Pie
                data={ringData2}
                dataKey="value"
                nameKey="name"
                cx ="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                label={renderCustomLabel}
                labelLine={false}
              >
                {ringData2.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS2[index % COLORS2.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            {ringData2.map((entry, index) => (
              <div key={entry.name} style={{ display: "flex", alignItems: "center", marginRight: "20px" }}>
                <div style={{ width: "15px", height: "15px", backgroundColor: COLORS2[index % COLORS2.length], marginRight: "8px" }}></div>
                <span style={{ fontSize: "14px", color: "#fff" }}>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
export default memo(MerchantGraph)