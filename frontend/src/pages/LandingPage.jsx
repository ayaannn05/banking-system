import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#1e293b] via-[#232a3e] to-[#181135] text-white font-sans relative">
      {/* App Bar */}
      <header className="flex items-center px-8 py-7">
        {/* Logo - SVG Circle with Bank Icon */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6366f1] to-[#38bdf8] flex items-center justify-center shadow-lg">
            {/* SVG Bank Icon */}
            <svg width="30" height="30" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="18" fill="#fff" opacity="0.19" />
              <rect x="14" y="22" width="20" height="9" rx="3" fill="#6366f1" />
              <rect
                x="18"
                y="13"
                width="12"
                height="7"
                rx="2.5"
                fill="#38bdf8"
              />
              <rect x="21" y="31" width="6" height="4" rx="2" fill="#6366f1" />
            </svg>
          </div>
          <span className="text-white font-bold text-2xl tracking-tight ml-1">
            Bankon
          </span>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex flex-row justify-between items-center flex-grow px-16">
        {/* Left Column */}
        <section className="max-w-xl">
          <span className="inline-block px-4 py-1 rounded-full bg-[#15d4bc]/20 text-[#15d4bc] text-sm font-semibold mb-5 shadow">
            Welcome to Online Banking
          </span>
          <h1 className="text-white text-4xl lg:text-6xl font-extrabold mb-4">
            Next-Gen Banking, <span className="text-[#38bdf8]">Secure</span>{" "}
            <br />& <span className="text-[#a694fa]">Instant</span>
          </h1>
          <p className="text-blue-200 text-lg mb-9 max-w-md">
            Move money, manage accounts, control transactions from anywhere.
            Secure, real-time, and trusted by thousands of customers.
          </p>
          <div className="flex gap-5 mt-4">
            <button
              onClick={() =>
                navigate("/login", { state: { role: "customer" } })
              }
              className="px-6 py-3 bg-gradient-to-r from-[#15d4bc] to-[#38bdf8] text-white font-bold rounded-xl shadow-lg hover:scale-105 active:scale-95 transition text-lg"
            >
              Customer Login
            </button>
            <button
              onClick={() => navigate("/login", { state: { role: "banker" } })}
              className="px-6 py-3 bg-gradient-to-r from-[#6366f1] to-[#a694fa] text-white font-bold rounded-xl shadow-lg hover:scale-105 active:scale-95 transition text-lg"
            >
              Banker Login
            </button>
          </div>
        </section>
        {/* Right Side Wallet Card */}
        <section className="mx-8 flex-grow flex items-center justify-center">
          <div className="w-full max-w-xs bg-[#232a3e]/80 backdrop-blur-lg rounded-2xl shadow-2xl p-7 border border-[#38bdf8]/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-white font-semibold text-lg">
                  Secure Wallet
                </div>
                <div className="text-blue-200 text-xs">
                  Protected with bank-level encryption.
                </div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#d9f99d] text-[#166534] font-extrabold shadow text-2xl">
                💳
              </div>
            </div>
            <div>
              <div className="text-blue-100 text-xs mb-1">Balance</div>
              <div className="text-white text-2xl font-bold">$12,450.00</div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="bg-[#181135]/50 rounded-lg p-4 text-sm text-white flex flex-col items-start shadow">
                  <span className="text-blue-300 text-xs mb-1">
                    Transactions
                  </span>
                  <span className="font-semibold">1,234</span>
                </div>
                <div className="bg-[#181135]/50 rounded-lg p-4 text-sm text-white flex flex-col items-start shadow">
                  <span className="text-blue-300 text-xs mb-1">Customers</span>
                  <span className="font-semibold">8,921</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
