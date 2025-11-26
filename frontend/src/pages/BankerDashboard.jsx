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
      if (error?.response?.status !== 401) {
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
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#232a3e] to-[#181135] flex justify-center items-start py-12">
      <div className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-[#38bdf8]/20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">
            Banker Dashboard
          </h2>
          <button
            onClick={handleSignOut}
            disabled={loading}
            className={`px-5 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-[#6366f1] to-[#38bdf8] shadow hover:scale-105 active:scale-95 transition ${
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

        <div className="space-y-6">
          {accounts.length === 0 ? (
            <p className="text-blue-200">No accounts available.</p>
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
                    if (e.key === "Enter")
                      navigate(`/banker-detail/${acct._id}`);
                  }}
                  className="bg-white/5 border border-[#38bdf8]/10 rounded-xl p-6 flex items-center justify-between cursor-pointer shadow hover:scale-[1.02] hover:bg-white/10 transition"
                >
                  <div>
                    <div className="font-bold text-lg text-[#38bdf8]">
                      {user.username ||
                        user.name ||
                        user.email ||
                        "Unknown user"}
                    </div>
                    <div className="text-blue-100 text-sm">
                      {user.email ? user.email : ""}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold text-white">
                      ₹ {acct.balance}
                    </div>
                    <div className="text-sm text-blue-200 mt-1">
                      {last ? (
                        <>
                          <span className="font-medium text-blue-100">
                            {last.type}
                          </span>{" "}
                          • ₹ {last.amount} •{" "}
                          {new Date(
                            last.createdAt || last.date || Date.now()
                          ).toLocaleString()}
                        </>
                      ) : (
                        <span className="text-blue-200">No transactions</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default BankerDashboard;