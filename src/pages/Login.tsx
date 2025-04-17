import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Gửi dữ liệu đăng nhập
    console.log("Login with:", { username, password });
    // TODO: gọi API login tại đây
    if (username && password) {
      // Giả sử login hợp lệ
      navigate("/dashboard");
    } else {
      alert("Please enter username and password.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center space-y-6">
      {/* Tiêu đề lớn */}
      <h1 className="text-3xl font-bold text-blue-600 tracking-wide">
        SmartHome Login
      </h1>
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded border shadow w-80"
      >
        <h2 className="text-center text-xl font-bold mb-6">LOGIN</h2>

        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-blue-50 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-200"
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-blue-50 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-200"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>

        <p className="text-center text-sm mt-4 text-gray-600">
          Don't have an account?{" "}
          <a href="#" className="text-blue-400 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
