import express from "express";
import Cart from "../models/cart.model.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { userId, listingId } = req.body;

    if (!userId || !listingId) {
      return res.status(400).json({ message: "userId and listingId are required" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // if user has no cart yet, create one
      cart = new Cart({
        userId,
        listings: [{ listingId, quantity: 1 }],
      });
    } else {
      // filter out any malformed items (missing listingId)
      cart.listings = cart.listings.filter((item) => item && item.listingId);

      // try to find if the listing already exists
      console.log("Cart before update:", JSON.stringify(cart, null, 2));

      const existing = cart.listings.find(
        (item) => item.listingId?.toString() === listingId
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.listings.push({ listingId, quantity: 1 });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Listing added to cart successfully", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error while adding to cart", error: error.message });
  }
});

export default router;
