import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import api from "../api/api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    setError("");
    setSuccess("");

    const { name, email, password, confirmPassword, phone, address } = form;

    // ✅ All fields required
    if (!name || !email || !password || !confirmPassword || !phone || !address) {
      setError("All fields are required");
      return;
    }

    // ✅ Password match
    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match");
      return;
    }

    // ✅ Phone validation (exactly 10 digits)
    if (!/^\d{10}$/.test(phone)) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    try {
      await api.post("/auth/signup", form);
      setSuccess("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-8">

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Student Signup
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4 text-sm">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 text-center mb-4 text-sm">
            {success}
          </p>
        )}

        {/* Name */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Full Name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Sanket Darunkar"
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="student@gmail.com"
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Password</label>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg pr-12 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">
            Confirm Password
          </label>
          <div className="relative mt-1">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg pr-12 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showConfirm ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            required
            maxLength={10}
            inputMode="numeric"
            value={form.phone}
            placeholder="10-digit phone number"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setForm({ ...form, phone: value });
            }}
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        {/* Address */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-600">
            Address
          </label>
          <textarea
            name="address"
            required
            rows="3"
            value={form.address}
            onChange={handleChange}
            placeholder="Nagpur, Maharashtra"
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Signup
        </button>

        {/* Login Redirect */}
        <p className="text-center text-sm mt-5 text-gray-600">
          Already registered?
          <button
            onClick={() => navigate("/")}
            className="ml-1 text-green-600 font-semibold hover:underline"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}
