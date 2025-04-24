import { Info } from "lucide-react";
import { useState } from "react";

export default function SecurityMode() {
  const [isOn, setOn] = useState(false);
  return (
    <div className="bg-white rounded-xl w-full p-8 space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-lg font-medium flex items-center gap-2">
          Security Mode
          <Info size={18} className="text-gray-500 cursor-pointer" />
        </p>

        {/* Toggle switch */}
        <button
          onClick={() => setOn(!isOn)}
          className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 ${
            isOn ? "bg-blue-500" : "bg-gray-200"
          }`}
        >
          <span
            className={`inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform duration-300 ease-in-out ${
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
            type="time"
            id="start-time"
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
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
