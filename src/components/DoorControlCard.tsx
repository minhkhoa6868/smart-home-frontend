import { DoorOpen, DoorClosed } from "lucide-react"; // Nếu bạn cài `lucide-react`

export default function DoorControlCard({
  isOpen,
  onToggle,
}: {
  isOpen: string;
  onToggle: (status: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow w-[180px] text-center transition-all">
      <p className="text-sm text-gray-500 mb-1">{isOpen == "Open" ? "Open" : "Closed"}</p>

      <div className="flex justify-center items-center w-12 h-12 mx-auto mb-2 rounded-full bg-blue-100 text-blue-600">
        {isOpen ? <DoorOpen size={24} /> : <DoorClosed size={24} />}
      </div>

      <div className="font-semibold mb-2">Door</div>

      {/* Toggle switch đẹp */}
      <div className="flex justify-center">
        <button
          onClick={() => onToggle(isOpen != "Open" ? "Open" : "Closed")}
          className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 cursor-pointer ${
            isOpen == "Open" ? "bg-blue-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform duration-300 ease-in-out cursor-pointer ${
              isOpen == "Open" ? "translate-x-5" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
