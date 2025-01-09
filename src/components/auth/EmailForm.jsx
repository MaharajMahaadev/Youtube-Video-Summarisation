import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Spinner } from '../ui/Spinner';

export function EmailForm({ onSubmit, buttonText, isLoading = false }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
    if (email.trim()) {
      onSubmit(email);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
                <label className="block text-sm font-medium text-[#282828] mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#282828]/40" size={20} />
                  <input
                  id="email"
                    type="email"
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/50 border border-white/20 focus:ring-2 focus:ring-[#FF0000] outline-none"
                    placeholder="you@example.com"
                    required
                    disabled={isLoading}
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>
              </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#FF0000] text-white py-2 px-4 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:transform-none h-11 flex items-center justify-center"
        >
        {isLoading ? (
          <Spinner size="sm" className="mx-auto" />
        ) : (
          buttonText
        )}
      </button>
    </form>
  );
}