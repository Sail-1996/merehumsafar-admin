import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";

import OrdersTable from '../components/listing/OrderListing'; // Import OrdersTable
import RequestQuotationListing from '../components/listing/RequestQuotationListing';
import useOrderStore from '../Context/OrderContext';

export default function Orders() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { orders, loading, error, fetchOrders } = useOrderStore();



  const quotations = [
    {
      id: 1,
      image: "https://via.placeholder.com/150",
      name: "John Doe",
      email: "john@example.com",
      location: "New York",
      companyName: "TechCorp",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/150",
      name: "Jane Smith",
      email: "jane@example.com",
      location: "California",
      companyName: "InnovateX",
    },
  ];

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className='h-full min-h-screen dark:bg-gray-900'>

      
      

      <OrdersTable orders={orders} search={search} />
    </div>
  );
}
