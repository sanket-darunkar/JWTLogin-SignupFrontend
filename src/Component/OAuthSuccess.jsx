import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    localStorage.setItem("token", token);

    const { role } = jwtDecode(token);

    if (role === "ADMIN") {
      navigate("/admin-dashboard", { replace: true });
    } else {
      navigate("/student-dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white px-8 py-6 rounded-xl shadow-lg text-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Logging you in…
        </h2>
        <p className="text-gray-500 mt-2">
          Please wait while we complete Google authentication
        </p>
      </div>
    </div>
  );
}
