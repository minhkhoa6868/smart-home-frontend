import { useState } from "react";
import axios from "axios";
import { Info } from "lucide-react";

export default function LightScheduleMode() {
  const [enabled, setEnabled] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleToggle = async () => {
    try {
      if (!enabled) {
        // Bật chế độ auto
        const payload = {
          startTime: new Date(`2025-04-24T${startTime}:00+07:00`).toISOString(),
          endTime: new Date(`2025-04-25T${endTime}:00+07:00`).toISOString(),
        };
        await axios.post(
          "https://smart-home-backend-07op.onrender.com/api/commands/light/auto-mode/on",
          payload
        );
        console.log("Auto mode ON");
      } else {
        // Tắt chế độ auto
        await axios.post(
          "https://smart-home-backend-07op.onrender.com/api/commands/light/auto-mode/off"
        );
        console.log("Auto mode OFF");
      }

      setEnabled(!enabled);
    } catch (error) {
      console.error("Error toggling auto mode:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl w-full p-8 space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-lg font-medium flex items-center gap-2">
          Light Schedule Mode
          <Info
            size={18}
            className="text-gray-500 cursor-pointer"
            title="Enable lights to turn on/off automatically during a time range."
          />
        </p>

        {/* Toggle */}
        <button
          onClick={handleToggle}
          className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 ${
            enabled ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform duration-300 ease-in-out ${
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
            type="time"
            id="start-time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="end-time" className="text-sm font-medium mb-1">
            End Time
          </label>
          <input
            type="time"
            id="end-time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
