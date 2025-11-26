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
    <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#232a3e] to-[#181135] flex justify-center items-start py-12">
      <div className="w-full max-w-3xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-[#38bdf8]/20">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-5 py-2 text-white font-medium rounded-lg bg-gradient-to-r from-[#6366f1] to-[#38bdf8] shadow hover:scale-105 active:scale-95 transition"
        >
          ← Back
        </button>
        <h2 className="text-3xl font-extrabold mb-8 text-white tracking-tight">
          Account Details
        </h2>
        {loading && (
          <p className="text-blue-200 font-medium mb-4">Loading...</p>
        )}
        {err && <p className="text-red-400 font-semibold mb-4">{err}</p>}

        {!loading && account && (
          <div>
            <div className="mb-8 bg-white/5 border border-[#38bdf8]/10 rounded-xl p-6 shadow">
              <div className="text-xl font-semibold text-[#38bdf8] mb-1">
                {account.userId?.username ||
                  account.userId?.name ||
                  account.userId?.email ||
                  "Unknown user"}
              </div>
              <div className="text-blue-100 mb-2">
                {account.userId?.email || ""}
              </div>
              <div>
                <span className="text-blue-200">Current balance:</span>{" "}
                <span className="font-bold text-lg text-white">
                  ₹ {account.balance}
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Transactions</h3>
            {!account.transactions || account.transactions.length === 0 ? (
              <p className="text-blue-200">No transactions for this account.</p>
            ) : (
              <ul className="space-y-3">
                {account.transactions.map((t, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between rounded-xl p-4 bg-[#232a3e]/60 border border-[#38bdf8]/10 items-center"
                  >
                    <div>
                      <div className="font-bold text-white">{t.type}</div>
                      <div className="text-sm text-blue-200">
                        {new Date(
                          t.createdAt || t.date || Date.now()
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
        )}
      </div>
    </div>
  );
}
