import { ShoppingBag, ShoppingCart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import React from "react";

export default function BottomNav() {
  const location = useLocation();
  const path = location.pathname;
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex justify-around py-2 z-50 shadow-md">
      <TabIcon
        to="/products"
        icon={<ShoppingBag className="text-blue-500" size={22} />}
        active={path.startsWith("/products")}
        label="Products"
      />
      <TabIcon
        to="/cart"
        icon={<ShoppingCart className="text-green-500" size={22} />}
        active={path.startsWith("/cart")}
        label="Cart"
      />
      <TabIcon
        to="/profile"
        icon={<User className="text-purple-500" size={22} />}
        active={path.startsWith("/profile")}
        label="Profile"
      />
    </nav>
  );
}

function TabIcon({ to, icon, active, label }) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center text-xs ${
        active ? "text-blue-600" : "text-gray-500 dark:text-gray-300"
      }`}
    >
      {icon}
      <span className="mt-1">{label}</span>
    </Link>
  );
}