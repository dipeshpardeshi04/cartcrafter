import React, { useState } from "react";
import "./styles/Loginpop.css"; // Assuming your CSS file is named this way
import axios from "axios";
import cookie from "js-cookie";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate

const AddShop = ({ setshowlogin }) => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [shopname, setShopname] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [address, setaddress] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  // Handle input changes
  const handleShopnameChange = (e) => setShopname(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleaddressChange = (e) => setaddress(e.target.value);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get the CSRF token from cookies if required by Django
    

    try {
      // Send POST request to the Django API to create a shop
      const csrfToken = cookie.get("csrftoken");
      const token = localStorage.getItem('token');
      console.log('CSRF Token:', csrfToken);

      const response = await axios.post(
        `${backendUrl}/createshop/`,
        {
          shopname,
          category,
          description,
          address,
        },
        {
          headers: {
            'Authorization': `Token ${token}`,
            'X-CSRFToken': csrfToken
          },
        }
      );

      // On success
      toast.success("Shop successfully created!");
      console.log(response);

      // Optionally, clear the form fields
      setShopname("");
      setCategory("");
      setDescription("");
      setaddress("");

      // Navigate to the Owner page after the shop is added
      navigate("/Owner");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error creating shop. Please try again.");
    }
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>Add Shop</h2>
          <Link to="/Owner"><p >X</p></Link>
        </div>

        <div className="login-popup-input">
          <input
            type="text"
            placeholder="Your shop name"
            value={shopname}
            onChange={handleShopnameChange}
            required
          />
          <input
            type="text"
            placeholder="Shop category"
            value={category}
            onChange={handleCategoryChange}
            required
          />
          <input
            type="text"
            placeholder="Shop description"
            value={description}
            onChange={handleDescriptionChange}
            required
          />
        </div>
        <input
          type="text"
          placeholder="Shop address"
          value={address}
          onChange={handleaddressChange}
          required
        />

        <button type="submit">
          Add Shop
        </button>
      </form>
    </div>
  );
};

export default AddShop;
