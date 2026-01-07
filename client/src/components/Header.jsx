
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  // const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  // const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-slate-200 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3 relative">
        {/* Logo */}
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Caretaker</span>
            <span className="text-slate-700">Hub</span>
          </h1>
        </Link>

        {/* Search Bar */}
        {/* <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-2 sm:p-3 rounded-lg flex items-center w-[50%] sm:w-auto"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form> */}

        {/* Desktop Nav Links */}
        <ul className="hidden sm:flex gap-4 items-center">
          <Link to="/">
            <li className="text-slate-700 hover:underline">Home</li>
          </Link>
          <Link to="/contact">
            <li className="text-slate-700 hover:underline">Contact</li>
          </Link>
          {/* <Link to="/history">
            <li className="text-slate-700 hover:underline">History</li>
          </Link> */}
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-8 w-8 object-cover border border-slate-400"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className="text-slate-700 hover:underline">Sign in</li>
            )}
          </Link>
        </ul>

        {/* Mobile Profile Button */}
        <div
          className="sm:hidden cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          ref={menuRef}
        >
          {currentUser ? (
            <img
              className="rounded-full h-8 w-8 object-cover border border-slate-400"
              src={currentUser.avatar}
              alt="menu"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-slate-400 flex items-center justify-center text-white">
              ☰
            </div>
          )}

          {/* Dropdown Menu */}
          {menuOpen && (
            <ul className="absolute right-3 top-14 bg-white shadow-md rounded-lg flex flex-col items-start gap-2 p-3 w-40">
              <Link to="/" onClick={() => setMenuOpen(false)}>
                <li className="w-full text-slate-700 hover:bg-slate-100 p-2 rounded">
                  Home
                </li>
              </Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)}>
                <li className="w-full text-slate-700 hover:bg-slate-100 p-2 rounded">
                  Contact
                </li>
              </Link>
              {/* <Link to="/history" onClick={() => setMenuOpen(false)}>
                <li className="w-full text-slate-700 hover:bg-slate-100 p-2 rounded">
                  History
                </li>
              </Link> */}
              <Link to="/profile" onClick={() => setMenuOpen(false)}>
                <li className="w-full text-slate-700 hover:bg-slate-100 p-2 rounded">
                  {currentUser ? "Profile" : "Sign in"}
                </li>
              </Link>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
