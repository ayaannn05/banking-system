import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

function LoginPage() {
  // Brand colors
  const PRIMARY_GRAD = "linear-gradient(90deg, #38bdf8 0%, #6366f1 100%)"; // Matches landing page
  const BG_GRAD =
    "linear-gradient(120deg, #1e293b 0%, #232a3e 80%, #181135 100%)";
  const CARD_BG = "rgba(30,41,59,0.75)"; // Glass effect color

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
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: BG_GRAD }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl p-8 border backdrop-blur-lg"
        style={{
          background: CARD_BG,
          border: "1px solid rgba(99,102,241,0.12)",
          boxShadow: "0 8px 44px 0 rgba(38,50,56,0.25)",
        }}
      >
        <h1
          className="text-3xl font-extrabold mb-3 text-center tracking-tight"
          style={{
            background: PRIMARY_GRAD,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {role === "banker" ? "Banker Login" : "Customer Login"}
        </h1>
        <p className="text-blue-200 mb-8 text-center text-base">
          Sign in to your account and start modern banking in seconds.
        </p>

        {/* Email */}
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block text-blue-100 font-medium mb-1"
          >
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-base bg-transparent text-white focus:outline-none focus:border-[#38bdf8] transition"
            style={{ border: "1px solid rgba(99,102,241,0.27)" }}
            required
            autoFocus
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block text-blue-100 font-medium mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-base bg-transparent text-white focus:outline-none focus:border-[#38bdf8] transition"
              style={{ border: "1px solid rgba(99,102,241,0.27)" }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="cursor-pointer absolute right-3 top-2.5 text-blue-200"
              tabIndex={-1}
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
        </div>

        {/* Sign In button */}
        <button
          type="button"
          onClick={handleSignIn}
          className="w-full font-semibold py-2 rounded-xl mt-1 transition duration-200"
          style={{
            background: PRIMARY_GRAD,
            color: "#fff",
            boxShadow: "0 2px 20px 0 rgba(99,102,241,0.14)",
          }}
        >
          Sign In
        </button>

        {/* Sign in with Google */}
        <button
          type="button"
          onClick={() => window.alert("Google Sign In - implement OAuth")}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl mt-5 font-semibold bg-white text-[#232a3e] shadow hover:bg-[#f3f4f6] transition"
        >
          <FcGoogle className="text-xl" /> Sign in with Google
        </button>

        {/* Sign Up Link */}
        <p className="text-center mt-7 text-blue-100 text-sm">
          Want to create a new account?
          <span
            onClick={() => navigate("/signup", { state: { role } })}
            className="ml-2 font-semibold cursor-pointer"
            style={{ color: "#38bdf8" }}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
