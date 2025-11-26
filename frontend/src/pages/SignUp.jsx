import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

import { useLocation, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

function SignUp() {
  // Gradient color scheme matching your branding
  const PRIMARY_GRAD = "linear-gradient(90deg, #38bdf8 0%, #6366f1 100%)";
  const BG_GRAD =
    "linear-gradient(120deg, #1e293b 0%, #232a3e 80%, #181135 100%)";
  const CARD_BG = "rgba(30,41,59,0.75)";

  const navigate = useNavigate();
  const location = useLocation();
  const initialRole = location?.state?.role || "customer";
  const [role] = useState(initialRole);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const serverURL = "http://localhost:8000";

  const handleSignUp = async () => {
    try {
      await axios.post(
        `${serverURL}/api/auth/signup`,
        {
          username: userName,
          email,
          password,
          role,
        },
        { withCredentials: true }
      );

      toast.success("Sign up successful! Please log in.");

      // You might want to redirect to dashboard or login here
      navigate("/login", { state: { role } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Sign up failed");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
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
          {role === "banker" ? "Banker Sign Up" : "Customer Sign Up"}
        </h1>
        <p className="text-blue-200 mb-8 text-center text-base">
          Create your account for secure, modern banking.
        </p>
        {/* Username */}
        <div className="mb-5">
          <label
            htmlFor="fullName"
            className="block text-blue-100 font-medium mb-1"
          >
            User Name
          </label>
          <input
            type="text"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            placeholder="Enter your username"
            className="w-full border rounded-lg px-3 py-2 text-base bg-transparent text-white focus:outline-none focus:border-[#38bdf8] transition"
            style={{ border: "1px solid rgba(99,102,241,0.27)" }}
            required
          />
        </div>
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
              aria-label="Toggle password visibility"
              tabIndex={-1}
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
        </div>

        {/* Sign Up button */}
        <button
          onClick={handleSignUp}
          className="w-full font-semibold py-2 rounded-xl mt-1 transition duration-200"
          style={{
            background: PRIMARY_GRAD,
            color: "#fff",
            boxShadow: "0 2px 20px 0 rgba(99,102,241,0.14)",
          }}
        >
          Sign Up
        </button>

        <p className="text-center mt-7 text-blue-100 text-sm">
          Already have an account?
          <span
            onClick={() => navigate("/login", { state: { role } })}
            className="ml-2 font-semibold cursor-pointer"
            style={{ color: "#38bdf8" }}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
