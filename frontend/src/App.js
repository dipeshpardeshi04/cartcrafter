import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./Navbar.js";
import AdminLogin from "./AdminLogin.js";
import Loginpopup from "./Loginpop.js";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import Home from "./Home.js";
import Card from "./card.js";
import Products from "./products.js";
import AddShop from "./AddShop.js";
import ProductForm from "./proForm.js";
import ProductsByShop from "./productbyshop.js";
import ProductsByShopowner from "./productsforowner.js";
import Edit from "./Edit.js";
import PDFCreator from "./PDFcreater.js";



function App() {
  const [showlogin, setshowlogin] = useState(false);
  const [shopId, setShopId] = useState(null);
  const [shopId1, setShopId1] = useState(null);
  const [shopname, setShopname] = useState(null);
  const [ownershopId, setownershopId] = useState(null);
  const [productId, setproductId] = useState(null);
  const [showloginAdmin, setshowloginAdmin] = useState(false);
//ulrshopname
const [ulrshop, ulrshopname] = useState(null);
  // Function to set shopId when shop is clicked
  // ulrshopadd
  useEffect(() => {
    ulrshopname(ulrshop);
  }, [ulrshop]); 
  // const [Ulrshopadd, ulrshopadd] = useState(null);
  const onShopClick = (shopId) => {
    console.log("Shop clicked with ID:", shopId);
    setShopId(shopId);  // Update the shopId state
  };

  const onShopClick1 = (shopId1) => {
    console.log("Shop clicked with ID:", shopId1);
    setShopId1(shopId1);  // Update the shopId state
  };
  const onproClick = (shopId1) => {
    console.log("Shop clicked with ID:", shopId1);
    console.log(shopId);
    setproductId(shopId1);  // Update the shopId state
  };
  const onShopnameClick1 = (shopname) => {
    console.log("Shop clicked with ID:", shopname);
    setShopname(shopname);  // Update the shopId state
  };
  const onownershopClick = (ownershopId) => {
    console.log("Shop clicked with ID:", ownershopId);
    setownershopId(ownershopId);  // Update the shopId state
  };
  const shopadd = (add) => {
    console.log("Shop clicked with ID:", ownershopId);
    ulrshopname(add);  // Update the shopId state
  };


// console.log("dhopppppppppppp",shopId1)
  return (
    <>
      <Toaster />
      {showlogin ? <Loginpopup setshowlogin={setshowlogin} /> : null}
      {showloginAdmin ? (
        <AdminLogin setshowloginAdmin={setshowloginAdmin} />
      ) : null}
      <Navbar setshowlogin={setshowlogin} setshowloginAdmin={setshowloginAdmin} />

      <Routes>
        <Route path="/Card" element={<Card />} />
        <Route path="/" element={<Home onShopClick={onShopClick} onShopnameClick1={onShopnameClick1} />} />  {/* Passing onShopClick */}
        <Route path="/Owner" element={<Products onShopClick1={onShopClick1} onownershopClick={onownershopClick} onShopnameClick1={onShopnameClick1} shopname={shopname} shopadd={shopadd} />} />
        <Route path="/Owner/shop" element={<AddShop />} />
        <Route path="/products/adds" element={<ProductForm shopId={shopId1} />} />
        {/* Passing shopId to ProductsByShop */}
        <Route path="/shop/:shopId/:shopname" element={<ProductsByShop shopname={shopname} />} />
        <Route path="/shopowner/:shopId" element={<ProductsByShopowner shopId={ownershopId} onproClick={onproClick} ulrshop={ulrshop} />} />
        <Route path="/products/:productId/edit" element={<Edit productId={productId} />} />
        <Route path="/pdfgenerator" element={<PDFCreator />} />
        {/* <Route path="/" element={<Footer />} /> */}
      </Routes>
    </>
  );
}

export default App;
