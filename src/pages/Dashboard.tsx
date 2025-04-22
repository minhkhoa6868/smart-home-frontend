import Sidebar from "../components/Sidebar";
import OverviewCard from "../components/OverviewCard";

import TrendChart from "../components/TrendChart";
import RightPanel from "../components/RightPanel";
import { useEffect, useState } from "react";
import DoorControlCard from "../components/DoorControlCard";
import FanControlCard from "../components/FanControlCard";
import LightControlCard from "../components/LightControlCard";
import VoiceRecognition from "../components/VoiceRecognition"; // Đảm bảo đường dẫn đúng
import { Mic, MicOff } from "lucide-react";
// import SockJS from "sockjs-client";
// import { CompatClient, Stomp } from "@stomp/stompjs";
import axios from "axios";
import useFetch from "../hooks/useFetch";

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
  const [doorOpen, setDoorOpen] = useState("Close");
  const [fanSpeed, setFanSpeed] = useState("0");
  const [fanOn, setFanOn] = useState("Off");
  const [lightOn, setLightOn] = useState("Off");
  const [lightColor, setLightColor] = useState("#000000"); // default: white
  const [humidity, setHumidity] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [brightness, setBrightness] = useState(0);
  const [distance, setDistance] = useState(0);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // useEffect(() => {
  //   const socket = new SockJS("http://localhost:8080/ws");
  //   const stompClient: CompatClient = Stomp.over(socket);

  //   stompClient.connect({}, () => {
  //     console.log("WebSocket connected");

  //     stompClient.subscribe("/topic/humidity", (message) => {
  //       const data = JSON.parse(message.body);
  //       setHumidity(data.humidity);
  //     });

  //     stompClient.subscribe("/topic/temperature", (message) => {
  //       const data = JSON.parse(message.body);
  //       setTemperature(data.temperature);
  //     });

  //     stompClient.subscribe("/topic/light", (message) => {
  //       const data = JSON.parse(message.body);
  //       setBrightness(data.brightness);
  //     });

  //     stompClient.subscribe("/topic/distance", (message) => {
  //       const data = JSON.parse(message.body);
  //       setDistance(data.motion);
  //     });
  //   });

  //   return () => {
  //     stompClient.disconnect(() => {
  //       console.log("WebSocket disconnected");
  //     });
  //   };
  // }, [])

  // fetch api for fan device
  useFetch("FAN-1", setFanOn);
  useFetch("DOOR-1", setDoorOpen);
  useFetch("LED-1", setLightOn);
  useFetch("LED-1", setLightColor);

  useEffect(() => {
    const GetLatestFanCommand = async () => {
      try {
        const response = await axios.get(
          "https://smart-home-backend-07op.onrender.com/api/commands/fan/latest",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFanSpeed(response.data.speed);
      } catch (error: any) {
        console.log(error);
      }
    };

    const GetLatestLightCommand = async () => {
      try {
        const response = await axios.get(
          "https://smart-home-backend-07op.onrender.com/api/commands/light/latest",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLightColor(response.data.color);
      } catch (error: any) {
        console.log(error);
      }
    };

    GetLatestFanCommand();
    GetLatestLightCommand();
  }, [setFanSpeed, setLightColor]);

  const handleSpeed = async (speed: string) => {
    try {
      const response = await axios.post(
        "https://smart-home-backend-07op.onrender.com/api/commands/fan",
        {
          speed: speed,
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFanOn(speed === "0" ? "Off" : "On");
      setFanSpeed(response.data.speed);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleDoorOpen = async (status: string) => {
    try {
      const num: string = status == "Open" ? "1" : "0";

      await axios.post(
        "https://smart-home-backend-07op.onrender.com/api/commands/door",
        {
          status: num,
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDoorOpen(status);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleLightOn = async (status: string) => {
    try {
      await axios.post(
        "https://smart-home-backend-07op.onrender.com/api/commands/light/status",
        {
          status: status,
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLightOn(status);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleLightColorChange = async (color: string) => {
    try {
      await axios.post(
        "https://smart-home-backend-07op.onrender.com/api/commands/light/color",
        {
          color: color,
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLightColor(color);
    } catch (error: any) {
      console.log(error);
    }
  };
  const [isListening, setIsListening] = useState(false);
  const [command, setCommand] = useState<string | null>(null);

  const handleCommand = (command: string) => {
    switch (command) {
      // Light
      case "LightOn":
        handleLightOn("On");
        break;
      case "LightOff":
        handleLightOn("Off");
        break;

      // Door
      case "DoorOpen":
        handleDoorOpen("Open");
        break;
      case "DoorClose":
        handleDoorOpen("Close");
        break;

      // Fan
      case "FanOff":
        handleSpeed("0");
        break;
      case "FanLow":
        handleSpeed("1");
        break;
      case "FanMedium":
        handleSpeed("2");
        break;
      case "FanHigh":
        handleSpeed("3");
        break;

      default:
        console.log("Unknown voice command:", command);
        break;
    }
  };

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
          <div className="grid grid-cols-4 gap-18">
            <OverviewCard title="Humidity" value={humidity} threshold={30} />
            <OverviewCard
              title="Brightness"
              value={brightness}
              threshold={10}
            />
            <OverviewCard
              title="Temperature"
              value={temperature}
              threshold={33}
            />
            <OverviewCard title="Distance" value={distance} />
          </div>

          {/* Devices */}
          <h1 className="text-xl font-semibold">Devices</h1>
          <div className="grid grid-cols-4 gap-4">
            <LightControlCard
              isOn={lightOn}
              color={lightColor}
              onToggle={(status) => handleLightOn(status)}
              onColorChange={(hex) => handleLightColorChange(hex)}
            />

            <DoorControlCard
              isOpen={doorOpen}
              onToggle={(status) => handleDoorOpen(status)}
            />

            <FanControlCard
              isOn={fanOn}
              currentSpeed={fanSpeed}
              onChangeSpeed={(speed) => handleSpeed(speed)}
            />
            <div className="mt-4 space-y-2">
              <button
                onClick={() => setIsListening(!isListening)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                {isListening ? (
                  <>
                    <MicOff className="w-5 h-5" /> Stop Voice Control
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" /> Start Voice Control
                  </>
                )}
              </button>

              <VoiceRecognition
                isListening={isListening}
                toggleListening={() => setIsListening(!isListening)}
                onCommand={handleCommand}
              />
            </div>
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
