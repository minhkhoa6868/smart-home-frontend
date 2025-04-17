import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function TrendChart({
  title,
  data,
}: {
  title: string;
  data: any[];
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4 w-full">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold">{title}</p>
        <span className="text-sm text-gray-500">Today ⌄</span>
      </div>
      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={data}>
          <XAxis dataKey="time" hide />
          <YAxis hide />
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
