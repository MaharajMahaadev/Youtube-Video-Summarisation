import { useState } from 'react';
import { Mail, Key, Lock, MoveLeft, Eye, EyeOff } from 'lucide-react';
import { AuthCard } from './AuthCard';
import { AuthButton } from './AuthButton';
import { EmailForm } from './EmailForm';
import { PasswordForm } from './PasswordForm';
import { useSignInEmailOTP, useSignInEmailPassword, useSignInEmailPasswordless, useSignUpEmailPassword } from '@nhost/react'
import NavBar from '../NavBar';

export function AuthPage() {
  const [authMethod, setAuthMethod] = useState('select');
  const [isSignUp, setIsSignUp] = useState(false);
  const [ otp, setOtp ] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signInEmailOTP, verifyEmailOTP, isLoading, isError } = useSignInEmailOTP()
  const { signInEmailPasswordless, error } = useSignInEmailPasswordless();
  const {
    signInEmailPassword,
  } = useSignInEmailPassword();
  const {
    signUpEmailPassword
  } = useSignUpEmailPassword();


  const handleOtpSubmit = async (email) => {
    console.log('OTP login:', email);
      await signInEmailOTP(email);

    if (isError) {
      console.error({ error })
      return
    }
    setOtp(true);
    // Mock implementation

    alert('otp sent')
  };

  const handleMagicSubmit = async (email) => {
    console.log('Magic link:', email);
    // Mock implementation
    const { error } = await signInEmailPasswordless(email)

    if (error) {
      console.error({ error })
      return
    }

    alert('Magic Link Sent!')
  };

  const handlePasswordSubmit = async (email, password) => {
    console.log('Password login:', email, password);
    // Mock implementation
    if(isSignUp===false){
      await signInEmailPassword(email, password);
    }
    if(isSignUp===true){
      console.log("hey");
      await signUpEmailPassword(email, password);
    }
  };

  const renderAuthContent = () => {
    switch (authMethod) {
      case 'select':
        return (
          <div className="space-y-4">
            <AuthButton
              icon={Mail}
              label="Continue with OTP"
              onClick={() => setAuthMethod('otp')}
            />
            <AuthButton
              icon={Key}
              label="Continue with Magic Link"
              onClick={() => setAuthMethod('magic')}
            />
            <AuthButton
              icon={Lock}
              label="Continue with Password"
              onClick={() => setAuthMethod('password')}
            />
          </div>
        );
      case 'otp':
        return (
          <EmailForm
            onSubmit={handleOtpSubmit}
            buttonText="Send OTP"
          />
        );
      case 'magic':
        return (
          <EmailForm
            onSubmit={handleMagicSubmit}
            buttonText="Send Magic Link"
          />
        );
      case 'password':
        return (
          <PasswordForm
            onSubmit={handlePasswordSubmit}
            buttonText={isSignUp ? "Sign Up" : "Sign In"}
          />
        );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.trim()) {
      await verifyEmailOTP(password);
    }
    setOtp(false);
  };

  const renderOtpContent = () => {
    return(
      <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm font-medium text-[#282828] mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#282828]/40" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-10 pr-12 py-2 rounded-lg bg-white/50 border border-white/20 focus:ring-2 focus:ring-[#FF0000] outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#282828]/40 hover:text-[#282828]/60"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FF0000] text-white py-2 px-4 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:transform-none h-11 flex items-center justify-center"
              >
              {isLoading ? (
                <Spinner size="sm" className="mx-auto" />
              ) : (
                'Submit Otp'
              )}
            </button>
          </form>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
    <NavBar />
    <div className="min-h-screen glass rounded-2xl shadow-lg flex items-center justify-center p-4">
      <AuthCard
        title={isSignUp ? "Create an account" : "Welcome back"}
        subtitle={isSignUp ? "Sign up to get started" : "Sign in to your account"}
      >
        {authMethod !== 'select' && (
          <button
            onClick={() => setAuthMethod('select')}
            className="bg-white text-[#FF0000] rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:transform-none h-11 flex items-center justify-center"
            >
            <MoveLeft />
          </button>
        )}
        {otp===true?renderOtpContent():renderAuthContent()}
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-center mt-4 text-[#282828]/70 hover:text-[#282828] transition-colors"
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </AuthCard>
    </div>
    </div>
  );
}