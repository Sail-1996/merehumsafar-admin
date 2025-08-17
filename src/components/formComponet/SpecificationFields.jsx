
import React, { useState, useEffect } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { IoMdSave } from 'react-icons/io';
import useSpecificationFieldsStore from '../../Context/SpecificationFieldsContext.js';

const SpecificationFields = ({ specs, onChange }) => {
  const { specificationFields, getAllSpecificationFields, getCommonFieldTemplates } = useSpecificationFieldsStore();

  const [selectedSpecification, setSelectedSpecification] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [showNewFieldInput, setShowNewFieldInput] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [availableFields, setAvailableFields] = useState([]);

  useEffect(() => {
    const loadFields = async () => {
      await getAllSpecificationFields();
      const templates = getCommonFieldTemplates();

      // Filter and format templates
      const formattedTemplates = templates
        .filter(template => template?.name)
        .map((template, index) => ({
          specificationFieldId: `template-${index}`,
          name: template.name.trim(),
          unit: template.unit || ''
        }));

      // Filter and format specification fields
      const validSpecFields = (specificationFields || [])
        .filter(field => field?.name)
        .map(field => ({
          ...field,
          name: field.name.trim()
        }));

      setAvailableFields([...validSpecFields, ...formattedTemplates]);
    };
    loadFields();
  }, []);

  // Initialize from props
  useEffect(() => {
    if (specs && availableFields.length > 0) {
      const initialSpecs = Array.isArray(specs) ? specs : [];

      // Process specs - remove nulls, trim names, remove duplicates
      const processedSpecs = initialSpecs
        .filter(spec => spec?.name)
        .map(spec => ({
          ...spec,
          name: spec.name.trim()
        }))
        .reduce((acc, spec) => {
          const exists = acc.find(item =>
            item.name.toLowerCase() === spec.name.toLowerCase()
          );
          if (!exists) acc.push(spec);
          return acc;
        }, []);

      // Map to field objects with values
      const fieldsWithValues = processedSpecs.map(spec => {
        const matchingField = availableFields.find(field =>
          field.name.toLowerCase() === spec.name.toLowerCase()
        );

        return {
          specificationFieldId: matchingField?.specificationFieldId || spec.specificationFieldId || `custom-${Date.now()}`,
          name: spec.name,
          value: spec.value || '',
          unit: matchingField?.unit || ''
        };
      });

      setSelectedSpecification(fieldsWithValues);
      setCustomFields(fieldsWithValues);
    }
  }, [specs, availableFields]);

  const handleSpecificationChange = (selectedValues) => {
    if (!selectedValues) {
      setSelectedSpecification([]);
      setCustomFields([]);
      onChange?.('specifications', null, []);
      return;
    }

    // Filter out any invalid values
    const validSelectedValues = selectedValues
      .filter(val => val?.name)
      .map(val => ({
        ...val,
        name: val.name.trim()
      }))
      .reduce((acc, val) => {
        const exists = acc.find(item =>
          item.name.toLowerCase() === val.name.toLowerCase()
        );
        if (!exists) acc.push(val);
        return acc;
      }, []);

    // Merge with existing values
    const updatedFields = validSelectedValues.map(spec => {
      const existingField = customFields.find(field =>
        field.specificationFieldId === spec.specificationFieldId ||
        field.name.toLowerCase() === spec.name.toLowerCase()
      );

      return existingField || {
        specificationFieldId: spec.specificationFieldId,
        name: spec.name,
        value: '',
        unit: spec.unit || ''
      };
    });

    setSelectedSpecification(updatedFields);
    setCustomFields(updatedFields);

    const formattedFields = updatedFields.map(({ name, value }) => ({ name, value }));
    onChange?.('specifications', null, formattedFields);
  };

  const handleCustomFieldChange = (specificationFieldId, value) => {
    const updatedFields = customFields.map(field =>
      field.specificationFieldId === specificationFieldId
        ? { ...field, value }
        : field
    );
    setCustomFields(updatedFields);

    const formattedFields = updatedFields.map(({ name, value }) => ({ name, value }));
    onChange?.('specifications', null, formattedFields);
  };

  const handleAddNewField = () => {
    if (!newFieldName.trim()) return;

    const trimmedName = newFieldName.trim();
    const fieldExists = selectedSpecification.some(
      spec => spec.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (fieldExists) {
      console.warn('This specification already exists');
      setNewFieldName('');
      setShowNewFieldInput(false);
      return;
    }

    const newField = {
      specificationFieldId: `custom-${Date.now()}`,
      name: trimmedName,
      value: '',
      unit: ''
    };

    const updatedFields = [...customFields, newField];

    setSelectedSpecification(updatedFields);
    setCustomFields(updatedFields);
    setAvailableFields(prev => [...prev, newField]);

    setNewFieldName('');
    setShowNewFieldInput(false);

    const formattedFields = updatedFields.map(({ name, value }) => ({ name, value }));
    onChange?.('specifications', null, formattedFields);
  };

  const handleRemoveField = (fieldToRemove) => {
    const updatedFields = customFields.filter(
      field => field.specificationFieldId !== fieldToRemove.specificationFieldId
    );
    setSelectedSpecification(updatedFields);
    setCustomFields(updatedFields);

    const formattedFields = updatedFields.map(({ name, value }) => ({ name, value }));
    onChange?.('specifications', null, formattedFields);
  };

  return (
    <div className="flex flex-col gap-6 w-full text-gray-800 dark:text-gray-200">
      <div className="flex items-center justify-between bg-secondary bg-opacity-10  rounded-lg px-5">
        <h2 className="md:text-lg text-base font-semibold text-secondary  rounded-lg  p-3 dark:text-gray-100">Specifications</h2>
      </div>

      <div className="grid grid-cols-2 gap-20 ">
        <MultiSelect
          value={selectedSpecification}
          onChange={(e) => handleSpecificationChange(e.value)}
          options={availableFields}
          optionLabel="name"
          filter
          placeholder="Select Specifications"
          className="w-full border dark:bg-gray-800 dark:text-white dark:border-gray-600"
          panelClassName="border dark:border-gray-600 dark:bg-gray-800"
          display="chip"
          selectedItemsLabel={selectedSpecification.length > 0 ? `${selectedSpecification.length} selected` : "Select Specifications"}
          maxSelectedLabels={0}
          showClear={true}
        />
        <div className=' flex justify-end'>

          {!showNewFieldInput ? (
            <button
              type="button"
              onClick={() => setShowNewFieldInput(true)}
              className="flex   justify-center items-center p-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition"
            >
              <FiPlus className="text-2xl" />
            </button>
          ) : (
            <div className="flex gap-2 w-full">
              <input
                type="text"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                className="p-2 border rounded-md w-full dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                placeholder="New specification name"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddNewField();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddNewField}
                className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition"
              >
                <IoMdSave />
              </button>
            </div>
          )}
        </div>
      </div>


      {customFields.length > 0 && (
        <div className="flex flex-col gap-4 w-full mt-4">
          {customFields.map((field) => (
            <div
              key={field.specificationFieldId}
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2"
            >
              <label className="font-medium text-gray-600 dark:text-gray-300 w-full md:w-[30%]">
                {field.name}
              </label>
              <div className="flex w-full md:w-[70%] gap-2">
                <input
                  type="text"
                  value={field.value || ''}
                  onChange={(e) =>
                    handleCustomFieldChange(field.specificationFieldId, e.target.value)
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  placeholder={`Enter ${field.name} value`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField(field)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  <FiTrash2 className="text-xl" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpecificationFields;
