import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/Signin";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Contact from "./pages/Contact";
import Payments from "./pages/Payments";
import PaymentHistory from "./pages/PaymentHistory";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/payment" element={<Payments />}/>

        <Route path="/sign-in" element={<SignIn />} />

        <Route path="/sign-up" element={<SignUp />} />

         <Route path='/listing/:listingId' element={<Listing />} />

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route
            path="/update-listing/:listingId"
            element={<UpdateListing />}
          />
          <Route path="/transactions" element={<PaymentHistory />}/>
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
