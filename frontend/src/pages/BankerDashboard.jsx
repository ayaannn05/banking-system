import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import formatDateTime from "../utils/formatDateTime";
import { toast } from "react-toastify";
import Nav from "../components/Nav";
import { API_CONFIG } from "../config/api";

function BankerDashboard() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchAccounts = async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${API_CONFIG.baseURL}/api/banker/accounts`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      setAccounts(res.data || []);
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      toast.error(
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

    try {
      await axios.post(
        `${API_CONFIG.baseURL}/api/auth/signout`,
        {},
        { headers: getAuthHeaders(), withCredentials: true }
      );
    } catch (error) {
      if (error?.response?.status !== 401) {
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
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <div className="pt-20 sm:pt-24 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Banker Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Manage customer accounts and transactions
              </p>
            </div>
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold text-sm sm:text-base rounded-xl hover:border-red-400 hover:text-red-600 transition disabled:opacity-60"
            >
              Sign Out
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm mb-1">Total Accounts</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {accounts.length}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#39b385] to-[#9be15d] rounded-lg sm:rounded-xl flex items-center justify-center">
                  <span className="text-xl sm:text-2xl">👥</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm mb-1">Total Balance</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    ₹{" "}
                    {accounts
                      .reduce((sum, acc) => sum + (acc.balance || 0), 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#ffb003] to-[#ffcb03] rounded-lg sm:rounded-xl flex items-center justify-center">
                  <span className="text-xl sm:text-2xl">💰</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm sm:col-span-2 md:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm mb-1">
                    Total Transactions
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {accounts.reduce(
                      (sum, acc) => sum + (acc.transactions?.length || 0),
                      0
                    )}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#ff585f] to-[#fd424b] rounded-lg sm:rounded-xl flex items-center justify-center">
                  <span className="text-xl sm:text-2xl">📊</span>
                </div>
              </div>
            </div>
          </div>

          {loading && (
            <p className="text-sm sm:text-base text-gray-500 font-medium mb-4">Loading...</p>
          )}

          {/* Accounts List */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Customer Accounts
            </h2>

            {accounts.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl sm:text-4xl">📋</span>
                </div>
                <p className="text-sm sm:text-base text-gray-500">No accounts available.</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {accounts.map((acct) => {
                  const user = acct.userId || {};
                  const txs = acct.transactions || [];
                  const last = txs.length ? txs[txs.length - 1] : null;
                  return (
                    <div
                      key={acct._id}
                      onClick={() => navigate(`/banker-detail/${acct._id}`)}
                      className="flex items-center justify-between p-4 sm:p-5 md:p-6 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100 hover:shadow-lg hover:border-green-300 transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#39b385] to-[#9be15d] rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl group-hover:scale-110 transition">
                          {user.username?.charAt(0).toUpperCase() ||
                            user.email?.charAt(0).toUpperCase() ||
                            "U"}
                        </div>
                        <div>
                          <p className="font-bold text-base sm:text-lg text-gray-900">
                            {user.username ||
                              user.name ||
                              user.email ||
                              "Unknown user"}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {user.email || ""}
                          </p>
                          {last && (
                            <p className="text-xs text-gray-400 mt-1 hidden sm:block">
                              Last: {last.type} • ₹ {last.amount} •{" "}
                              {formatDateTime(
                                last.createdAt || last.date || Date.now()
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                          ₹ {acct.balance.toLocaleString()}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {txs.length} transaction{txs.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BankerDashboard;
