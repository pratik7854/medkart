export default function ProductCard({ product, addToCart }) {
  const discount = Math.round(
    ((product.mrp - product.price) / product.mrp) * 100
  );

  return (
    <div className="bg-white rounded-md shadow-sm hover:shadow-lg 
                    transition p-3 w-full max-w-[200px] mx-auto">

      {/* Image */}
      <div className="h-40 flex items-center justify-center mb-2 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full object-contain hover:scale-105 transition"
        />
      </div>

      {/* RX badge */}
      {product.rx && (
        <span className="text-[10px] text-red-600 font-semibold">
          Rx Required
        </span>
      )}

      {/* Name */}
      <h2 className="text-sm font-medium text-gray-900 leading-tight mt-1">
        {product.name}
      </h2>

      {/* Rating */}
      <div className="flex items-center text-xs text-gray-600 mt-1">
        ⭐ {product.rating}
        <span className="ml-1 text-blue-600">
          ({product.reviews})
        </span>
      </div>

      {/* Price */}
      <div className="mt-1">
        <span className="text-lg font-bold text-black">
          ₹{product.price}
        </span>
        <span className="text-xs line-through text-gray-500 ml-2">
          ₹{product.mrp}
        </span>
        <span className="text-xs text-green-600 ml-1">
          {discount}% off
        </span>
      </div>

      {/* Button */}
      <button
        onClick={() => addToCart(product)}
        className="w-full bg-yellow-400 hover:bg-yellow-500 
                   text-black text-sm font-medium py-1.5 rounded mt-2"
      >
        Add to Cart
      </button>
    </div>
  );
}
