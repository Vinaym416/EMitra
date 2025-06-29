import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios.js";
import toast from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    phonenumber: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !form.username ||
      !form.email ||
      !form.phonenumber ||
      !form.password
    ) {
      const errorMessage = "All fields are required.";
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      const errorMessage = "Please enter a valid email address.";
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phonenumber)) {
      const errorMessage = "Please enter a valid 10-digit phone number.";
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    try {
      const payload = {
        username: form.username,
        email: form.email,
        phonenumber: form.phonenumber,
        password: form.password,
      };
      const res = await axiosInstance.post("/auth/register", payload);
      localStorage.setItem("token", res.data.token);
      toast.success("Signup successful!");
      navigate("/products");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Signup failed";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-300">
      <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg w-full max-w-md mx-2">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Create your Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your username"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Phone Number
            </label>
            <input
              type="text"
              name="phonenumber"
              value={form.phonenumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your phone number"
              required
              autoComplete="tel"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition-all"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 font-semibold ml-1"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}