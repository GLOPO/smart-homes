import React, { useState } from "react";
import Paystack from "@paystack/inline-js";
// import { useNavigation } from "react-router-dom";

const Payment = () => {
  const publicKey = "pk_test_9d65cd5e1fad89f36057bcef6c0ad7245d3ff8ea";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const amount = 2000;
  // const navigate = useNavigation();

  const handlePayment = () => {
    const popup = new Paystack();
    popup.checkout({
      key: publicKey,
      email,
      amount: amount * 100,
      metadata: {
        name,
        phoneNumber,
      },
      text: "Book an Inspection",
      // handle successful transaction
      onSuccess: () => {
        // your logic
        alert("Successfull");
        // navigate('../pages/Home.jsx')
      },
      onCancel: () => {
        alert("Payment Modal Closed");
      },
      onError: () => {
        alert("Ran into an Error");
      },
    });
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

        <input
          type="email"
          value={email}
          placeholder="Email Address"
          className={style.input}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

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

        <button id="payButton" className={style.button} onClick={handlePayment}>
          Book an Inspection
        </button>
      </div>
    </div>
  );
};

export default Payment;
