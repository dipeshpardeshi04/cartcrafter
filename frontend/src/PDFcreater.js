import React, { useState } from "react";
import jsPDF from "jspdf";
import axios from "axios";
import toast from "react-hot-toast";

const PDFCreator = () => {
  const [shopId, setShopId] = useState("");
  const [shopDetails, setShopDetails] = useState(null); // State to store shop details
  const [products, setProducts] = useState([{ productId: "", quantity: "" }]);
  const [productDetails, setProductDetails] = useState([]);
  const [customer, setCustomer] = useState(""); // State for customer name
  const [phone, setPhone] = useState(""); // State for customer phone

  // Function to fetch product details from the backend for a specific shop and product
  const fetchProductDetails = async (index) => {
    try {
      const { productId } = products[index];
      const response = await axios.get(`http://127.0.0.1:8000/api/shopowner/${shopId}/products/${productId}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      const updatedProductDetails = [...productDetails];
      updatedProductDetails[index] = response.data;
      setProductDetails(updatedProductDetails);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  // Function to fetch shop details from the backend
  const fetchShopDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await axios.get(`http://127.0.0.1:8000/api/shops/${shopId}/`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json", // Set content type if needed
        },
      });

      console.log("Shop details fetched successfully:", response.data); // Debug log
      setShopDetails(response.data); // Save shop details
      console.log("Shop details:", shopDetails);
    } catch (error) {
      console.error("Error fetching shop details:", error);
    }
  };

  // Function to update product quantity in the backend
  const updateProductQuantity = async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.patch(
        `http://127.0.0.1:8000/api/shopowner/1/products/${productId}/update/`,
        { quantaty: newQuantity },
        config
      );
      console.log("Product quantity updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating product quantity:", error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let totalAmount = 0;

    // Add Logo
    // const logoUrl = "https://yourlogo.com/logo.png";
    // doc.addImage(logoUrl, 'PNG', 15, 10, 30, 30); // Add logo at the top left

    // Invoice Title
    doc.setFontSize(24);
    doc.setTextColor(40, 55, 71); // Set custom color for title
    doc.text("INVOICE", 105, 30, { align: "center" });

    // Add Shop Name and Details
    if (shopDetails) {
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Shop Name: ${shopDetails.shopname}`, 20, 50); // Dynamic shop name
      doc.text(`Address: ${shopDetails.address}`, 20, 60); // Dynamic shop address
      doc.text(`owner name: ${shopDetails.owner_name}`, 20, 70);
      doc.text(`Email: ${shopDetails.owner_email}`, 20, 80);
    }

    // Line under the header
    doc.setDrawColor(100, 100, 100);
    doc.line(20, 90, 190, 90); // Draw a horizontal line

    // Customer Details
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Bill To:", 20, 100);
    doc.setFontSize(12);
    doc.text(`Customer Name: ${customer}`, 20, 110); // Use customer name from form
    doc.text(`Customer Phone: ${phone}`, 20, 120); // Use customer phone from form

    // Product Details in the PDF (as a table)
    doc.setFontSize(12);
    let y = 130; // Start position for product details

    // Table Header
    doc.setFontSize(12);
    doc.setFillColor(230, 230, 230); // Light grey background for the header
    doc.rect(20, y, 170, 10, "F"); // Draw a filled rectangle for the table header background
    doc.setTextColor(0);
    doc.text("Product", 25, y + 7);
    doc.text("Price", 85, y + 7);
    doc.text("Quantity", 125, y + 7);
    doc.text("Total", 165, y + 7);

    y += 15; // Move position below header

    // Loop through products and add them to the table
    products.forEach((item, index) => {
      const { productId, quantity } = item;
      const details = productDetails[index];

      if (details) {
        const updatedQuantity = details.quantaty - parseInt(quantity);
        if (updatedQuantity < 0) {
          toast.error("Quantity cannot be negative");
        }

        const productTotal = details.price * quantity;
        totalAmount += productTotal;

        // Product Details logoUrl
        doc.text(details.prod_name, 25, y); // Product Name
        doc.text(`Price: $${details.price}`, 85, y); // Product Price
        doc.text(quantity.toString(), 125, y); // Quantity Sold
        doc.text(`$${productTotal.toFixed(2)}`, 165, y); // Total Price for this product

        y += 10; // Move position for the next product

        // Update the quantity in the backend
        updateProductQuantity(productId, updatedQuantity);
      }
    });

    // Line before the total
    doc.setDrawColor(100, 100, 100);
    doc.line(20, y, 190, y);

    // Total Amount
    doc.setFontSize(14);
    doc.setTextColor(40, 55, 71); // Use same color as title for total
    doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 165, y + 10, { align: "right" });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Thank you for your purchase!", 105, y + 30, { align: "center" });
    doc.text("Please contact us if you have any questions regarding this invoice.", 105, y + 40, { align: "center" });

    // Save the PDF
    doc.save("invoice.pdf");
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const handleAddProduct = () => {
    setProducts([...products, { productId: "", quantity: "" }]);
    setProductDetails([...productDetails, null]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchShopDetails(); // Fetch shop details before generating the PDF
    await Promise.all(products.map((_, index) => fetchProductDetails(index)));
  };

  return (
    <div className="pdf-creator">
      <h1>Create and Download Invoice PDF</h1>

      {/* Form to input shop ID and multiple products */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Shop ID:</label>
          <input
            type="text"
            value={shopId}
            onChange={(e) => setShopId(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Customer Name:</label>
          <input
            type="text"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Customer Phone:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        {products.map((product, index) => (
          <div key={index}>
            <label>Product ID:</label>
            <input
              type="text"
              value={product.productId}
              onChange={(e) => handleProductChange(index, "productId", e.target.value)}
              required
            />

            <label>Quantity:</label>
            <input
              type="number"
              value={product.quantity}
              onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
              required
            />
          </div>
        ))}

        <button type="button" onClick={handleAddProduct}>
          Add Another Product
        </button>

        <button type="submit">Generate Invoice</button>
        <button onClick={generatePDF}>Download PDF</button>
      </form>

      {/* <button onClick={generatePDF}>Download PDF</button> */}
    </div>
  );
};

export default PDFCreator;
