import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          ✅ Order Placed Successfully
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for shopping with MedKart.  
          Your medicines will be delivered soon.
        </p>

        <Link
          to="/"
          className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
