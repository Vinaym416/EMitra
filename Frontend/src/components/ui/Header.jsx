import { Search, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";
import toast from "react-hot-toast";

export default function Header() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  // Get user profile pic from localStorage or fallback
  useEffect(() => {
    try {
      const authUser = JSON.parse(localStorage.getItem("authUser"));
      let pic = authUser?.profilepic;
      if (typeof pic === "string" && pic.startsWith('"') && pic.endsWith('"')) {
        pic = pic.slice(1, -1);
      }
      setProfilePic(pic || null);
    } catch {
      setProfilePic(null);
    }
  }, []);

  // Reload page if view (mobile/web) changes
  useEffect(() => {
    function handleResize() {
  
      const isMobile = window.innerWidth < 768;
      const lastIsMobile = sessionStorage.getItem("lastIsMobile") === "true";
      if (isMobile !== lastIsMobile) {
        sessionStorage.setItem("lastIsMobile", isMobile);
        window.location.reload();
      }
    }
    window.addEventListener("resize", handleResize);
   
    sessionStorage.setItem("lastIsMobile", window.innerWidth < 768);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");
    toast.success("Logged out successfully!");
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <>
      {/* Mobile Header */}
      <div className="flex md:hidden items-center justify-between px-3 py-2 bg-white dark:bg-zinc-900 shadow-sm fixed top-0 left-0 right-0 z-40 ">
        <button
          className="p-2"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={26} className="text-zinc-700 dark:text-zinc-200" />
        </button>
        <div className="flex-1 mx-2">
          <input
            type="text"
            placeholder="Search products"
            className="w-full rounded-full px-4 py-2 bg-zinc-100 dark:bg-zinc-800 focus:outline-none text-sm"
            onKeyDown={e => {
              if (e.key === "Enter" && e.target.value.trim()) {
                navigate(`/products?search=${encodeURIComponent(e.target.value.trim())}`);
              }
            }}
          />
        </div>
        <div>
          {isLoggedIn && profilePic ? (
            <img
              src={profilePic}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border border-blue-500 cursor-pointer"
              onClick={() => navigate("/user")}
            />
          ) : isLoggedIn ? (
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs"
              onClick={() => navigate("/user")}
            >
              Profile
            </button>
          ) : (
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Desktop Header */}
      <header className="hidden md:flex flex-row items-center justify-between p-4 shadow-md bg-white dark:bg-zinc-900  w-full">
        <h1
          className=" font-bold text-primary  bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm"
          onClick={() => navigate("/products")}
        >
           Trendora
        </h1>
        <div className="flex flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search products"
              className="rounded-lg px-3 py-1 bg-zinc-100 dark:bg-zinc-800 focus:outline-none w-56 text-sm transition"
              onKeyDown={e => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  navigate(`/products?search=${encodeURIComponent(e.target.value.trim())}`);
                }
              }}
            />
            <Search className="text-zinc-500 dark:text-zinc-300" size={20} />
          </div>
          {isLoggedIn ? (
            <button
              className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <button
              className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 bg-white dark:bg-zinc-900 h-full shadow-xl flex flex-col p-6">
            <button
              className="self-end mb-4 text-zinc-700 dark:text-zinc-200"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
            <div className="flex flex-col items-center gap-4 mt-4">
              {isLoggedIn ? (
                <button
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
                  onClick={() => {
                    setSidebarOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              ) : (
                <button
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
                  onClick={() => {
                    setSidebarOpen(false);
                    navigate("/login");
                  }}
                >
                  Login
                </button>
              )}
            </div>
          </div>
          <div
            className="flex-1 bg-black bg-opacity-30"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}
    </>
  );
}