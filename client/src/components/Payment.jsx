import React, { useState } from "react";
import PaystackPop from "@paystack/inline-js";
import { useSelector } from "react-redux";
// import { useNavigation } from "react-router-dom";

const Payment = () => {
  const { currentUser } = useSelector((state) => state.user)

  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const amount = 2000;
  const email = currentUser.email;

  const publicKey = "pk_test_9d65cd5e1fad89f36057bcef6c0ad7245d3ff8ea";

  // 
  
  const payWithPaystack = () => {
    const handler = PaystackPop.setup({
      key: publicKey, // Public key
      email: email,
      name: name,
      phone: phoneNumber,
      amount: amount * 100, // Amount in kobo
      currency: "NGN",
      callback: async (response) => {
        alert("Payment successful! Verifying...");
      
        try {
          // Call your backend to verify and record the transaction
          const verifyRes = await fetch(
  `${import.meta.env.MODE === 'development'
    ? 'http://localhost:3000'
    : 'https://your-production-server.com'
  }/api/transactions/verify/${response.reference}`,
  {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }
);

      
          if (!verifyRes.ok) {
            throw new Error("Verification failed");
          }
      
          // Optional: show success message or refresh transaction history
          alert("Payment verified and saved successfully!");
          window.location.reload(); // or re-fetch data if you use React Query or Redux
        } catch (err) {
          console.error("Error verifying payment:", err);
          alert("Payment succeeded but verification failed. Try refreshing.");
        }
      },
      onClose: () => alert("Payment closed"),
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
        Book An Inspection Here
      </h1>
      <div className="max-w-md mx-auto my-4">
        <input
          type="text"
          value={name}
          placeholder="Full Name"
          className={style.input}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />

        <div className={style.input}>
          Email: {currentUser.email}
        </div>

        <input
          type="text"
          value={phoneNumber}
          placeholder="Input Phone Number"
          className={style.input}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
          }}
        />

        <div className={style.input}>
          Inspection Fee: ₦{amount.toLocaleString()}
        </div>

        <button id="payButton" className={style.button} onClick={payWithPaystack}>
          Book an Inspection
        </button>
      </div>
    </div>
  );
};

export default Payment;
