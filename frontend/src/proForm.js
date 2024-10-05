import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProductForm = ({shopId}) => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [quantaty, setQuantaty] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      prod_name: productName,
      price,
      category,
      description,
      shopId,
      quantaty
    };
    console.log(formData);
    try {
      const token = localStorage.getItem('token');  // Assuming you're using token-based authentication
      const response = await axios.post('https://cartcrafter.onrender.com/api/products/',{
        prod_name: productName,
        price,
        category,
        description,
        shopId,
        quantaty
      }, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      console.log(response.data);
      setSuccess('Product added successfully!');
      setError(null);
    } catch (err) {
      setError('Error adding product.');
      setSuccess(null);
    }
  };

  return (
    <div>
      <h2>Add New Product</h2>
      {error && toast.error(error)}
      {success && toast.success(success)}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input type='number' value={quantaty} onChange={(e) => setQuantaty(e.target.value)} required />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default ProductForm;
