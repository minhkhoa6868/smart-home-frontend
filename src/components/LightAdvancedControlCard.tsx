import { useState } from "react";
import { useEffect } from "react";
import { Lightbulb } from "lucide-react";
import axios from "axios";

export default function LightAdvancedControlCard() {
  const [scheduleMode, setScheduleMode] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [timeOn, setTimeOn] = useState("");
  const [timeOff, setTimeOff] = useState("");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [lightOn, setLightOn] = useState("Off");
  const handleApply = async () => {
    try {
      console.log("Applied:", { scheduleMode, autoMode, timeOn, timeOff });

      // Nếu thời gian hiện tại trùng với thời gian bật, thì bật đèn
      const currentTime = new Date().toTimeString().slice(0, 5); // "HH:MM"
      if (scheduleMode && timeOn === currentTime) {
        await handleLightOn("On");
      }

      if (scheduleMode && timeOff === currentTime) {
        await handleLightOn("Off");
      }

      alert("Settings applied successfully");
    } catch (error) {
      console.error("Failed to apply:", error);
      alert("Failed to apply settings");
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toTimeString().slice(0, 5); // "HH:MM"

      if (scheduleMode && now === timeOn) {
        handleLightOn("On");
      }

      if (scheduleMode && now === timeOff) {
        handleLightOn("Off");
      }
    }, 1000 * 30); // kiểm tra mỗi 30 giây

    return () => clearInterval(interval); // cleanup khi unmount
  }, [scheduleMode, timeOn, timeOff]); // theo dõi các biến liên quan

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
  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-xl w-full flex gap-6 items-start">
      {/* Icon đèn */}
      <div className="w-24 h-24 bg-yellow-50 rounded-md flex items-center justify-center text-yellow-500">
        <Lightbulb size={48} />
      </div>

      {/* Điều khiển */}
      <div className="flex flex-col gap-3 text-sm text-gray-700 w-full">
        <div className="flex justify-between">
          <span>Schedule Mode</span>
          <button
            onClick={() => setScheduleMode(!scheduleMode)}
            className={`px-3 py-0.5 rounded text-xs font-medium ${
              scheduleMode
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {scheduleMode ? "ON" : "OFF"}
          </button>
        </div>

        <div className="flex justify-between items-center">
          <span>Time ON</span>
          <input
            type="time"
            value={timeOn}
            onChange={(e) => setTimeOn(e.target.value)}
            className="bg-gray-100 rounded px-2 py-1"
          />
        </div>

        <div className="flex justify-between items-center">
          <span>Time OFF</span>
          <input
            type="time"
            value={timeOff}
            onChange={(e) => setTimeOff(e.target.value)}
            className="bg-gray-100 rounded px-2 py-1"
          />
        </div>

        <div className="flex justify-between">
          <span>Auto Mode</span>
          <button
            onClick={() => setAutoMode(!autoMode)}
            className={`px-3 py-0.5 rounded text-xs font-medium ${
              autoMode
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {autoMode ? "ON" : "OFF"}
          </button>
        </div>

        <button
          onClick={handleApply}
          className="mt-3 bg-blue-500 text-white px-4 py-1.5 rounded hover:bg-blue-600 text-sm self-end"
        >
          Apply Settings
        </button>
      </div>
    </div>
  );
}
