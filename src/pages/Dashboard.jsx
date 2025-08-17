import React from 'react';
import { Card } from 'primereact/card';

export default function Dashboard() {
  const items = [
    { name: 'Leads', value: 0, icon: 'pi pi-database', color: 'border-red-500', bgColor: 'bg-red-100 dark:bg-red-900' },
    { name: 'Order Pending', value: 0, icon: 'pi pi-inbox', color: 'border-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900' },
    { name: 'Order Processing', value: 0, icon: 'pi pi-box', color: 'border-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900' },
    { name: 'Order Complete', value: 5, icon: 'pi pi-box', color: 'border-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900' },
    { name: 'Total Products', value: 6, icon: 'pi pi-box', color: 'border-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900' },
    { name: 'In Stock Product', value: 6, icon: 'pi pi-box', color: 'border-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900' },
    { name: 'Out of Stock', value: 0, icon: 'pi pi-box', color: 'border-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900' },
    { name: 'On BackOrder', value: 0, icon: 'pi pi-box', color: 'border-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900' },
    { name: 'Main Categories', value: 9, icon: 'pi pi-sitemap', color: 'border-green-400', bgColor: 'bg-green-100 dark:bg-green-900' },
    { name: 'Sub Categories', value: 7, icon: 'pi pi-sitemap', color: 'border-green-400', bgColor: 'bg-green-100 dark:bg-green-900' },
    { name: 'Brands', value: 7, icon: 'pi pi-tag', color: 'border-red-500', bgColor: 'bg-red-100 dark:bg-red-900' },
    { name: 'Clients', value: 13, icon: 'pi pi-users', color: 'border-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900' },
    { name: 'Service Pending', value: 0, icon: 'pi pi-cog', color: 'border-red-500', bgColor: 'bg-red-100 dark:bg-red-900' },
    { name: 'Service Schedule', value: 0, icon: 'pi pi-cog', color: 'border-red-500', bgColor: 'bg-red-100 dark:bg-red-900' },
    { name: 'Service Confirmed', value: 0, icon: 'pi pi-cog', color: 'border-red-500', bgColor: 'bg-red-100 dark:bg-red-900' },
    { name: 'Complains Pending', value: 0, icon: 'pi pi-exclamation-circle', color: 'border-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900' },
    { name: 'Complains Schedule', value: 0, icon: 'pi pi-exclamation-circle', color: 'border-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900' },
    { name: 'Complains Confirmed', value: 0, icon: 'pi pi-exclamation-circle', color: 'border-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 bg-white dark:bg-gray-900 text-black dark:text-gray-100">
      {items.map((item, index) => (
        <Card 
          key={index} 
          className={`shadow-md rounded-lg border-b-4 ${item.color} dark:border-opacity-40 bg-white dark:bg-gray-800 h-full`}
        >
          <div className="flex justify-between items-center p-4 h-full">
            <div className="flex flex-col gap-2">
              <h5 className="subheading font-semibold text-gray-900 dark:text-gray-100">{item.name}</h5>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{item.value}</p>
            </div>
            <div className={`w-12 h-12 flex justify-center items-center rounded-full ${item.bgColor}`}>
              <i className={`${item.icon} text-xl text-gray-600 dark:text-gray-100`}></i>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}