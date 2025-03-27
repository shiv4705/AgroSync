import { useNavigate, Link, NavLink, useLocation } from "react-router-dom";
import React, { useState } from "react";
import {
  Home,
  ShoppingBasket,
  Users,
  Info,
  LogIn,
  UserPlus,
  Menu,
  X,
  User, // <-- added icon for profile
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // State to control the profile dropdown for logged-in users
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const isFarmerArea = location.pathname.startsWith("/farmer");

  const navItems = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "Marketplace", path: "/marketplace", icon: <ShoppingBasket size={18} /> },
    { name: "Verified Farmers", path: "/farmers", icon: <Users size={18} /> },
    { name: "About", path: "/about", icon: <Info size={18} /> },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    // ...logout logic (clear session, tokens etc.)...
    navigate("/");
  };

  // Click handler for the profile icon (toggles dropdown)
  const toggleProfileDropdown = () =>
    setProfileDropdownOpen(!isProfileDropdownOpen);

  return (
    <header className="bg-black py-4 px-6 sm:px-10 flex justify-between items-center fixed w-full z-50 border-b border-teal-500/30 shadow-lg">
      <div className="text-white text-2xl font-bold flex items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-xl">A</span>
          </div>
          <span className="text-teal-400 font-bold">AgroSync</span>
        </Link>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="text-white p-2 rounded-full hover:bg-teal-500/20 transition-all"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`absolute top-full left-0 right-0 bg-black shadow-lg md:hidden ${isMenuOpen ? "block" : "hidden"
          } transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col p-4 space-y-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => {
                setIsMenuOpen(false);
                setProfileDropdownOpen(false);
              }}
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-md transition-all duration-200 ${isActive
                  ? "text-teal-400 bg-teal-500/10 border-l-2 border-teal-400 pl-3"
                  : "text-gray-300 hover:text-teal-400 hover:bg-black/40 hover:pl-3"
                }`
              }
            >
              <span className="transition-colors duration-200">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
          <hr className="border-gray-800" />
          {isFarmerArea && (
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="w-full text-left text-gray-300 hover:text-teal-400 p-2 rounded-md hover:bg-black/40 transition-all duration-200"
              >
                <User size={18} />
              </button>
              {isProfileDropdownOpen && (
                <div className="ml-4 flex flex-col space-y-2">
                  <Link
                    to="/profile"
                    className="text-gray-300 hover:text-teal-400 p-2 rounded-md hover:bg-black/40 transition-all duration-200"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setProfileDropdownOpen(false);
                    }}
                  >
                    Profile
                  </Link>
                  <button
                    className="text-white bg-teal-600 hover:bg-teal-500 p-2 rounded-md transition-all duration-200"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                      setProfileDropdownOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          {!isFarmerArea && (
            <>
              <button
                className="flex items-center space-x-2 w-full text-left text-gray-300 hover:text-teal-400 p-2 rounded-md hover:bg-black/40 transition-all duration-200"
                onClick={() => {
                  navigate("/login");
                  setIsMenuOpen(false);
                }}
              >
                <LogIn size={18} />
                <span>Sign In</span>
              </button>
              <button
                className="flex items-center space-x-2 w-full text-left text-white bg-teal-600 hover:bg-teal-500 p-2 rounded-md transition-all duration-200"
                onClick={() => {
                  navigate("/register");
                  setIsMenuOpen(false);
                }}
              >
                <UserPlus size={18} />
                <span>Register</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Desktop navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `relative flex items-center space-x-1 px-1 py-2 overflow-hidden group ${isActive ? "text-teal-400" : "text-gray-300 hover:text-teal-400"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`${isActive ? "text-teal-400" : "text-gray-400 group-hover:text-teal-400"
                    } transition-colors duration-300`}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-300 ease-in-out transform ${isActive
                    ? "bg-teal-400 scale-x-100"
                    : "bg-teal-500 scale-x-0 group-hover:scale-x-100"
                    }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Desktop buttons */}
      <div className="hidden md:flex items-center space-x-4">
        {isFarmerArea ? (
          <div className="relative">
            <button
              onClick={toggleProfileDropdown}
              className="text-white border border-teal-500 px-4 py-2 rounded-md hover:bg-teal-500/20 hover:border-teal-400 transition-all duration-300 flex items-center"
            >
              <User size={18} />
            </button>
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-black border border-gray-700 rounded-md shadow-lg">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-300 hover:bg-teal-500/20"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left block px-4 py-2 text-gray-300 hover:bg-teal-500/20"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              className="text-white border border-teal-500 px-4 py-2 rounded-md hover:bg-teal-500/20 hover:border-teal-400 transition-all duration-300 flex items-center space-x-2"
              onClick={() => navigate("/login")}
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
            <button
              className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-500 transition-all duration-300 flex items-center space-x-2"
              onClick={() => navigate("/register")}
            >
              <UserPlus size={16} />
              <span>Register</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;