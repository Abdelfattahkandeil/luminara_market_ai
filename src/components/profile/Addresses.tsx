import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { RootState } from '../../store';
import { Address } from '../../types/user';

// In a real app, these would come from an API
const mockAddresses: Address[] = [
  {
    id: 'addr1',
    userId: '1',
    name: 'Home',
    addressLine1: '123 Main St',
    addressLine2: 'Apt 4B',
    city: 'San Francisco',
    state: 'CA',
    country: 'US',
    postalCode: '94103',
    phone: '555-1234',
    isDefault: true
  },
  {
    id: 'addr2',
    userId: '1',
    name: 'Work',
    addressLine1: '456 Market St',
    city: 'San Francisco',
    state: 'CA',
    country: 'US',
    postalCode: '94105',
    phone: '555-5678',
    isDefault: false
  }
];

const Addresses: React.FC = () => {
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  
  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };
  
  const handleDeleteAddress = (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };
  
  const handleEditAddress = (id: string) => {
    setEditingAddressId(id);
    setIsAddingAddress(true);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{t('profile.addresses')}</h2>
        <button
          onClick={() => {
            setIsAddingAddress(true);
            setEditingAddressId(null);
          }}
          className="btn-primary text-sm flex items-center py-1.5"
        >
          <Plus size={16} className="mr-1" />
          {t('profile.addAddress')}
        </button>
      </div>
      
      {isAddingAddress ? (
        <AddressForm 
          address={editingAddressId ? addresses.find(a => a.id === editingAddressId) : undefined}
          onCancel={() => {
            setIsAddingAddress(false);
            setEditingAddressId(null);
          }}
          onSave={(address) => {
            if (editingAddressId) {
              // Update existing address
              setAddresses(addresses.map(a => a.id === editingAddressId ? address : a));
            } else {
              // Add new address
              setAddresses([...addresses, address]);
            }
            setIsAddingAddress(false);
            setEditingAddressId(null);
          }}
        />
      ) : addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div key={address.id} className="border border-neutral-200 rounded-lg p-4">
              {address.isDefault && (
                <p className="text-xs font-medium text-primary mb-2">Default Address</p>
              )}
              <h3 className="font-medium text-lg">{address.name}</h3>
              <div className="text-neutral-600 mt-2">
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>{address.city}, {address.state} {address.postalCode}</p>
                <p>{address.country}</p>
                <p className="mt-1">{address.phone}</p>
              </div>
              
              <div className="mt-4 flex space-x-2">
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => handleEditAddress(address.id)}
                  className="text-sm text-neutral-600 hover:text-neutral-800 flex items-center"
                >
                  <Edit size={14} className="mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="text-sm text-error hover:text-error/80 flex items-center"
                >
                  <Trash2 size={14} className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-neutral-50 rounded-lg">
          <MapPin size={48} className="mx-auto text-neutral-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
          <p className="text-neutral-500 mb-6">
            You haven't added any addresses yet.
          </p>
          <button
            onClick={() => setIsAddingAddress(true)}
            className="btn-primary"
          >
            Add New Address
          </button>
        </div>
      )}
    </div>
  );
};

interface AddressFormProps {
  address?: Address;
  onCancel: () => void;
  onSave: (address: Address) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ address, onCancel, onSave }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState<Partial<Address>>(address || {
    userId: user?.id || '',
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    phone: '',
    isDefault: false
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: address?.id || `addr_${Date.now()}`,
      userId: user?.id || '',
      name: formData.name || '',
      addressLine1: formData.addressLine1 || '',
      addressLine2: formData.addressLine2,
      city: formData.city || '',
      state: formData.state || '',
      country: formData.country || '',
      postalCode: formData.postalCode || '',
      phone: formData.phone || '',
      isDefault: formData.isDefault || false
    });
  };
  
  return (
    <div className="bg-neutral-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">
        {address ? t('profile.editAddress') : t('profile.addAddress')}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Address Name
          </label>
          <input
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            placeholder="Home, Work, etc."
            className="input"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Address Line 1
          </label>
          <input
            name="addressLine1"
            value={formData.addressLine1 || ''}
            onChange={handleChange}
            placeholder="Street address, P.O. box, etc."
            className="input"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Address Line 2 (Optional)
          </label>
          <input
            name="addressLine2"
            value={formData.addressLine2 || ''}
            onChange={handleChange}
            placeholder="Apartment, suite, unit, building, floor, etc."
            className="input"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              City
            </label>
            <input
              name="city"
              value={formData.city || ''}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              State / Province
            </label>
            <input
              name="state"
              value={formData.state || ''}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Postal Code
            </label>
            <input
              name="postalCode"
              value={formData.postalCode || ''}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Country
            </label>
            <select
              name="country"
              value={formData.country || ''}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Phone Number
          </label>
          <input
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault || false}
              onChange={handleChange}
              className="h-4 w-4 text-primary border-neutral-300 rounded"
            />
            <span className="ml-2 text-sm text-neutral-700">
              Set as default address
            </span>
          </label>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            {t('common.save')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Addresses;