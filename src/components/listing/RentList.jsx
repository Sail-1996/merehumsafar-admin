import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import CustomButton from '../../systemdesign/CustomeButton';
import { Dialog } from 'primereact/dialog';

export default function RentList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);

  // Sample Data
  const [rentals] = useState([
    {
      id: 1,
      image: 'https://via.placeholder.com/80',
      title: 'Flexible Rental Solutions',
      subtitle: 'GET TO KNOW PRODUCTS',
    },
  ]);

  // Filtered Rentals
  const filteredRentals = rentals.filter((rental) =>
    rental.title.toLowerCase().includes(search.toLowerCase())
  );

  // Handle Delete
  const handleDelete = () => {
    console.log(`Rental with ID ${selectedRental?.id} deleted`);
    setVisible(false);
  };

  // Image Template
  const imageTemplate = (rowData) => (
    <div className="flex justify-center">
      <img
        src={rowData.image}
        alt={rowData.title}
        className="w-20 h-12 object-contain rounded-md"
      />
    </div>
  );

  // Actions Template
  const actionsTemplate = (rowData) => (
    <div className="flex gap-2 justify-center">
      <Button
        icon="pi pi-pencil"
        className="rounded p-2 bg-blue-500 text-white"
      />
      <Button
        icon="pi pi-trash"
        onClick={() => {
          setSelectedRental(rowData);
          setVisible(true);
        }}
        className="rounded p-2 bg-red-500 text-white"
      />
    </div>
  );

  return (
    <div className="h-screen">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h5 className="text-xl font-semibold text-gray-700 dark:text-gray-300 w-full md:w-auto">
          Rental Details List
        </h5>

        <div className="flex justify-center flex-row items-stretch gap-3 w-full md:w-auto">
          <IconField
            iconPosition="right"
            className="border rounded flex p-2  md:w-64 dark:bg-gray-700 dark:border-gray-600  w-[60%]"
          >
            <InputIcon className="pi pi-search dark:text-gray-400" />
            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="p-inputtext-sm focus:ring-0 focus:outline-none flex-1 dark:bg-gray-700 dark:text-gray-200 w-[60%]"
            />
          </IconField>

          {/* Add New Button */}
          <CustomButton
            title="Add"
            icon="pi pi-plus"
            onClick={() => navigate('add')}
            className="w-full md:w-auto dark:bg-green-600 dark:hover:bg-green-700 dark:text-white"
          />
        </div>
      </div>



      <DataTable
        value={filteredRentals}
        paginator
        rows={5}
        stripedRows
        paginatorClassName="dark:bg-gray-800"
        className="border border-gray-300 dark:border-gray-700 rounded-md mb-8 hidden lg:block 
             bg-white dark:bg-gray-800 dark:text-gray-200 text-sm"
      >
        <Column
          field="image"
          header="Rental Image"
          body={imageTemplate}
          headerClassName="bg-gray-100 text-gray-500 font-light text-sm border dark:bg-gray-800 dark:border-gray-700 text-center"
          bodyClassName=" dark:bg-gray-800 text-center border text-sm border-gray-300 dark:border-gray-700"
        />
        <Column
          field="title"
          header="Title"
          headerClassName="bg-gray-100 text-gray-500 font-light text-sm border dark:bg-gray-800 dark:border-gray-700 text-center"
          bodyClassName=" dark:bg-gray-800 text-center font-semibold text-sm border-b border-gray-300 dark:border-gray-700"
        />
        <Column
          field="subtitle"
          header="Subtitle"
          headerClassName="bg-gray-100 text-gray-500 font-light text-sm border dark:bg-gray-800 dark:border-gray-700  text-center"
          bodyClassName=" dark:bg-gray-800 text-center font-semibold text-sm border-b border-gray-300 dark:border-gray-700"
        />
        <Column
          header="Option"
          body={actionsTemplate}
          headerClassName="bg-gray-100 text-gray-500 font-light border dark:border-gray-700 text-sm dark:bg-gray-800 border text-center"
          bodyClassName="dark:bg-gray-800 text-center border-b text-sm border-gray-300 dark:border-gray-700"
        />
      </DataTable>




      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6">
  {filteredRentals.map((rental) => (
    <div
      key={rental.id}
      className="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden transition-all duration-300 
                 hover:shadow-xl hover:-translate-y-1 border border-gray-300 dark:border-gray-700"
    >
      <img
        src={rental.image}
        alt={rental.title}
        className="w-full h-32 object-cover border-b border-gray-300 dark:border-gray-700"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          {rental.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {rental.subtitle}
        </p>
        <div className="flex justify-center mt-4 gap-3">
          <Button
            icon="pi pi-pencil"
            className="p-button-sm text-white p-2 w-full bg-green-300"
          />
          <Button
            icon="pi pi-trash"
            className="p-button-sm text-white p-2 w-full bg-red-400"
            onClick={() => {
              setSelectedRental(rental);
              setVisible(true);
            }}
          />
        </div>
      </div>
    </div>
  ))}
</div>


      <Dialog
        header="Confirmation"
        position="top"
        draggable={false}
        visible={visible}
        onHide={() => setVisible(false)}
      >
        <p className="mb-10">
          Do you want to delete this rental with ID{" "}
          <strong>{selectedRental?.id}</strong>?
        </p>
        <div className="flex justify-between">
          <CustomButton
            title="Yes"
            icon="pi pi-check"
            onClick={handleDelete}
          />
          <CustomButton
            title="No"
            icon="pi pi-times"
            onClick={() => setVisible(false)}
          />
        </div>
      </Dialog>
    </div>
  );
}
