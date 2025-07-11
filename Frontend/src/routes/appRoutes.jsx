import React from "react";
import { Navigate } from "react-router-dom";
import Login from "../pages/Users/Login";
import Signup from "../pages/Users/Signup";
import ProductList from "../pages/Catalogs/ProductList";
import ProductDetails from "../pages/Catalogs/ProductDetails";
import Cart from "../pages/Catalogs/Cart";
import Checkout from "../pages/Payments/Checkout";
import Payment from "../pages/Payments/Payment";
import UserProfile from "../pages/Users/User.jsx";
import Orders from "../pages/Users/Orders.jsx";



const appRoutes = [

  { path: "/", element: <Navigate to="/products" /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/checkout", element: <Checkout /> },
  { path: "/products", element: <ProductList /> },
  { path: "/products/:id", element: <ProductDetails /> },

  { path: "/payment", element: <Payment /> },
   {path:"/user" ,element:<UserProfile/>},
   {path:"/user/orders",element:<Orders/>},
  {path:"/cart", element: <Cart />}, 
];

export default appRoutes;