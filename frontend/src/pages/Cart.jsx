import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import Modal from '../components/common/Modal';

const Cart = () => {
  const { cartItems, total, itemCount, removeFromCart, updateCartItem, clearCart } = useCart();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateCartItem(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId) => {
    setItemToRemove(itemId);
    setShowConfirmModal(true);
  };

  const confirmRemoveItem = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove);
      setShowConfirmModal(false);
      setItemToRemove(null);
    }
  };

  const handleClearCart = () => {
    setShowClearModal(true);
  };

  const confirmClearCart = () => {
    clearCart();
    setShowClearModal(false);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-light-theme dark:bg-dark-theme py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingCart className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Add some delicious items to get started!</p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-primary-600 dark:bg-accent-500 text-white font-medium rounded-lg hover:bg-primary-700 dark:hover:bg-accent-600 transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-theme dark:bg-dark-theme py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Cart Items ({itemCount} items)</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-dark-700">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gray-200 dark:bg-dark-700 rounded-lg"></div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">${Number(item.price).toFixed(2)} each</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-dark-600 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
                          >
                            <Minus size={16} className="text-gray-600 dark:text-gray-400" />
                          </button>
                          <span className="w-8 text-center text-gray-900 dark:text-gray-100">{item.quantity}</span>
                          <button 
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-dark-600 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
                          >
                            <Plus size={16} className="text-gray-600 dark:text-gray-400" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                          <button 
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 text-sm flex items-center"
                          >
                            <Trash2 size={16} className="mr-1" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="text-gray-900 dark:text-gray-100">${calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-dark-700 pt-4 mt-4">
                  <span className="text-gray-900 dark:text-gray-100">Total</span>
                  <span className="text-gray-900 dark:text-gray-100">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-primary-600 dark:bg-accent-500 text-white py-3 rounded-lg font-medium hover:bg-primary-700 dark:hover:bg-accent-600 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={20} />
              </Link>
              
              <button 
                onClick={handleClearCart}
                className="w-full mt-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Clear Cart
              </button>
            </div>

            <div className="mt-6 bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Need help?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Have questions about your order? Contact our support team.
              </p>
              <button className="text-primary-600 dark:text-accent-400 hover:text-primary-700 dark:hover:text-accent-300 font-medium">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirm Remove Item Modal */}
      <Modal 
        isOpen={showConfirmModal} 
        onClose={() => setShowConfirmModal(false)}
        title="Remove Item"
      >
        <p className="text-gray-900 dark:text-gray-100 mb-6">
          Are you sure you want to remove this item from your cart?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowConfirmModal(false)}
            className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmRemoveItem}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Remove
          </button>
        </div>
      </Modal>

      {/* Confirm Clear Cart Modal */}
      <Modal 
        isOpen={showClearModal} 
        onClose={() => setShowClearModal(false)}
        title="Clear Cart"
      >
        <p className="text-gray-900 dark:text-gray-100 mb-6">
          Are you sure you want to clear all items from your cart? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowClearModal(false)}
            className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmClearCart}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear Cart
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Cart;