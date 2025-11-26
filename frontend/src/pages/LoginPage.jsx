import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import Nav from "../components/Nav";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const serverUrl = "http://localhost:8000";
  const location = useLocation();
  const initialRole = location?.state?.role || "customer";
  const [role] = useState(initialRole);

  const handleSignIn = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password, role },
        { withCredentials: true }
      );

      toast.success("Login successful!");

      const { accessToken, role: userRole } = result.data || {};
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      if (userRole) {
        localStorage.setItem("role", userRole);
      }
      navigate(
        userRole === "banker" ? "/banker-dashboard" : "/customer-dashboard",
        { replace: true }
      );
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "An error occurred";

      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <div className="flex items-center justify-center px-6 pt-24 pb-20">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {role === "banker" ? "Banker Login" : "Customer Login"}
              </h1>
              <p className="text-gray-600">
                Welcome back! Please enter your credentials.
              </p>
            </div>

            {/* Email */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[var(--color-primary)] transition"
                required
                autoFocus
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-semibold mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[var(--color-primary)] transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <FaRegEyeSlash size={20} />
                  ) : (
                    <FaRegEye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In button */}
            <button
              type="button"
              onClick={handleSignIn}
              className="w-full bg-gradient-to-r from-[#39b385] to-[#9be15d] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              Sign In
            </button>

            {/* Sign Up Link */}
            <p className="text-center mt-6 text-gray-600">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/signup", { state: { role } })}
                className="font-semibold text-[var(--color-primary-darker)] cursor-pointer hover:underline"
              >
                Sign Up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
