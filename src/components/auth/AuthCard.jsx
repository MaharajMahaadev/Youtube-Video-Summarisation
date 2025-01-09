import React from 'react';

export function AuthCard({ children, title, subtitle }) {
  return (
    <div className="w-full max-w-md rounded-xl shadow-lg p-8 font-bold text-[#282828]">
      <h1 className="text-2xl font-bold text-center mb-2 text-[#282828]">{title}</h1>
      {subtitle && (
        <p className="text-center mb-6 text-[#282828]">{subtitle}</p>
      )}
      {children}
    </div>
  );
}