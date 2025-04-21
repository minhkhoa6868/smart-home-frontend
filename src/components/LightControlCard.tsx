import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react"; // hoặc dùng HeroIcon, tùy bạn

export default function LightControlCard({
  isOn,
  color,
  onToggle,
  onColorChange,
}: {
  isOn: string;
  color: string;
  onToggle: (status: string) => void;
  onColorChange: (newColor: string) => void;
}) {
  const [selectedColor, setSelectedColor] = useState(color);

  useEffect(() => {
    const isValidColor = /^#[0-9A-Fa-f]{6}$/.test(color);
    setSelectedColor(isValidColor ? color : "#ffffff");
  }, [color])

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);
    onColorChange(newColor); // gửi mã hex về backend ngay
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow w-[180px] text-center transition-all">
      <p className="text-sm text-gray-500 mb-1">{isOn}</p>

      {/* Icon đèn */}
      <div
        className="flex justify-center items-center w-12 h-12 mx-auto mb-2 rounded-full"
        style={{
          backgroundColor: isOn == "On" ? "#ffcc00" : "#e5e7eb", // Tailwind gray-200
        }}
      >
        <Lightbulb
          size={24}
          className={`${
            isOn == "On" ? "text-white" : "text-gray-400"
          } transition duration-300`}
        />
      </div>

      <div className="font-semibold mb-2">Light</div>

      {/* Nút bật/tắt hiện đại */}
      <div className="mb-3 flex justify-center">
        <button
          onClick={() => onToggle(isOn == "On" ? "Off" : "On")}
          className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 ${
            isOn == "On" ? "bg-blue-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform duration-300 ease-in-out ${
              isOn == "On" ? "translate-x-5" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Color picker */}
      <input
        type="color"
        value={selectedColor}
        onChange={handleColorChange}
        className="w-full h-10 rounded cursor-pointer border border-gray-300"
      />
    </div>
  );
}
