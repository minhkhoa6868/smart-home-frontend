import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type TrendPoint = {
  time: string;
  value: number;
};

type RawData = {
  timestamp: string;
  [key: string]: number | string | null;
};

function handleTrendData(rawData: RawData[], valueKey: string): TrendPoint[] {
  return rawData.map((item) => {
    const date = new Date(item.timestamp);
    const hour = date.getHours().toString();
    const minute = date.getMinutes().toString().padStart(2, "0");

    const rawValue = item[valueKey];
    const safeValue =
      typeof rawValue === "number" && !isNaN(rawValue) ? rawValue : 0;

    return {
      time: `${hour}:${minute}`,
      value: safeValue,
    };
  });
}
export default function TrendChart({
  title,
  data,
  valueKey,
}: {
  title: string;
  data: RawData[];
  valueKey: string; // <-- thêm valueKey
}) {
  return (
    <div className="bg-white rounded-xl p-8 w-full h-[200px]">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold">{title}</p>
        <span className="text-sm text-gray-500">Today</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={handleTrendData(data, valueKey)}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            dot
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
