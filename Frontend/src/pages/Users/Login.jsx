import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios.js";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    const isPhone = /^[0-9]{10}$/.test(phoneOrEmail);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(phoneOrEmail);

    if (!isPhone && !isEmail) {
      const errorMessage = "Please enter a valid phone number or email.";
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    try {
      const payload = isPhone
        ? { phone: phoneOrEmail, password }
        : { email: phoneOrEmail, password };

      const res = await axiosInstance.post("/auth/login", payload);

      localStorage.setItem("token", res.data.token);
      toast.success("Login successful!");
      navigate("/home");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Login to your Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Phone Number or Email
            </label>
            <input
              type="text"
              value={phoneOrEmail}
              onChange={(e) => {
                setPhoneOrEmail(e.target.value);
                setError(null);
              }}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your phone number or email"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition-all"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-600 font-semibold ml-1"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}