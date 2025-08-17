import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../systemdesign/CustomeButton";
import BrandList from "../components/listing/BrandListing";
import useBrandStore from "../Context/BrandContext";


export default function Brand() {
  const navigate = useNavigate();
  const { brands, getAllBrands, removeBrand } = useBrandStore()
  useEffect(() => {
    getAllBrands()
  }, [])
  return (
    <div className="h-[100%] dark:bg-gray-900">
      <BrandList brands={brands} />

    </div>
  );
}
