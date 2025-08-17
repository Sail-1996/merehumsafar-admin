import React from 'react';
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { IoCloseCircleSharp } from "react-icons/io5";

const AlertBox = ({ title, message, onClose, isSuccess }) => {

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 relative">
        <div className='flex justify-center items-center'>
          {!isSuccess ? (
            <IoCloseCircleSharp className='text-7xl text-red-500 -mt-14 bg-white rounded-full p-2' />
          ) : (
            <IoShieldCheckmarkSharp className='text-7xl text-green-500 -mt-14 bg-white rounded-full p-2' />
          )}
        </div>
        <h1 className={`text-2xl font-bold text-center mb-4 ${!isSuccess ? 'text-red-500' : 'text-green-500'}`}>
          {title}
        </h1>
        <p className="text-gray-600 text-center mb-6">
          {message}
        </p>

        <button 
          onClick={onClose}
          className={`w-full py-2 px-4 border ${!isSuccess ? 'border-red-300 hover:bg-red-50 text-red-500' : 'border-green-300 hover:bg-green-50 text-green-500'} font-medium rounded-md transition duration-200`}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default AlertBox;