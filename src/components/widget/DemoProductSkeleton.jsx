import React from 'react';
import { Skeleton } from 'primereact/skeleton';
import { Card } from 'primereact/card';

const DemoProductSkeleton = () => {
  return (
    <div className="mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-md">
        <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-6 border-b dark:border-gray-600 pb-2">
          <Skeleton width="200px" height="30px" />
        </h1>

        <div className="space-y-8">
          {/* Product Basic Info Skeleton */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <Skeleton width="150px" height="25px" />
              <Skeleton width="80px" height="20px" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton width="100px" height="20px" />
                  <Skeleton width="100%" height="40px" />
                </div>
              ))}
              <div className="md:col-span-2 space-y-2">
                <Skeleton width="120px" height="20px" />
                <Skeleton width="100%" height="80px" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Skeleton width="120px" height="20px" />
                <Skeleton width="100%" height="80px" />
              </div>
            </div>
          </Card>

          {/* Category & Brand Skeleton */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <Skeleton width="150px" height="25px" />
              <Skeleton width="80px" height="20px" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton width="100px" height="20px" />
                <Skeleton width="100%" height="40px" />
              </div>
              <div className="space-y-2">
                <Skeleton width="100px" height="20px" />
                <Skeleton width="100%" height="40px" />
              </div>
              <div className="space-y-2">
                <Skeleton width="100px" height="20px" />
                <Skeleton width="100%" height="40px" />
              </div>
            </div>
          </Card>

          {/* Pricing Options Skeleton */}
          <Card>
            <Skeleton width="150px" height="25px" className="mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} width="100%" height="80px" />
              ))}
            </div>
            <div className="space-y-6">
              <Skeleton width="100%" height="300px" />
              <Skeleton width="100%" height="300px" />
            </div>
          </Card>

          {/* Specifications Skeleton */}
          <Card>
            <Skeleton width="150px" height="25px" className="mb-4" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton width="30%" height="40px" />
                  <Skeleton width="60%" height="40px" />
                  <Skeleton width="10%" height="40px" />
                </div>
              ))}
              <Skeleton width="150px" height="40px" />
            </div>
          </Card>

          {/* Inventory Skeleton */}
          <Card>
            <Skeleton width="200px" height="25px" className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton width="100px" height="20px" />
                  <Skeleton width="100%" height="40px" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <Skeleton width="80px" height="30px" borderRadius="16px" />
              <Skeleton width="120px" height="30px" borderRadius="16px" />
            </div>
          </Card>

          {/* Key Features Skeleton */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <Skeleton width="120px" height="25px" />
              <Skeleton width="60px" height="20px" />
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton width="100%" height="60px" />
                  <Skeleton width="30px" height="30px" shape="circle" />
                </div>
              ))}
              <Skeleton width="120px" height="40px" />
            </div>
          </Card>

          {/* Tags & Keywords Skeleton */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <Skeleton width="150px" height="25px" />
              <Skeleton width="100px" height="35px" />
            </div>
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton width="100%" height="40px" />
                  <Skeleton width="30px" height="30px" shape="circle" />
                </div>
              ))}
            </div>
          </Card>

          {/* Image Uploader Skeleton */}
          <Card>
            <Skeleton width="150px" height="25px" className="mb-4" />
            <Skeleton width="100%" height="200px" className="mb-4" />
            <div className="flex gap-3 mb-6">
              <Skeleton width="120px" height="40px" />
              <Skeleton width="150px" height="40px" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} width="100%" height="150px" />
              ))}
            </div>
          </Card>

          {/* Submit Button Skeleton */}
          <div className="flex justify-end pt-4 border-t dark:border-gray-600">
            <Skeleton width="150px" height="40px" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoProductSkeleton;