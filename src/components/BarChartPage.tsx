import React, { useState } from "react";
import BarCharts from "./BarCharts";

const BarChartPage = () => {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("monthly");

  const dataOptions: Record<"daily" | "weekly" | "monthly", { labels: string[]; data: number[] }> = {
    daily: {
      // labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
      // data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100)),
      labels: ["Mon", "Tue", "Wed", "Thurs", "Fri"],
      data: [100, 210, 170, 240, 200],
    },
    weekly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      data: [100, 200, 150, 250],
    },
    monthly: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      data: [110, 232, 90, 200, 130, 200, 210, 205, 260, 215, 125, 140],
    },
  };

  return (
    <div>
      <div className="w-flex">
        <div>
          <h1>Sales Report</h1>
          <h2>Subscribers Payment</h2>
        </div>
        <select onChange={(e) => setTimeframe(e.target.value as "daily" | "weekly" | "monthly")} value={timeframe}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

      </div>
      
      
      <BarCharts
      
        labels={dataOptions[timeframe].labels}
        data={dataOptions[timeframe].data}
        customTexts={[]}
        
      />
    </div>
  );
};

export default BarChartPage;
