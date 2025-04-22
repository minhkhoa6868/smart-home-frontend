import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // ✅ mới
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "https://smart-home-backend-07op.onrender.com/auth/signup",
        {
          username,
          password,
        }
      );

      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        alert("Signup failed: " + error.response.data.message);
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center space-y-6">
      <h1 className="text-3xl font-bold text-blue-600 tracking-wide">
        CREAT NEW ACCOUNT
      </h1>

      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded border shadow w-80"
      >
        <h2 className="text-center text-xl font-bold mb-6">SIGN UP</h2>

        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-blue-50"
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-blue-50"
        />

        <input
          type="password"
          placeholder="confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-blue-50"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Sign Up
        </button>

        <p className="text-center text-sm mt-4 text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
