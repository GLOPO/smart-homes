/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import PaystackPop from "@paystack/inline-js";
import { useSelector } from "react-redux";

const Payment = ({ listingName, listingId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const amount = 2000; // inspection fee
  const email = currentUser?.email;
  const userId = currentUser?._id;

  const publicKey = "pk_test_9d65cd5e1fad89f36057bcef6c0ad7245d3ff8ea";

  // ✅ Add listing to user's cart after payment
  const handleBookAndPay = async () => {
    try {
      console.log("Sending to backend:", { userId, listingId });

      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, listingId }),
      });

      const data = await res.json();

      if (!res.ok) {
        // throw new Error(data.message || "Failed to add to cart");
      }

      // alert("✅ Listing successfully added to your cart!");
    } catch (err) {
      // console.error("Error adding to cart:", err);
      // alert("Error adding listing to cart.");
    }
  };

  // ✅ Paystack Payment Logic
  const payWithPaystack = () => {
    if (!name || !phoneNumber) {
      alert("Please enter your name and phone number.");
      return;
    }

    setLoading(true);

    const handler = PaystackPop.setup({
      key: publicKey,
      email,
      amount: amount * 100, // amount in kobo
      currency: "NGN",
      metadata: {
        custom_fields: [
          {
            display_name: "Property Name",
            variable_name: "property_name",
            value: listingName,
          },
          {
            display_name: "Buyer Name",
            variable_name: "buyer_name",
            value: name,
          },
          {
            display_name: "Phone Number",
            variable_name: "phone_number",
            value: phoneNumber,
          },
        ],
      },
      callback: async (response) => {
        alert("✅ Payment successful! Verifying...");

        try {
          const verifyRes = await fetch(
            `/api/transactions/verify/${response.reference}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (!verifyRes.ok) throw new Error("Verification failed");

          // After successful verification → Add to cart
          await handleBookAndPay();
          onClose();
        } catch (err) {
          console.error("Error verifying payment:", err);
          alert("Payment succeeded but verification failed. Please refresh.");
        } finally {
          setLoading(false);
        }
      },
      onClose: () => {
        alert("Payment window closed");
        setLoading(false);
      },
    });

    handler.openIframe();
  };

  const style = {
    input:
      "block w-full px-4 py-2 mb-4 rounded-md border border-gray-300 focus:outline-none",
    button: "block w-full px-4 py-2 bg-[#1369A1] text-white rounded-md",
  };

  return (
    <div className="px-4">
      <h1 className="text-center text-[25px] my-4 font-[600] uppercase">
        Book An Inspection for{" "}
        <span className="text-blue-600">{listingName}</span>
      </h1>

      <div className="max-w-md mx-auto my-4">
        <input
          type="text"
          value={name}
          placeholder="Full Name"
          className={style.input}
          onChange={(e) => setName(e.target.value)}
        />

        <div className={style.input}>Email: {email}</div>

        <input
          type="text"
          value={phoneNumber}
          placeholder="Phone Number"
          className={style.input}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        <div className={style.input}>
          Inspection Fee: ₦{amount.toLocaleString()}
        </div>

        <button
          id="payButton"
          className={style.button}
          onClick={payWithPaystack}
          disabled={loading}
        >
          {loading ? "Processing..." : "Book an Inspection"}
        </button>

        <button
          onClick={onClose}
          className="block w-full mt-3 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Payment;
