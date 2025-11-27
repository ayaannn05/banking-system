import { useNavigate } from "react-router-dom";

function Nav({ showAuthButtons = false }) {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 cursor-pointer group"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#39b385] to-[#9be15d] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <span className="text-white font-bold text-lg sm:text-xl">B</span>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
            Bankist
          </span>
        </div>

        {/* Auth Buttons (optional) */}
        {showAuthButtons && (
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="px-3 sm:px-6 py-2 text-sm sm:text-base text-gray-700 font-medium hover:text-[#39b385] transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-gradient-to-r from-[#39b385] to-[#9be15d] text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Nav;
