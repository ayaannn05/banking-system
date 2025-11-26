import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import formatDateTime from "../utils/formatDateTime";
import { toast } from "react-toastify";

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
      <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#232a3e] to-[#181135] flex justify-center items-start py-12">
        <div className="w-full max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-[#38bdf8]/20 rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-4xl font-extrabold text-white tracking-tight">
              Customer Dashboard
            </h2>
            <button
              onClick={handleSignOut}
              disabled={loading}
              className={`px-4 py-2 rounded bg-[#ff4d2d] text-white font-semibold hover:bg-[#e64323] transition ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              Sign Out
            </button>
          </div>

          {/* Balance Card */}
          <div className="mb-8 flex flex-col items-center">
            <span className="text-blue-200 text-base mb-1">
              Current balance
            </span>
            <span className="text-5xl font-semibold text-[#38bdf8] drop-shadow">
              {balance !== null ? `₹ ${balance}` : "-"}
            </span>
          </div>

          {/* Deposit / Withdraw Card */}
          <div className="mb-8 bg-white/10 rounded-xl p-6 flex flex-col items-center shadow border border-[#38bdf8]/10">
            <div className="text-blue-100 font-semibold mb-2">
              Quick Actions
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => openModal("deposit")}
                className="px-6 py-2 font-bold rounded-lg bg-gradient-to-r from-[#15d4bc] to-[#38bdf8] text-white shadow hover:scale-105 active:scale-95 transition text-base"
                disabled={loading}
              >
                Deposit
              </button>
              <button
                onClick={() => openModal("withdraw")}
                className="px-6 py-2 font-bold rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a694fa] text-white shadow hover:scale-105 active:scale-95 transition text-base"
                disabled={loading}
              >
                Withdraw
              </button>
            </div>
          </div>

          {/* Transactions Card */}
          <div className="bg-white/10 rounded-xl p-6 shadow-md border border-[#38bdf8]/10">
            <h3 className="text-2xl font-semibold mb-4 text-white">
              Transactions
            </h3>
            {transactions.length === 0 ? (
              <p className="text-blue-200">No transactions yet.</p>
            ) : (
              <ul className="space-y-3">
                {transactions.map((t, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between rounded-xl p-4 bg-[#232a3e]/60 border border-[#38bdf8]/10 items-center"
                  >
                    <div>
                      <div className="font-bold text-white">{t.type}</div>
                      <div className="text-sm text-blue-200">
                        {formatDateTime(t.date || t.createdAt || Date.now())}
                      </div>
                    </div>
                    <div
                      className={`font-extrabold text-lg
                        ${
                          t.type === "DEPOSIT"
                            ? "text-[#15d4bc]"
                            : "text-[#a694fa]"
                        }
                      `}
                    >
                      {t.type === "DEPOSIT" ? "+" : "-"}₹ {t.amount}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={closeModal} />
          <div className="relative bg-[#0b1220] p-6 rounded-xl w-full max-w-md border border-[#38bdf8]/20">
            <h3 className="text-xl font-bold text-white mb-3">
              {modalType === "deposit" ? "Deposit Funds" : "Withdraw Funds"}
            </h3>
            <p className="text-blue-200 mb-4">
              Available balance:{" "}
              <span className="font-semibold text-white">
                {balance !== null ? `₹ ${balance}` : "-"}
              </span>
            </p>
            <input
              type="number"
              min="1"
              value={modalAmount}
              onChange={(e) => setModalAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-transparent border border-[#38bdf8]/30 text-white mb-4"
              placeholder="Enter amount"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded bg-white/10 text-white"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={confirmModal}
                className="px-4 py-2 rounded bg-gradient-to-r from-[#15d4bc] to-[#38bdf8] text-white font-semibold"
                disabled={loading}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CustomerDashboard;
