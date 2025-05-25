import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { User } from 'lucide-react';
import { RootState } from '../../store';
import { setUser } from '../../store/slices/authSlice';
import { showToast } from '../../store/slices/uiSlice';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ProfileFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

const PersonalInfo: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormInputs>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    }
  });
  
  // Handle form submission
  const onSubmit = async (data: ProfileFormInputs) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update user data
      dispatch(setUser({
        ...user!,
        ...data,
        updatedAt: new Date().toISOString(),
      }));
      
      dispatch(showToast({
        message: 'Profile updated successfully',
        type: 'success',
      }));
      
      setIsEditing(false);
      setIsSubmitting(false);
    }, 1000);
  };
  
  // Handle cancel
  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };
  
  if (!user) {
    return <div>Loading user information...</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{t('profile.personalInfo')}</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-outline text-sm py-1"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleCancel}
            className="text-neutral-500 text-sm hover:text-neutral-700"
          >
            Cancel
          </button>
        )}
      </div>
      
      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1">
                {t('auth.firstName')}
              </label>
              <input
                id="firstName"
                {...register('firstName', { required: 'First name is required' })}
                className="input"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-error">{errors.firstName.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1">
                {t('auth.lastName')}
              </label>
              <input
                id="lastName"
                {...register('lastName', { required: 'Last name is required' })}
                className="input"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-error">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  }
                })}
                className="input"
                disabled
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error">{errors.email.message}</p>
              )}
              <p className="mt-1 text-xs text-neutral-500">Email cannot be changed</p>
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                {...register('phone')}
                className="input"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-error">{errors.phone.message}</p>
              )}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? <LoadingSpinner size="sm" /> : t('common.save')}
          </button>
        </form>
      ) : (
        <div className="bg-neutral-50 rounded-md p-6">
          <div className="flex items-start">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-6">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">{user.firstName} {user.lastName}</h3>
              <p className="text-neutral-500 mb-1">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              {user.phone && (
                <p className="text-neutral-500 mb-1">
                  <span className="font-medium">Phone:</span> {user.phone}
                </p>
              )}
              <p className="text-neutral-500 mb-1">
                <span className="font-medium">Member since:</span> {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;