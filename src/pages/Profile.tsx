import { useState } from "react";
import { Pencil, Save } from "lucide-react"; // dùng icon từ lucide-react
import Sidebar from "../components/Sidebar"; // Đảm bảo đường dẫn đúng

export default function Profile() {
  const storedUsername = localStorage.getItem("username") || "User";

  const [username, setUsername] = useState(storedUsername);
  const [editing, setEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handleSave = () => {
    localStorage.setItem("username", username); // hoặc gửi API
    alert("Changes saved.");
    setEditing(false);
  };

  return (
    <div className="grid grid-cols-12 gap-8 min-h-screen p-6 bg-[#E8F3FC]">
      {/* Sidebar - Left */}
      <div className="col-span-2">
        <Sidebar />
      </div>

      <div className="col-span-8">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
          <div className="flex items-center gap-6 mb-8">
            <img
              src={`https://i.pravatar.cc/100?img=3{username}`}
              className="w-24 h-24 rounded-full shadow"
              alt="avatar"
            />
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{username}</h2>
              {!editing && (
                <button onClick={() => setEditing(true)} title="Edit Profile">
                  <Pencil
                    size={20}
                    className="text-blue-500 hover:text-blue-700"
                  />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={username}
                disabled={!editing}
                onChange={(e) => setUsername(e.target.value)}
                className={`mt-1 block w-full border rounded px-4 py-2 ${
                  editing ? "bg-white" : "bg-gray-100"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                disabled={!editing}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`mt-1 block w-full border rounded px-4 py-2 ${
                  editing ? "bg-white" : "bg-gray-100"
                }`}
                placeholder="Enter new password"
              />
            </div>

            {editing && (
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
