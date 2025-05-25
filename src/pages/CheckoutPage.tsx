import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { CreditCard, MapPin, Truck, Check } from 'lucide-react';
import { RootState } from '../store';
import { clearCart } from '../store/slices/cartSlice';
import { showToast } from '../store/slices/uiSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';

type CheckoutStep = 'shipping' | 'payment' | 'confirmation';

interface ShippingFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  saveAddress: boolean;
}

interface PaymentFormInputs {
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
}

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items } = useSelector((state: RootState) => state.cart);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingData, setShippingData] = useState<ShippingFormInputs | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentFormInputs | null>(null);
  
  // Calculate totals
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const shipping = 15; // $15 shipping
  const total = subtotal + tax + shipping;
  
  // React Hook Form
  const {
    register: registerShipping,
    handleSubmit: handleSubmitShipping,
    formState: { errors: shippingErrors },
  } = useForm<ShippingFormInputs>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    }
  });
  
  const {
    register: registerPayment,
    handleSubmit: handleSubmitPayment,
    formState: { errors: paymentErrors },
  } = useForm<PaymentFormInputs>();
  
  // Handle shipping form submission
  const onShippingSubmit = (data: ShippingFormInputs) => {
    setShippingData(data);
    setCurrentStep('payment');
    window.scrollTo(0, 0);
  };
  
  // Handle payment form submission
  const onPaymentSubmit = (data: PaymentFormInputs) => {
    setPaymentData(data);
    setCurrentStep('confirmation');
    window.scrollTo(0, 0);
  };
  
  // Handle order placement
  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    
    // Simulate order placement
    setTimeout(() => {
      dispatch(clearCart());
      dispatch(showToast({
        message: 'Your order has been placed successfully!',
        type: 'success'
      }));
      navigate('/profile/orders');
      setIsSubmitting(false);
    }, 2000);
  };
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login?redirect=checkout');
    }
  }, [isAuthenticated, navigate]);
  
  // Redirect if cart is empty
  React.useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('checkout.title')}</h1>
      
      {/* Progress Indicator */}
      <div className="flex justify-between items-center mb-8">
        <div className="hidden sm:flex w-full max-w-2xl mx-auto">
          <div className="w-full flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              currentStep === 'shipping' ? 'bg-primary text-white' : 'bg-primary text-white'
            }`}>
              {currentStep === 'shipping' ? <MapPin size={18} /> : <Check size={18} />}
            </div>
            <div className={`h-1 flex-grow mx-2 ${
              currentStep !== 'shipping' ? 'bg-primary' : 'bg-neutral-300'
            }`} />
          </div>
          
          <div className="w-full flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              currentStep === 'payment' 
                ? 'bg-primary text-white' 
                : currentStep === 'confirmation'
                  ? 'bg-primary text-white'
                  : 'bg-neutral-300 text-neutral-500'
            }`}>
              {currentStep === 'payment' ? <CreditCard size={18} /> : 
                currentStep === 'confirmation' ? <Check size={18} /> : 
                <CreditCard size={18} />}
            </div>
            <div className={`h-1 flex-grow mx-2 ${
              currentStep === 'confirmation' ? 'bg-primary' : 'bg-neutral-300'
            }`} />
          </div>
          
          <div className="w-auto flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              currentStep === 'confirmation' ? 'bg-primary text-white' : 'bg-neutral-300 text-neutral-500'
            }`}>
              <Truck size={18} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Shipping Step */}
            {currentStep === 'shipping' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('checkout.shippingAddress')}</h2>
                
                <form onSubmit={handleSubmitShipping(onShippingSubmit)}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1">
                        {t('auth.firstName')}
                      </label>
                      <input
                        id="firstName"
                        {...registerShipping('firstName', { required: 'First name is required' })}
                        className="input"
                      />
                      {shippingErrors.firstName && (
                        <p className="mt-1 text-sm text-error">{shippingErrors.firstName.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1">
                        {t('auth.lastName')}
                      </label>
                      <input
                        id="lastName"
                        {...registerShipping('lastName', { required: 'Last name is required' })}
                        className="input"
                      />
                      {shippingErrors.lastName && (
                        <p className="mt-1 text-sm text-error">{shippingErrors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...registerShipping('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                          }
                        })}
                        className="input"
                      />
                      {shippingErrors.email && (
                        <p className="mt-1 text-sm text-error">{shippingErrors.email.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                        Phone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        {...registerShipping('phone', { required: 'Phone is required' })}
                        className="input"
                      />
                      {shippingErrors.phone && (
                        <p className="mt-1 text-sm text-error">{shippingErrors.phone.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="addressLine1" className="block text-sm font-medium text-neutral-700 mb-1">
                      Address Line 1
                    </label>
                    <input
                      id="addressLine1"
                      {...registerShipping('addressLine1', { required: 'Address is required' })}
                      className="input"
                    />
                    {shippingErrors.addressLine1 && (
                      <p className="mt-1 text-sm text-error">{shippingErrors.addressLine1.message}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="addressLine2" className="block text-sm font-medium text-neutral-700 mb-1">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      id="addressLine2"
                      {...registerShipping('addressLine2')}
                      className="input"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                        City
                      </label>
                      <input
                        id="city"
                        {...registerShipping('city', { required: 'City is required' })}
                        className="input"
                      />
                      {shippingErrors.city && (
                        <p className="mt-1 text-sm text-error">{shippingErrors.city.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1">
                        State / Province
                      </label>
                      <input
                        id="state"
                        {...registerShipping('state', { required: 'State is required' })}
                        className="input"
                      />
                      {shippingErrors.state && (
                        <p className="mt-1 text-sm text-error">{shippingErrors.state.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-neutral-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        id="postalCode"
                        {...registerShipping('postalCode', { required: 'Postal code is required' })}
                        className="input"
                      />
                      {shippingErrors.postalCode && (
                        <p className="mt-1 text-sm text-error">{shippingErrors.postalCode.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-1">
                        Country
                      </label>
                      <select
                        id="country"
                        {...registerShipping('country', { required: 'Country is required' })}
                        className="input"
                      >
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                      {shippingErrors.country && (
                        <p className="mt-1 text-sm text-error">{shippingErrors.country.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...registerShipping('saveAddress')}
                        className="h-4 w-4 text-primary border-neutral-300 rounded"
                      />
                      <span className="ml-2 text-sm text-neutral-700">
                        Save this address for future orders
                      </span>
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    className="btn-primary w-full py-3"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}
            
            {/* Payment Step */}
            {currentStep === 'payment' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{t('checkout.paymentMethod')}</h2>
                  <button
                    onClick={() => setCurrentStep('shipping')}
                    className="text-primary text-sm hover:text-primary/80"
                  >
                    Edit Shipping
                  </button>
                </div>
                
                <form onSubmit={handleSubmitPayment(onPaymentSubmit)}>
                  <div className="mb-4">
                    <label htmlFor="cardName" className="block text-sm font-medium text-neutral-700 mb-1">
                      Name on Card
                    </label>
                    <input
                      id="cardName"
                      {...registerPayment('cardName', { required: 'Name is required' })}
                      className="input"
                    />
                    {paymentErrors.cardName && (
                      <p className="mt-1 text-sm text-error">{paymentErrors.cardName.message}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                      Card Number
                    </label>
                    <input
                      id="cardNumber"
                      placeholder="XXXX XXXX XXXX XXXX"
                      {...registerPayment('cardNumber', {
                        required: 'Card number is required',
                        pattern: {
                          value: /^\d{4}(\s?\d{4}){3}$/,
                          message: 'Invalid card number format'
                        }
                      })}
                      className="input"
                    />
                    {paymentErrors.cardNumber && (
                      <p className="mt-1 text-sm text-error">{paymentErrors.cardNumber.message}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-neutral-700 mb-1">
                        Expiry Date (MM/YY)
                      </label>
                      <input
                        id="expiryDate"
                        placeholder="MM/YY"
                        {...registerPayment('expiryDate', {
                          required: 'Expiry date is required',
                          pattern: {
                            value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                            message: 'Invalid format (MM/YY)'
                          }
                        })}
                        className="input"
                      />
                      {paymentErrors.expiryDate && (
                        <p className="mt-1 text-sm text-error">{paymentErrors.expiryDate.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-neutral-700 mb-1">
                        CVV
                      </label>
                      <input
                        id="cvv"
                        type="password"
                        placeholder="XXX"
                        {...registerPayment('cvv', {
                          required: 'CVV is required',
                          pattern: {
                            value: /^\d{3,4}$/,
                            message: 'Invalid CVV'
                          }
                        })}
                        className="input"
                      />
                      {paymentErrors.cvv && (
                        <p className="mt-1 text-sm text-error">{paymentErrors.cvv.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...registerPayment('saveCard')}
                        className="h-4 w-4 text-primary border-neutral-300 rounded"
                      />
                      <span className="ml-2 text-sm text-neutral-700">
                        Save this card for future purchases
                      </span>
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    className="btn-primary w-full py-3"
                  >
                    Review Order
                  </button>
                </form>
              </div>
            )}
            
            {/* Confirmation Step */}
            {currentStep === 'confirmation' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">{t('checkout.orderSummary')}</h2>
                
                <div className="mb-6">
                  <h3 className="font-medium text-lg mb-2">Shipping Address</h3>
                  <div className="bg-neutral-50 p-4 rounded-md">
                    <p className="mb-1">
                      <span className="font-medium">{shippingData?.firstName} {shippingData?.lastName}</span>
                    </p>
                    <p className="text-neutral-600 mb-1">{shippingData?.addressLine1}</p>
                    {shippingData?.addressLine2 && (
                      <p className="text-neutral-600 mb-1">{shippingData.addressLine2}</p>
                    )}
                    <p className="text-neutral-600 mb-1">
                      {shippingData?.city}, {shippingData?.state} {shippingData?.postalCode}
                    </p>
                    <p className="text-neutral-600 mb-1">{shippingData?.country}</p>
                    <p className="text-neutral-600">{shippingData?.phone}</p>
                  </div>
                  <button
                    onClick={() => setCurrentStep('shipping')}
                    className="text-primary text-sm mt-2 hover:text-primary/80"
                  >
                    Edit
                  </button>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium text-lg mb-2">Payment Method</h3>
                  <div className="bg-neutral-50 p-4 rounded-md flex items-center">
                    <CreditCard size={24} className="text-primary mr-3" />
                    <div>
                      <p className="font-medium">{paymentData?.cardName}</p>
                      <p className="text-neutral-600">
                        **** **** **** {paymentData?.cardNumber?.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentStep('payment')}
                    className="text-primary text-sm mt-2 hover:text-primary/80"
                  >
                    Edit
                  </button>
                </div>
                
                <div className="border-t border-neutral-200 pt-6 mb-6">
                  <h3 className="font-medium text-lg mb-3">Order Items</h3>
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center">
                        <div className="w-16 h-16 flex-shrink-0">
                          <img
                            src={item.thumbnail}
                            alt={item.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="ml-4 flex-grow">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-neutral-500">
                            ${item.price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                        <div className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="btn-primary w-full py-3"
                >
                  {isSubmitting ? <LoadingSpinner size="sm" /> : t('checkout.placeOrder')}
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-neutral-600">
                <span>{t('cart.subtotal')} ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-neutral-600">
                <span>{t('cart.shipping')}</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-neutral-600">
                <span>{t('cart.tax')}</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-neutral-200 pt-3 flex justify-between font-semibold text-lg">
                <span>{t('cart.total')}</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-6 text-sm text-neutral-500">
              <p className="mb-2">
                Estimated delivery: <span className="font-medium">3-5 business days</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;