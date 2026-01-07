import { useNavigate } from "react-router-dom";

export default function Checkout({ cart, setCart }) {
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  /* ===============================
     STEP 1: CREATE ORDER (MongoDB)
  ================================ */
  const placeOrder = async () => {
    try {
      if (cart.length === 0) {
        alert("Cart is empty");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));

      const res = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user?.email || "guest@medkart.com",
          items: cart,
          amount: total,
        }),
      });

      if (!res.ok) {
        throw new Error("Order creation failed");
      }

      const backendOrder = await res.json();
      console.log("✅ Backend order:", backendOrder);

      // Open Razorpay after order creation
      openRazorpay(total, backendOrder._id);

    } catch (error) {
      console.error("❌ Order error:", error);
      alert("Order failed. Please try again.");
    }
  };

  /* ===============================
     STEP 2: OPEN RAZORPAY
  ================================ */
  const openRazorpay = async (amount, orderId) => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/payment/create-razorpay-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error("Razorpay order error:", data);
        alert("Failed to start payment");
        return;
      }

      const razorpayOrder = data.razorpayOrder;

      const options = {
        key: "rzp_test_RzOIT9TAWFWQTD", // Test Key
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "MedKart",
        description: "Medicine Order",
        order_id: razorpayOrder.id,

        handler: async (response) => {
          try {
            const verifyRes = await fetch(
              "http://localhost:5000/api/payment/verify-payment",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: orderId,
                }),
              }
            );

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              setCart([]);
              navigate("/success");
            } else {
              alert("Payment verification failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Payment verification error");
          }
        },

        prefill: {
          name: "MedKart User",
          email: "test@medkart.com",
          contact: "9999999999",
        },

        theme: {
          color: "#facc15",
        },

        modal: {
          ondismiss: () => {
            alert("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Razorpay init error:", error);
      alert("Unable to start payment");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Address */}
        <div className="md:col-span-2 bg-white p-6 rounded shadow">
          <h2 className="font-semibold mb-4">Delivery Address</h2>

          <input className="w-full mb-3 p-2 border rounded" placeholder="Full Name" />
          <input className="w-full mb-3 p-2 border rounded" placeholder="Phone Number" />
          <input className="w-full mb-3 p-2 border rounded" placeholder="Street Address" />

          <div className="grid grid-cols-2 gap-3">
            <input className="p-2 border rounded" placeholder="City" />
            <input className="p-2 border rounded" placeholder="Pincode" />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-semibold mb-4">Order Summary</h2>

          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              <span>{item.name} × {item.qty}</span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}

          <hr className="my-3" />

          <div className="flex justify-between font-bold text-lg mb-4">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={placeOrder}
            className="w-full bg-yellow-400 hover:bg-yellow-500 py-3 rounded font-semibold"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
