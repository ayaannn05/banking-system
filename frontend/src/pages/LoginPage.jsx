import axios from "axios";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const primaryColor = "#ff4d2d";
  //   const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const serverUrl = "http://localhost:8000";
  const location = useLocation();
  const initialRole = location?.state?.role || "customer";
  const [role] = useState(initialRole);

  const handleSignIn = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        {
          email,
          password,
          role,
        },
        { withCredentials: true }
      );
      setErr("");
      // Save token and role, then redirect based on role
      const { accessToken, role: userRole } = result.data || {};
      if (accessToken) {
        try {
          localStorage.setItem("accessToken", accessToken);
        } catch (e) {
          console.warn("Could not save accessToken", e);
        }
      }
      if (userRole) {
        try {
          localStorage.setItem("role", userRole);
        } catch (e) {
          console.warn("Could not save role", e);
        }
      }

      if (userRole === "banker") {
        navigate("/banker-dashboard", { replace: true });
      } else {
        navigate("/customer-dashboard", { replace: true });
      }
    } catch (err) {
      // Use optional chaining and fallback so we don't throw when `err.response` is undefined
      const message =
        err?.response?.data?.message || err?.message || "An error occurred";
      setErr(message);
      console.log(err?.response?.data || err.message);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className={`h-full bg-white rounded-xl shadow-lg w-full max-w-md p-8 border `}
        style={{ border: `1px solid ${borderColor}` }}
      >
        <h1
          className={`text-3xl font-bold mb-2 `}
          style={{ color: primaryColor }}
        >
          Feastly
        </h1>
        <p className="text-gray-600 mb-8">
          Sign In to your account to get started with delicious food deliveries
        </p>

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-1"
          >
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none "
            style={{ border: `1px solid ${borderColor}` }}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={`${showPassword ? "text" : "password"}`}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none "
              style={{ border: `1px solid ${borderColor}` }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="cursor-pointer absolute right-3 top-2.5 text-gray-500"
            >
              {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
        </div>

        {/* Forget Password */}

        {/* Sign In button */}

        <button
          type="button"
          onClick={handleSignIn}
          className={`w-full font-semibold  py-2  rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`}
        >
          Sign In
        </button>
        {err && <p className="text-red-500 text-center my-4">{err}</p>}
        {/* Sigin with google */}

        <p className="cursor-pointer text-center mt-6">
          Want to create a new account ?{" "}
          <span
            onClick={() => navigate("/signup", { state: { role } })}
            className="text-[#ff4d2d]"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
