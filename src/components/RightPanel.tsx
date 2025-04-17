import MemberCard from "./MemberCard";
import HistoryItem from "./HistoryItem";

export default function RightPanel() {
  const members = [
    { name: "Jaquiline", avatar: "https://i.pravatar.cc/100?u=1" },
    { name: "Sennorita", avatar: "https://i.pravatar.cc/100?u=2" },
    { name: "Firoz", avatar: "https://i.pravatar.cc/100?u=3" },
  ];

  const history = [
    { label: "Fan", time: "03:20", user: "Jaquiline", status: "on" },
    { label: "Refrigerator", time: "01:48", user: "Firoz", status: "on" },
    { label: "Light", time: "11:36", user: "Jaquiline", status: "off" },
    { label: "Door", time: "09:15", user: "Jaquiline", status: "off" },
  ];

  return (
    <div className="space-y-4">
      {/* Members */}
      <h3 className="font-semibold ml-2">Members</h3>
      <div className="bg-white rounded-xl p-4 shadow">
        <div className="flex justify-between items-center mb-2">
          <a href="#" className="text-sm text-blue-500">
            View all
          </a>
        </div>
        <div className="space-y-2">
          {members.map((m) => (
            <MemberCard key={m.name} {...m} />
          ))}
        </div>
        <button className="mt-4 w-full bg-blue-100 text-blue-600 rounded-full py-2 text-sm font-medium">
          Add Member
        </button>
      </div>

      {/* History */}
      <h3 className="font-semibold ml-2">History</h3>
      <div className="bg-white rounded-xl p-4 shadow">
        <div className="flex justify-between items-center mb-2">
          <a href="#" className="text-sm text-blue-500">
            View all
          </a>
        </div>
        <div className="space-y-2">
          {history.map((h, i) => (
            <HistoryItem key={i} {...h} status={h.status as "on" | "off"} />
          ))}
        </div>
      </div>
    </div>
  );
}
