import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function LightControlCard({
  token,
  userId,
  isOn,
  setIsOn,
}: {
  token: string | null;
  userId: string | null;
  isOn: string;
  setIsOn: (status: string) => void;
}) {
  const [color, setColor] = useState("#ffffff");
  const [selectedColor, setSelectedColor] = useState("#ffffff");

  useEffect(() => {
    fetchLed();
  }, []);

  useEffect(() => {
    const isValidColor = /^#[0-9A-Fa-f]{6}$/.test(color);
    setSelectedColor(isValidColor ? color : "#ffffff");
  }, [color]);

  const fetchLed = async () => {
    try {
      const response = await axios.get(
        "https://smart-home-backend-07op.onrender.com/api/device/led",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsOn(response.data.status);
      setColor(response.data.color);
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleToggle = async () => {
    const newStatus = isOn === "On" ? "Off" : "On";
    try {
      await axios.post(
        "https://smart-home-backend-07op.onrender.com/api/commands/light/status",
        {
          status: newStatus,
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(newStatus === "On" ? "Light is on!" : "Light is off!");
      setIsOn(newStatus);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
  };

  const handleSubmitColor = async () => {
    try {
      await axios.post(
        "https://smart-home-backend-07op.onrender.com/api/commands/light/color",
        {
          color: selectedColor,
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`Changed color to ${selectedColor}!`);
      setColor(selectedColor);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow w-[180px] text-center transition-all">
      <p className="text-sm text-gray-500 mb-1">{isOn}</p>

      <div
        className="flex justify-center items-center w-12 h-12 mx-auto mb-2 rounded-full"
        style={{
          backgroundColor: isOn === "On" ? selectedColor : "#e5e7eb",
        }}
      >
        <Lightbulb
          size={24}
          className={`transition duration-300 ${
            isOn === "On"
              ? selectedColor.toLowerCase() === "#ffffff"
                ? "text-gray-600"
                : "text-white"
              : "text-gray-400"
          }`}
        />
      </div>

      <div className="font-semibold mb-2">Light</div>

      <div className="mb-3 flex justify-center">
        <button
          onClick={handleToggle}
          className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 cursor-pointer ${
            isOn === "On" ? "bg-blue-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform duration-300 ease-in-out cursor-pointer ${
              isOn === "On" ? "translate-x-5" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <div className="flex items-center gap-2 justify-center">
        <input
          type="color"
          value={selectedColor}
          onChange={handleColorChange}
          className="h-10 w-10 rounded cursor-pointer border border-gray-300"
        />
        {selectedColor !== color && (
          <button
            onClick={handleSubmitColor}
            className="px-2 py-2 bg-gray-200 text-white text-sm rounded hover:bg-blue-400 transition flex items-center gap-1"
          >
            <span>OK</span>
          </button>
        )}
      </div>
    </div>
  );
}
