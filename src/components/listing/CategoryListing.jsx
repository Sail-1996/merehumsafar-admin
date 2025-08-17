import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Skeleton } from "primereact/skeleton";
import { Tag } from "primereact/tag";
import { Tooltip } from "primereact/tooltip";
import { Toast } from "primereact/toast";
import CustomButton from "../../systemdesign/CustomeButton";
import { useNavigate } from "react-router-dom";
import useCategoryStore from "../../Context/CategoryContext";

export default function CategoryList() {
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const toast = React.useRef(null);
  const { categoryList, getAllCategories, removeCategory } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      await getAllCategories();
    } catch (error) {
      showError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const showError = (message) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 3000,
    });
  };

  const showSuccess = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 3000,
    });
  };

  const filteredCategories = categoryList.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    setDeleting(true);
    try {
      const res = await removeCategory(categoryToDelete);
      if (res.status == 204) {
        alert("Category Deleted");
        fetchCategories();
        showSuccess("Category deleted successfully");

      } else {

        showError(res?.message || "Unexpected response while deleting category.");
      }

    } catch (error) {
      showError("Failed to delete category");
    } finally {
      setDeleting(false);
      setVisible(false);
      setCategoryToDelete(null);
    }
  };


  const showDeleteDialog = (id) => {
    setCategoryToDelete(id);
    setVisible(true);
  };

  const editCategory = (category) => {
    navigate("/categories/add", { state: { category } });
  };

  const subCategoryTemplate = (rowData) => {
    if (rowData.subCategories.length === 0) {
      return <span className="text-gray-400 dark:text-gray-500">None</span>;
    }

    return (
      <div className="flex flex-wrap gap-1">
        {rowData.subCategories.slice(0, 3).map((sub, index) => (
          <Tag
            key={index}
            value={sub.name || sub}
            severity="info"
            rounded
            className="text-xs"
          />
        ))}
        {rowData.subCategories.length > 3 && (
          <Tag
            value={`+${rowData.subCategories.length - 3}`}
            severity="black"
            rounded
            className="text-xs"
          />
        )}
      </div>
    );
  };

  const actionsTemplate = (rowData) => (
    <>

      <div className="border grid grid-cols-2 p-[2px] rounded gap-1">
        <button
          onClick={() => editCategory(rowData)} className="w-full h-full text-black hover:text-blue-500 flex justify-center items-center bg-gray-100 rounded px-3 py-1"
          title="Edit"
        >
          <i className="pi pi-pencil"></i>
        </button>
        <button
          onClick={() => showDeleteDialog(rowData.categoryId)}
          className="w-full h-full text-red-500 rounded px-3 py-1"
          title="Delete"
        >
          <i className="pi pi-trash"></i>
        </button>

      </div>

      
    </>
  );

  const skeletons = Array.from({ length: 5 }, (_, i) => (
    <div key={i} className="p-4 border-b border-gray-100 dark:border-gray-700">
      <div className="flex gap-4 items-center">
        <Skeleton width="48px" height="48px" borderRadius="8px" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton width="70%" height="18px" />
          <Skeleton width="50%" height="14px" />
        </div>
        <div className="flex gap-2">
          <Skeleton width="32px" height="32px" borderRadius="50%" />
          <Skeleton width="32px" height="32px" borderRadius="50%" />
        </div>
      </div>
    </div>
  ));

  return (
    <div className="dark:text-gray-200 p-4 md:p-6 w-full h-full bg-white dark:bg-gray-900">
      <Toast ref={toast} position="top-right" />


      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Category Management
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {categoryList.length} categories available
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <IconField className="w-full md:w-64">
            <InputIcon className="pi pi-search text-gray-400 dark:text-gray-500" />
            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </IconField>

          <button
            onClick={() => navigate("/categories/add")}
            className="px-4 py-2 gap-5 flex items-center justify-center w-full md:w-auto rounded-lg shadow-sm bg-secondary hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            <i className="pi pi-plus"></i>
            Add Category
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      {loading ? (
        <div className="hidden lg:block border border-gray-100 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
          {skeletons}
        </div>
      ) : (
        <div className="hidden lg:block">
          <DataTable
            value={filteredCategories}
            paginator
            rows={8}
            stripedRows
            className="border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800"
            emptyMessage={
              <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800">
                <i className="pi pi-inbox text-4xl text-gray-400 dark:text-gray-500 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No categories found</p>
              </div>
            }
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            rowsPerPageOptions={[5, 10, 25]}
            paginatorClassName="border-t border-gray-100 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          >
            <Column
              field="name"
              header="Category"
              headerClassName="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium px-4 py-3"
              bodyClassName="px-4 py-3 border-b border-gray-100 dark:border-gray-600 font-medium text-gray-800 dark:text-gray-100 dark:bg-gray-700"
            />
            <Column
              header="Subcategories"
              body={subCategoryTemplate}
              headerClassName="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium px-4 py-3"
              bodyClassName="px-4 py-3 border-b border-gray-100 dark:border-gray-600 font-medium text-gray-800 dark:text-gray-100 dark:bg-gray-700"
            />
            <Column
              header="Actions"
              body={actionsTemplate}
              headerClassName="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium px-4 py-3"
              bodyClassName="px-4 py-3 border-b border-gray-100 dark:border-gray-600 font-medium text-gray-800 dark:text-gray-100 dark:bg-gray-700"
              style={{ width: '140px' }}
            />
          </DataTable>
        </div>
      )}

      {/* Mobile Card View */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse"
            >
              <Skeleton height="140px" className="mb-3 rounded-lg bg-gray-200 dark:bg-gray-700" />
              <Skeleton width="70%" height="20px" className="mb-2 bg-gray-200 dark:bg-gray-700" />
              <Skeleton width="90%" height="16px" className="mb-4 bg-gray-200 dark:bg-gray-700" />
              <div className="flex gap-2">
                <Skeleton width="100%" height="36px" className="rounded bg-gray-200 dark:bg-gray-700" />
                <Skeleton width="100%" height="36px" className="rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:hidden">
          {filteredCategories.map((category) => (
            <div
              key={category.categoryId}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {category.name}
                </h3>

                <div className="flex flex-wrap gap-1 mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                  <p className="text-xs text-gray-600 dark:text-gray-300">Subcategories: </p>
                  {category.subCategories.length > 0 ? (
                    category.subCategories.slice(0, 3).map((sub, index) => (
                      <Tag
                        key={index}
                        value={sub.name || sub}
                        severity="info"
                        rounded
                        className="text-[8px] bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                      />
                    ))
                  ) : (
                    <Tag 
                      value="No subcategories" 
                      severity="secondary" 
                      rounded 
                      className="text-[8px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300" 
                    />
                  )}
                  {category.subCategories.length > 3 && (
                    <Tag
                      value={`+${category.subCategories.length - 3}`}
                      severity="secondary"
                      rounded
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    />
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <Button
                    icon="pi pi-pencil"
                    className="p-2 rounded-full text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30"
                    onClick={() => editCategory(category)}
                    text
                    raised
                  />
                  <Button
                    icon="pi pi-trash"
                    className="p-2 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                    onClick={() => showDeleteDialog(category.categoryId)}
                    text
                    raised
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        header="Delete Category"
        visible={visible}
        onHide={() => {
          setVisible(false);
          setCategoryToDelete(null);
        }}
        className="w-11/12 sm:w-96 bg-white dark:bg-gray-800"
        headerClassName="border-b border-gray-100 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
        contentClassName="p-4 bg-white dark:bg-gray-800"
        footerClassName="border-t border-gray-100 dark:border-gray-700 p-4 bg-white dark:bg-gray-800"
      >
        <div className="flex flex-col items-center text-center">
          <i className="pi pi-exclamation-triangle text-5xl text-red-500 mb-4" />
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Are you sure you want to delete this category? This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            label="Cancel"
            icon="pi pi-times"
            className="p-button-text text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              setVisible(false);
              setCategoryToDelete(null);
            }}
          />
          <Button
            label={deleting ? "Deleting..." : "Delete"}
            icon={deleting ? "pi pi-spinner pi-spin" : "pi pi-trash"}
            className="p-button-danger bg-red-500 hover:bg-red-600 text-white px-3 py-1 dark:bg-red-600 dark:hover:bg-red-700"
            onClick={handleDelete}
            disabled={deleting}
          />
        </div>
      </Dialog>
    </div>
  );
}