// import React, { useState, useEffect } from 'react';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { Button } from 'primereact/button';
// import { InputText } from 'primereact/inputtext';
// import { Badge } from 'primereact/badge';
// import { useNavigate } from 'react-router-dom';
// import CustomButton from '../../systemdesign/CustomeButton';
// import useServiceStore from '../../Context/ServiceContext';
// import { Skeleton } from 'primereact/skeleton';

// export default function ServiceList() {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState('');
//   const { services, loading, error, getAllServices, deleteService } = useServiceStore();

//   useEffect(() => {
//     getAllServices();
//   }, [getAllServices]);

//   const handleDelete = async (id) => {
//     try {
//       await deleteService(id);
//     } catch (error) {
//       console.error('Failed to delete service:', error);
//     }
//   };

//   const handleEdit = (service) => {
//     navigate('/service/add', { state: { service } });
//   };

//   const filteredServices = services.filter(
//     (service) =>
//       service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       service.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const actionBodyTemplate = (rowData) => (
//     <div className="flex gap-2 py-2">
//       <Button
//         icon="pi pi-eye"
//         className="p-2 rounded-full text-blue-500 hover:bg-blue-50 transition-colors duration-200"
//         tooltip="View Details"
//         tooltipOptions={{ position: 'top' }}
//       />
//       <Button
//         icon="pi pi-pencil"
//         className="p-2 rounded-full text-green-500 hover:bg-green-50 transition-colors duration-200"
//         onClick={() => handleEdit(rowData)}
//         tooltip="Edit Service"
//         tooltipOptions={{ position: 'top' }}
//       />
//       <Button
//         icon="pi pi-trash"
//         className="p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors duration-200"
//         onClick={() => handleDelete(rowData.ourServiceId)}
//         tooltip="Delete Service"
//         tooltipOptions={{ position: 'top' }}
//       />
//     </div>
//   );

//   const imageTemplate = (rowData) => (
//     <div className="flex items-center py-2">
//       <img
//         src={rowData.imageUrl[0] || 'https://via.placeholder.com/80'}
//         alt={rowData.title}
//         className="w-16 h-16 object-cover rounded-lg shadow-sm hover:scale-105 transition-transform duration-200"
//       />
//     </div>
//   );

//   const titleTemplate = (rowData) => (
//     <div className="flex flex-col gap-1 py-3">
//       <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
//         {rowData.title}
//       </span>
//       <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
//         {rowData.shortDescription}
//       </p>
//     </div>
//   );

