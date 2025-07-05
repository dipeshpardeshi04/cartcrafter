import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import "./styles/productsbyshop.css";
import { Link } from 'react-router-dom';

const ProductsByShopowner = ({ shopId, onproClick, ulrshop }) => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const fetchProducts = useCallback(async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/shopowner/${shopId}/products/`);
            setProducts(response.data);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products.');
        } finally {
            setLoading(false);
        }
    }, [shopId]); // Add shopId as a dependency

    useEffect(() => {
        if (shopId) {
            fetchProducts();
        }
    }, [shopId, fetchProducts]); // Include fetchProducts in the dependency array

    const deleteProduct = async (productId) => {
        try {
            const token = localStorage.getItem('token'); // Replace with your token retrieval logic
            const config = {
                headers: {
                    Authorization: `Token ${token}`, // Include token in header
                },
            };
            
            await axios.delete(`${backendUrl}/api/products/${productId}/delete/`, config);
            setProducts(products.filter(product => product.id !== productId));
        } catch (err) {
            console.error('Error deleting product:', err);
            setError('Failed to delete product.');
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
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Products for Shop Having ID:  {shopId}</h1>
            <p className='text-xl'>Share Shop link to Customer</p>
            <p className='text-xl'><a href={`${backendUrl}/shop/${shopId}/${ulrshop}`}>{`https://cartcrafter.netlify.app/shop/${shopId}/${ulrshop}`}</a></p>
            <Link to="/pdfgenerator"><button className="sell-btn">Sell Products</button></Link>
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
                            <img
                                src={product.image_url || 'https://www.instamojo.com/blog/wp-content/uploads/2022/03/ecommerce.jpg'}
                                alt={product.prod_name}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="mt-4">
                                <h2 className="text-xl font-semibold text-gray-700">{product.name}</h2>
                                <p className="text-gray-500">{product.description}</p>
                                <p className="mt-2 text-lg font-bold text-gray-900">${product.price}</p>
                                <p>Pro ID: {product.id}</p>
                                <p className="text-gray-500">Quantity: {product.quantaty}</p>
                                <Link to={`/products/${product.id}/edit`}><button className="edit-btn" onClick={() => onproClick(product.id)} >Edit</button></Link>
                                <button onClick={() => deleteProduct(product.id)} className="text-red-500 ml-4">Delete</button>
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

export default ProductsByShopowner;
