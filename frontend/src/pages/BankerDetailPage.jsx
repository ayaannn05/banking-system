import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import formatDateTime from "../utils/formatDateTime";
import { toast } from "react-toastify";
import Nav from "../components/Nav";

export default function BankerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const serverUrl = "http://localhost:8000";

  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchDetail = async (page = 1) => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${serverUrl}/api/banker/accounts/${id}/transactions?page=${page}`,
        { headers: getAuthHeaders(), withCredentials: true }
      );
      setAccount(res.data.account || null);
      setCurrentPage(res.data.currentPage || 1);
      setTotalPages(res.data.totalPages || 0);
      setTotalTransactions(res.data.totalTransactions || 0);
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to load account details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return navigate("/banker-dashboard");
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchDetail(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 transition inline-flex items-center gap-2"
          >
            <span>←</span> Back
          </button>

          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Account Details
          </h1>

          {loading && (
            <p className="text-gray-500 font-medium mb-4">Loading...</p>
          )}

          {!loading && account && (
            <div>
              {/* Account Info Card */}
              <div className="bg-gradient-to-br from-[#39b385] to-[#9be15d] rounded-3xl shadow-xl p-8 mb-8 text-white">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-white/80 text-sm mb-2">Account Holder</p>
                    <h2 className="text-3xl font-bold mb-1">
                      {account.userId?.username ||
                        account.userId?.name ||
                        account.userId?.email ||
                        "Unknown user"}
                    </h2>
                    <p className="text-white/90">
                      {account.userId?.email || ""}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl">
                    {account.userId?.username?.charAt(0).toUpperCase() ||
                      account.userId?.email?.charAt(0).toUpperCase() ||
                      "U"}
                  </div>
                </div>
                <div>
                  <p className="text-white/80 text-sm mb-2">Current Balance</p>
                  <p className="text-5xl font-bold">
                    ₹ {account.balance.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Transactions */}
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Transaction History
                  </h3>
                  {totalTransactions > 0 && (
                    <p className="text-sm text-gray-500">
                      Showing {Math.min(currentPage * 10, totalTransactions)} of{" "}
                      {totalTransactions}
                    </p>
                  )}
                </div>

                {!account.transactions || account.transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">📋</span>
                    </div>
                    <p className="text-gray-500">
                      No transactions for this account.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {account.transactions.map((t, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100"
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
                              <p className="font-bold text-gray-900">
                                {t.type}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDateTime(
                                  t.createdAt || t.date || Date.now()
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1 || loading}
                          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          ← Previous
                        </button>

                        <div className="flex items-center gap-2">
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page) => {
                            if (
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 &&
                                page <= currentPage + 1)
                            ) {
                              return (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  disabled={loading}
                                  className={`w-10 h-10 rounded-lg font-semibold transition ${
                                    currentPage === page
                                      ? "bg-gradient-to-r from-[#39b385] to-[#9be15d] text-white shadow-md"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  } disabled:opacity-40`}
                                >
                                  {page}
                                </button>
                              );
                            } else if (
                              page === currentPage - 2 ||
                              page === currentPage + 2
                            ) {
                              return (
                                <span key={page} className="text-gray-400">
                                  ...
                                </span>
                              );
                            }
                            return null;
                          })}
                        </div>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages || loading}
                          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Next →
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

