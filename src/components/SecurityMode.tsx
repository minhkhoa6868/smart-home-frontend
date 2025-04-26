import axios from "axios";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import formatToDatetimeLocal from "../utils/changeDateTime";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";

export default function SecurityMode() {
  const [isOn, setOn] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const token = localStorage.getItem("token");

  const fetchSecurityModeStatus = async () => {
    try {
      const response = await axios.get(
        "https://smart-home-backend-07op.onrender.com/api/device/DISTANCE-1/auto-mode",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOn(response.data.isAutoMode);
      if (response.data.startTime) {
        const formattedStart = formatToDatetimeLocal(response.data.startTime);
        setStartTime(formattedStart);
      } else {
        setStartTime("");
      }

      if (response.data.endTime) {
        const formattedEnd = formatToDatetimeLocal(response.data.endTime);
        setEndTime(formattedEnd);
      } else {
        setEndTime("");
      }
    } catch (error) {
      console.error("Error fetching security mode status:", error);
    }
  };

  useEffect(() => {
    fetchSecurityModeStatus();
  }, [setOn, setStartTime, setEndTime]);

  useEffect(() => {
    const socket = new SockJS(
      `https://smart-home-backend-07op.onrender.com/ws?Authorization=${encodeURIComponent(
        `Bearer ${token}`
      )}`
    );
    const stompClient: CompatClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log("WebSocket connected");

      stompClient.subscribe("/topic/alert", (message) => {
        const alertData = JSON.parse(message.body);

        if (alertData.alert) {
          alert(alertData.message);

          const alertSound = new Audio("/police-sirens-316719.mp3");
          alertSound.play().catch((err) => console.error("Sound play failed:", err));
        }
      });
    });

    return () => {
      if (stompClient.connected) {
        stompClient.disconnect(() => {
          console.log("WebSocket disconnected");
        });
      }
    };
  }, []);

  const handleToggle = async () => {
    try {
      if (!isOn) {
        if (startTime == "" || endTime == "") {
          alert("Please set start time and end time");
          return;
        }
        const payload = {
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
        };

        const response = await axios.post(
          "https://smart-home-backend-07op.onrender.com/api/commands/security-mode/on",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert(response.data.message);
      } else {
        const response = await axios.post(
          "https://smart-home-backend-07op.onrender.com/api/commands/security-mode/off",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert(response.data.message);
        setStartTime("");
        setEndTime("");
      }

      setOn((prev) => !prev);
    } catch (error: any) {
      console.error("Error toggling security mode:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl w-full p-8 space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-lg font-medium flex items-center gap-2">
          Security Mode
          <Info size={18} className="text-gray-500 cursor-pointer" />
        </p>

        {/* Toggle switch */}
        <button
          onClick={handleToggle}
          className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 cursor-pointer ${
            isOn ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform duration-300 ease-in-out cursor-pointer ${
              isOn ? "translate-x-5" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Time Inputs */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col w-full">
          <label htmlFor="start-time" className="text-sm font-medium mb-1">
            Start Time
          </label>
          <input
            type="datetime-local"
            id="start-time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="end-time" className="text-sm font-medium mb-1">
            End Time
          </label>
          <input
            type="datetime-local"
            id="end-time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
