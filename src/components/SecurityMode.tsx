import axios from "axios";
import { Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import formatToDatetimeLocal from "../utils/changeDateTime";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { toast } from "react-toastify";

export default function SecurityMode() {
  const [isOn, setOn] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const token = localStorage.getItem("token");
  const soundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    soundRef.current = new Audio("/police-sirens-316719.mp3");
  }, []);

  const fetchSecurityModeStatus = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/device/DISTANCE-1/auto-mode",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.startTime && response.data.endTime) {
        setOn(true);
      } else {
        setOn(false);
      }

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
  }, []);

  useEffect(() => {
    const socket = new SockJS(
      `http://localhost:8080/ws?Authorization=${encodeURIComponent(
        `Bearer ${token}`
      )}`
    );
    const stompClient: CompatClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log("WebSocket connected");

      stompClient.subscribe("/topic/alert", (message) => {
        if (!soundRef.current) return;
        const alertData = JSON.parse(message.body);

        if (alertData.alert) {
          toast.warning(alertData.message, { toastId: "security-alert" });

          setIsAlert(true);
          soundRef.current.preload = "auto";
          soundRef.current.currentTime = 0;
          soundRef.current.play();
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
          toast.error("Please set start time and end time");
          return;
        }
        const payload = {
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
        };

        const response = await axios.post(
          "http://localhost:8080/api/commands/security-mode/on",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(response.data.message, { toastId: "security-toggle" });
      } else {
        const response = await axios.post(
          "http://localhost:8080/api/commands/security-mode/off",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(response.data.message, { toastId: "security-toggle" });
        setStartTime("");
        setEndTime("");
      }

      fetchSecurityModeStatus();
    } catch (error: any) {
      console.error("Error toggling security mode:", error);
    }
  };

  const handleTurnOffSound = () => {
    setIsAlert(false);
    soundRef.current?.pause();
  };

  return (
    <div className="bg-white rounded-xl w-full p-8 space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-lg font-medium flex items-center gap-2">
          Security Mode
          <Info size={18} className="text-gray-500 cursor-pointer" />
        </p>

        <div className="flex flex-row space-x-5 justify-center items-center">
          {isAlert && <button onClick={handleTurnOffSound} className="bg-red-600 rounded-full p-2 h-10 w-10 text-white cursor-pointer">
            &#9632;
          </button>}

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
