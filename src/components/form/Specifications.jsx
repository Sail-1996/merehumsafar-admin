import React, { useState, useEffect } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { FiPlus } from 'react-icons/fi';
import { IoMdSave } from 'react-icons/io';
import useSpecificationFieldsStore from '../../Context/SpecificationFieldsContext.js';

const SpecificationFields = () => {
  const { specificationFields, getAllSpecificationFields } = useSpecificationFieldsStore();
  
  const [selectedSpecification, setSelectedSpecification] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [showNewFieldInput, setShowNewFieldInput] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');

  useEffect(() => {
    getAllSpecificationFields();
  }, []);
  

  const handleAddNewField = () => {
    if (!newFieldName.trim()) return;

    const newSpec = {
      specificationFieldId: Date.now(), // Temporary ID for new fields
      name: newFieldName.trim()
    };

    // Add to selected specifications
    setSelectedSpecification(prev => [...prev, newSpec]);

    // Add to custom fields
    setCustomFields(prev => [
      ...prev,
      { 
        specificationFieldId: newSpec.specificationFieldId,
        name: newSpec.name,
        value: '' 
      }
    ]);

    setNewFieldName('');
    setShowNewFieldInput(false);
  };

  const handleSpecificationChange = (selectedValues) => {
    setSelectedSpecification(selectedValues);

    // Create a map of existing fields for quick lookup
    const existingFieldsMap = customFields.reduce((acc, field) => {
      acc[field.specificationFieldId] = field;
      return acc;
    }, {});

    // Update fields based on selection
    const updatedFields = selectedValues.map(spec => {
      return existingFieldsMap[spec.specificationFieldId] || { 
        specificationFieldId: spec.specificationFieldId,
        name: spec.name,
        value: '' 
      };
    });

    setCustomFields(updatedFields);
  };

  const handleCustomFieldChange = (specificationFieldId, value) => {
    setCustomFields(prev => 
      prev.map(field => 
        field.specificationFieldId === specificationFieldId 
          ? { ...field, value } 
          : field
      )
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex md:flex-row flex-col justify-between items-center w-full">
        <label className="font-semibold text-gray-500 text-left w-full md:w-auto my-2">
          Specifications
        </label>

        <div className="flex flex-col md:flex-row justify-between gap-2 md:w-[70%] w-full">
          <MultiSelect
            value={selectedSpecification}
            onChange={(e) => handleSpecificationChange(e.value)}
            options={specificationFields}
            optionLabel="name"
            filter
            placeholder="Select Specifications"
            className="w-[80%] md:w-[40%] border"
          />

          {!showNewFieldInput ? (
            <button
              type="button"
              onClick={() => setShowNewFieldInput(true)}
              className="flex justify-center items-center"
            >
              <FiPlus className="p-2 bg-secondary text-white rounded text-4xl md:w-auto w-16" />
            </button>
          ) : (
            <div className="flex gap-2 w-full ml-auto">
              <input
                type="text"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                className="p-2 border rounded w-full"
                placeholder="Enter new specification name"
              />
              <button
                type="button"
                onClick={handleAddNewField}
                className="bg-secondary text-white rounded p-2"
              >
                <IoMdSave />
              </button>
            </div>
          )}
        </div>
      </div>

      {customFields.length > 0 && (
        <div className="flex flex-col gap-3 w-full my-2 m">
          {customFields.map((field) => (
            <div
              key={field.specificationFieldId}
              className="flex justify-between items-center"
            >
              <label className="font-medium text-gray-500">
                {field.name}
              </label>
              <input
                type="text"
                value={field.value}
                onChange={(e) =>
                  handleCustomFieldChange(field.specificationFieldId, e.target.value)
                }
                className="w-[70%] p-2 border rounded"
                placeholder={`Enter ${field.name} value`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpecificationFields;


