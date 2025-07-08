import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels, { Context } from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

interface BarChartProps {
  labels: string[];
  data: number[];
  title?: string;
  customTexts?: string[];
}

const BarCharts: React.FC<BarChartProps> = ({ labels, data, title, customTexts }) => {
  // Find the maximum value in the data
  const maxValue = Math.max(...data);

  // Create an array of background colors, where the highest bar gets a different color
  const backgroundColors = data.map(value =>
    value === maxValue ? "#f3ab7b" : "#90969f" // Change this to the color you want for the highest bar
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Packages",
        data,
        backgroundColor: backgroundColors, // Apply the colors to each bar
        // borderColor: "#7065e9",
        borderWidth: 1,
        borderRadius: 20, // Fully rounded corners
        borderSkipped: false, // Ensures bottom corners are rounded too
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: { display: !!title, text: title || "" },
      datalabels: {
        anchor: "end" as const,
        align: "end" as const,
        color: "#fff",
        font: { size: 12 },
        formatter: (value: number, context: Context) => {
          return customTexts?.[context.dataIndex] || "";
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(...data) * 1.5,
      },
    },
  };

  return (
    <div style={{ height: "250px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarCharts;
