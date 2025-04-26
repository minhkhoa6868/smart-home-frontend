import Sidebar from "../components/Sidebar";
import axios from "axios";
import RightPanel from "../components/RightPanel";
import TrendChart from "../components/TrendChart";
import { useEffect } from "react";
import { useState } from "react";

export default function Statistic() {
  // const [humidityTrend, setHumidityTrend] = useState([]);
  // const [temperatureTrend, setTemperatureTrend] = useState([]);
  // const token = localStorage.getItem("token");

  const humidityTrend = Array.from({ length: 24 }, (_, hour) => ({
    timestamp: `2025-04-24T${hour.toString().padStart(2, "0")}:00:00+07:00`,
    humidity: Math.floor(Math.random() * 41) + 40, // Random từ 40 đến 80
  }));
  const temperatureTrend = Array.from({ length: 24 }, (_, hour) => ({
    timestamp: `2025-04-24T${hour.toString().padStart(2, "0")}:00:00+07:00`,
    temperature: Math.floor(Math.random() * 21) + 10, // Random từ 10 đến 30
  }));

  // const fetchHumidityData = async () => {
  //   try {
  //     const response = await axios.get(
  //       "https://smart-home-backend-07op.onrender.com/api/records/humidity/today",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     console.log(response.data);
  //     setHumidityTrend(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const fetchTemperatureData = async () => {
  //   try {
  //     const response = await axios.get(
  //       "https://smart-home-backend-07op.onrender.com/api/records/temperature/today",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     console.log(response.data);
  //     setTemperatureTrend(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchHumidityData();
  //   fetchTemperatureData();
  // }, [setHumidityTrend, setTemperatureTrend]);

  return (
    <div className="grid grid-cols-12 gap-8 min-h-screen p-6 bg-[#E8F3FC]">
      {/* Sidebar - Left */}
      <div className="col-span-2">
        <Sidebar />
      </div>
      {/* Main Content - Center */}
      <div className="col-span-8 h-full">
        <div className="flex flex-col h-full space-y-4">
          <div className="p-4 bg-white rounded-xl shadow-md">
            <TrendChart
              title="Humidity"
              data={humidityTrend}
              valueKey="humidity"
            />
          </div>
          <div className="p-4 bg-white rounded-xl shadow-md">
            <TrendChart
              title="Temperature"
              data={temperatureTrend}
              valueKey="temperature"
            />
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <RightPanel />
      </div>
    </div>
  );
}
