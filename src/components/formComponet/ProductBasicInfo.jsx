import React from 'react';
import { Controller } from 'react-hook-form';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

const ProductBasicInfo = ({ control, errors }) => {
  return (
    <div className="bg-white dark:bg-gray-900 border-gray-200 rounded dark:border-gray-700">
      <div className="flex items-center justify-between mb-6 bg-secondary bg-opacity-10 rounded-lg px-5">
        <h2 className="md:text-lg text-base font-semibold text-secondary rounded-lg p-3 dark:text-gray-100">Product Information</h2>
        <span className="text-xs bg-blue-50 dark:bg-blue-900 text-secondary px-1 py-1 rounded max-w-28">Required fields*</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <FloatLabel className='active:text-blue-500'>
            <Controller
              name="basicInfo.name"
              control={control}
              rules={{ required: 'Product name is required' }}
              render={({ field }) => (
                <InputText
                  {...field}
                  id='name'
                  className="w-full px-3 peer py-2 border-b border-gray-300 dark:text-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-0 focus:border-blue-500"
                />
              )}
            />
            <label htmlFor='name' className="block text-sm peer-focus:text-blue-500 font-medium text-gray-700 dark:text-gray-300 focus:text-blue-500">Product Name</label>
          </FloatLabel>
          {errors.basicInfo?.name && (
            <p className="text-xs text-red-500 mt-1">{errors.basicInfo.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <FloatLabel>
            <Controller
              name="basicInfo.modelNo"
              control={control}
              render={({ field }) => (
                <InputText
                  {...field}
                  className="w-full px-3 peer py-2 border-b dark:text-gray-200 dark:bg-gray-800 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-500"
                />
              )}
            />
            <label className="block peer-focus:text-blue-500 text-sm font-medium text-gray-700 dark:text-gray-300">Product Model No</label>
          </FloatLabel>
        </div>

        <div className="space-y-2">
          <FloatLabel>
            <Controller
              name="basicInfo.manufacturer"
              control={control}
              render={({ field }) => (
                <InputText
                  {...field}
                  className="w-full peer px-3 py-2 border-b border-gray-300 dark:text-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-0 focus:border-blue-500"
                />
              )}
            />
            <label className="block peer-focus:text-blue-500 text-sm font-medium text-gray-700 dark:text-gray-300">Manufacturer</label>
          </FloatLabel>
        </div>

        <div className="space-y-2">
          <FloatLabel>
            <Controller
              name="basicInfo.supplierName"
              control={control}
              render={({ field }) => (
                <InputText
                  {...field}
                  className="w-full px-3 peer py-2 border-b border-gray-300 dark:text-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-0 focus:border-blue-500"
                />
              )}
            />
            <label className="block peer-focus:text-blue-500 text-sm font-medium text-gray-700 dark:text-gray-300">Supplier Name</label>
          </FloatLabel>
        </div>

        <div className="space-y-2">
          <FloatLabel>
            <Controller
              name="basicInfo.supplierCode"
              control={control}
              render={({ field }) => (
                <InputText
                  {...field}
                  className="w-full px-3 peer py-2 border-b border-gray-300 dark:text-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-0 focus:border-blue-500"
                />
              )}
            />
            <label className="block peer-focus:text-blue-500 text-sm font-medium text-gray-700 dark:text-gray-300">Supplier Code</label>
          </FloatLabel>
        </div>

        <div className="space-y-2 md:col-span-2">
          <FloatLabel>
            <Controller
              name="basicInfo.shortDescription"
              control={control}
              render={({ field }) => (
                <InputText
                  {...field}
                  maxLength={160}
                  className="w-full px-3 py-2 peer border-b border-gray-300 dark:text-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-0 focus:border-blue-500"
                />
              )}
            />
            <label className="block peer-focus:text-blue-500 text-sm font-medium text-gray-700 dark:text-gray-300">Short Description</label>
          </FloatLabel>
        </div>

        <div className="space-y-2 md:col-span-2">
          <FloatLabel>
            <Controller
              name="basicInfo.longDescription"
              control={control}
              render={({ field }) => (
                <InputTextarea
                  {...field}
                  rows={3}
                  className="w-full peer px-3 py-2 border-b border-gray-300 dark:text-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-0 focus:border-blue-500"
                />
              )}
            />
            <label className="block peer-focus:text-blue-500 text-sm font-medium text-gray-700 dark:text-gray-300">Long Description</label>
          </FloatLabel>
        </div>
      </div>
    </div>
  );
};

export default ProductBasicInfo;