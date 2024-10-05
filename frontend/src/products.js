

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./App.css"; // Link to the custom CSS
import "./styles/products.css";
import toast from "react-hot-toast";

const Products = ({ onShopClick1, onownershopClick,onShopnameClick1,shopadd }) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true); // Initially true to show loading
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get("https://cartcrafter.onrender.com/user_shops/", {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`, // Include your token here
          },
        });
        setShops(response.data);
        console.log(response.data);
      } catch (err) {
        setError("Please Login First" || "An unknown error occurred.");
        toast.error("Please Login First");
      } finally {
        setLoading(false); // Ensure loading is set to false after fetching
      }
    };

    fetchShops();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>; // Render error message

  return (
    <div className="container">
      <div className="header">
        <h1>Your Shops</h1>
        <Link to="/Owner/shop">
          <button className="add-shop-button">+ Add new Shop</button>
        </Link>
      </div>

      <input type="text" placeholder="Search shops..." className="search-input" />

      <table className="shop-table">
        <thead>
          <tr>
            <th>Shop Name</th>
            <th>Category</th>
            <th>Description</th>
            <th>Address</th>
            <th>Time Created</th>
            <th>Actions</th> {/* Added an Actions header for clarity */}
          </tr>
        </thead>
        <tbody>
          {shops.map((shop) => (
            <tr key={shop.id}>
              <td>{shop.shopname}</td>
              <td>{shop.category}</td>
              <td>{shop.description}</td>
              <td>{shop.address}</td>
              <td>{new Date(shop.created_at).toLocaleDateString()}</td> {/* Format date */}
              <td>
                <Link to="/products/adds">
                  <button onClick={() => onShopClick1(shop.id)} className="action-button">Add Product</button>
                </Link>
                <Link to={`/shopowner/${shop.id}`}>
                  <button 
                    onClick={() => { 
                      onownershopClick(shop.id); 
                      onShopnameClick1(shop.shopname);
                      shopadd(shop.shopname); 
                      // shopadd(shop.address);
                    }} 
                    className="action-button"
                  >
                    See Shop
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
