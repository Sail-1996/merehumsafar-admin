import React, { useState, useEffect } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import axiosInstance from '../../utils/axiosInstance';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';

const ServiceSelector = ({ onSave, onCancel = () => { }, initialSelected = [] }) => {
  const [services, setServices] = useState([]);
  const [selectedServiceObjects, setSelectedServiceObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosInstance.get('/our-services');
        const fetchedServices = response.data;
        setServices(fetchedServices);

        // Process initialSelected which could be:
        // 1. Array of IDs: [1, 2, 3]
        // 2. Array of objects with ourServiceId: [{ourServiceId: 1}, {ourServiceId: 2}]
        // 3. Single ID: 1
        // 4. Single object: {ourServiceId: 1}

        if (initialSelected) {
          let initialIds = [];

          if (Array.isArray(initialSelected)) {
            // Handle array of IDs or objects
            initialIds = initialSelected.map(item =>
              typeof item === 'object' ? item.ourServiceId : item
            );
          } else if (typeof initialSelected === 'object') {
            // Handle single object
            initialIds = [initialSelected.ourServiceId];
          } else {
            // Handle single ID
            initialIds = [initialSelected];
          }

          // Find matching service objects
          const matchedServices = fetchedServices.filter(service =>
            initialIds.some(id =>
              id && service.ourServiceId && id.toString() === service.ourServiceId.toString()
            )
          );

          console.log('Initial IDs:', initialIds);
          console.log('Matched services:', matchedServices);

          setSelectedServiceObjects(matchedServices);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setFetchError('Failed to load services. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [initialSelected]);

  // Handle selection change and immediately save
  const handleSelectionChange = (e) => {
    const selectedServices = e.value;
    console.log('Selected services:', selectedServices);

    // Update local state
    setSelectedServiceObjects(selectedServices);

    // Immediately save to parent component
    const selectedIds = selectedServices.map(service => service.ourServiceId);
    console.log('Auto-saving selected service IDs:', selectedIds);
    onSave(selectedIds);
  };



  if (fetchError) {
    return (
      <div className="p-4 text-red-500">
        {fetchError}
        <Button
          label="Retry"
          icon="pi pi-refresh"
          className="p-button-text ml-2"
          onClick={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="card ">
      <h3 className="text-lg font-semibold mb-4 text-secondary w-full p-4 px-8 bg-blue-50">
        {selectedServiceObjects?.length > 0 ? 'Selected Services' : 'Select Services'}
      </h3>

      <div className="mb-4">
        <MultiSelect
          value={selectedServiceObjects}
          options={services}
          onChange={handleSelectionChange}
          optionLabel="title"
          filter
          dropdownIcon={loading ? "pi pi-spinner pi-spin" : ""}
          placeholder={loading ? "Loading services..." : "Search services..."}
          className="w-full border text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
          display="chip"
          selectedItemsLabel="{0} services selected"
          maxSelectedLabels={5}
          showSelectAll={services.length > 5}
          disabled={loading}
        />
      </div>

      {/* <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {selectedServiceObjects.length} service(s) selected
        </div>

      </div> */}
    </div>
  );
};

export default ServiceSelector;
