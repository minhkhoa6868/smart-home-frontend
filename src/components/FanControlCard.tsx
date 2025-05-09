import { Wind } from "lucide-react";
import useFetch from "../hooks/useFetch";

export default function FanControlCard({
  isOn,
  setIsOn,
  currentSpeed,
  onChangeSpeed,
}: {
  isOn: string;
  setIsOn: (status: string) => void;
  currentSpeed: string;
  onChangeSpeed: (s: string) => void;
}) {
  const speeds = ["0", "1", "2", "3"];

  useFetch("fan", setIsOn);

  return (
    <div className="bg-white rounded-xl p-4 shadow w-[180px] text-center transition-all">
      <p className="text-sm text-gray-500 mb-1">{isOn}</p>
      <Wind size={36} className="mx-auto text-blue-400 mb-2" />
      <div className="font-semibold mb-2">Fan</div>

      <div className="flex justify-center gap-2">
        {speeds.map((s) => (
          <button
            key={s}
            onClick={() => onChangeSpeed(s)}
            className={`w-8 h-8 rounded-full text-sm font-bold transition cursor-pointer ${
              s === currentSpeed
                ? "bg-blue-500 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-blue-100"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
