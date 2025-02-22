import { useState } from 'react';
import {  Key, Lock, MoveLeft } from 'lucide-react';
import { AuthCard } from './AuthCard';
import { AuthButton } from './AuthButton';
import { EmailForm } from './EmailForm';
import { PasswordForm } from './PasswordForm';
import {  useResetPassword, useSignInEmailPassword, useSignInEmailPasswordless, useSignUpEmailPassword } from '@nhost/react'
import NavBar from '../NavBar';

export function AuthPage() {
  const [authMethod, setAuthMethod] = useState('select');
  const [isSignUp, setIsSignUp] = useState(false);

  const { signInEmailPasswordless, isLoading } = useSignInEmailPasswordless();
  const {
    signInEmailPassword, isLoading:isLoadingSignIn, 
  } = useSignInEmailPassword();
  const {
    signUpEmailPassword, isLoading:isLoadingSignUp
  } = useSignUpEmailPassword();
  const { resetPassword, isLoading:isLoadingReset } = useResetPassword();


  const handleMagicSubmit = async (email) => {
    console.log('Magic link:', email);

    const {isSuccess, error } = await signInEmailPasswordless(email)
    if(isSuccess===false){
      alert("Sorry couldn't send link." + error?.message);
    }
    else if(isSuccess===true){
      alert('Magic Link Sent to your email!')
      setAuthMethod('select')
    }
  };

  const handlePasswordSubmit = async (email, password) => {

    if(isSignUp===false){
      const { isSuccess, error} = await signInEmailPassword(email, password);

      if(isSuccess===false){
        if(error!==null){
          alert(error?.message);
          console.log(error);
        }
        else{
          alert("An unknown error occured.");
        }
      }
    }
    if(isSignUp===true){
      const {isSuccess, error} = await signUpEmailPassword(email, password);

      if(error===null || isSuccess===true){
        alert('Successfully created the account. Verify the email and you can proceed to Login');
        setAuthMethod('select')
      }

      else if(isSuccess===false){
        if(error!==null){ 
          alert(error?.message);
          console.log(error);
        }
        else{
          alert("An unknown error occured.");
        }
      }
    }
  };

  const handleForgotPass = async (email) => {
    const {isSent, error} = await resetPassword(email, {
      redirectTo: 'https://yt-summariser.netlify.app/reset'
    });

    if(isSent===false){
      if(error!==null){
        alert("Error: " + error?.message);
      }
      else{
        alert('An unknown error occured.');
      }
    }

    else if(isSent){
      alert("Check your email for reset link");
      setAuthMethod('select');
    }
  }

  const renderAuthContent = () => {
    switch (authMethod) {
      case 'select':
        return (
          <div className="space-y-4">
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
      case 'magic':
        return (
          <EmailForm
            onSubmit={handleMagicSubmit}
            buttonText="Send Magic Link"
            isLoading={isLoading}
          />
        );
      case 'password':
        return (
          <PasswordForm
            onSubmit={handlePasswordSubmit}
            buttonText={isSignUp ? "Sign Up" : "Sign In"}
            isLoadingSignIn={isLoadingSignIn}
            isLoadingSignUp={isLoadingSignUp}
            setAuthMethod={setAuthMethod}
          />
        );
        case 'forgot':
          return (
            <EmailForm
              onSubmit={handleForgotPass}
              buttonText="Send Reset Link"
              isLoading={isLoadingReset}
            />
          );
    }
  };


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
        {renderAuthContent()}
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