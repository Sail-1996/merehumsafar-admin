import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiEye, FiEdit2, FiTrash2, FiChevronDown, FiCalendar } from "react-icons/fi";
import { BsBoxSeam, BsTruck, BsCheckCircle } from "react-icons/bs";


export default function OrderManagement({ orders }) {
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedRows, setExpandedRows] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();



  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Filter Orders Based on Search
  const filteredOrders = orders.filter((order) =>
    order.userName?.toLowerCase().includes(search.toLowerCase()) ||
    order.orderNumber?.toLowerCase().includes(search.toLowerCase())
  );

  // Handle Delete
  const handleDelete = () => {
    console.log(`Order with ID ${selectedOrder?.orderId} deleted`);
    setVisible(false);
  };

  // Status Template for Table
  const statusTemplate = (rowData) => {
    if (loading) return <Skeleton width="100%" height="1.5rem" />;
    
    const status = rowData.status;
    const getStatusConfig = () => {
      switch (status) {
        case "PENDING":
          return { 
            severity: "warning", 
            icon: <BsBoxSeam className="mr-1" />,
            color: "bg-amber-100 text-amber-800 border-amber-200"
          };
        case "PROCESSING":
          return { 
            severity: "info", 
            icon: <BsBoxSeam className="mr-1" />,
            color: "bg-blue-100 text-blue-800 border-blue-200"
          };
        case "SHIPPED":
          return { 
            severity: "primary", 
            icon: <BsTruck className="mr-1" />,
            color: "bg-indigo-100 text-indigo-800 border-indigo-200"
          };
        case "DELIVERED":
          return { 
            severity: "success", 
            icon: <BsCheckCircle className="mr-1" />,
            color: "bg-green-100 text-green-800 border-green-200"
          };
        case "CANCELLED":
          return { 
            severity: "danger", 
            icon: <FiTrash2 className="mr-1" />,
            color: "bg-red-100 text-red-800 border-red-200"
          };
        default:
          return { 
            severity: "info", 
            icon: <BsBoxSeam className="mr-1" />,
            color: "bg-gray-100 text-gray-800 border-gray-200"
          };
      }
    };

    const config = getStatusConfig();
    return (
      <Tag 
        value={status} 
        severity={config.severity} 
        icon={config.icon}
        className={`flex items-center px-3 py-1 rounded-full border ${config.color}`}
      />
    );
  };

  // Payment Status Template
  const paymentStatusTemplate = (rowData) => {
    if (loading) return <Skeleton width="100%" height="1.5rem" />;
    
    return rowData.isPaid ? (
      <Tag 
        value="PAID" 
        severity="success" 
        icon={<BsCheckCircle className="mr-1" />}
        className="flex items-center px-3 py-1 rounded-full border bg-green-100 text-green-800 border-green-200"
      />
    ) : (
      <Tag 
        value="PENDING" 
        severity="warning" 
        icon={<FiCalendar className="mr-1" />}
        className="flex items-center px-3 py-1 rounded-full border bg-orange-100 text-orange-800 border-orange-200"
      />
    );
  };

  // Loading Skeleton for Rows
  const loadingTemplate = () => {
    return <Skeleton width="100%" height="2rem" />;
  };

  // Items Count Template
  const itemsTemplate = (rowData) => {
    if (loading) return <Skeleton width="100%" height="1.5rem" />;
    
    return (
      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium border border-blue-100">
        {rowData.items?.length || 0} item{rowData.items?.length !== 1 ? 's' : ''}
      </span>
    );
  };

  // Amount Template
  const amountTemplate = (rowData) => {
    if (loading) return <Skeleton width="100%" height="1.5rem" />;
    
    return (
      <span className="font-semibold text-gray-800">
        AED {rowData.totalAmount?.toFixed(2) || '0.00'}
      </span>
    );
  };

  // Date Template
  const dateTemplate = (dateString) => {
    if (loading) return <Skeleton width="100%" height="1.5rem" />;
    
    const date = new Date(dateString);
    return (
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-800">
          {date.toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}
        </span>
        <span className="text-xs text-gray-500">
          {date.toLocaleDateString("en-US", { year: 'numeric' })}
        </span>
      </div>
    );
  };

  // Row Expansion Template
  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700">Customer Details</h4>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="font-medium text-gray-800">{data.userName}</p>
              <p className="text-sm text-gray-600 mt-1">{data.deliveryAddress?.formattedAddress}</p>
              {data.userMobile && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Contact:</span> {data.userMobile}
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700">Order Items</h4>
            <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-3">
              {data.items?.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-10 h-10 rounded-md bg-gray-100 mr-3 overflow-hidden flex items-center justify-center">
                    {item.productImage ? (
                      <img 
                        src={item.productImage} 
                        alt={item.productName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BsBoxSeam className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.productName}</p>
                    <p className="text-sm text-gray-500">{item.productType}</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">
                      {item.quantity} × AED {item.price?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700">Payment Info</h4>
            <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-2">
              <p className="text-sm">
                <span className="font-medium text-gray-700">Method:</span> 
                <span className="ml-2 capitalize text-gray-600">{data.paymentMethod?.toLowerCase()}</span>
              </p>
              {paymentStatusTemplate(data)}
              {data.isPaid && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Paid on:</span> {new Date(data.paidAt).toLocaleDateString()}
                </p>
              )}
              <p className="text-sm pt-2 border-t border-gray-100">
                <span className="font-medium text-gray-700">Total:</span> 
                <span className="ml-2 font-semibold text-gray-800">
                  AED {data.totalAmount?.toFixed(2) || '0.00'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Actions Template for Table
  const actionsTemplate = (rowData) => {
    // if (loading) return <div className="flex gap-2"><Skeleton width="2rem" height="2rem" shape="circle" /><Skeleton width="2rem" height="2rem" shape="circle" /></div>;
    
    return (
      <div className="flex gap-2 ">
        <Button
          icon={<FiEye size={20} className="text-blue-500 " />}
          className="p-button-rounded p-button-text p-button-plain hover:bg-blue-50"
          onClick={() => navigate(`/order/${rowData.orderId}`, { state: { order: rowData } })}
          tooltip="View Details"
          tooltipOptions={{ position: 'top', className: 'text-xs' }}
        />
      
      </div>
    );
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
          <p className="text-gray-500 mt-1">View and manage customer orders</p>
        </div>
        <div className="mt-4 md:mt-0 relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </span>
          <InputText
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full md:w-64 p-2 border rounded-lg focus:ring-0 focus:outline-none"
            disabled={loading}
          />
        </div>
      </div>

      <DataTable
        value={loading ? Array(5).fill({}) : filteredOrders}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
        className={`border border-gray-200 rounded-lg shadow-sm ${loading ? 'opacity-75' : ''}`}
        emptyMessage={loading ? "Loading orders..." : "No orders found"}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        loading={loading}
        responsiveLayout="stack"
        breakpoint="960px"
        size="small"
        paginatorClassName="border-t border-gray-200 px-4 py-3 bg-gray-50 text-gray-600"
      >
        <Column
          field="orderNumber"
          header="Order #"
          sortable
          headerClassName="bg-gray-50 text-gray-600 font-medium px-4 py-3"
          bodyClassName="px-4 py-3 border-b border-gray-100"
          style={{ minWidth: '120px' }}
          body={loading ? loadingTemplate : (rowData) => (
            <span className="text-xs ">#{rowData.orderNumber}</span>
          )}
        />
        <Column
          field="createdAt"
          header="Date"
          body={loading ? loadingTemplate : (rowData) => dateTemplate(rowData.createdAt)}
          headerClassName="bg-gray-50 text-gray-600 font-medium px-4 py-3"
          bodyClassName="px-4 py-3 border-b border-gray-100"
          sortable
          style={{ minWidth: '100px' }}
        />
        <Column
          field="userName"
          header="Customer"
          sortable
          style={{ minWidth: '150px' }}
          headerClassName="bg-gray-50 text-gray-600 font-medium px-4 py-3"
          bodyClassName="px-4 py-3 border-b border-gray-100 font-medium"
          body={loading ? loadingTemplate : null}
        />
        <Column
          header="Items"
          body={itemsTemplate}
          style={{ minWidth: '100px' }}
          headerClassName="bg-gray-50 text-gray-600 font-medium px-4 py-3"
          bodyClassName="px-4 py-3 border-b border-gray-100"
        />
        <Column
          header="Amount"
          body={amountTemplate}
          sortable
          sortField="totalAmount"
          style={{ minWidth: '120px' }}
          headerClassName="bg-gray-50 text-gray-600 font-medium px-4 py-3"
          bodyClassName="px-4 py-3 border-b border-gray-100"
        />
        <Column
          header="Payment"
          body={paymentStatusTemplate}
          sortable
          sortField="isPaid"
          style={{ minWidth: '120px' }}
          headerClassName="bg-gray-50 text-gray-600 font-medium px-4 py-3"
          bodyClassName="px-4 py-3 border-b border-gray-100"
        />
        <Column
          header="Status"
          body={statusTemplate}
          sortable
          sortField="status"
          style={{ minWidth: '140px' }}
          headerClassName="bg-gray-50 text-gray-600 font-medium px-4 py-3"
          bodyClassName="px-4 py-3 border-b border-gray-100"
        />
        <Column
          header="Actions"
          body={actionsTemplate}
          style={{ minWidth: '120px' }}
          headerClassName="bg-gray-50 text-gray-600 font-medium px-4 py-3"
          bodyClassName="px-4 py-3 border-b border-gray-100"
        />
      </DataTable>

      {/* Delete Confirmation Dialog */}
      <Dialog
        header={<span className="font-bold text-gray-800">Confirm Deletion</span>}
        visible={visible}
        style={{ width: '450px' }}
        onHide={() => setVisible(false)}
        footer={
          <div className="flex justify-end space-x-3">
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={() => setVisible(false)}
              className="p-button-text p-2 rounded-md p-button-plain hover:bg-gray-100"
            />
            <Button
              label="Delete"
              icon="pi pi-trash"
              onClick={handleDelete}
              className="p-button-danger p-2 rounded-md bg-red-500 hover:bg-red-600 border-red-500"
              autoFocus
            />
          </div>
        }
      >
        <div className="flex items-start">
          <div className="bg-red-100 p-2 rounded-full mr-3 mt-1">
            <FiTrash2 className="text-red-500 text-lg" />
          </div>
          <div>
            <p className="font-bold text-gray-800 mb-1">Delete order #{selectedOrder?.orderNumber}?</p>
            <p className="text-gray-600 text-sm">
              This action cannot be undone. All order data will be permanently removed.
            </p>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
