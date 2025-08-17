import React from 'react';
import { useNavigate } from "react-router-dom";
import ProductList from '../components/listing/ProductListing';
import CustomButton from '../systemdesign/CustomeButton';

export default function Products() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/products/add');
  };

  const handleEdit = (sku) => {
    console.log(`Edit product with SKU: ${sku}`);
    navigate(`/products/add/`);
  };

  const handleDelete = (sku) => {
    console.log(`Delete product with SKU: ${sku}`);
    alert(`Delete product with SKU: ${sku}`);
  };

  const products = [
    { image: "http://panelro.xpertspot.com/assets/images/product/1.png", sku: "RR000001", name: "Domestic Water Filter", category: "Domestic", quantity: 100, monthlyPrice: "AED 70.00", yearlyPrice: "AED 900.00" },
    { image: "http://panelro.xpertspot.com/assets/images/product/2.png", sku: "RR000002", name: "Commercial Water Filter - 200 GPD", category: "Commercial", quantity: 8, monthlyPrice: "AED 120.00", yearlyPrice: "AED 2,800.00" },
    { image: "http://panelro.xpertspot.com/assets/images/product/3.png", sku: "RR000003", name: "Industrial Water Filter", category: "Industrial", quantity: 9, monthlyPrice: "AED 70.00", yearlyPrice: "AED 700.00" },
    { image: "http://panelro.xpertspot.com/assets/images/product/1.png", sku: "RR000004", name: "Water Cooler", category: "Water Cooler", quantity: 9, monthlyPrice: "AED 70.00", yearlyPrice: "AED 700.00" },
    { image: "http://panelro.xpertspot.com/assets/images/product/2.png", sku: "RR000005", name: "Water Dispenser", category: "Dispenser", quantity: 10, monthlyPrice: "AED 70.00", yearlyPrice: "AED 700.00" },
    { image: "http://panelro.xpertspot.com/assets/images/product/3.png", sku: "RR000006", name: "3 in 1 - 3 Way Kitchen Sink Faucet - RO Faucet", category: "Domestic", quantity: 100, monthlyPrice: "AED 30.00", yearlyPrice: "AED 280.00" },
  ];

  return (
    <div className="dark:bg-dark dark:text-white">
      <ProductList products={products} handleEdit={handleEdit} handleDelete={handleDelete} />
    </div>
  );
}
