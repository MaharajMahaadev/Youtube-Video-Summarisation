import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Spinner } from '../ui/Spinner';
import NavBar from '../NavBar.jsx'
import { useChangePassword } from '@nhost/react';
import { useNavigate } from 'react-router-dom';

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { changePassword, isLoading } = useChangePassword();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.trim()) {
      if(password.length>2 && password.length<21){
        const {isSuccess, error} = await changePassword(password);

        if(isSuccess===true){
          alert("Password sucessfully changed");
          navigate('/dashboard');
        }
        else if(isSuccess===false){
          if(error!==null){
            alert('Error: '+ error?.message);
          }
          else{
            alert('An unknown error occured.');
          }
        }
      }
      else{
        alert("Password should be 3 - 20 characters");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        <NavBar />
        <div className="min-h-screen glass rounded-2xl shadow-lg flex items-center justify-center p-4">
    <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                <label className="block text-sm font-medium text-[#282828] mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#282828]/40" size={20} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-2 rounded-lg bg-white/50 border border-white/20 focus:ring-2 focus:ring-[#FF0000] outline-none"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#282828]/40 hover:text-[#282828]/60"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
      <button
        type="submit"
        className="w-full bg-[#FF0000] text-white py-2 px-4 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:transform-none h-11 flex items-center justify-center"
      >
        { isLoading ? (
          <Spinner size="sm" className="mx-auto" />
        ) : (
          "Confirm Password"
        )}
      </button>
    </form>
    </div>
    </div>
  );
}