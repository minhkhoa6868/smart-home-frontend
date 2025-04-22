import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import HistoryItem from "../components/HistoryItem";
import RightPanel from "../components/RightPanel";
import axios from "axios";

type HistoryRecord = {
  label: string;
  time: string;
  user: string;
  status: "on" | "off";
};

export default function History() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);

    return date.toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "https://smart-home-backend-07op.onrender.com/api/commands/five-latest",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        console.log("History data:", data);
        const formatted: HistoryRecord[] = data.map((item: any) => ({
          label: item.deviceName,
          time: formatTime(item.timestamp),
          user: item.userName,
          status: item.status.toLowerCase() === "on" ? "on" : "off",
        }));

        setHistory(formatted);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="grid grid-cols-12 gap-8 min-h-screen p-6 bg-[#E8F3FC]">
      {/* Sidebar - Left */}
      <div className="col-span-2">
        <Sidebar />
      </div>

      <div className="col-span-8">
        <h1 className="font-semibold text-2xl ml-2 mb-4">History</h1>
        <div className="bg-white rounded-xl p-4 shadow">
          <div className="space-y-2">
            {history.length > 0 ? (
              history.map((h, i) => <HistoryItem key={i} {...h} />)
            ) : (
              <p className="text-gray-500">No history available.</p>
            )}
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <RightPanel />
      </div>
    </div>
  );
}
