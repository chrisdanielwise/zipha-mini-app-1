import React, { useState } from "react";
import LineCharts from "./LineChart";

const LineChartPage = () => {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("monthly");

  const dataOptions: Record<"daily" | "weekly" | "monthly", { labels: string[]; data: number[] }> = {
    daily: {
      labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
      data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100)),
    },
    weekly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      data: [300, 200, 350, 450],
    },
    monthly: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      data: [100, 270, 200, 400, 300, 400, 300, 550, 500, 350, 250, 400],
    },
  };

  return (
    <div>
      <div className="w-flex">
        <div>
          <h1>Analytical Revenue</h1>
          <h2>September 2024</h2>
        </div>
        <select onChange={(e) => setTimeframe(e.target.value as "daily" | "weekly" | "monthly")} value={timeframe}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

      </div>
      
      
      <LineCharts
        labels={dataOptions[timeframe].labels}
        data={dataOptions[timeframe].data}
        customTexts={[]} // Ensure this is provided if required
      />
    </div>
  );
};

export default LineChartPage;
