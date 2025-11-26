import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import formatDateTime from "../utils/formatDateTime";
import { toast } from "react-toastify";
import Nav from "../components/Nav";

function CustomerDashboard() {
  const serverUrl = "http://localhost:8000";
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'deposit' or 'withdraw'
  const [modalAmount, setModalAmount] = useState("");

  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchTransactions = async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${serverUrl}/api/customer/transactions`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      setBalance(res.data.balance);
      setTransactions(res.data.transactions || []);
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);

    try {
      await axios.post(
        `${serverUrl}/api/auth/signout`,
        {},
        { headers: getAuthHeaders(), withCredentials: true }
      );
      toast.success("Signed out successfully!");
    } catch (error) {
      if (error?.response?.status === 401) {
        // token invalid or expired, continue to clear local state
      } else {
        toast.error(
          error?.response?.data?.message ||
            error.message ||
            "Failed to sign out"
        );
      }
    } finally {
      try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
      } catch {
        // ignore
      }
      setLoading(false);
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const postAction = async (path, value) => {
    const num = Number(value);
    if (!num || num <= 0) {
      toast.error("Enter a valid amount greater than zero");
      return false;
    }

    // local check for withdraw insufficient funds
    if (path === "withdraw" && balance !== null && num > balance) {
      toast.error("Insufficient Funds");
      return false;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/customer/${path}`,
        { amount: num },
        { headers: getAuthHeaders(), withCredentials: true }
      );
      setBalance(res.data.balance);
      setTransactions(res.data.transactions || []);
      toast.success(
        `${path.charAt(0).toUpperCase() + path.slice(1)} successful!`
      );
      return true;
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/login", { replace: true });
        return false;
      }
      toast.error(error?.response?.data?.message || `Failed to ${path}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type) => {
    // If attempting to withdraw but there's no balance, show a toast and do not open modal
    if (type === "withdraw") {
      if (balance === null || balance <= 0) {
        toast.error("Insufficient balance");
        return;
      }
    }

    setModalType(type);
    setModalAmount("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setModalAmount("");
  };

  const confirmModal = async () => {
    const ok = await postAction(modalType, modalAmount);
    if (ok) closeModal();
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Nav />

        <div className="pt-24 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Customer Dashboard
                </h1>
                <p className="text-gray-600">
                  Manage your account and transactions
                </p>
              </div>
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-red-400 hover:text-red-600 transition disabled:opacity-60"
              >
                Sign Out
              </button>
            </div>

            {/* Balance Card */}
            <div className="bg-gradient-to-br from-[#39b385] to-[#9be15d] rounded-3xl shadow-xl p-8 mb-8 text-white">
              <p className="text-white/80 text-sm font-medium mb-2">
                Total Balance
              </p>
              <p className="text-5xl font-bold mb-6">
                {balance !== null ? `₹ ${balance.toLocaleString()}` : "-"}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => openModal("deposit")}
                  disabled={loading}
                  className="flex-1 bg-white text-green-700 font-bold py-4 rounded-xl hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-60"
                >
                  💰 Deposit
                </button>
                <button
                  onClick={() => openModal("withdraw")}
                  disabled={loading}
                  className="flex-1 bg-white/20 backdrop-blur-sm text-white font-bold py-4 rounded-xl border-2 border-white/30 hover:bg-white/30 hover:scale-[1.02] transition disabled:opacity-60"
                >
                  💸 Withdraw
                </button>
              </div>
            </div>

            {/* Transactions */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Recent Transactions
              </h2>

              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">📊</span>
                  </div>
                  <p className="text-gray-500">No transactions yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((t, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            t.type === "DEPOSIT"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          <span className="text-2xl font-bold">
                            {t.type === "DEPOSIT" ? "+" : "-"}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{t.type}</p>
                          <p className="text-sm text-gray-500">
                            {formatDateTime(
                              t.date || t.createdAt || Date.now()
                            )}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`text-xl font-bold ${
                          t.type === "DEPOSIT"
                            ? "text-green-700"
                            : "text-yellow-700"
                        }`}
                      >
                        {t.type === "DEPOSIT" ? "+" : "-"}₹{" "}
                        {t.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {modalType === "deposit" ? "Deposit Funds" : "Withdraw Funds"}
            </h3>
            <p className="text-gray-600 mb-6">
              Available balance:{" "}
              <span className="font-bold text-gray-900">
                {balance !== null ? `₹ ${balance.toLocaleString()}` : "-"}
              </span>
            </p>
            <input
              type="number"
              min="1"
              value={modalAmount}
              onChange={(e) => setModalAmount(e.target.value)}
              className="w-full px-4 py-4 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 text-lg focus:outline-none focus:border-green-500 transition mb-6"
              placeholder="Enter amount"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={confirmModal}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#39b385] to-[#9be15d] text-white font-bold hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CustomerDashboard;
