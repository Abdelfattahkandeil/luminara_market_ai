import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { RootState } from '../store';
import { login, register } from '../store/slices/authSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface LoginInputs {
  email: string;
  password: string;
}

interface RegisterInputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AuthPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string }>();
  
  const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // React Hook Form
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginInputs>();
  
  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: signupErrors },
    watch,
  } = useForm<RegisterInputs>();
  
  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Login form submission
  const onLoginSubmit = (data: LoginInputs) => {
    dispatch(login(data) as any);
  };
  
  // Register form submission
  const onRegisterSubmit = (data: RegisterInputs) => {
    const { confirmPassword, ...registerData } = data;
    dispatch(register(registerData) as any);
  };
  
  const isLoginMode = mode === 'login';
  
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary">
            {isLoginMode ? t('auth.login') : t('auth.register')}
          </h1>
          <p className="text-neutral-500 mt-2">
            {isLoginMode 
              ? 'Sign in to your account to continue'
              : 'Create a new account to get started'
            }
          </p>
        </div>
        
        {error && (
          <div className="bg-error-light text-error-dark p-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {isLoginMode ? (
          <form onSubmit={handleSubmitLogin(onLoginSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                  {t('auth.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  {...registerLogin('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    }
                  })}
                  className="input"
                />
                {loginErrors.email && (
                  <p className="mt-1 text-sm text-error">{loginErrors.email.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...registerLogin('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      }
                    })}
                    className="input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {loginErrors.password && (
                  <p className="mt-1 text-sm text-error">{loginErrors.password.message}</p>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary border-neutral-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
                    Remember me
                  </label>
                </div>
                <Link to="/auth/forgot-password" className="text-sm text-primary hover:text-primary/80">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-2"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : t('auth.login')}
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-500">
                {t('auth.newAccount')}{' '}
                <Link to="/auth/register" className="text-primary font-medium hover:text-primary/80">
                  {t('auth.register')}
                </Link>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitSignup(onRegisterSubmit)}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1">
                    {t('auth.firstName')}
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    {...registerSignup('firstName', { required: 'First name is required' })}
                    className="input"
                  />
                  {signupErrors.firstName && (
                    <p className="mt-1 text-sm text-error">{signupErrors.firstName.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1">
                    {t('auth.lastName')}
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    {...registerSignup('lastName', { required: 'Last name is required' })}
                    className="input"
                  />
                  {signupErrors.lastName && (
                    <p className="mt-1 text-sm text-error">{signupErrors.lastName.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                  {t('auth.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  {...registerSignup('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    }
                  })}
                  className="input"
                />
                {signupErrors.email && (
                  <p className="mt-1 text-sm text-error">{signupErrors.email.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...registerSignup('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      }
                    })}
                    className="input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {signupErrors.password && (
                  <p className="mt-1 text-sm text-error">{signupErrors.password.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                  {t('auth.confirmPassword')}
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...registerSignup('confirmPassword', { 
                      required: 'Please confirm your password',
                      validate: value => value === watch('password') || 'Passwords do not match',
                    })}
                    className="input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {signupErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-error">{signupErrors.confirmPassword.message}</p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-2"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : t('auth.register')}
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-500">
                {t('auth.alreadyAccount')}{' '}
                <Link to="/auth/login" className="text-primary font-medium hover:text-primary/80">
                  {t('auth.login')}
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;