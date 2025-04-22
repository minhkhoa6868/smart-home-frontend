export default function OverviewCard({
  title,
  value,
  threshold_upper,
  threshold_lower,
  unit,
}: {
  title: string;
  value: number;
  threshold_upper?: number; // optional
  threshold_lower?: number; // optional,
  unit: string;
}) {
  const hasData = value > 0;

  const exceeded =
    hasData &&
    ((threshold_upper !== undefined && value >= threshold_upper) ||
      (threshold_lower !== undefined && value <= threshold_lower));

  return (
    <div className="bg-white rounded-xl shadow p-4 text-center w-full">
      <p className="text-gray-500">{title}</p>
      <div className="relative w-20 h-20 mx-auto my-2">
        {/* Viền ngoài mờ */}
        <div
          className={`absolute inset-0 rounded-full border-4 ${
            exceeded ? "border-red-200" : "border-blue-200"
          }`}
        ></div>

        {/* Viền trong sáng hơn */}
        <div
          className={`absolute inset-1 rounded-full border-4 ${
            exceeded ? "border-red-500" : "border-blue-500"
          } animate-pulse`}
        ></div>

        {/* Giá trị */}
        <p
          className={`absolute inset-0 flex items-center justify-center text-xl font-bold ${
            exceeded ? "text-red-500" : "text-blue-600"
          }`}
        >
          {value}
        </p>
      </div>
      <div className="text-gray-500 text-sm">{unit}</div>
    </div>
  );
}
