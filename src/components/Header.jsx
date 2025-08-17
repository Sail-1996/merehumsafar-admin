import React, { useRef, useEffect, useState } from 'react';
import { Menu } from 'primereact/menu';
import { useNavigate } from 'react-router-dom';
import { ColorPicker } from 'primereact/colorpicker';
import useAuthStore from '../Context/AuthContext';

export default function Header({ setIsDarkMode }) {

    const menuRef = useRef(null);
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
    const { logout } = useAuthStore();

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDarkMode(true);
        } else {
            document.documentElement.classList.remove("dark");
            setIsDarkMode(false);
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);

    };

    const items = [
        {
            label: 'Options',
            items: [
                {
                    label: 'Setting',
                    icon: 'pi pi-cog',
                    command: () => console.log("Settings Clicked")

                },
                {
                    label: 'Log out',
                    icon: 'pi pi-sign-out',
                    command: () => logout()
                }
            ]
        }
    ];

    return (
        <div className=" flex justify-end py-1 border-b fixed right-0 left-0 z-40 px-10 gap-5 top-0 transition-all duration-300 
                         text-black bg-white dark:bg-gray-900 dark:text-dark">
            <Menu model={items} popup ref={menuRef} id="popup_menu_left" className=' bg-white dark:text-gray-100 dark:bg-gray-800 ' />



            <button
                onClick={toggleDarkMode}
                className="p-3 rounded-md transition-all duration-300  text-black  dark:text-white"
            >
                {darkMode ? <i className="pi pi-sun"></i>
                    : <i className="pi  pi-moon"></i>
                }
            </button>


            <div className='flex gap-3 items-center ' onClick={(event) => menuRef.current.toggle(event)}>
                <i className="pi pi-user text-lg cursor-pointer dark:text-white" aria-controls="popup_menu_left" aria-haspopup />
            </div>

            <style>
                {`.dark  #popup_menu_left_sub_0{
          background: #1F2937;
          color:#F3F4F6
        }
        .dark .p-menuitem-content{
          background: #1F2937;
          color:#F3F4F6
        }
      
        `}
            </style>
        </div>
    );
}
