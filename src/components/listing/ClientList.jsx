
// import React, { useState } from "react";
// import { Button } from "primereact/button";
// import { IconField } from "primereact/iconfield";
// import { InputIcon } from "primereact/inputicon";
// import { InputText } from "primereact/inputtext";
// import { Dialog } from "primereact/dialog";
// import { Paginator } from "primereact/paginator";
// import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
// import { useNavigate } from "react-router-dom";
// import useBrandStore from "../../Context/BrandContext";
// import CustomButton from "../../systemdesign/CustomeButton";
// import { Badge } from "primereact/badge";
// import { Tooltip } from "primereact/tooltip";

// export default function BrandListing({ brands }) {
//   const [search, setSearch] = useState("");
//   const [first, setFirst] = useState(0);
//   const [rows, setRows] = useState(5);
//   const [loading, setLoading] = useState(false);

//   const { removeBrand, getAllBrands } = useBrandStore();
//   const navigate = useNavigate();

//   const filteredBrands = brands.filter((brand) =>
//     brand.name.toLowerCase().includes(search.toLowerCase())
//   );

//   const paginatedBrands = filteredBrands.slice(first, first + rows);

//   const handleDelete = async (id) => {
//     setLoading(true);
//     try {
//       await removeBrand(id);
//       await getAllBrands();
//     } catch (error) {
//       console.error("Error deleting brand:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const confirmDelete = (id) => {
//     confirmDialog({
//       message: "Are you sure you want to delete this brand?",
//       header: "Delete Confirmation",
//       icon: "pi pi-exclamation-triangle",
//       acceptClassName: "p-button-danger p-1 mx-4 bg-red-400 text-white",
//       accept: () => handleDelete(id),
//       rejectClassName: "   p-1  bg-blue-400 text-white "
//     });
//   };

//   const onPageChange = (e) => {
//     setFirst(e.first);
//     setRows(e.rows);
//   };

//   const editBrand = (brand) => {
//     navigate("/brands/add", { state: { brand } });
//   };

  



//   return (
//     <div className="p-4">
//       <ConfirmDialog className="m-4" />
      
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
//         <div className="flex items-center">
//         <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 ">
//           Brand List
//         </h1>
         
//         </div>
        
//         <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//           <IconField className="w-full sm:w-60">
//             <InputIcon className="pi pi-search" />
//             <InputText
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setFirst(0);
//               }}
//               placeholder="Search brands..."
//               className="w-full pl-8 p-2 border"
//             />
//           </IconField>

//           <CustomButton
//             title="Add Brand"
//             icon="pi pi-plus"
//             onClick={() => navigate("/brands/add")}
//             className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
//           />
//         </div>
//       </div>

//       {/* Desktop Table */}
//       <div className="hidden md:block min-h-screen">
//         <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
//           <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//             <thead className="bg-gray-50 dark:bg-gray-800">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Brand
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Name
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
//               {paginatedBrands.length > 0 ? (
//                 paginatedBrands.map((brand) => (
//                   <tr
//                     key={brand.brandId}
//                     className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-10 w-10">
//                           <img
//                             className="h-10 w-10 rounded-full object-contain"
//                             src={brand.images[0]}
//                             // src={brand.images?.[0] || "/default-brand.png"}
//                             alt={brand.name}
//                             onError={(e) => {
//                               e.target.src = "/default-brand.png";
//                             }}
//                           />
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                         {brand.name}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <div className="flex justify-end gap-2">
//                         <Tooltip target=".edit-btn" content="Edit Brand" position="top" />
//                         <Button
//                           icon="pi pi-pencil"
//                           className="edit-btn p-button-rounded p-button-text p-button-sm text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
//                           onClick={() => editBrand(brand)}
//                           aria-label="Edit"
//                         />
                        
