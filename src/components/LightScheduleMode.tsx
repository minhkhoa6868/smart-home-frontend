import { useEffect, useState } from "react";
import axios from "axios";
import { Info } from "lucide-react";
import formatToDatetimeLocal from "../utils/changeDateTime";

export default function LightScheduleMode() {
  const [enabled, setEnabled] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const token = localStorage.getItem("token");

  const fetchLightModeStatus = async () => {
    try {
      const response = await axios.get(
        "https://smart-home-backend-07op.onrender.com/api/device/LED-1/auto-mode",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      setEnabled(response.data.isAutoMode);
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
    fetchLightModeStatus();
  }, [setEnabled, setStartTime, setEndTime]);

  const handleToggle = async () => {
    try {
      if (!enabled) {
        // Bật chế độ auto
        if (startTime == "" || endTime == "") {
          alert("Please set start time and end time");
          return;
        }
        const payload = {
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
        };
        const response = await axios.post(
          "https://smart-home-backend-07op.onrender.com/api/commands/light/auto-mode/on",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert(response.data.message);
      } else {
        // Tắt chế độ auto
        const response = await axios.post(
          "https://smart-home-backend-07op.onrender.com/api/commands/light/auto-mode/off",
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

      setEnabled((prev) => !prev);
    } catch (error) {
      console.error("Error toggling auto mode:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl w-full p-8 space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-lg font-medium flex items-center gap-2">
          Light Schedule Mode
          <span title="Enable lights to turn on/off automatically during a time range.">
            <Info size={18} className="text-gray-500 cursor-pointer" />
          </span>
        </p>

        {/* Toggle */}
        <button
          onClick={handleToggle}
          className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 cursor-pointer ${
            enabled ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform duration-300 ease-in-out cursor-pointer ${
              enabled ? "translate-x-5" : "translate-x-1"
            }`}
          />
        </button>
      </div>

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
