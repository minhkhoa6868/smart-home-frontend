import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import HistoryItem from "../components/HistoryItem";
import RightPanel from "../components/RightPanel";
import axios from "axios";

type HistoryRecord = {
  label: string;
  timestamp: string; // Giữ timestamp gốc để dễ filter
  user: string;
  status: "on" | "off";
};

const ITEMS_PER_PAGE = 12;

export default function History() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>("");

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

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://smart-home-backend-07op.onrender.com/api/commands/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log("History data:", data);

      // Sort data mới nhất trước
      data.sort((a: any, b: any) => {
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      });

      const formatted: HistoryRecord[] = data.map((item: any) => ({
        label: item.deviceName,
        timestamp: item.timestamp, // giữ nguyên timestamp gốc
        user: item.userName,
        status: item.status.toLowerCase() === "on" ? "on" : "off",
      }));

      setHistory(formatted);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Filter theo ngày nếu có chọn
  const filteredHistory = selectedDate
    ? history.filter((item) => {
        const itemDate = new Date(item.timestamp).toISOString().slice(0, 10); // 2025-04-26
        return itemDate === selectedDate;
      })
    : history;

  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleResetDate = () => {
    setSelectedDate("");
  };

  return (
    <div className="grid grid-cols-12 gap-8 min-h-screen p-6 bg-[#E8F3FC]">
      {/* Sidebar - Left */}
      <div className="col-span-2">
        <Sidebar />
      </div>

      <div className="col-span-8">
        <h1 className="font-semibold text-2xl ml-2 mb-4">History</h1>

        {/* Date Picker */}
        <div className="flex items-center gap-4 mb-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setCurrentPage(1); // Reset về page 1 khi chọn filter
            }}
            className="bg-white border rounded p-2"
          />
          {selectedDate && (
            <button
              onClick={handleResetDate}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Clear
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl p-4 shadow">
          <div className="space-y-2">
            {paginatedHistory.length > 0 ? (
              paginatedHistory.map((h, i) => (
                <HistoryItem
                  key={i}
                  label={h.label}
                  time={formatTime(h.timestamp)} // chỉ format ở đây để hiển thị
                  user={h.user}
                  status={h.status}
                />
              ))
            ) : (
              <p className="text-gray-500">No history available.</p>
            )}

            {/* Pagination controls */}
            <div className="flex justify-between pt-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
              >
                Previous
              </button>

              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <RightPanel />
      </div>
    </div>
  );
}
