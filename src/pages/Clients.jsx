import React, { useEffect } from "react";

import ClientList from "../components/listing/ClientList";
import useClientStore from "../Context/ClientContext";


export default function Clients() {

  const { clients, getAllClients, removeClient } = useClientStore()
  useEffect(() => {
    getAllClients()
  }, [])
  return (
    <div className="h-[100%] dark:bg-gray-900">
      <ClientList clients={clients} />

    </div>
  );
}


