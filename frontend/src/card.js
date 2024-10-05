import React, { useState, useEffect } from "react";
import axios from "axios";
// import { assets } from "../assets";
import "./styles/card.css";
import cartimage from "./vector-add-to-cart-vector-icon.jpg"
import toast from "react-hot-toast";
const Card = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("https://cartcrafter.onrender.com/api/cart/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setCartItems(response.data.items || []);

      // Calculate total price
      const calculatedTotal = response.data.items.reduce((acc, item) => {
        return acc + item.product.price * item.quantity;
      }, 0);
      setTotalPrice(calculatedTotal);
    } catch (error) {
      console.error("Error fetching cart:", error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    console.log("Removing item with ID:", itemId);  // Debugging log
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://cartcrafter.onrender.com/api/cart/${itemId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    toast.success("Item removed from cart");

    // Recalculate the total price after removal
    const updatedTotal = updatedItems.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);
    setTotalPrice(updatedTotal);
      // Further processing...
    } catch (error) {
      console.error("Error removing item from cart:", error.response);
      toast.error("Error removing item from cart");
    }
  };
  

  if (loading) return <div>Loading cart...</div>;

  return (
    <>
    {cartItems.length === 0 ? (
      <div className="empty-cart">
        Your cart is empty
      </div>
    ) : (
      <div className="card">
      <div className="cart-container">
        <h2>Shopping Cart</h2>
        <div className="cart-header">
          <span>Product</span>
          <span>Quantity</span>
          <span>Price</span>
        </div>

        {cartItems.map((item) => (
          <div className="cart-item" key={item.id}>
            <div className="product-info">
              <img className="cart-image" src={cartimage} alt={item.product.prod_name} />
              <span>{item.product.prod_name}</span>
            </div>
            <button 
              className="remove-button" 
              onClick={() => handleRemoveItem(item.id)}
            >
              Remove
            </button>

            <span className="quantity">{item.quantity}</span>
            <span>{(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}

        <div className="grand-total">
          Total Price: {totalPrice.toFixed(2)}
        </div>
      </div>
      <button id="buttonc">Place Order</button>
    </div>
    )
  })
    
    </>
  );
};

export default Card;
