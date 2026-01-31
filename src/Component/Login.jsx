import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";
import api from "../api/api";

export default function Login() {
  const navigate = useNavigate();

  // 1 = Login, 2 = OTP
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAs, setLoginAs] = useState("STUDENT");
  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  /* ================= OTP TIMER ================= */
  useEffect(() => {
    if (step === 2) {
      setTimer(60);
      const interval = setInterval(() => {
        setTimer((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [step]);

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await api.post("/auth/login", { email, password, loginAs });
      setStep(2);
    } catch (err) {
      setError(err.response?.data || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Enter valid 6-digit OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-otp", {
        email,
        otp,
        loginAs,
      });

      const token = res.data;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      const role = decoded.role;

      if (role === "ADMIN") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/student-dashboard", { replace: true });
      }
    } catch {
      setError("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESEND OTP ================= */
  const handleResendOtp = async () => {
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/resend-otp", { email, loginAs });
      setTimer(60);
    } catch {
      setError("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

        {/* HEADER */}
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {step === 1 ? "Welcome Back 👋" : "Verify OTP 🔐"}
        </h2>

        <p className="text-center text-gray-500 text-sm mt-2 mb-6">
          {step === 1
            ? "Login to access your dashboard"
            : "Enter the OTP sent to your email"}
        </p>

        {error && (
          <p className="text-red-500 text-center mb-4 text-sm">{error}</p>
        )}

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <>
            {/* Email */}
            <div className="mb-4">
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="text-sm text-gray-600">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border rounded-lg pr-12 focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Role */}
            <div className="mb-6">
              <label className="text-sm text-gray-600">Login as</label>
              <select
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={loginAs}
                onChange={(e) => setLoginAs(e.target.value)}
              >
                <option value="STUDENT">Student</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
            >
              {loading ? "Sending OTP..." : "Login"}
            </button>

            {/* Google Login */}
            <button
              onClick={() =>
                (window.location.href =
                  "http://localhost:8081/oauth2/authorization/google")
              }
              className="w-full mt-4 border py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="h-5 w-5"
              />
              Continue with Google
            </button>

            {/* Signup */}
            {loginAs === "STUDENT" && (
              <p className="text-center text-sm mt-5 text-gray-600">
                New student?
                <button
                  onClick={() => navigate("/signup")}
                  className="ml-1 text-blue-600 font-semibold hover:underline"
                >
                  Create account
                </button>
              </p>
            )}
          </>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <>
            <input
              type="text"
              maxLength={6}
              inputMode="numeric"
              placeholder="Enter OTP"
              className="w-full px-4 py-3 border rounded-lg text-center tracking-widest text-lg focus:ring-2 focus:ring-green-500"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              disabled={timer > 0 || loading}
              onClick={handleResendOtp}
              className="w-full mt-4 text-sm text-blue-600 hover:underline disabled:text-gray-400"
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full mt-3 text-sm text-gray-500 hover:underline"
            >
              Change email or password
            </button>
          </>
        )}
      </div>
    </div>
  );
}
