import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import ChatBot from "./components/ChatBot";

import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword"; // ✅ ADD THIS

import ProtectedRoute from "./auth/ProtectedRoute";

import paracetamolImg from "./assets/medicines/paracetamol.png";
import cetirizineImg from "./assets/medicines/cetirizine.png";
import azithromycinImg from "./assets/medicines/azithromycin.png";

/* =====================
   PRODUCT DATA
===================== */
const products = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    brand: "Cipla",
    price: 35,
    mrp: 45,
    rating: 4.4,
    reviews: 1823,
    rx: false,
    image: paracetamolImg,
  },
  {
    id: 2,
    name: "Cetirizine",
    brand: "Sun Pharma",
    price: 20,
    mrp: 30,
    rating: 4.2,
    reviews: 978,
    rx: false,
    image: cetirizineImg,
  },
  {
    id: 3,
    name: "Azithromycin",
    brand: "Pfizer",
    price: 120,
    mrp: 160,
    rating: 4.6,
    reviews: 2456,
    rx: true,
    image: azithromycinImg,
  },
];

function App() {
  const [cart, setCart] = useState([]);

  /* =====================
     ADD TO CART
  ===================== */
  const addToCart = (product) => {
    const exists = cart.find((item) => item.id === product.id);

    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <Navbar cart={cart} />

      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={
            <div className="bg-gray-100 min-h-screen p-6">
              <h1 className="text-gray-900 text-2xl font-bold mb-6">
                Available Medicines
              </h1>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    addToCart={addToCart}
                  />
                ))}
              </div>
            </div>
          }
        />

        {/* AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* ✅ FIX */}

        {/* CART */}
        <Route
          path="/cart"
          element={<Cart cart={cart} setCart={setCart} />}
        />

        {/* CHECKOUT (PROTECTED) */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout cart={cart} setCart={setCart} />
            </ProtectedRoute>
          }
        />

        {/* ORDER SUCCESS */}
        <Route
          path="/success"
          element={<OrderSuccess setCart={setCart} />}
        />
      </Routes>

      {/* CHATBOT */}
      <ChatBot />
    </>
  );
}

export default App;
