import React, { useState, useEffect, useRef } from "react";  
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";  
import { BsThreeDotsVertical } from "react-icons/bs";  

const DoughnutChartPage: React.FC = () => {  
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("monthly");  
  const [dropdownOpen, setDropdownOpen] = useState(false);  
  const chartContainerRef = useRef<HTMLDivElement | null>(null);  
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });  

  const dataOptions: Record<"daily" | "weekly" | "monthly", { name: string; value: number }[]> = {  
    daily: [  
      { name: "VIP 1 Month", value: 20 },  
      { name: "VIP 3 Months", value: 15 },  
      { name: "VIP 6 Months", value: 25 },  
      { name: "VIP 12 Months", value: 10 },  
      { name: "1-on-1", value: 20 },  
      { name: "G Mentorship", value: 10 },  
    ],  
    weekly: [  
      { name: "VIP 1 Month", value: 140 },  
      { name: "VIP 3 Months", value: 100 },  
      { name: "VIP 6 Months", value: 175 },  
      { name: "VIP 12 Months", value: 120 },  
      { name: "1-on-1", value: 160 },  
      { name: "G Mentorship", value: 105 },  
    ],  
    monthly: [  
      { name: "VIP 1 Month", value: 600 },  
      { name: "VIP 3 Months", value: 450 },  
      { name: "VIP 6 Months", value: 750 },  
      { name: "VIP 12 Months", value: 500 },  
      { name: "1-on-1", value: 650 },  
      { name: "G Mentorship", value: 400 },  
    ],  
  };  

  const COLORS = ["#7065e9", "#fff4de", "#f2f0fe", "#f16876", "#70f89f", "#bf83ff"];  

  const totalValue = dataOptions[timeframe].reduce((acc, curr) => acc + curr.value, 0);  
  const percentage = totalValue;  

  const updateChartDimensions = () => {  
    if (chartContainerRef.current) {  
      const { width, height } = chartContainerRef.current.getBoundingClientRect();  
      setChartDimensions({ width, height });  
    }  
  };  

  useEffect(() => {  
    updateChartDimensions(); // Set initial dimensions  
    window.addEventListener("resize", updateChartDimensions); // Update on resize  
    return () => window.removeEventListener("resize", updateChartDimensions); // Clean up  
  }, []);  

  return (  
    <div className="d-section">  
      <div className="w-flex">  
        <h1>Activity</h1>  
        <div style={{ position: "relative" }}>  
          <BsThreeDotsVertical  
            onClick={() => setDropdownOpen(!dropdownOpen)}  
            style={{ cursor: "pointer", fontSize: "24px" }}  
          />  
          {dropdownOpen && (  
            <div  
              style={{  
                position: "absolute",  
                right: 0,  
                backgroundColor: "white",  
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",  
                borderRadius: "4px",  
                zIndex: 1000,  
                marginTop: "5px",  
                color: "#141313",  
              }}  
            >  
              {["daily", "weekly", "monthly"].map((t) => (  
                <div  
                  key={t}  
                  onClick={() => {  
                    setTimeframe(t as "daily" | "weekly" | "monthly");  
                    setDropdownOpen(false);  
                  }}  
                  style={{ padding: "10px", cursor: "pointer" }}  
                >  
                  {t.charAt(0).toUpperCase() + t.slice(1)}  
                </div>  
              ))}  
            </div>  
          )}  
        </div>  
      </div>  
  
      {/* Custom Doughnut Chart with Curved Edges */}  
      <div  
        ref={chartContainerRef}  
        style={{  
          position: 'relative',  
          width: '100%',  
          height: '350px',  
          borderRadius: '20px', // Add border radius here  
          overflow: 'hidden', // Hide overflow to clip corners  
        }}  
      >  
        <PieChart width={chartDimensions.width} height={chartDimensions.height}>  
          <Pie  
            data={dataOptions[timeframe]}  
            dataKey="value"  
            nameKey="name"  
            cx="50%"  
            cy="50%"  
            outerRadius={chartDimensions.width * 0.35}  
            innerRadius={chartDimensions.width * 0.3}  
            paddingAngle={5}  
            label  
          >  
            {dataOptions[timeframe].map((entry, index) => (  
              <Cell  
                key={`cell-${index}`}  
                fill={COLORS[index % COLORS.length]}  
                style={{  
                  opacity: 0.9  
                }}  
              />  
            ))}  
          </Pie>  
          <Tooltip />  
          <Legend />  
        </PieChart>  
  
        {/* Percentage Display in the Center */}  
        <div  
          style={{  
            position: 'absolute',  
            top: '55%',  
            left: '50%',  
            transform: 'translate(-50%, -50%)',  
            textAlign: 'center',  
            fontSize: '16px',  
            color: '#141313'  
          }}  
        >  
          <div style={{ fontWeight: 'bold', fontSize: '24px', color: '#fff' }}>  
            +12%  
          </div>  
          <div style={{ fontSize: '12px', color: '#5e5e5e' }}>Since last week</div>  
        </div>  
      </div>  
  
      {/* List of Categories */}  
      <ul>  
        {dataOptions[timeframe].map((item, index) => (  
          <li key={index} style={{ display: "flex", alignItems: "start", gap: "7px" }}>  
            <span  
              style={{  
                width: "11px",  
                height: "11px",  
                borderRadius: "50%",  
                backgroundColor: COLORS[index],  
                display: "inline-block",  
                marginTop:'3px'
              }}  
            ></span>  
            {item.name}: {item.value}  
          </li>  
        ))}  
      </ul>  
    </div>  
  ); 
};  

export default DoughnutChartPage;