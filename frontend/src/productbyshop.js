
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./styles/productsbyshop.css";
import { useParams } from 'react-router-dom';
const ProductsByShop = () => {

    const [products, setProducts] = useState([]);
    const [shopDetails, setShopDetails] = useState(null); // State to store shop details
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { shopId } = useParams();

    // Fetch products based on the shopId when the component mounts or shopId changes
    useEffect(() => {
        const fetchProducts = async () => {
            try {

                const response = await axios.get(`https://cartcrafter.onrender.com/api/shop/${shopId}/products/`);
                setProducts(response.data);
                console.log(response.data);
            } catch (err) {
                console.error('Error fetching products:', err.response || err.message || err);
                setError('Failed to load products. ' + (err.response?.data?.message || err.message || ''));
            } finally {
                setLoading(false);
            }
        };

        const fetchShopDetails = async () => {
            try {
                const response = await axios.get(`https://cartcrafter.onrender.com/api/shops/${shopId}`);
                setShopDetails(response.data);
                console.log("Shop details fetched:", response.data);
            } catch (err) {
                console.error('Error fetching shop details:', err.response || err.message || err);
                setError('Failed to load shop details. ' + (err.response?.data?.message || err.message || ''));
            }
        };

        if (shopId) {
            fetchShopDetails();
            fetchProducts();
        }
    }, [shopId]);  // Trigger fetch when shopId changes

    // Function to add product to cart
    const addToCart = async (productId) => {
        try {
            const token = localStorage.getItem('token'); // Get token from localStorage
            const config = {
                headers: {
                    Authorization: `Token ${token}`, // Include token in header
                },
            };

            // Add the product to the cart
            const response = await axios.post(`https://cartcrafter.onrender.com/api/cart/add/`, { product_id: productId }, config);
            console.log('Product added to cart:', response.data);
            // Optionally show a success message or update UI state here
        } catch (err) {
            console.error('Error adding product to cart:', err.response || err.message || err);
            setError('Failed to add product to cart. ' + (err.response?.data?.message || err.message || ''));
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="shopbg">
            {shopDetails && (
    <h2 className="shop-title">  {shopDetails.shopname}</h2>
)}
{shopDetails && (
    <p className="shop-title">{shopDetails.description}</p>
)}
{shopDetails && (
    <p className="shop-address">Add: {shopDetails.address}</p>
)}
{shopDetails && (
    <p className="shop-address">Owner:{shopDetails.owner_name}</p>
)}
{shopDetails && (
    <p className="shop-address">Email:{shopDetails.owner_email}</p>
)}

            </div>
            {products.length > 0 ? (
                <div className="byshop grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8">
                    {products.map((product) => (
                        <div key={product.id} className="byshop bg-white rounded-lg shadow-md p-8">
                            <img
                                src={product.image_url || 'https://www.instamojo.com/blog/wp-content/uploads/2022/03/ecommerce.jpg'}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="mt-4">
                                <h2 className="text-xl font-semibold text-gray-700">
                                    {product.prod_name}
                                </h2>
                                <p className="text-gray-500">{product.description}</p>
                                <p className="mt-2 text-lg font-bold text-gray-900">
                                   Price: ${product.price}
                                </p>
                                <p>Quantity: {product.quantaty}</p>
                                <button 
                                    onClick={() => addToCart(product.id)} 
                                    className="btn-byshop text-blue-500 mt-2"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500">No products found for this shop.</div>
            )}
        </div>
    );
};

export default ProductsByShop;
