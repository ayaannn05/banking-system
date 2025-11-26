import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 py-12">
      <div className="bg-white max-w-lg w-full rounded-xl shadow-md p-12 text-center">
        <h1 className="text-gray-900 text-4xl font-semibold mb-6 font-sans">
          Welcome to SmartBank
        </h1>
        <p className="text-gray-600 text-lg mb-12 font-light">
          Please select your login type to get started
        </p>
        <div className="flex justify-center space-x-8">
          <button
            onClick={() => navigate("/login", { state: { role: "customer" } })}
            className="px-10 py-3 bg-blue-700 text-white rounded-lg shadow-md font-medium hover:bg-blue-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Customer Login
          </button>
          <button
            onClick={() => navigate("/login", { state: { role: "banker" } })}
            className="px-10 py-3 bg-gray-800 text-white rounded-lg shadow-md font-medium hover:bg-gray-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Banker Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
