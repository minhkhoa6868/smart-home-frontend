import Sidebar from "../components/Sidebar";
import OverviewCard from "../components/OverviewCard";

import TrendChart from "../components/TrendChart";
import RightPanel from "../components/RightPanel";
import { useState } from "react";
import DoorControlCard from "../components/DoorControlCard";
import FanControlCard from "../components/FanControlCard";
import LightControlCard from "../components/LightControlCard";

// Trạng thái các thiết bị

const humidityData = [
  { time: "8AM", value: 24 },
  { time: "10AM", value: 33 },
  { time: "12PM", value: 29 },
  { time: "2PM", value: 35 },
  { time: "4PM", value: 24 },
  { time: "6PM", value: 40 },
];

const temperatureData = [
  { time: "8AM", value: 24 },
  { time: "10AM", value: 33 },
  { time: "12PM", value: 29 },
  { time: "2PM", value: 35 },
  { time: "4PM", value: 24 },
  { time: "6PM", value: 40 },
];

// src/pages/Dashboard.tsx
export default function Dashboard() {
  const [doorOpen, setDoorOpen] = useState(false);
  const [fanSpeed, setFanSpeed] = useState(0);
  const [lightOn, setLightOn] = useState(false);
  const [lightColor, setLightColor] = useState("#ffcc00"); // default: vàng

  return (
    <div className="grid grid-cols-12 gap-8 min-h-screen p-6 bg-[#E8F3FC]">
      {/* Sidebar - Left */}
      <div className="col-span-2">
        <Sidebar />
      </div>
      {/* Dashboard content - Center */}
      <div className="col-span-8 space-y-4">
        {" "}
        <div className="space-y-4">
          {/* Environment Overview */}
          <h1 className="text-xl font-semibold">Environment Overview</h1>
          <div className="grid grid-cols-3 gap-18">
            <OverviewCard title="Humidity" value={20} threshold={30} />
            <OverviewCard title="Brightness" value={20} threshold={10} />
            <OverviewCard title="Temperature" value={35} threshold={33} />
          </div>

          {/* Devices */}
          <h1 className="text-xl font-semibold">Devices</h1>
          <div className="grid grid-cols-3 gap-4">
            <LightControlCard
              isOn={lightOn}
              color={lightColor}
              onToggle={() => setLightOn(!lightOn)}
              onColorChange={(hex) => {
                setLightColor(hex);
                // Optional: gọi API gửi mã hex
                // axios.post("/devices/light", { color: hex, status: lightOn ? "ON" : "OFF" })
              }}
            />

            <DoorControlCard
              isOpen={doorOpen}
              onToggle={() => setDoorOpen(!doorOpen)}
            />

            <FanControlCard
              currentSpeed={fanSpeed}
              onChangeSpeed={(speed) => setFanSpeed(speed)}
            />
          </div>

          {/* Trends */}
          <h1 className="text-xl font-semibold">Environmental Trends</h1>
          <div className="grid grid-cols-2 gap-4">
            <TrendChart title="Humidity" data={humidityData} />
            <TrendChart title="Temperature" data={temperatureData} />
          </div>
        </div>
      </div>

      {/* Members & History - Right */}
      <div className="col-span-2 border-l border-gray-400 pl-4">
        <RightPanel />
      </div>
    </div>
  );
}
