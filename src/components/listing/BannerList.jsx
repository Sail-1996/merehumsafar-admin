import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useBannerStore from '../../Context/BannerContext';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Skeleton } from 'primereact/skeleton';

export default function BannerList() {
  const { loading, banners, fetchBanners, deleteBanner } = useBannerStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleEditBanner = (banner) => {
    navigate('/banner/add', { state: { banner } });
  };

  const handleDelete = async (id) => {
    try {
      await deleteBanner(id);
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg dark:border-gray-700 dark:bg-gray-700 mb-4">
            <div className="flex items-center gap-4">
              <Skeleton width="80px" height="80px" className="rounded-lg dark:bg-gray-600" />
              <Skeleton width="30%" height="1.5rem" className="dark:bg-gray-600" />
              <div className="ml-auto flex gap-2">
                <Skeleton width="2.5rem" height="2.5rem" shape="circle" className="dark:bg-gray-600" />
                <Skeleton width="2.5rem" height="2.5rem" shape="circle" className="dark:bg-gray-600" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-white dark:bg-gray-900">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-left w-full md:w-auto">Banners List</h2>

        <button
          onClick={() => navigate('/banner/add')} // corrected if it's for banners
          className="bg-blue-500 hover:bg-blue-600 w-full md:w-fit text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <i className="pi pi-plus"></i>
          <span>Add Banner</span>
        </button>
      </div>


      {banners.length === 0 ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-700 rounded shadow">
          <i className="pi pi-image text-4xl mb-2" />
          <p className="text-lg">No banners found</p>
          <Button
            label="Create First Banner"
            icon="pi pi-plus"
            className="p-button-text mt-4 text-white bg-secondary"
            onClick={() => navigate('/banner/add')}
          />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5 dark:ring-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Image</th>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {banners.map((banner) => (
                <tr key={banner.bannerId} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200">
                  <td className="px-6 py-4">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-20 h-20 object-cover rounded border dark:border-gray-700"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">{banner.title}</td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <Button
                      icon="pi pi-pencil"
                      className="p-button-rounded p-button-text edit-btn dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      data-pr-tooltip="Edit"
                      onClick={() => handleEditBanner(banner)}
                    />
                    <Button
                      icon="pi pi-trash"
                      className="p-button-rounded p-button-text p-button-danger delete-btn dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700"
                      data-pr-tooltip="Delete"
                      onClick={() => handleDelete(banner.bannerId)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
