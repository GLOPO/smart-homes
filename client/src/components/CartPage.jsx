import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const CartPage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      if (!currentUser?._id) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/cart/${currentUser._id}`);
        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();

        if (Array.isArray(data)) {
          setCartItems(data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Fetch cart error:", err);
        setError("Unable to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [currentUser]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!cartItems.length) return <div>Your cart is empty.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-[#1369A1]">Your Cart</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cartItems.map((item, i) => {
          const listing = item.listingId;
          const img = listing?.imageUrls?.[0] || "https://via.placeholder.com/400";
          return (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={img} alt={listing?.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="font-semibold text-lg">{listing?.name}</h2>
                <p className="text-gray-600 text-sm">
                  {listing?.description?.slice(0, 80) || "No description available"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CartPage;
