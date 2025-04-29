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
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import axios from "axios";
import { toast } from "react-toastify";
import PowerConsumptionCard from "../components/PowerConsumptionCard";

// Trạng thái các thiết bị
const humidityTrend = Array.from({ length: 24 }, (_, hour) => ({
  timestamp: `2025-04-24T${hour.toString().padStart(2, "0")}:00:00+07:00`,
  humidity: Math.floor(Math.random() * 41) + 40, // Random từ 40 đến 80
}));
const temperatureTrend = Array.from({ length: 24 }, (_, hour) => ({
  timestamp: `2025-04-24T${hour.toString().padStart(2, "0")}:00:00+07:00`,
  temperature: Math.floor(Math.random() * 21) + 10, // Random từ 10 đến 30
}));

// src/pages/Dashboard.tsx
export default function Dashboard() {
  const [doorOpen, setDoorOpen] = useState("Close");
  const [fanSpeed, setFanSpeed] = useState("0");
  const [fanOn, setFanOn] = useState("Off");
  const [lightOn, setLightOn] = useState<string>("Off");
  const [humidity, setHumidity] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [powerConsumption, setPowerConsumption] = useState(0);
  const [command, setCommand] = useState<string>("");
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  // const [brightness, setBrightness] = useState(0);
  // const [distance, setDistance] = useState(0);
  // const [humidityTrend, setHumidityTrend] = useState([]);
  // const [temperatureTrend, setTemperatureTrend] = useState([]);

  // mock data for trend

  useEffect(() => {
    const socket = new SockJS(
      `http://localhost:8080/ws?Authorization=${encodeURIComponent(
        `Bearer ${token}`
      )}`
    );

    const stompClient: CompatClient = Stomp.over(socket);

    stompClient.connect(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      () => {
        console.log("WebSocket connected");

        stompClient.subscribe("/topic/humidity", (message) => {
          const data = JSON.parse(message.body);
          setHumidity(data.humidity);
        });

        stompClient.subscribe("/topic/temperature", (message) => {
          const data = JSON.parse(message.body);
          setTemperature(data.temperature);
        });

        stompClient.subscribe("/topic/power", (message) => {
          const data = JSON.parse(message.body);
          setPowerConsumption(data.power);
        });

        // stompClient.subscribe("/topic/light", (message) => {
        //   const data = JSON.parse(message.body);
        //   setBrightness(data.brightness);
        // });

        // stompClient.subscribe("/topic/distance", (message) => {
        //   const data = JSON.parse(message.body);
        //   setDistance(data.motion);
        // });
      }
    );

    return () => {
      stompClient.disconnect(() => {
        console.log("WebSocket disconnected");
      });
    };
  }, []);

  const GetLatestFanCommand = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/commands/fan/latest",
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

  useEffect(() => {
    console.log(powerConsumption);
    GetLatestFanCommand();
  }, []);

  // useEffect(() => {
  //   const fetchHumidityData = async () => {
  //     try {
  //       const response = await axios.get(
  //         "https://smart-home-backend-07op.onrender.com/api/records/humidity/today",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       console.log(response.data);
  //       setHumidityTrend(response.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   const fetchTemperatureData = async () => {
  //     try {
  //       const response = await axios.get(
  //         "https://smart-home-backend-07op.onrender.com/api/records/temperature/today",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       console.log(response.data);
  //       setTemperatureTrend(response.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchHumidityData();
  //   fetchTemperatureData();
  // }, [setHumidityTrend, setTemperatureTrend]);

  const handleSpeed = async (speed: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/commands/fan",
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

      toast.success(
        speed == "0"
          ? `Fan is turned off!`
          : `Fan is turned on with speed ${speed}!`
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
        "http://localhost:8080/api/commands/door",
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

      toast.success(status == "Open" ? "Door is opened!" : "Door is closed!");
      setDoorOpen(status);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleLightOn = async (status: string) => {
    try {
      await axios.post(
        "http://localhost:8080/api/commands/light/status",
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

      toast.success(status == "On" ? "Light is on!" : "Light is off!");
      setLightOn(status);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleCommand = (command: string) => {
    if (command === lastCommand) {
      return;
    }

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
    setLastCommand(command);
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
            <OverviewCard
              title="Humidity"
              value={humidity}
              threshold_upper={100}
              threshold_lower={60}
              unit="%"
            />

            <OverviewCard
              title="Temperature"
              value={temperature}
              threshold_upper={33}
              threshold_lower={10}
              unit="*C"
            />

            <PowerConsumptionCard 
              powerConsumption={powerConsumption}
              powerConsumptionUnit="KWh"
            />
          </div>

          {/* Devices */}
          <h1 className="text-xl font-semibold">Devices</h1>
          <div className="grid grid-cols-4 gap-4">
            <LightControlCard
              token={token}
              userId={userId}
              isOn={lightOn}
              setIsOn={setLightOn}
            />

            <DoorControlCard
              isOpen={doorOpen}
              setIsOpen={setDoorOpen}
              onToggle={(status) => handleDoorOpen(status)}
            />

            <FanControlCard
              isOn={fanOn}
              setIsOn={setFanOn}
              currentSpeed={fanSpeed}
              onChangeSpeed={(speed) => handleSpeed(speed)}
            />

            <div className="bg-white rounded-xl p-4 shadow w-[180px] text-center transition-all space-y-3">
              <p className="text-sm text-gray-500 mb-1">Voice Command</p>

              <div className="flex justify-center items-center">
                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full transition cursor-pointer ${
                    isListening
                      ? "bg-red-500 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              <div
                className={`text-sm font-medium transition ${
                  isListening ? "text-red-500" : "text-gray-400"
                }`}
              >
                {isListening ? "Listening..." : "Click to speak"}
              </div>

              {/* Kết quả giọng nói hiện ra khi nhận được */}
              {command && (
                <div className="text-xs text-gray-600 italic mt-2">
                  Your Command:{" "}
                  <span className="font-semibold text-black">{command}</span>
                </div>
              )}

              <VoiceRecognition
                isListening={isListening}
                onCommand={(cmd) => {
                  handleCommand(cmd);
                  setCommand(cmd);
                }}
              />
            </div>
          </div>

          {/* Trends */}
          <h1 className="text-xl font-semibold">Environmental Trends</h1>
          <div className="grid grid-cols-2 gap-4 ">
            <TrendChart
              title="Humidity"
              data={humidityTrend}
              valueKey="humidity"
            />
            <TrendChart
              title="Temperature"
              data={temperatureTrend}
              valueKey="temperature"
            />
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
