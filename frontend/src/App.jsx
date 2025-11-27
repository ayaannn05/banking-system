import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LandingPage from "./pages/LandingPage";
import SignUp from "./pages/SignUp";
import LoginPage from "./pages/LoginPage";
import CustomerDashboard from "./pages/CustomerDashboard";
import BankerDashboard from "./pages/BankerDashboard";
import BankerDetailPage from "./pages/BankerDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
const serverUrl = "http://localhost:8000";
function LandingGate() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    if (token) {
      if (role === "banker") navigate("/banker-dashboard", { replace: true });
      else navigate("/customer-dashboard", { replace: true });
    }
  }, [navigate]);

  return <LandingPage />;
}

return (
  <>
    <Routes>
      <Route path="/" element={<LandingGate />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/customer-dashboard"
        element={
          <ProtectedRoute requiredRole={"customer"}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/banker-dashboard"
        element={
          <ProtectedRoute requiredRole={"banker"}>
            <BankerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/banker-detail/:id"
        element={
          <ProtectedRoute requiredRole={"banker"}>
            <BankerDetailPage />
          </ProtectedRoute>
        }
      />
    </Routes>

    <ToastContainer
      position="top-right"
      autoClose={2500}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
  </>
);
}

export default App;
