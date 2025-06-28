import React from "react";
import { Navigate } from "react-router-dom";
import Login from "../pages/Users/Login";
import Signup from "../pages/Users/Signup";
// import Orders from "../pages/Users/Orders";
// import Checkout from "../pages/Payments/Checkout";
// import OrderSummary from "../pages/Payments/OrderSummary";
// import Payment from "../pages/Payments/Payment";
// import PaymentSuccess from "../pages/Payments/PaymentSuccess";
// import ProductList from "../pages/Catalogs/ProductList";
// import ProductDetails from "../pages/Catalogs/ProductDetails";
// import ProductCard from "../pages/Catalogs/ProductCard";
// import CategoryFilter from "../pages/Catalogs/CategoryFilter";

const appRoutes = [

  { path: "/", element: <Navigate to="/login" /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
//   { path: "/orders", element: <Orders /> },
//   { path: "/checkout", element: <Checkout /> },
//   { path: "/order-summary", element: <OrderSummary /> },
//   { path: "/payment", element: <Payment /> },
//   { path: "/payment-success", element: <PaymentSuccess /> },
//   { path: "/products", element: <ProductList /> },
//   { path: "/products/:id", element: <ProductDetails /> },
//   { path: "/product-card", element: <ProductCard /> },
//   { path: "/categories", element: <CategoryFilter /> },
];

export default appRoutes;