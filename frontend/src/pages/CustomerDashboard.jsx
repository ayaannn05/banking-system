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
      // If unauthorized, send user back to login
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
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Customer Dashboard</h2>

      {loading && <p className="text-gray-600">Loading...</p>}
      {err && <p className="text-red-500 mb-4">{err}</p>}

      <div className="mb-6">
        <p className="text-gray-700">Current balance:</p>
        <p className="text-3xl font-semibold">
          {balance !== null ? `₹ ${balance}` : "-"}
        </p>
      </div>

      <div className="mb-6">
        <label className="block mb-2">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border rounded px-3 py-2 w-48"
          placeholder="Enter amount"
        />
        <div className="mt-3 space-x-3">
          <button
            onClick={() => postAction("deposit")}
            className="px-4 py-2 bg-green-500 text-white rounded"
            disabled={loading}
          >
            Deposit
          </button>
          <button
            onClick={() => postAction("withdraw")}
            className="px-4 py-2 bg-red-500 text-white rounded"
            disabled={loading}
          >
            Withdraw
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Transactions</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-600">No transactions yet.</p>
        ) : (
          <ul className="space-y-2">
            {transactions.map((t, idx) => (
              <li key={idx} className="flex justify-between border rounded p-2">
                <div>
                  <div className="font-medium">{t.type}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(
                      t.date || t.createdAt || Date.now()
                    ).toLocaleString()}
                  </div>
                </div>
                <div
                  className={`font-semibold ${
                    t.type === "DEPOSIT" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {t.type === "DEPOSIT" ? "+" : "-"}₹ {t.amount}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;
