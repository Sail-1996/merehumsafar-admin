

import React, { useState } from "react";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useNavigate } from "react-router-dom";
import useBrandStore from "../../Context/BrandContext";
import CustomButton from "../../systemdesign/CustomeButton";
import { Tooltip } from "primereact/tooltip";

export default function BrandListing({ brands }) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const { removeBrand, getAllBrands } = useBrandStore();
  const navigate = useNavigate();

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(search.toLowerCase())
  );

  console.log(filteredBrands, "filtered brands");

  const handleDelete = async (id) => {
    setLoading(true);
    try {
       const res =await removeBrand(id);
      await getAllBrands();
    } catch (error) {
      alert( error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    confirmDialog({
      message: "Are you sure you want to delete this brand?",
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger p-1 mx-4 bg-red-400 text-white",
      accept: () => handleDelete(id),
      rejectClassName: "p-1 bg-blue-400 text-white",
    });
  };

  const editBrand = (brand) => {
    navigate("/brands/add", { state: { brand } });
  };

  return (
    <div className="p-4">
      <ConfirmDialog className="m-4" />

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Brand List</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <IconField className="w-full sm:w-60">
            <InputIcon className="pi pi-search" />
            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search brands..."
              className="w-full pl-8 p-2 border"
            />
          </IconField>

          <CustomButton
            title="Add Brand"
            icon="pi pi-plus"
            onClick={() => navigate("/brands/add")}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          />
        </div>
      </div>

      
      <div className="hidden md:block min-h-screen">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBrands.length > 0 ? (
                filteredBrands.map((brand,index) => (
                  <tr
                  key={index}
        
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <img
                        className="h-10 w-10 rounded-full object-contain"
                        src={brand?.image?.imageUrl}
                        alt={brand?.name}
                        
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {brand?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Tooltip target=".edit-btn" content="Edit Brand" position="top" />
                        <Button
                          icon="pi pi-pencil"
                          className="edit-btn p-button-rounded p-button-text p-button-sm text-blue-500"
                          onClick={() => editBrand(brand)}
                        />
                        <Tooltip target=".delete-btn" content="Delete Brand" position="top" />
                        <Button
                          icon="pi pi-trash"
                          className="delete-btn p-button-rounded p-button-text p-button-sm text-red-500"
                          onClick={() => confirmDelete(brand.brandId)}
                          loading={loading}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    {search ? "No matching brands found" : "No brands available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile List */}
      <div className="md:hidden space-y-3">
        {filteredBrands.length > 0 ? (
          filteredBrands.map((brand) => (
            <div
              key={brand._id}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 flex justify-between items-center"
            >
              <span className="font-medium text-gray-800 dark:text-gray-100">{brand.name}</span>
              <div className="flex gap-2">
                <Button
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-text p-button-sm text-blue-500"
                  onClick={() => editBrand(brand)}
                />
                <Button
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-text p-button-sm text-red-500"
                  onClick={() => confirmDelete(brand.brandId)}
                  loading={loading}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow">
            {search ? "No matching brands found" : "No brands available"}
          </div>
        )}
      </div>
    </div>
  );
}
