import React from "react";  
import { Doughnut } from "react-chartjs-2";  
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";  

// Register required Chart.js components  
ChartJS.register(ArcElement, Tooltip, Legend);  

interface DoughnutChartProps {  
  labels: string[];  
  data: number[];  
  previousTotal: number;  
  height?: number;  
}  

const DoughnutChart: React.FC<DoughnutChartProps> = ({ labels, data, previousTotal, height = 300 }) => {  
  const total = data.reduce((a, b) => a + b, 0);  
  const percentageChange = previousTotal ? ((total - previousTotal) / previousTotal) * 100 : 0;  
  const formattedPercentage = percentageChange.toFixed(2);  

  const chartData = {  
    labels,  
    datasets: [  
      {  
        data,  
        backgroundColor: ["#7065E9", "#FF7E6D", "#FFD84C", "#4CD6B9"],  
        borderWidth: 0, // Set to 0 for a cleaner doughnut effect  
        cutout: "80%", // Inner circle size  
      },  
    ],  
  };  

  const options = {  
    responsive: true,  
    maintainAspectRatio: false,  
    plugins: {  
      legend: { display: false },  
      tooltip: { enabled: true },  
    },  
  };  

  return (  
    <div style={{ height: `${height}px`, position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>  
      <Doughnut data={chartData} options={options} />  

      <div  
        style={{  
          position: "absolute",  
          top: "50%",  
          left: "50%",  
          transform: "translate(-50%, -50%)",  
          textAlign: "center",  
          fontSize: "18px",  
          fontWeight: "bold",  
          color: percentageChange >= 0 ? "green" : "red",  
        }}  
      >  
        {formattedPercentage}% <br />  
        {percentageChange >= 0 ? "Increase" : "Decrease"}  
      </div>  
    </div>  
  );  
};  

export default DoughnutChart;