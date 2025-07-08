import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels, { Context } from "chartjs-plugin-datalabels";
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
  annotationPlugin
);

interface LineChartProps {
  labels: string[];
  data: number[];
  title?: string;
  customTexts?: string[];
}

const LineCharts: React.FC<LineChartProps> = ({ labels, data, title, customTexts }) => {
  // Wavy data transformation (simulate a sine wave or any wavy pattern)
  const transformedData = data.map((value, index) => {
    const amplitude = 10; // Amplitude of the wave
    const frequency = 0.3; // Frequency of the wave
    return value + amplitude * Math.sin(frequency * index); // Adding sine wave to each data point
  });

  // Find the index of the highest value
  const maxValueIndex = transformedData.indexOf(Math.max(...transformedData)); // Find the index of the highest value

  const chartData = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: transformedData, // Use the transformed (wavy) data
        borderColor: "#626273",
        backgroundColor: "626273",
        borderWidth: 2,
        pointBackgroundColor: "#626273",
        pointBorderColor: "#fff",
        pointRadius: 0, // Remove points
        lineTension: 0.4, // Smoothen the line by adding tension
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
        align: "top" as const,
        color: "#000",
        font: { size: 12 },
        formatter: (_value: number, context: Context) => {
          return customTexts?.[context.dataIndex] || "";
        },
      },
      annotation: {
        annotations: {
          maxValueMarker: {
            type: "point" as const,
            xValue: labels[maxValueIndex], // Set pointer at max value point
            yValue: transformedData[maxValueIndex],
            backgroundColor: "red",
            radius: 8,
            borderColor: "#fff",
            borderWidth: 5,
          },
        },
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // Custom Plugin for the Colored Shadow from X-Axis to Pointer
  const shadowPlugin = {
    id: "shadowPlugin",
    beforeDatasetsDraw: (chart: any) => {
      const ctx = chart.ctx;
      const meta = chart.getDatasetMeta(0);
      const point = meta.data[maxValueIndex]; // Get the max value point

      if (!point) return;

      const { x, y } = point;
      const xAxisY = chart.scales.y.getPixelForValue(0); // Get the Y position of the X-axis

      ctx.save();
      ctx.beginPath();

      // Create the shadow effect (Gradient from X-axis up to the marker)
      const gradient = ctx.createLinearGradient(x, xAxisY, x, y);
      gradient.addColorStop(0, "#3e4147"); // Light shadow at the bottom (near X-axis)
      gradient.addColorStop(1, "#6d6f76"); // Fades near the marker

      ctx.fillStyle = gradient;
      ctx.fillRect(x - 5, y, 10, xAxisY - y); // Draw gradient from X-axis to point

      ctx.restore();
    },
  };

  ChartJS.register(shadowPlugin);

  return (
    <div style={{ height: "300px", width: "100%" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineCharts;
