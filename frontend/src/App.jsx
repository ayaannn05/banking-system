import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignUp from "./pages/SignUp";
import LoginPage from "./pages/LoginPage";
import CustomerDashboard from "./pages/CustomerDashboard";
import BankerDashboard from "./pages/BankerDashboard";
import BankerDetailPage from "./pages/BankerDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/customer-dashboard"
        element={
          <ProtectedRoute>
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
  );
}

export default App;
