import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CustomerDashboard() {
  const serverUrl = "http://localhost:8000";
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setErr("");
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
      setErr(
        error?.response?.data?.message ||
          error.message ||
          "Failed to load transactions"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setErr("");
    try {
      await axios.post(
        `${serverUrl}/api/auth/signout`,
        {},
        { headers: getAuthHeaders(), withCredentials: true }
      );
    } catch (error) {
      if (error?.response?.status === 401) {
        // token invalid or expired, continue to clear local state
      } else {
        setErr(
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

  const postAction = async (path) => {
    const value = Number(amount);
    if (!value || value <= 0) {
      setErr("Enter a valid amount greater than zero");
      return;
    }
    setErr("");
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/customer/${path}`,
        { amount: value },
        { headers: getAuthHeaders(), withCredentials: true }
      );
      setBalance(res.data.balance);
      setTransactions(res.data.transactions || []);
      setAmount("");
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      setErr(
        error?.response?.data?.message || error.message || `Failed to ${path}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
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
        {loading && (
          <p className="text-blue-200 font-medium mb-4">Loading...</p>
        )}
        {err && <p className="text-red-400 font-semibold mb-4">{err}</p>}

        {/* Balance Card */}
        <div className="mb-8 flex flex-col items-center">
          <span className="text-blue-200 text-base mb-1">Current balance</span>
          <span className="text-5xl font-semibold text-[#38bdf8] drop-shadow">
            {balance !== null ? `₹ ${balance}` : "-"}
          </span>
        </div>

        {/* Deposit / Withdraw Card */}
        <div className="mb-8 bg-white/10 rounded-xl p-6 flex flex-col items-center shadow border border-[#38bdf8]/10">
          <label className="block mb-2 text-blue-100 font-semibold">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded-lg px-4 py-3 mb-4 text-white bg-transparent w-48 text-lg focus:outline-none focus:border-[#38bdf8] border-[#38bdf8]/40"
            placeholder="Enter amount"
            min="1"
          />
          <div className="flex space-x-4">
            <button
              onClick={() => postAction("deposit")}
              className="px-6 py-2 font-bold rounded-lg bg-gradient-to-r from-[#15d4bc] to-[#38bdf8] text-white shadow hover:scale-105 active:scale-95 transition text-base"
              disabled={loading}
            >
              Deposit
            </button>
            <button
              onClick={() => postAction("withdraw")}
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
                      {new Date(
                        t.date || t.createdAt || Date.now()
                      ).toLocaleString()}
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
  );
}

export default CustomerDashboard;
