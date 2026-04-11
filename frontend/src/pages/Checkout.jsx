import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, User, Phone, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/common/Modal';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, total, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    // Delivery Information
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    zipCode: '',
    
    // Payment Information
    paymentMethod: 'cbe',
    accountNumber: '',
    phoneNumber: '',
    referenceNumber: '',
    
    // Order Notes
    orderNotes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateDeliveryFee = () => {
    return calculateSubtotal() > 50 ? 0 : 5.99; // Free delivery over $50
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateDeliveryFee();
  };

  const getPaymentMethodName = (method) => {
    switch (method) {
      case 'cbe': return 'CBE Bank';
      case 'awash': return 'Awash Bank';
      case 'telebirr': return 'TeleBirr';
      case 'ebirr': return 'E-Birr';
      case 'cash': return 'Cash on Delivery';
      default: return method;
    }
  };

  const validateForm = () => {
    const required = ['fullName', 'email', 'phone', 'address', 'city', 'zipCode'];
    
    if (formData.paymentMethod === 'cbe' || formData.paymentMethod === 'awash') {
      required.push('accountNumber');
    } else if (formData.paymentMethod === 'telebirr' || formData.paymentMethod === 'ebirr') {
      required.push('phoneNumber');
    }

    for (let field of required) {
      if (!formData[field].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    // Basic phone validation
    if (formData.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return false;
    }

    // Payment method specific validation
    if ((formData.paymentMethod === 'telebirr' || formData.paymentMethod === 'ebirr') && formData.phoneNumber.length < 10) {
      toast.error('Please enter a valid payment phone number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate order ID
      const newOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Create order object
      const orderData = {
        orderId: newOrderId,
        userId: user.id,
        items: cartItems,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        deliveryFee: calculateDeliveryFee(),
        total: calculateTotal(),
        deliveryInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode
        },
        paymentMethod: formData.paymentMethod,
        paymentDetails: {
          accountNumber: formData.accountNumber,
          phoneNumber: formData.phoneNumber,
          referenceNumber: formData.referenceNumber
        },
        orderNotes: formData.orderNotes,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      // Save order to localStorage (in a real app, this would be sent to backend)
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      // Clear cart
      clearCart();
      
      setOrderId(newOrderId);
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/orders');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-light-theme dark:bg-dark-theme py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Add some items to proceed with checkout</p>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center px-6 py-3 bg-primary-600 dark:bg-accent-500 text-white font-medium rounded-lg hover:bg-primary-700 dark:hover:bg-accent-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-theme dark:bg-dark-theme py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center text-primary-600 dark:text-accent-400 hover:text-primary-700 dark:hover:text-accent-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cart
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Checkout</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Information */}
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Delivery Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-accent-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-accent-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-accent-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-accent-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-accent-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-accent-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Information
              </h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center p-3 border border-gray-300 dark:border-dark-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cbe"
                      checked={formData.paymentMethod === 'cbe'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">CBE Bank</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Commercial Bank of Ethiopia</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border border-gray-300 dark:border-dark-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="awash"
                      checked={formData.paymentMethod === 'awash'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Awash Bank</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Awash International Bank</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border border-gray-300 dark:border-dark-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="telebirr"
                      checked={formData.paymentMethod === 'telebirr'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">TeleBirr</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Mobile Money</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border border-gray-300 dark:border-dark-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ebirr"
                      checked={formData.paymentMethod === 'ebirr'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">E-Birr</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Digital Wallet</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border border-gray-300 dark:border-dark-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700 col-span-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Cash on Delivery</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Pay when your order arrives</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Bank Account Payment Fields */}
              {(formData.paymentMethod === 'cbe' || formData.paymentMethod === 'awash') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your account number"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-accent-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reference Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="referenceNumber"
                      value={formData.referenceNumber}
                      onChange={handleInputChange}
                      placeholder="Transaction reference number"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-accent-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Payment Instructions:</h4>
                    <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>1. Transfer the total amount to our {formData.paymentMethod === 'cbe' ? 'CBE' : 'Awash'} account</li>
                      <li>2. Use your order ID as reference</li>
                      <li>3. Enter your account number above</li>
                      <li>4. Keep the transaction receipt for verification</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* Mobile Money Payment Fields */}
              {(formData.paymentMethod === 'telebirr' || formData.paymentMethod === 'ebirr') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+251 9XX XXX XXX"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-accent-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reference Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="referenceNumber"
                      value={formData.referenceNumber}
                      onChange={handleInputChange}
                      placeholder="Transaction reference number"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-accent-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Payment Instructions:</h4>
                    <ol className="text-sm text-green-800 dark:text-green-200 space-y-1">
                      <li>1. Open your {formData.paymentMethod === 'telebirr' ? 'TeleBirr' : 'E-Birr'} app</li>
                      <li>2. Send money to our merchant number</li>
                      <li>3. Use the total amount: ${calculateTotal().toFixed(2)}</li>
                      <li>4. Enter your phone number above</li>
                      <li>5. Save the transaction ID for reference</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* Cash on Delivery Information */}
              {formData.paymentMethod === 'cash' && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                  <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Cash on Delivery:</h4>
                  <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                    <li>• Pay ${calculateTotal().toFixed(2)} when your order arrives</li>
                    <li>• Have exact change ready for faster service</li>
                    <li>• Our delivery person will provide a receipt</li>
                    <li>• No advance payment required</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Order Notes */}
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Order Notes (Optional)
              </h2>
              <textarea
                name="orderNotes"
                value={formData.orderNotes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Any special instructions for your order..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-accent-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 dark:border-dark-700 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                  <span className="text-gray-900 dark:text-gray-100">{getPaymentMethodName(formData.paymentMethod)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-gray-100">${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="text-gray-900 dark:text-gray-100">${calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {calculateDeliveryFee() === 0 ? 'FREE' : `$${calculateDeliveryFee().toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-dark-700 pt-2">
                  <span className="text-gray-900 dark:text-gray-100">Total</span>
                  <span className="text-gray-900 dark:text-gray-100">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-6 bg-primary-600 dark:bg-accent-500 text-white py-3 rounded-lg font-medium hover:bg-primary-700 dark:hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : `Place Order - $${calculateTotal().toFixed(2)}`}
              </button>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                By placing your order, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <Modal 
        isOpen={showSuccessModal} 
        onClose={handleSuccessClose}
        title="Order Confirmed!"
      >
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Thank you for your order!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your order has been confirmed and will be delivered soon.
          </p>
          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Order ID</p>
            <p className="font-mono font-semibold text-gray-900 dark:text-gray-100">{orderId}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Payment Method</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{getPaymentMethodName(formData.paymentMethod)}</p>
          </div>
          
          {(formData.paymentMethod === 'cbe' || formData.paymentMethod === 'awash') && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Next Steps:</h4>
              <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>1. Transfer ${calculateTotal().toFixed(2)} to our {getPaymentMethodName(formData.paymentMethod)} account</li>
                <li>2. Use order ID: {orderId} as reference</li>
                <li>3. Keep your transaction receipt</li>
                <li>4. Your order will be confirmed once payment is verified</li>
              </ol>
            </div>
          )}
          
          {(formData.paymentMethod === 'telebirr' || formData.paymentMethod === 'ebirr') && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Next Steps:</h4>
              <ol className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>1. Open your {getPaymentMethodName(formData.paymentMethod)} app</li>
                <li>2. Send ${calculateTotal().toFixed(2)} to our merchant number</li>
                <li>3. Use order ID: {orderId} as reference</li>
                <li>4. Save the transaction ID</li>
                <li>5. Your order will be confirmed once payment is received</li>
              </ol>
            </div>
          )}

          {formData.paymentMethod === 'cash' && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Next Steps:</h4>
              <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                <li>• Your order is confirmed and being prepared</li>
                <li>• Prepare ${calculateTotal().toFixed(2)} in cash</li>
                <li>• Our delivery person will contact you</li>
                <li>• Pay when your order arrives at your door</li>
                <li>• You'll receive a receipt upon payment</li>
              </ul>
            </div>
          )}
          <button
            onClick={handleSuccessClose}
            className="w-full bg-primary-600 dark:bg-accent-500 text-white py-2 rounded-lg font-medium hover:bg-primary-700 dark:hover:bg-accent-600 transition-colors"
          >
            View My Orders
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Checkout;