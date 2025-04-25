import { memo } from "react";

export default memo(function HistoryItem({
  label,
  time,
  user,
  status,
}: {
  label: string;
  time: string;
  user: string;
  status: "on" | "off";
}) {
  const color = status === "on" ? "green" : status === "off" ? "red" : "gray";

  return (
    <div className="flex justify-between items-center text-sm py-1">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full bg-${color}-500`} />
        <div className="flex flex-col leading-tight">
          <span className="text-gray-800 font-medium">{label}</span>
          <span className="text-xs text-gray-500">
            Turned {status} • {user}
          </span>
        </div>
      </div>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  );
})
