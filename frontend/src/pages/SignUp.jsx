import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

function SignUp() {
  const navigate = useNavigate();
  const primaryColor = "#ff4d2d";
  //   const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const initialRole = location?.state?.role || "customer";
  const [role] = useState(initialRole);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const serverURL = "http://localhost:8000";

  const handleSignUp = async () => {
    try {
      const result = await axios.post(
        `${serverURL}/api/auth/signup`,
        {
          username: userName,
          email,
          password,
          role,
        },
        { withCredentials: true }
      );
      setErr("");

      console.log(result);
    } catch (err) {
      setErr(err.response?.data?.message || err.message);
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border `}
        style={{ border: `1px solid ${borderColor}` }}
      >
        <h1
          className={`text-3xl font-bold mb-2 `}
          style={{ color: primaryColor }}
        >
          Banking System
        </h1>
        <p className="text-gray-600 mb-8">
          Create your account to get started with your banking needs
        </p>
        {/* FullName */}
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-gray-700 font-medium mb-1"
          >
            User Name
          </label>
          <input
            type="text"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            placeholder="Enter your username"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none "
            style={{ border: `1px solid ${borderColor}` }}
            required
          />
        </div>
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
              aria-label="Toggle password visibility"
            >
              {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
        </div>

        {/* Sign up button */}
        <button
          onClick={handleSignUp}
          className={`w-full font-semibold  py-2  rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`}
        >
          Sign up
        </button>
        {err && <p className="text-red-500 text-center my-4">{err}</p>}

        <p className="cursor-pointer text-center mt-6">
          Already have an account ?{" "}
          <span
            onClick={() => navigate("/login", { state: { role } })}
            className="text-[#ff4d2d]"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
