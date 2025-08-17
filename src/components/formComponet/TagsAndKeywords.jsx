import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';

const TagsAndKeywords = ({ control, setValue, watch }) => {
  const tags = watch('tagandkeywords') || [''];
  const [errors, setErrors] = useState({});

  const handleInputChange = (e, field, index) => {
    const value = e.target.value;
    
    if (value && value.includes('#')) {
      setErrors(prev => ({
        ...prev,
        [index]: 'The # character is not allowed'
      }));
      
      field.onChange('');
      

      setTimeout(() => {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[index];
          return newErrors;
        });
      }, 3000);
    } else {
      
      field.onChange(value);
    
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
    }
  };

  return (
    <div className="bg-white mb-6 dark:bg-gray-800">
      <div className="flex items-center justify-between mb-5 bg-secondary bg-opacity-10 rounded-lg px-5">
        <h2 className="md:text-lg text-base font-semibold text-secondary rounded-lg p-3 dark:text-gray-100">Tags & Keywords</h2>
        <button
          type="button"
          onClick={() => {
            const currentTags = watch('tagandkeywords') || [''];
            setValue('tagandkeywords', [...currentTags, '']);
          }}
          className="inline-flex bg-secondary text-white items-center px-4 py-2.5 border-gray-300 dark:border-gray-600 text-sm font-medium rounded dark:text-blue-400 hover:bg-blue-500 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Tag
        </button>
      </div>

      <div className="grid grid-cols-3">
        {tags.map((tag, index) => (
          <div key={index} className="flex flex-col items-start gap-1 group mb-4">
            <div className="flex w-full items-start gap-3">
              <div className="flex-1 relative">
                <Controller
                  name={`tagandkeywords.${index}`}
                  control={control}
                  render={({ field }) => (
                    <InputText
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => handleInputChange(e, field, index)}
                      placeholder={`Enter tag/keyword #${index + 1}...`}
                      className={`w-full px-4 py-3 border-b ${errors[index] ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-y`}
                    />
                  )}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const currentTags = watch('tagandkeywords');
                  const updatedTags = currentTags.filter((_, i) => i !== index);
                  setValue('tagandkeywords', updatedTags.length > 0 ? updatedTags : ['']);
                  
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[index];
                    return newErrors;
                  });
                }}
                className="mt-3 px-2 py-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Remove Tag"
                aria-label="Remove Tag"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            {errors[index] && (
              <p className="text-xs text-red-500 ml-1">{errors[index]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagsAndKeywords;
