import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for API requests
import "./styles/Home.css";
import { Link } from "react-router-dom";
import Footer from "./Footer.js";

const Home = ({onShopClick,onShopnameClick1}) => {
  const [shops, setShops] = useState([]); // State to store shops data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to store any errors

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/allshops/');
        setShops(response.data); // Set the shops data
        setLoading(false); // Turn off loading once data is fetched
      } catch (err) {
        console.error('Error fetching shops:', err);
        setError('Failed to fetch shops. Please try again later.');
        setLoading(false); // Turn off loading even if there's an error
      }
    };

    fetchShops(); // Call the function to fetch data
  }, []); // Empty dependency array to ensure this effect runs only once

  // Display loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Display error state
  if (error) {
    return <div>{error}</div>;
  }

  // Function to handle button click
  // const handleShopClick = (shopId) => {
  //   // Navigate to the ProductsByShop page
  //   window.location.href = `/shop/${shopId}`;
  // };

  return (
    <div className="App">
      <div className="app">
        {/* Header */}
        <section className="hero">
          <h1>Empowering Shop Owners to Showcase Their Brands Online with Ease!</h1>
        </section>

        {/* Info Section */}
        <section className="info-section">
          {shops.map((shop) => (
            <div className="info-box" key={shop.id}>
              <img className='image-home' src="https://wallpaperaccess.com/full/2484120.jpg" alt="" />
              <h3>{shop.shopname}</h3>
              <p><strong>Category:</strong> {shop.category}</p>
              <p><strong>Des: </strong>{shop.description}</p>
              <p><strong>Address:</strong> {shop.address}</p>
              <p><strong>Owner:</strong> {shop.owner_name}</p>
              {/* Button to view products by shop */}
              <Link to={`/shop/${shop.id}/${shop.shopname}`}>
  <button onClick={() => {
    onShopClick(shop.id);
    onShopnameClick1(shop.shopname);
  }}>
    View Shop
  </button>
</Link>
            </div>
          ))}
        </section>
      </div>
      <Footer/>
    </div>
  );
};

export default Home;
