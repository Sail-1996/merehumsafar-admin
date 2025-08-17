import React, { useEffect, useRef, useState } from "react";

import { FaFileImage } from "react-icons/fa6";
import { Toast } from "primereact/toast";
import { useRequestQuotationStore } from "../../Context/RequestQoutation";
import { Menu } from "primereact/menu";
import AlertBox from "../widget/AlertBox";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
export default function RequestQuotationListing() {
  const { quotations, loading, fetchQuotations, updateQuotation } =
    useRequestQuotationStore();
  const [search, setSearch] = useState("");

  const toast = useRef(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending', // 'ascending' or 'descending'
  });

  const [showAlert, setShowAlert] = useState(false);
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedQuotation, setSelectedQuotation] = useState([]);

  const [alertData, setAlertData] = useState({
    title: "",
    message: "",
    isSuccess: true,
  });
  useEffect(() => {
    fetchQuotations();
  }, []);


  useEffect(() => {
    if (quotations) {
      setSelectedQuotation(quotations);
    }
  }, [quotations]);


  const StatusDropdown = ({ rowData }) => {

    const [status, setStatus] = useState(rowData?.status || "SENT_QUOTATION");
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const menuRef = useRef(null);

    const statusOptions = [
      {
        value: "SENT_QUOTATION",
        label: "Sent Quotation",
        color: "bg-blue-400",
      },
      {
        value: "NEGOTIATION",
        label: "Negotiation",
        color: "bg-purple-400"
      },
      {
        value: "WAITING_FOR_APPROVAL",
        label: "Waiting Approval",
        color: "bg-yellow-400",
      },
      {
        value: "CLOSE_WON",
        label: "Close Won",
        color: "bg-green-400"
      },
      {
        value: "CLOSE_LOST",
        label: "Close Lost",
        color: "bg-red-400"
      },
    ];

    const handleStatusChange = async (newStatus) => {
      setLoading(true);
      try {
        const res = await updateQuotation(rowData?.requestQuotationId, {
          status: newStatus,
        });
        setStatus(newStatus);

        setAlertData({
          title: "Status Updated",
          message: `Changed to: ${newStatus}`,
          isSuccess: true,
        });
        setShowAlert(true);

        setTimeout(() => setShowAlert(false), 5000);
        fetchQuotations();
      } catch (error) {
        setAlertData({
          title: "Update Failed",
          message: "Could not update status",
          isSuccess: false,
        });
        setShowAlert(true);
      } finally {
        setLoading(false);
      }
    };


    const currentStatus = statusOptions.find((opt) => opt.value === status);

    return (
      <div className="relative">
        <Toast ref={toast} position="top-right" />
        <Menu
          model={statusOptions.map((option) => ({
            label: (
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${option.color}`}></span>
                {option.label}
              </div>
            ),
            command: () => handleStatusChange(option.value),
            className: status === option.value ? "bg-gray-100" : "",
          }))}
          popup
          ref={menuRef}
          id="status_menu"
        />

        <button
          onClick={(e) => menuRef.current.toggle(e)}
          aria-controls="status_menu"
          aria-haspopup
          className={`flex items-center gap-2 px-3 py-1 rounded-md border text-sm ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-50"
            }`}
          disabled={loading}
        >
          {loading ? (
            <svg
              className="animate-spin h-4 w-4 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <>
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${currentStatus?.color || "bg-blue-400"
                  }`}
              ></span>
              <span>
                {currentStatus?.label.slice(0, 10) || "Sent Quotation"}
              </span>
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </>
          )}
        </button>
      </div>
    );
  };

  const actionsTemplate = (rowData) => {
    console.log(rowData, 'rowData')
    return (
      <div className="flex">
        <StatusDropdown rowData={rowData} />
      </div>
    );
  };



  const handleActiveTab = (tab) => {
    if (tab === "ALL") {
      setSelectedQuotation(quotations);
      setActiveTab("ALL");
      return;
    }
    const filteredQuotations = quotations?.filter((quotation) => quotation.status === tab);
    console.log(filteredQuotations, 'filteredQuotations')
    setSelectedQuotation(filteredQuotations);
    setActiveTab(tab);
  };

  const countByStatus = (status) => {
    if (status === "ALL") return quotations?.length || 0;
    return quotations?.filter(q => q.status === status)?.length || 0;
  };

  console.log(quotations, 'quotations', selectedQuotation, 'selectedQuotation');

  return (
    <div className="">
      <Toast ref={toast} position="top-right" />

      <h5 className="heading w-full dark:text-gray-100 mb-3">
        Request Quotation List
      </h5>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 my-4">
        {[
          { label: "ALL", value: "ALL", color: "purple" },
          { label: "Sent Quotation", value: "SENT_QUOTATION", color: "cyan" },
          { label: "Negotiation", value: "NEGOTIATION", color: "pink" },
          { label: "Waiting Approval", value: "WAITING_FOR_APPROVAL", color: "yellow" },
          { label: "Close Won", value: "CLOSE_WON", color: "green" },
          { label: "Close Lost", value: "CLOSE_LOST", color: "red" },
        ].map((tab) => (
          <div
            key={tab}
            onClick={() => handleActiveTab(tab?.value)}
            className={`p-5 bg-white dark:bg-gray-800 border-2 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 
    ${activeTab === tab?.value ? `border-${tab?.color}-400` : ""}`}
          >
            <div className="flex justify-between items-center mb-3">
              <span className={`px-3 py-1 text-[10px] font-semibold uppercase rounded-md bg-${tab?.color}-100 dark:bg-${tab?.color}-900 dark:text-${tab?.color}-200} text-${tab?.color}-500 || ""}`}>
                {tab?.label}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className={`md:text-2xl text-base font-bold text-${tab?.color}-400 dark:text-white`}>
                {countByStatus(tab?.value)}
              </p>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Total Requests
                </p>
              </div>
            </div>
          </div>
        ))}

      </div>



      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <DataTable
          sortMode="multiple"
          stripedRows
          value={loading ? [] : (selectedQuotation.length === 0 ? quotations : selectedQuotation)}
          emptyMessage={loading ? (
            <div className="flex justify-center p-4">
              <ProgressSpinner
                style={{ width: '20px', height: '20px' }}
                strokeWidth="4"
                animationDuration=".5s"
              />
            </div>
          ) : "No quotations found"}
          className="p-datatable-sm"
          responsiveLayout="scroll"
        >
          <Column
            header="S.No."
            headerClassName="text-xs uppercase text-gray-600 dark:text-gray-300 px-6 py-3 text-left"
            body={(rowData, { rowIndex }) => (
              <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                {rowIndex + 1}
              </div>
            )}

          />
          <Column
            field="requestQuotationId"
            header="ID"
            headerClassName="text-xs uppercase text-gray-600 dark:text-gray-300 px-6 py-3 text-left"
            body={(rowData) => (
              <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                {rowData.requestQuotationCode}
              </div>
            )}
            sortable
          />
          <Column
            header="Image"
            headerClassName="text-xs uppercase text-gray-600 dark:text-gray-300 px-6 py-3 text-left"
            body={(rowData) => (
              <div className="px-6 py-4 whitespace-nowrap text-left">
                {imageTemplate(rowData)}
              </div>
            )}
          />
          <Column
            field="name"
            header="Name"
            headerClassName="text-xs uppercase text-gray-600 dark:text-gray-300 px-6 py-3 text-left"
            body={(rowData) => (
              <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                {rowData.name || "N/A"}
              </div>
            )}
            sortable
          />
          <Column
            field="mobile"
            header="Mobile"
            headerClassName="text-xs uppercase text-gray-600 dark:text-gray-300 px-6 py-3 text-left"
            body={(rowData) => (
              <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                {rowData.mobile || "N/A"}
              </div>
            )}

          />
          <Column
            field="companyName"
            header="Company"
            headerClassName="text-xs uppercase text-gray-600 dark:text-gray-300 px-6 py-3 text-left"
            body={(rowData) => (
              <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                {rowData.companyName || "N/A"}
              </div>
            )}
          />
          <Column
            header="Location"
            headerClassName="text-xs uppercase text-gray-600 dark:text-gray-300 px-6 py-3 text-left"
            body={(rowData) => (
              <div className="px-6 py-4 max-w-xs overflow-x-auto whitespace-nowrap text-sm text-gray-500 text-left">
                {rowData?.location
                  ? `${rowData.location.street || ""}, ${rowData.location.city || ""
                    }, ${rowData.location.state || ""}, ${rowData.location.country || ""
                    }, ${rowData.location.pincode || ""}`
                    .replace(/(,\s*)+/g, ", ")
                    .replace(/^, |, $/g, "") || "N/A"
                  : "N/A"}
              </div>
            )}

          />
          <Column
            header="Actions"
            headerClassName="text-xs uppercase text-gray-600 dark:text-gray-300 px-6 py-3 text-left"
            body={(rowData) => (
              <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                {actionsTemplate(rowData)}
              </div>
            )}
          />
        </DataTable>

        {selectedQuotation.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>

          </div>
        )}
      </div>

      {showAlert && (
        <AlertBox
          title={alertData?.title}
          message={alertData?.message}
          isSuccess={alertData?.isSuccess}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}

const imageTemplate = (rowData) => {
  // if (!rowData.productImages || rowData.productImages.length === 0) {
  //   return (
  //     <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center mx-auto">
  //       <FaFileImage className="text-gray-400 text-xl" />
  //     </div>
  //   );
  // }

  return (
    <div className="relative w-12 h-12 rounded-md overflow-hidden mx-auto group">
      <img
        src={rowData.image?.imageUrl}
        alt="Product"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.parentElement.innerHTML = `
          <div class="w-full h-full bg-gray-100 flex items-center justify-center">
            <svg class="text-gray-400 text-xl" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        `;
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <FaFileImage className="text-white text-lg" />
      </div>
    </div>
  );
};
