export default function PowerConsumptionCard({
  powerConsumption,
  powerConsumptionUnit,
}: {
  powerConsumption: number;
  powerConsumptionUnit: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col text-center w-full">
      <p className="text-gray-500">Power Consumption</p>
      <div className="relative w-20 h-20 mx-auto my-2">
        {/* Viền ngoài mờ */}
        <div
          className={`absolute inset-0 rounded-full border-4 border-blue-200`}
        ></div>

        {/* Viền trong sáng hơn */}
        <div
          className={`absolute inset-1 rounded-full border-4 border-blue-500 animate-pulse`}
        ></div>

        {/* Giá trị */}
        <p
          className={`absolute inset-0 flex items-center justify-center text-xl font-bold text-blue-600}`}
        >
          {powerConsumption}
        </p>
      </div>
      <div className="text-gray-500 text-sm">{powerConsumptionUnit}</div>
    </div>
  );
}
