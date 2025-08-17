import React, { useState,useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Tag } from "primereact/tag";
import { Tooltip } from "primereact/tooltip";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import  useAboutUsStore  from "../../Context/AboutUsContext";

export default function AboutUsListing() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const {fetchAboutUs,updateAboutUs,deleteAboutUs,aboutUsList} = useAboutUsStore()

  useEffect(()=>{
    fetchAboutUs()
  },[])



  const filteredData = aboutUsList.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  const imageTemplate = (rowData) => (
    <div className="flex justify-center">
      <img
        src={rowData?.image?.imageUrl}
        alt={rowData.title}
        className="w-16 h-16 object-cover rounded-lg shadow-md"
      />
    </div>
  );

  const handleDelete = async (id) => {

   const  res = await deleteAboutUs(id)
   console.log(res,'res')
   if(res.status == 200 || res.status == 201 || res.status == 204){
    alert("About Us deleted successfully!");
   }

  }

  const handleEdit = (about)=> {
    navigate("/about/add", { state: { about } });
  }
  const actionTemplate = (rowData) => (
    <div className="flex gap-2 justify-center">
      <Tooltip target=".edit-btn" content="Edit" position="top" />
      <Button
        icon={<FiEdit2 className="text-blue-500" />}
        className="p-button-text edit-btn"
        onClick={() => handleEdit(rowData)}
      />
      
      <Button
        icon={<FiTrash2 className="text-red-500" />}
        className="p-button-text delete-btn"
        onClick={() => handleDelete(rowData.aboutUsId)}
      />
    </div>
  );

  const header = (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        About Us Sections
      </h2>
      <div className="flex flex-col md:flex-row gap-3 w-full   md:w-auto">
        <div className="p-input-icon-left w-full relative">
          <i className="pi pi-search absolute top-5 right-2 " />
          <InputText
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sections..."
            className="w-full md:w-64 p-2 border"
          />
        </div>
        <Button
          label="Add New"
          icon={<FiPlus className="mr-2" />}
          onClick={() => navigate("/about/add")}
          className="bg-secondary p-2 text-base text-white w-full md:w-[50%]"
        />
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="card shadow-sm rounded-xl border dark:border-gray-700">
        <DataTable
          value={filteredData}
          header={header}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          emptyMessage="No about us sections found."
          className="p-datatable-striped p-datatable-gridlines"
          rowHover
          responsiveLayout="scroll"
        >
          <Column
            field="imageUrl"
            header="Image"
            body={imageTemplate}
            style={{ width: '120px' }}
            headerClassName="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          />
          <Column
            field="title"
            header="Title"
            sortable
            headerClassName="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            bodyClassName="font-medium"
          />
          <Column
            field="subtitle"
            header="Subtitle"
            sortable
            headerClassName="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          />
          <Column
            field="description"
            header="Description"
            // body={(data) => (
            //   <Tooltip target={`.desc-${data.aboutUsId}`} content={data.description} position="top" />
            //   <span className={`desc-${data.aboutUsId} line-clamp-2`}>
            //     {data.description}
            //   </span>
            
            // )}
            headerClassName="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          />
        
          <Column
            header="Actions"
            body={actionTemplate}
            style={{ width: '120px' }}
            headerClassName="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          />
        </DataTable>
      </div>

      {/* Mobile View */}
      <div className="md:hidden  grid grid-cols-1 gap-4 mt-6">
        {filteredData.map((item) => (
          <div
            key={item.aboutUsId}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="p-4 flex items-start gap-4">
              <img
                src={item?.image?.imageUrl}
                alt={item.title}
                className="w-16 h-16 object-cover rounded-lg"

              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 dark:text-white">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.subtitle}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  icon={<FiEdit2 size={16} />}
                  className="p-button-text p-button-sm text-blue-500"
                  onClick={() => navigate(`/about/edit/${item.aboutUsId}`)}
                />
                <Button
                  icon={<FiTrash2 size={16} />}
                  className="p-button-text p-button-sm text-red-500"
                  onClick={() => console.log("Delete", item.aboutUsId)}
                />
              </div>
            </div>
            <div className="px-4 pb-3">
              <Tag
                value="Active"
                severity="success"
                className="text-xs py-1 px-2 rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

