import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function Navbar({ cart }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 text-white px-6 py-3 flex items-center gap-6">
      {/* LOGO */}
      <Link to="/" className="text-2xl font-bold text-yellow-400">
        MedKart
      </Link>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search medicines..."
        className="flex-1 px-4 py-2 rounded-md text-black outline-none"
      />

      <div className="flex gap-6 items-center">
        {/* AUTH */}
        {!user ? (
          <button
            onClick={() => navigate("/login")}
            className="hover:text-yellow-400 transition"
          >
            Login
          </button>
        ) : (
          <div ref={dropdownRef} className="relative">
            {/* BUTTON */}
            <button
              onClick={() => setOpen(!open)}
              className="text-left leading-tight hover:text-yellow-400 transition"
            >
              <p className="text-xs text-gray-300">
                Hello, {user.name}
              </p>
              <p className="text-sm font-semibold flex items-center gap-1">
                Account & Lists
                <span className="text-xs">▾</span>
              </p>
            </button>

            {/* DROPDOWN */}
            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
                <button
                  onClick={() => navigate("/account")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Your Account
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Switch Account
                </button>

                <hr />

                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* CART */}
        <Link to="/cart" className="relative hover:text-yellow-400">
          🛒 Cart
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-4 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