//   const skeletonTemplate = () => (
//     <div className="border border-gray-200 dark:border-gray-700 p-4">
//       <div className="flex items-center gap-4">
//         <Skeleton width="100px" height="100px" className="rounded-lg" />
//         <div className="flex-1">
//           <Skeleton width="70%" height="20px" className="mb-2" />
//           <Skeleton width="40%" height="16px" />
//         </div>
//         <div className="flex gap-2">
//           <Skeleton width="40px" height="40px" className="rounded-full" />
//           <Skeleton width="40px" height="40px" className="rounded-full" />
//           <Skeleton width="40px" height="40px" className="rounded-full" />
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) return (
//     <div className="p-6">
//       {/* Header Skeleton */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
//         <div className="flex flex-col gap-2">
//           <Skeleton width="200px" height="32px" className="mb-2" />
//           <Skeleton width="300px" height="20px" />
//         </div>
//         <div className="flex items-center gap-4 w-full md:w-auto">
//           <Skeleton width="240px" height="40px" className="rounded-lg" />
//           <Skeleton width="120px" height="40px" className="rounded-lg" />
//         </div>
//       </div>

//       {/* Table Skeleton - Desktop */}
//       <div className="hidden lg:block">
//         {[1, 2, 3, 4, 5].map((index) => (
//           <div key={index} className="mb-4">
//             {skeletonTemplate()}
//           </div>
//         ))}
//       </div>

//       {/* Card Skeleton - Mobile */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:hidden">
//         {[1, 2, 3, 4, 5, 6].map((index) => (
//           <div
//             key={index}
//             className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg p-4"
//           >
//             <Skeleton height="200px" className="mb-4 rounded-lg" />
//             <Skeleton width="70%" height="24px" className="mb-2" />
//             <Skeleton width="90%" height="16px" className="mb-4" />
//             <div className="flex gap-2 mb-4">
//               <Skeleton width="60px" height="24px" className="rounded-full" />
//               <Skeleton width="60px" height="24px" className="rounded-full" />
//               <Skeleton width="60px" height="24px" className="rounded-full" />
//             </div>
//             <div className="flex justify-end gap-2 pt-4">
//               <Skeleton width="40px" height="40px" className="rounded-full" />
//               <Skeleton width="40px" height="40px" className="rounded-full" />
//               <Skeleton width="40px" height="40px" className="rounded-full" />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   if (error) return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="text-red-500 bg-red-50 p-4 rounded-lg">Error: {error}</div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen dark:bg-gray-900 p-6">
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
//         <div className="flex flex-col gap-2">
//           <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
//             Service List
//           </h3>
//           <p className="text-sm text-gray-500 dark:text-gray-400">
//             Manage and organize your services
//           </p>
//         </div>

//         <div className="flex items-center gap-4 w-full md:w-auto">
//           <div className="relative flex-1 md:flex-none">
//             <InputText
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search services..."
//               className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
//             />
//             <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           </div>

//           <CustomButton
//             title="Add Service"
//             icon="pi pi-plus"
//             onClick={() => navigate('/service/add')}
//             className="px-4 py-2 rounded-lg"
//           />
//         </div>
//       </div>

//       {/* Table View */}
//       <div className="hidden lg:block">
//         <DataTable
//           value={filteredServices}
//           paginator
//           rows={5}
//           stripedRows
//           className="rounded-lg overflow-hidden shadow-lg"
//           emptyMessage="No services found"
//           currentPageReportTemplate="Showing {first} to {last} of {totalRecords} services"
//           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
//           rowsPerPageOptions={[5, 10, 25]}
//           tableStyle={{ minWidth: '50rem' }}
//         >
//           <Column
//             field="imageUrl"
//             header="Image"
//             body={imageTemplate}
//             headerClassName="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium text-left px-6 py-4"
//             bodyClassName="px-6 even:bg-gray-50 dark:even:bg-gray-700 dark:odd:bg-gray-800"
//             style={{ width: '150px' }}
//           />
//           <Column
//             field="ourServiceId"
//             header="ID"
//             headerClassName="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium text-left px-6 py-4"
//             bodyClassName="px-6 text-gray-800 dark:text-gray-200 even:bg-gray-50 dark:even:bg-gray-700 dark:odd:bg-gray-800"
//             style={{ width: '100px' }}
//           />
//           <Column
//             field="title"
//             header="Service Details"
//             body={titleTemplate}
//             headerClassName="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium text-left px-6 py-4"
//             bodyClassName="px-6 even:bg-gray-50 dark:even:bg-gray-700 dark:odd:bg-gray-800"
//           />
//           <Column
//             header="Actions"
//             body={actionBodyTemplate}
//             headerClassName="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium text-left px-6 py-4"
//             bodyClassName="px-6 even:bg-gray-50 dark:even:bg-gray-700 dark:odd:bg-gray-800"
//             style={{ width: '180px' }}
//           />
//         </DataTable>
//       </div>

//       {/* Card View for Mobile */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:hidden">
//         {filteredServices.map((service) => (
//           <div
//             key={service.ourServiceId}
//             className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
//           >
//             <div className="relative group">
//               <img
//                 src={service.imageUrl[0] || 'https://via.placeholder.com/80'}
//                 alt={service.title}
//                 className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//               />
//               <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
//             </div>

//             <div className="p-5">
//               <div className="flex justify-between items-start mb-4">
//                 <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 line-clamp-1">
//                   {service.title}
//                 </h3>
//                 <Badge value={`ID: ${service.ourServiceId}`} severity="secondary" />
//               </div>

//               <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
//                 {service.shortDescription}
//               </p>

//               {service.features && service.features.length > 0 && (
//                 <div className="flex gap-2 mb-4 flex-wrap">
//                   {service.features.slice(0, 3).map((feature, index) => (
//                     <Badge 
//                       key={feature.featureId || index}
//                       value={feature.title}
//                       severity="info"
//                       className="text-xs"
//                     />
//                   ))}
//                   {service.features.length > 3 && (
//                     <Badge 
//                       value={`+${service.features.length - 3} more`}
//                       severity="secondary"
//                       className="text-xs"
//                     />
//                   )}
//                 </div>
//               )}

//               <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">

//                 <Button
//                   icon="pi pi-pencil"
//                   className="p-2 rounded-full text-green-500 hover:bg-green-50 dark:hover:bg-green-900"
//                   onClick={() => handleEdit(service)}
//                 />
//                 <Button
//                   icon="pi pi-trash"
//                   className="p-2 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
//                   onClick={() => handleDelete(service.ourServiceId)}
//                 />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../systemdesign/CustomeButton';
import useServiceStore from '../../Context/ServiceContext';
import { Skeleton } from 'primereact/skeleton';
import { Tooltip } from 'primereact/tooltip';

const stripHtmlTags = (html) => {
  if (!html) return '';
  // First, remove any <p> tags
  let text = html.replace(/<p>/g, '').replace(/<\/p>/g, '');
  // Then remove any other HTML tags if present
  text = text.replace(/<[^>]*>/g, '');
  return text;
};

export default function ServiceList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { services, loading, error, getAllServices, deleteService } = useServiceStore();

  useEffect(() => {
    getAllServices();
  }, [getAllServices]);

  const handleDelete = async (id) => {
    try {
      await deleteService(id);
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  const handleEdit = (service) => {
    navigate('/service/add', { state: { service } });
  };

  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const actionBodyTemplate = (rowData) => (
    <div className="flex gap-2">
      <Tooltip target=".view-btn" position="top" content="View Details" />

      <Tooltip target=".edit-btn" position="top" content="Edit Service" />
      <Button
        icon="pi pi-pencil"
        className="edit-btn p-2 rounded-full text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all duration-200"
        onClick={() => handleEdit(rowData)}
        severity="secondary"
        text
        raised
      />
      <Tooltip target=".delete-btn" position="top" content="Delete Service" />
      <Button
        icon="pi pi-trash"
        className="delete-btn p-2 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200"
        onClick={() => handleDelete(rowData.ourServiceId)}
        severity="secondary"
        text
        raised
      />
    </div>
  );

  const imageTemplate = (rowData) => (
    <div className="flex items-center">
      <img
        src={rowData.image?.imageUrl || 'https://via.placeholder.com/80'}
        alt={rowData.title}
        className="w-12 h-12 object-cover rounded-lg shadow-sm hover:scale-105 transition-transform duration-200"
        
      />
    </div>
  );

  const titleTemplate = (rowData) => (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
        {rowData?.title}
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
        {stripHtmlTags(rowData.shortDescription)}
      </span>
    </div>
  );

  const statusTemplate = (rowData) => (
    <Tag
      value={rowData?.status || 'Active'}
      severity={rowData?.status === 'Inactive' ? 'danger' : 'success'}
      rounded
      className="text-xs"
    />
  );

  const skeletonTemplate = () => (
    <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
      <div className="flex items-center gap-4">
        <Skeleton width="80px" height="80px" className="rounded-lg" />
        <div className="flex-1">
          <Skeleton width="70%" height="20px" className="mb-2" />
          <Skeleton width="40%" height="16px" />
        </div>
        <div className="flex gap-2">
          <Skeleton width="32px" height="32px" className="rounded-full" />
          <Skeleton width="32px" height="32px" className="rounded-full" />
          <Skeleton width="32px" height="32px" className="rounded-full" />
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="p-6">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <Skeleton width="200px" height="32px" className="mb-2" />
          <Skeleton width="300px" height="20px" />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Skeleton width="240px" height="40px" className="rounded-lg" />
          <Skeleton width="120px" height="40px" className="rounded-lg" />
        </div>
      </div>

      {/* Table Skeleton - Desktop */}
      <div className="hidden lg:block space-y-3">
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index}>
            {skeletonTemplate()}
          </div>
        ))}
      </div>

      {/* Card Skeleton - Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:hidden">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm p-4 border border-gray-100 dark:border-gray-700"
          >
            <Skeleton height="160px" className="mb-4 rounded-lg" />
            <Skeleton width="70%" height="20px" className="mb-2" />
            <Skeleton width="90%" height="16px" className="mb-4" />
            <div className="flex gap-2 mb-4">
              <Skeleton width="60px" height="24px" className="rounded-full" />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              {/* <Skeleton width="32px" height="32px" className="rounded-full" /> */}
              <Skeleton width="32px" height="32px" className="rounded-full" />
              <Skeleton width="32px" height="32px" className="rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-red-500 bg-red-50 p-4 rounded-lg">Error: {error}</div>
    </div>
  );

  return (
    <div className="min-h-screen dark:bg-gray-900 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Service Management
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {services?.length} services available
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <span className="p-input-icon-left w-full md:w-64 ">
            <i className="pi pi-search text-gray-400 pl-2" />
            <InputText
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </span>

          <button
            onClick={() => navigate('/service/add')}
            className="bg-secondary justify-center hover:bg-blue-600 w-full md:w-fit text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <i className="pi pi-plus"></i>
            <span>Add Service</span>
          </button>

        </div>
      </div>

      {/* Table View */}
      <div className="hidden md:block">
        <DataTable
          value={filteredServices}
          paginator
          rows={8}
          stripedRows
          className="rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm"
          emptyMessage={
            <div className="flex flex-col items-center justify-center py-12">
              <i className="pi pi-inbox text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No services found</p>
            </div>
          }
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} services"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          rowsPerPageOptions={[5, 10, 25, 50]}
          paginatorClassName="border-t border-gray-100 dark:border-gray-700 px-4 py-3 dark:bg-gray-800 text-gray-400 dark:text-gray-300 "
          tableStyle={{ minWidth: '50rem' }}
        >
          <Column
            field="image.imageUrl"
            header=""
            body={imageTemplate}
            style={{ width: '80px' }}
            headerClassName="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium text-left px-4 py-3"
            bodyClassName="px-4 py-3 border-b border-gray-100 dark:border-gray-700 dark:bg-gray-800 text-gray-400 dark:text-gray-300  "
          />
          <Column
            field="title"
            header="Service Details"
            body={titleTemplate}
            headerClassName="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium text-left px-4 py-3"
            bodyClassName="px-4 py-3 border-b border-gray-100 dark:border-gray-700 dark:bg-gray-800 text-gray-400 dark:text-gray-300 "
          />
          <Column
            field="status"
            header="Status"
            body={statusTemplate}
            headerClassName="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium text-left px-4 py-3"
            bodyClassName="px-4 py-3 border-b border-gray-100 dark:border-gray-700 dark:bg-gray-800 text-gray-400 dark:text-gray-300 "
            style={{ width: '120px' }}
          />
          <Column
            header="Actions"
            body={actionBodyTemplate}
            headerClassName="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium text-left px-4 py-3"
            bodyClassName="px-4 py-3 border-b border-gray-100 dark:border-gray-700 dark:bg-gray-800 text-gray-400 dark:text-gray-300 "
            style={{ width: '160px' }}
          />
        </DataTable>
      </div>

      {/* Card View for Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:hidden gap-4">
        {filteredServices.map((service) => (
          <div
            key={service.ourServiceId}
            className="bg-white border border-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300   dark:border-gray-700"
          >
            <div className="relative group">
              <img
                src={service.image?.imageUrl || 'https://via.placeholder.com/300'}
                alt={service.title}
                className="w-full h-40 object-cover group-hover:opacity-90 transition-opacity duration-300"
                
              />
              <Tag
                value={service?.status || 'Active'}
                severity={service?.status === 'Inactive' ? 'danger' : 'success'}
                rounded
                className="absolute top-2 right-2 text-xs"
              />
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
                  {service?.title}
                </h3>
                <Badge
                  value={`#${service?.ourServiceId}`}
                  severity="info"
                  className="text-xs flex justify-center items-center"
                />
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                {stripHtmlTags(service?.shortDescription)}
              </p>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">

                <Button
                  icon="pi pi-pencil"
                  className="p-2 rounded-full text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30"
                  onClick={() => handleEdit(service)}
                  severity="secondary"
                  text
                  raised
                />
                <Button
                  icon="pi pi-trash"
                  className="p-2 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                  onClick={() => handleDelete(service?.ourServiceId)}
                  severity="secondary"
                  text
                  raised
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
