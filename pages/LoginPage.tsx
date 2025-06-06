
import React, { useState, FormEvent, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate, useLocation, Link } = ReactRouterDOM;
import { useAuth } from '@/hooks/useAuth';
import Icon from '@/components/Icon';
import Logo from '@/components/Logo'; // Import the new Logo component

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const intendedPathFromState = location.state?.from?.pathname;
  // Admin login distinction is removed from here as auth.login handles it.
  // We focus on user redirection logic.
  let from = intendedPathFromState || '/';


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const success = await auth.login(email, password);
    setIsLoading(false);

    if (success) {
      // General user redirection logic
      let redirectTo = from;
      // Prevent redirecting to admin, login, or register pages after successful general login
      if (!redirectTo || redirectTo.startsWith('/admin') || redirectTo === '/login' || redirectTo === '/register') {
          redirectTo = '/';
      }
      navigate(redirectTo, { replace: true });
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };
  
  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    // Simulate Google login using special credentials recognized by useAuth
    const success = await auth.login('google_user', 'google_password');
    setIsLoading(false);

    if (success) {
      let redirectTo = from;
      if (!redirectTo || redirectTo.startsWith('/admin') || redirectTo === '/login' || redirectTo === '/register') {
        redirectTo = '/';
      }
      navigate(redirectTo, { replace: true });
    } else {
      setError('Google Sign-In failed (simulated). Please try again.');
    }
  };


  useEffect(() => {
    if (auth.isAuthenticated) {
      let effectiveFrom = from;
      if (!effectiveFrom || effectiveFrom.startsWith('/admin') || effectiveFrom === '/login' || effectiveFrom === '/register') {
          effectiveFrom = '/';
      }
      navigate(effectiveFrom, { replace: true });
    }
  }, [auth.isAuthenticated, navigate, from]);

  return (
    <div className="min-h-screen bg-panda-bg-light flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="bg-panda-pink p-8 pt-12 pb-10 text-center rounded-t-xl flex justify-center items-center">
          <Logo className="h-14 w-auto" /> 
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-b-xl rounded-t-2xl shadow-2xl transform -translate-y-5 z-10">
          <h2 className="text-2xl font-bold text-panda-text text-center mb-6">Welcome Back!</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-panda-text-light mb-1">
                Email or Username
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-panda-pink focus:border-transparent sm:text-sm text-panda-text"
                placeholder="user@example.com or google_user"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-panda-text-light">
                  Password
                </label>
                <Link to="#" className="text-xs text-panda-pink hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-panda-pink focus:border-transparent sm:text-sm text-panda-text"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-panda-pink"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} />
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2.5 rounded-md text-sm" role="alert">
                <p>{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-panda-dark-pink hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-panda-dark-pink transition duration-150 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { name: 'Google', icon: 'google', bgColor: 'bg-red-50 hover:bg-red-100', textColor: 'text-red-600', action: handleGoogleLogin },
                { name: 'Facebook', icon: 'facebook', bgColor: 'bg-blue-50 hover:bg-blue-100', textColor: 'text-blue-700', action: () => alert('Facebook login not implemented') },
                { name: 'Apple', icon: 'apple', bgColor: 'bg-gray-700 hover:bg-gray-800', textColor: 'text-white', action: () => alert('Apple login not implemented') },
              ].map((social) => (
                <button
                  key={social.name}
                  onClick={social.action}
                  className={`w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm ${social.bgColor} text-sm font-medium ${social.textColor} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-panda-pink transition-colors`}
                  aria-label={`Sign in with ${social.name}`}
                >
                  <Icon name={social.icon} size={20} />
                </button>
              ))}
            </div>
          </div>
          
          <p className="mt-8 text-center text-sm text-panda-text-light">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-panda-pink hover:text-panda-dark-pink hover:underline">
              Create Now
            </Link>
          </p>
          {/* Admin hint removed */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;