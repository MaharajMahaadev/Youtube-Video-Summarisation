import { useState } from 'react';
import {  Key, Lock, MoveLeft } from 'lucide-react';
import { AuthCard } from './AuthCard';
import { AuthButton } from './AuthButton';
import { EmailForm } from './EmailForm';
import { PasswordForm } from './PasswordForm';
import { nhost } from '../../lib/host.ts';
import NavBar from '../NavBar';

export function AuthPage() {
  const [authMethod, setAuthMethod] = useState('select');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);

  const handleMagicSubmit = async (email) => {
    setLoadingAction('magic');
    try {
      await nhost.auth.signInPasswordlessEmail({ email });
      alert('Magic Link Sent to your email!');
      setAuthMethod('select');
    } catch (error) {
      alert("Sorry couldn't send link. " + error.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handlePasswordSubmit = async (email, password) => {
    setLoadingAction(isSignUp ? 'signup' : 'signin');
    try {
      if (isSignUp) {
        const response = await nhost.auth.signUpEmailPassword({ email, password });
        if (!response.body?.session) {
          alert('Successfully created the account. Verify the email and you can proceed to Login');
          setAuthMethod('select');
        }
      } else {
        const response = await nhost.auth.signInEmailPassword({ email, password });
        if (!response.body?.session) alert('Additional verification is required to sign in.');
      }
    } catch (error) {
      alert(error.message || 'An unknown error occurred.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleForgotPass = async (email) => {
    setLoadingAction('reset');
    try {
      await nhost.auth.sendPasswordResetEmail({
        email,
        options: { redirectTo: 'https://yt-summariser.netlify.app/reset' },
      });
      alert("Check your email for reset link");
      setAuthMethod('select');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoadingAction(null);
    }
  };

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
            isLoading={loadingAction === 'magic'}
          />
        );
      case 'password':
        return (
          <PasswordForm
            onSubmit={handlePasswordSubmit}
            buttonText={isSignUp ? "Sign Up" : "Sign In"}
            isLoadingSignIn={loadingAction === 'signin'}
            isLoadingSignUp={loadingAction === 'signup'}
            setAuthMethod={setAuthMethod}
          />
        );
        case 'forgot':
          return (
            <EmailForm
              onSubmit={handleForgotPass}
              buttonText="Send Reset Link"
              isLoading={loadingAction === 'reset'}
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
        <p className='font-bold mb-5 text-center'>You can use <p className='text-[#FF0000] inline-flex'>test@gmail.com</p> and password: <p className='text-[#FF0000] inline-flex'>test1234</p></p>
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
