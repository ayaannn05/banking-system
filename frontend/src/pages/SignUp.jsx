import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Nav from "../components/Nav";
import { API_CONFIG } from "../config/api";

function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialRole = location?.state?.role || "customer";
  const [role] = useState(initialRole);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    try {
      if (!userName || !email || !password) {
        toast.error("Please fill in all fields");
        return;
      }

      // Validate username length
      if (userName.trim().length < 3) {
        toast.error("Username must be at least 3 characters long");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      await axios.post(
        `${API_CONFIG.baseURL}/api/auth/signup`,
        {
          username: userName,
          email,
          password,
          role,
        },
        { withCredentials: true }
      );

      toast.success("Sign up successful! Please log in.");
      navigate("/login", { state: { role } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Sign up failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <div className="flex items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24 pb-12 sm:pb-20">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {role === "banker" ? "Banker Sign Up" : "Customer Sign Up"}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Create your account to get started.
              </p>
            </div>

            {/* Username */}
            <div className="mb-4 sm:mb-6">
              <label
                htmlFor="fullName"
                className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base"
              >
                Username
              </label>
              <input
                type="text"
                id="fullName"
                onChange={(e) => setUserName(e.target.value)}
                value={userName}
                placeholder="Enter your username"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 focus:outline-none focus:border-[var(--color-primary)] transition"
                required
                minLength={3}
                title="Username must be at least 3 characters long"
              />
            </div>

            {/* Email */}
            <div className="mb-4 sm:mb-6">
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 focus:outline-none focus:border-[var(--color-primary)] transition"
                required
                pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                title="Please enter a valid email address"
              />
            </div>

            {/* Password */}
            <div className="mb-4 sm:mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 focus:outline-none focus:border-[var(--color-primary)] transition"
                  required
                  minLength={6}
                  title="Password must be at least 6 characters long"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 sm:right-4 top-2.5 sm:top-3.5 text-gray-500 hover:text-gray-700"
                  aria-label="Toggle password visibility"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <FaRegEyeSlash size={18} className="sm:w-5 sm:h-5" />
                  ) : (
                    <FaRegEye size={18} className="sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign Up button */}
            <button
              onClick={handleSignUp}
              className="w-full bg-gradient-to-r from-[#39b385] to-[#9be15d] text-white font-bold py-3 sm:py-4 text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              Sign Up
            </button>

            <p className="text-center mt-4 sm:mt-6 text-sm sm:text-base text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login", { state: { role } })}
                className="font-semibold text-[var(--color-primary-darker)] cursor-pointer hover:underline"
              >
                Sign In
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
