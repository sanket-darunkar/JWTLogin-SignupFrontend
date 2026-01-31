import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Component/Login";
import Signup from "./Component/Signup";
import StudentDashboard from "./Component/StudentDashboard";
import AdminDashboard from "./Component/AdminDashboard";
import OAuthSuccess from "./Component/OAuthSuccess";

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

        {/* 🔥 ROOT ROUTE FIX */}
        <Route
          path="/"
          element={
            token ? <Navigate to="/student-dashboard" /> : <Navigate to="/login" />
          }
        />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* Dashboards */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}
