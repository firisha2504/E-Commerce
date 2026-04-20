import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useLogo } from '../contexts/LogoContext';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser } = useAuth();
  const { logoUrl } = useLogo();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...registrationData } = data;
      await registerUser(registrationData);
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle different error formats more robustly
      let errorMessage = 'Registration failed';
      
      if (error.response?.data?.error) {
        const serverError = error.response.data.error;
        if (typeof serverError === 'string') {
          errorMessage = serverError;
        } else if (Array.isArray(serverError)) {
          errorMessage = serverError.map(err => 
            typeof err === 'string' ? err : err.message || 'Validation error'
          ).join(', ');
        } else if (typeof serverError === 'object' && serverError.message) {
          errorMessage = serverError.message;
        } else {
          errorMessage = 'Invalid data provided';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-theme dark:bg-dark-theme py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="FA Restaurant Logo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`w-full h-full bg-primary-600 dark:bg-accent-500 rounded-full ${logoUrl ? 'hidden' : 'flex'} items-center justify-center`}>
                <span className="text-white font-bold text-lg">FA</span>
              </div>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 dark:text-accent-400 hover:text-primary-500 dark:hover:text-accent-300"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
                type="text"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-dark-700 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{String(errors.name.message || errors.name)}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  },
                })}
                type="email"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-dark-700 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{String(errors.email.message || errors.email)}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <input
                {...register('phone', {
                  required: 'Phone number is required',
                  minLength: {
                    value: 10,
                    message: 'Phone number must be at least 10 digits',
                  },
                })}
                type="tel"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-dark-700 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{String(errors.phone.message || errors.phone)}</p>
              )}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Address (Optional)
              </label>
              <textarea
                {...register('address')}
                rows={2}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-dark-700 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter your address"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 dark:border-dark-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-dark-700 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{String(errors.password.message || errors.password)}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <input
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
                type="password"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-dark-700 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{String(errors.confirmPassword.message || errors.confirmPassword)}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 dark:bg-accent-500 hover:bg-primary-700 dark:hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-accent-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;