
import React from 'react';
import LoginForm from '../components/form/LoginForm';
import Waves from '../components/Waves';
import useAuthStore from '../Context/AuthContext';
import logo from '../assets/renroLogo.png'

export default function  Login() {

    return (
        <div className="flex justify-center gap-6 items-center h-screen w-full relative overflow-hidden bg-secondary">

            <img src={logo} alt="" className='w-32 absolute top-10 left-10' />
            <div className="w-[38%] hidden md:block text-center lg:text-left px-4">
                <h1 className="text-white text-5xl  font-bold">Welcome to the App</h1>
                <p className="text-white text-xl mt-4">
                    Your success is our business—let’s make great things happen!
                </p>
            </div>

   
            <div className="flex justify-center items-center w-[90%] md:w-[35%]">
                <div className="border rounded-lg p-6 md:p-8 lg:p-10 w-full sm:w-3/4 md:w-2/3 lg:w-[80%] text-center flex flex-col items-center gap-4 bg-black bg-opacity-10 shadow-xl shadow-gray-800/40 ">
                    <h1 className="text-primary text-3xl font-semibold">Login</h1>
                    <LoginForm  />
                </div>
            </div>

            {/* Waves Background */}
            <div className="absolute bottom-0 left-0 right-0">
                <Waves />
            </div>
        </div>
    );
}
