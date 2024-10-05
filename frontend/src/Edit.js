import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import './styles/Edit.css';
const Edit = ({ productId }) => {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantaty, setQuantity] = useState('');

    // Fetch the current product details when the component mounts
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`https://cartcrafter.onrender.com/api/products/${productId}/`);
                const { name, description, price, quantity } = response.data; // Adjust according to your API response structure
                setProductName(name);
                setDescription(description);
                setPrice(price);
                setQuantity(quantity);
            } catch (error) {
                console.error('Error fetching product details:', error);
                toast.error('Failed to fetch product details.');
            }
        };

        if (productId) {
            fetchProductDetails();
        }
    }, [productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = {
            Prod_name: productName,
            description,
            price,
            quantaty,
        };

        try {
            console.log(updatedData);
            const token = localStorage.getItem('token'); // Get the token from local storage
            const config = {
                headers: {
                    Authorization: `Token ${token}`, // Include token in header
                },
            };

            await axios.put(`https://cartcrafter.onrender.com/api/products/${productId}/update/`, updatedData, config);
            toast.success('Product updated successfully!');
            // Optionally, redirect or refresh the product list after update
        } catch (err) {
            console.error('Error updating product:', err);
            toast.error('Failed to update product.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Update Product</h1>
            <form onSubmit={handleSubmit} className="mt-8 p-4 border border-gray-300 rounded">
                <input
                    type="text"
                    name="name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Product Name"
                    className="border border-gray-400 rounded p-2 mb-2 w-full"
                    required
                />
                <input
                    type="text"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Product Description"
                    className="border border-gray-400 rounded p-2 mb-2 w-full"
                    required
                />
                <input
                    type="number"
                    name="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Product Price"
                    className="border border-gray-400 rounded p-2 mb-2 w-full"
                    required
                />
                <input
                    type="number"
                    name="quantity"
                    value={quantaty}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Product Quantity"
                    className="border border-gray-400 rounded p-2 mb-2 w-full"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white rounded p-2">
                    Update Product
                </button>
            </form>
        </div>
    );
};

export default Edit;
