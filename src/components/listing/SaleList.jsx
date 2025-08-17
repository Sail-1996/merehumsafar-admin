import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CustomButton from '../../systemdesign/CustomeButton';
import { useNavigate } from 'react-router-dom';

export default function SaleList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sales] = useState([
    {
      id: 1,
      image: 'https://via.placeholder.com/80',
      title: 'Special Sale Offer',
      subtitle: 'Limited Time Discount',
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/80',
      title: 'Holiday Sale',
      subtitle: '50% off on all items',
    },
  ]);

  // Filter Sales List
  const filteredSales = sales.filter((sale) =>
    sale.title.toLowerCase().includes(search.toLowerCase())
  );

  // Handle Delete
  const handleDelete = (id) => {
    console.log(`Sale with ID ${id} deleted`);
  };

  // Action Template for Table View
  const actionBodyTemplate = (rowData) => (
    <div className="flex gap-2 justify-center">
      <Button
        icon="pi pi-pencil"
        className="p-button-text p-button-sm bg-blue-500 text-white rounded p-2"
      />
      <Button
        icon="pi pi-trash"
        className=" text-white rounded p-2 bg-red-500 "
        onClick={() => handleDelete(rowData.id)}
      />
    </div>
  );

  // Sale Image Template for Table View
  const imageTemplate = (rowData) => (
    <div className="flex justify-center">
      <img
        src={rowData.image}
        alt="Sale"
        className="w-10 h-10 object-contain rounded-md"
      />
    </div>
  );

  return (
    <div className='h-screen'>
      {/* ✅ Responsive Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-700 w-full md:w-auto dark:text-gray-100">
          Sale List
        </h3>

        {/* Search and Add Button */}
        <div className="flex flex-row justify-center items-center px-2 gap-3 w-full md:w-auto dark:text-gray-100 ">
          {/* Search Input */}
          <div className="flex relative justify-between items-center p-2  w-[60%] md:w-64 border rounded-md dark:bg-gray-800">
            
              <i className="pi pi-search  absolute top-3 right-2 text-gray-400 dark:text-gray-100 dark:bg-gray-800 " />
              <InputText
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="p-inputtext-sm md:w-full border-none focus:ring-0   focus:outline-none dark:text-gray-100 dark:bg-gray-800 w-full "
              />
       
          </div>

          {/* Add New Button */}
          <CustomButton
            title="Add"
            icon="pi pi-plus"
            onClick={() => navigate('/sale/add')}
            className="w-full md:w-auto"
          />
        </div>
      </div>

      {/* ✅ Table View */}
      <DataTable
        value={filteredSales}
        paginator
        rows={5}
        stripedRows
        className="hidden lg:block border border-gray-300 rounded-md dark:text-gray-100 dark:bg-gray-800"
        paginatorClassName='dark:text-gray-100 dark:bg-gray-800'
        footerClassName='dark:text-gray-100  dark:bg-gray-800'
      >
        <Column
          field="image"
          header="Sale Image"
          body={imageTemplate}
          headerClassName="bg-gray-100 text-gray-500 font-light text-sm  border text-center dark:text-gray-100 dark:bg-gray-800"
          bodyClassName="text-center dark:text-gray-100 text-sm border dark:bg-gray-800"
        />
        <Column
          field="title"
          header="Title"
          headerClassName="bg-gray-100 text-gray-500 font-light text-sm  border text-center dark:text-gray-100 dark:bg-gray-800"
          bodyClassName="text-center font-semibold dark:text-gray-100 text-sm border-b  dark:bg-gray-800"
        />
        <Column
          field="subtitle"
          header="Subtitle"
          headerClassName="bg-gray-100 text-gray-500 font-light text-sm  border text-white text-center dark:text-gray-100 dark:bg-gray-800"
          bodyClassName="text-center dark:text-gray-100 font-semibold text-sm border-b  dark:bg-gray-800"
        />
        <Column
          header="Option"
          body={actionBodyTemplate}
          headerClassName="bg-gray-100 text-gray-700 font-medium text-sm border-b border-gray-300 text-center dark:bg-gray-800 dark:text-gray-100"
          bodyClassName="text-center dark:text-gray-100 text-sm border-b dark:bg-gray-800"
        />
      </DataTable>

      {/* ✅ Card View (For Mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:hidden px-6">
        {filteredSales.map((sale) => (
          <div
            key={sale.id}
            className="bg-white shadow-md rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 "
          >
            <img
              src={sale.image}
              alt={sale.title}
              className="w-full h-32 object-cover dark:text-gray-100 dark:bg-gray-800"
            />
            <div className="p-4 dark:text-gray-100 dark:bg-gray-800">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 dark:bg-gray-800">
                {sale.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-100 dark:bg-gray-800">{sale.subtitle}</p>
              <div className="flex justify-center mt-4 gap-3 dark:text-gray-100 dark:bg-gray-800">
                <Button
                  icon="pi pi-pencil"
                  className="p-button-sm text-white p-2 w-full bg-green-300 "
                />
                <Button
                  icon="pi pi-trash"
                  className="p-button-sm text-white p-2 w-full bg-red-400"
                  onClick={() => handleDelete(sale.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
