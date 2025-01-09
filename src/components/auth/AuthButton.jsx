import React from 'react';
import { Spinner } from '../ui/Spinner';


export function AuthButton({ 
  icon: Icon, 
  label, 
  onClick, 
  isLoading = false 
}) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="w-full bg-[#FF0000] text-white py-2 px-4 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:transform-none h-11 flex items-center justify-center"
    >
      {isLoading ? (
        <Spinner size="sm" className="absolute left-1/2 -translate-x-1/2" />
      ) : (
        <>
          <Icon size={20} className='mr-2' />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}