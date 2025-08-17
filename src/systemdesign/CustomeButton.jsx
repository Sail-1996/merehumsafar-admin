import React from 'react';
import { Ripple } from 'primereact/ripple';

export default function CustomButton({ title, onClick,icon }) {
  return (
    <button
      className="bg-secondary flex gap-2 text-primary justify-center items-center rounded-lg px-5 py-2  capitalize relative overflow-hidden"
      onClick={onClick}
    >
      {icon !=null ?<i className={icon}/>:<></>}
      {title}
      <Ripple />
    </button>
  );
}
