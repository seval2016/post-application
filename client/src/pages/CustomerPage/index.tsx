import  { useState } from 'react';
import Header from '../../components/Header';
import { CustomerList, CustomerForm, CustomerDetails } from '../../components/Customer';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Import the CustomerFormValues type from the CustomerForm component
interface CustomerFormValues {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
}

const CustomerPage = () => {
  const [view, setView] = useState<'list' | 'form' | 'details'>('list');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined);

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setView('form');
  };

  const handleDeleteCustomer = (customer: Customer) => {
    console.log('Delete customer:', customer);
    // Implement delete functionality
  };

  const handleFormSubmit = (values: CustomerFormValues) => {
    console.log('Form submitted:', values);
    // Here you would typically update the customer in your backend
    // For now, we just log the values and return to the list view
    setView('list');
  };

  const handleFormCancel = () => {
    setView('list');
  };

  const handleBackToList = () => {
    setView('list');
  };

  // Convert Customer to CustomerFormValues for the form
  const getFormValues = (customer?: Customer): CustomerFormValues | undefined => {
    if (!customer) return undefined;
    
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      status: customer.status
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-16">
        {view !== 'list' && (
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBackToList}
            className="mb-4"
          >
            Listeye Dön
          </Button>
        )}

        {view === 'list' && (
          <CustomerList />
        )}

        {view === 'form' && (
          <CustomerForm 
            initialValues={getFormValues(selectedCustomer)}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}

        {view === 'details' && selectedCustomer && (
          <CustomerDetails 
            customer={selectedCustomer}
            onEdit={() => handleEditCustomer(selectedCustomer)}
            onDelete={() => handleDeleteCustomer(selectedCustomer)}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerPage;
