import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-white">
      <Nav showAuthButtons={true} />

      {/* Hero Section - 100vh */}
      <section className="mt-10 h-[70vh] flex items-center justify-center px-6 bg-gradient-to-br from-gray-50 via-white to-green-50/30">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="inline-block px-5 py-2 rounded-full bg-[var(--color-primary-opacity)] border border-[var(--color-primary)] text-[var(--color-primary-darker)] text-sm font-semibold animate-fade-in">
                Welcome to Modern Banking
              </div>

              <h1 className="text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
                Banking Made{" "}
                <span className="bg-gradient-to-r from-[#39b385] to-[#9be15d] bg-clip-text text-transparent">
                  Simple
                </span>
              </h1>

              <p className="text-2xl text-gray-600 leading-relaxed max-w-xl">
                Everything you need in a modern banking app. Fast, secure, and
                designed for your financial freedom.
              </p>

              <div className="flex flex-wrap gap-5 pt-6">
                <button
                  onClick={() =>
                    navigate("/login", { state: { role: "customer" } })
                  }
                  className="px-10 py-5 bg-gradient-to-r from-[#39b385] to-[#9be15d] text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300"
                >
                  Customer Login →
                </button>
                <button
                  onClick={() =>
                    navigate("/login", { state: { role: "banker" } })
                  }
                  className="px-10 py-5 bg-white text-gray-700 font-bold text-lg rounded-full border-2 border-gray-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary-darker)] hover:scale-105 transition-all duration-300"
                >
                  Banker Login
                </button>
              </div>
            </div>

            {/* Right Column - Card */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 hover:shadow-3xl transition-shadow duration-300 transform hover:-translate-y-2">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-gray-900 font-bold text-2xl mb-2">
                      Digital Wallet
                    </h3>
                    <p className="text-gray-500">Secure & Protected</p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#39b385] to-[#9be15d] flex items-center justify-center shadow-lg animate-pulse">
                    <span className="text-4xl">💳</span>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-gray-500 text-sm mb-2">Total Balance</p>
                  <p className="text-5xl font-bold text-gray-900">₹12,450.00</p>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 border border-green-200">
                    <p className="text-gray-600 text-xs mb-2 font-semibold">
                      Transactions
                    </p>
                    <p className="text-3xl font-bold text-gray-900">1,234</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200">
                    <p className="text-gray-600 text-xs mb-2 font-semibold">
                      Customers
                    </p>
                    <p className="text-3xl font-bold text-gray-900">8,921</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - 70vh */}
      <section className="h-[60vh] flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
              Why Choose Bankist?
            </h2>
            <p className="text-2xl text-gray-600">
              Everything you need for modern banking
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#39b385] to-[#9be15d] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-4xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Instant Transfers
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Send and receive money instantly with zero fees. Real-time
                processing for all your transactions.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ffb003] to-[#ffcb03] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-4xl">🔒</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Bank-Level Security
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Your money is protected with industry-leading encryption and
                multi-factor authentication.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff585f] to-[#fd424b] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Real-Time Analytics
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Track your spending and savings with detailed insights and smart
                financial reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - 30vh */}
      <footer className="h-[40vh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo & About */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#39b385] to-[#9be15d] flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">B</span>
                </div>
                <span className="text-3xl font-bold">Bankist</span>
              </div>
              <p className="text-gray-400 max-w-md text-lg">
                Modern banking made simple. Secure, fast, and designed for your
                financial freedom.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-xl mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-[var(--color-primary)] cursor-pointer transition">
                  About Us
                </li>
                <li className="hover:text-[var(--color-primary)] cursor-pointer transition">
                  Services
                </li>
                <li className="hover:text-[var(--color-primary)] cursor-pointer transition">
                  Contact
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-xl mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-[var(--color-primary)] cursor-pointer transition">
                  Privacy Policy
                </li>
                <li className="hover:text-[var(--color-primary)] cursor-pointer transition">
                  Terms of Service
                </li>
                <li className="hover:text-[var(--color-primary)] cursor-pointer transition">
                  Security
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 pt-6 text-center">
            <p className="text-gray-400">
              © 2025 Bankist. All rights reserved. | Built by Ayaan Ansari
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
