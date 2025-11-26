import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function BankerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const serverUrl = "http://localhost:8000";

  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    if (!id) return navigate("/banker-dashboard");

    const fetchDetail = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await axios.get(
          `${serverUrl}/api/banker/accounts/${id}/transactions`,
          { headers: getAuthHeaders(), withCredentials: true }
        );
        // backend returns { account }
        setAccount(res.data.account || null);
      } catch (error) {
        if (error?.response?.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        setErr(
          error?.response?.data?.message ||
            error.message ||
            "Failed to load account details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 bg-gray-200 rounded"
      >
        Back
      </button>

      <h2 className="text-2xl font-bold mb-4">Account Details</h2>

      {loading && <p className="text-gray-600">Loading...</p>}
      {err && <p className="text-red-500 mb-4">{err}</p>}

      {!loading && account && (
        <div>
          <div className="mb-4 border rounded p-4">
            <div className="font-semibold text-lg">
              {account.userId?.username ||
                account.userId?.name ||
                account.userId?.email ||
                "Unknown user"}
            </div>
            <div className="text-sm text-gray-500">
              {account.userId?.email || ""}
            </div>
            <div className="mt-2">
              Current balance:{" "}
              <span className="font-medium">₹ {account.balance}</span>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-2">Transactions</h3>
          {!account.transactions || account.transactions.length === 0 ? (
            <p className="text-gray-600">No transactions for this account.</p>
          ) : (
            <ul className="space-y-2">
              {account.transactions.map((t, idx) => (
                <li
                  key={idx}
                  className="flex justify-between border rounded p-3"
                >
                  <div>
                    <div className="font-medium">{t.type}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(
                        t.createdAt || t.date || Date.now()
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
      )}
    </div>
  );
}
