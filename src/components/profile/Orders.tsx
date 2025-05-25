import React from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { Order } from '../../types/user';

const Orders: React.FC = () => {
  const { t } = useTranslation();
  
  // In a real app, this would come from an API
  const orders: Order[] = [
    {
      id: 'ORD123456',
      userId: '1',
      items: [
        {
          productId: '1',
          name: 'Professional Camera XL-1000',
          price: 1299.99,
          quantity: 1,
          image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg',
        }
      ],
      subtotal: 1299.99,
      tax: 130.00,
      shipping: 15.00,
      total: 1444.99,
      status: 'delivered',
      payment: {
        method: 'credit_card',
        status: 'paid'
      },
      shippingAddress: {
        id: 'addr1',
        userId: '1',
        name: 'Home',
        addressLine1: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        country: 'US',
        postalCode: '94103',
        phone: '555-1234',
        isDefault: true
      },
      createdAt: '2023-05-20T10:30:00Z',
      updatedAt: '2023-05-22T14:20:00Z'
    },
    {
      id: 'ORD123457',
      userId: '1',
      items: [
        {
          productId: '2',
          name: 'Wireless Noise-Cancelling Headphones',
          price: 249.99,
          quantity: 1,
          image: 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg',
        },
        {
          productId: '5',
          name: 'Premium Wireless Earbuds',
          price: 179.99,
          quantity: 1,
          image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg',
        }
      ],
      subtotal: 429.98,
      tax: 43.00,
      shipping: 15.00,
      total: 487.98,
      status: 'shipped',
      payment: {
        method: 'credit_card',
        status: 'paid'
      },
      shippingAddress: {
        id: 'addr1',
        userId: '1',
        name: 'Home',
        addressLine1: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        country: 'US',
        postalCode: '94103',
        phone: '555-1234',
        isDefault: true
      },
      createdAt: '2023-06-15T14:20:00Z',
      updatedAt: '2023-06-16T08:45:00Z'
    }
  ];
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Package size={20} className="text-neutral-500" />;
      case 'processing':
        return <Package size={20} className="text-warning" />;
      case 'shipped':
        return <Truck size={20} className="text-primary" />;
      case 'delivered':
        return <CheckCircle size={20} className="text-success" />;
      case 'cancelled':
        return <AlertCircle size={20} className="text-error" />;
      default:
        return <Package size={20} />;
    }
  };
  
  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">{t('profile.orders')}</h2>
      
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-neutral-200 rounded-lg overflow-hidden">
              {/* Order Header */}
              <div className="bg-neutral-50 p-4 border-b border-neutral-200 flex flex-wrap justify-between gap-4">
                <div>
                  <p className="text-sm text-neutral-500">
                    Order placed: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="font-medium">{order.id}</p>
                </div>
                
                <div className="flex items-center">
                  {getStatusIcon(order.status)}
                  <span className="ml-2 font-medium">
                    {getStatusText(order.status)}
                  </span>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-neutral-500">Total</p>
                  <p className="font-medium">${order.total.toFixed(2)}</p>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="p-4">
                {order.items.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center py-3 border-b border-neutral-200 last:border-0"
                  >
                    <div className="w-16 h-16 mr-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-neutral-500 text-sm">
                        ${item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <div className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Actions */}
              <div className="bg-neutral-50 p-4 border-t border-neutral-200 flex justify-end gap-3">
                <button className="btn-outline text-sm py-1.5">
                  View Details
                </button>
                
                {order.status === 'delivered' && (
                  <button className="btn-primary text-sm py-1.5">
                    Write a Review
                  </button>
                )}
                
                {(order.status === 'pending' || order.status === 'processing') && (
                  <button className="btn-outline text-sm py-1.5 text-error border-error">
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-neutral-50 rounded-lg">
          <Package size={48} className="mx-auto text-neutral-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No orders yet</h3>
          <p className="text-neutral-500 mb-6">
            You haven't placed any orders yet.
          </p>
          <a href="/products" className="btn-primary">
            Start Shopping
          </a>
        </div>
      )}
    </div>
  );
};

export default Orders;