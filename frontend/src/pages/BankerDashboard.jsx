import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BankerDashboard() {
  const serverUrl = "http://localhost:8000";
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchAccounts = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await axios.get(`${serverUrl}/api/banker/accounts`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      setAccounts(res.data || []);
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      setErr(
        error?.response?.data?.message ||
          error.message ||
          "Failed to load accounts"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Banker Dashboard</h2>

      {loading && <p className="text-gray-600">Loading...</p>}
      {err && <p className="text-red-500 mb-4">{err}</p>}

      <div className="space-y-4">
        {accounts.length === 0 ? (
          <p className="text-gray-600">No accounts available.</p>
        ) : (
          accounts.map((acct) => {
            const user = acct.userId || {};
            const txs = acct.transactions || [];
            const last = txs.length ? txs[txs.length - 1] : null;
            return (
              <div
                key={acct._id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/banker-detail/${acct._id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigate(`/banker-detail/${acct._id}`);
                }}
                className="border rounded p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
              >
                <div>
                  <div className="font-semibold">
                    {user.username || user.name || user.email || "Unknown user"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {user.email ? user.email : ""}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">₹ {acct.balance}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {last ? (
                      <>
                        <span className="font-medium">{last.type}</span> • ₹{" "}
                        {last.amount} •{" "}
                        {new Date(
                          last.createdAt || last.date || Date.now()
                        ).toLocaleString()}
                      </>
                    ) : (
                      <span className="text-gray-500">No transactions</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default BankerDashboard;