//                         <Tooltip target=".delete-btn" content="Delete Brand" position="top" />
//                         <Button
//                           icon="pi pi-trash"
//                           className="delete-btn p-button-rounded p-button-text p-button-sm text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
//                           onClick={() => confirmDelete(brand.brandId)}
//                           aria-label="Delete"
//                           loading={loading}
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="3" className="px-6 py-4 text-center">
//                     <div className="text-gray-500 dark:text-gray-400">
//                       {search ? "No matching brands found" : "No brands available"}
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Mobile List */}
//       <div className="md:hidden space-y-3">
//         {paginatedBrands.length > 0 ? (
//           paginatedBrands.map((brand) => (
//             <div
//               key={brand._id}
//               className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 flex justify-between items-center"
//             >
//               <div className="flex items-center gap-3">
//                 {/* <img
//                   className="h-12 w-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
//                   src={brand.images?.[0] || "/default-brand.png"}
//                   alt={brand.name}
//                   onError={(e) => {
//                     e.target.src = "/default-brand.png";
//                   }}
//                 /> */}
//                 <span className="font-medium text-gray-800 dark:text-gray-100">
//                   {brand.name}
//                 </span>
//               </div>
//               <div className="flex gap-2">
//                 <Button
//                   icon="pi pi-pencil"
//                   className="p-button-rounded p-button-text p-button-sm text-blue-500"
//                   onClick={() => editBrand(brand)}
//                 />
//                 <Button
//                   icon="pi pi-trash"
//                   className="p-button-rounded p-button-text p-button-sm text-red-500"
//                   onClick={() => confirmDelete(brand.brandId)}
//                   loading={loading}
//                 />
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="p-4 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow">
//             {search ? "No matching brands found" : "No brands available"}
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       {filteredBrands.length > rows && (
//         <div className="mt-4">
//           <Paginator
//             first={first}
//             rows={rows}
//             totalRecords={filteredBrands.length}
//             rowsPerPageOptions={[5, 10, 20]}
//             onPageChange={onPageChange}
//             className="border-0"
//             template={{
//               layout: "PrevPageLink PageLinks NextPageLink RowsPerPageDropdown",
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState } from "react";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useNavigate } from "react-router-dom";
import useClientStore from "../../Context/ClientContext";
import CustomButton from "../../systemdesign/CustomeButton";
import { Tooltip } from "primereact/tooltip";

export default function ClientListing({ clients }) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const { removeClient, getAllClients } = useClientStore();
  const navigate = useNavigate();

  const filteredClients = clients?.filter((client) =>
    client?.name?.toLowerCase().includes(search?.toLowerCase())
  );

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await removeClient(id);
      await getAllClients();
    } catch (error) {
      console.error("Error deleting client:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    confirmDialog({
      message: "Are you sure you want to delete this client?",
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger p-1 mx-4 bg-red-400 text-white",
      accept: () => handleDelete(id),
      rejectClassName: "p-1 bg-blue-400 text-white",
    });
  };

  const editClient = (client) => {
    console.log(client,"client");
    navigate("/clients/add", { state: { client } });
  };

  return (
    <div className="p-4">
      <ConfirmDialog className="m-4" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Client List</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <IconField className="w-full sm:w-60">
            <InputIcon className="pi pi-search" />
            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients..."
              className="w-full pl-8 p-2 border"
            />
          </IconField>

          <CustomButton
            title="Add Client"
            icon="pi pi-plus"
            onClick={() => navigate("/clients/add")}
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
                  Image
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
              {filteredClients?.length > 0 ? (
                filteredClients?.map((client) => (
                  <tr
                    key={client?.clientId}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={client?.image?.imageUrl}
                        alt={client?.name}
                        
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {client?.name}
                      </span>
                    </td>
                   
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Tooltip target=".edit-btn" content="Edit Client" position="top" />
                        <Button
                          icon="pi pi-pencil"
                          className="edit-btn p-button-rounded p-button-text p-button-sm text-blue-500"
                          onClick={() => editClient(client)}
                        />
                        <Tooltip target=".delete-btn" content="Delete Client" position="top" />
                        <Button
                          icon="pi pi-trash"
                          className="delete-btn p-button-rounded p-button-text p-button-sm text-red-500"
                          onClick={() => confirmDelete(client?.clientId)}
                          loading={loading}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    {search ? "No matching clients found" : "No clients available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {filteredClients?.length > 0 ? (
          filteredClients?.map((client) => (
            <div
              key={client?.clientId}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={client?.image?.imageUrl || "/default-client.png"}
                  alt={client?.name}
                />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-100">{client?.name}</h3>
               
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
         
                  <Button
                    icon="pi pi-pencil"
                    className="border p-1 w-full  p-button-text p-button-sm text-blue-500"
                    onClick={() => editClient(client)}
                  />
                  <Button
                    icon="pi pi-trash"
                    className=" p-1 flex justify-center items-center w-full border  p-button-text p-button-sm text-red-500"
                    onClick={() => confirmDelete(client?.clientId)}
                    loading={loading}f
                  />
                
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow">
            {search ? "No matching clients found" : "No clients available"}
          </div>
        )}
      </div>
    </div>
  );
}