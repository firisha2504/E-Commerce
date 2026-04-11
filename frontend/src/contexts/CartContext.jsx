import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        itemCount: action.payload.itemCount || 0,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(item => item.productId === action.payload.productId);
      let newItems;
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...state.items, action.payload];
      }
      
      const newItemCount = newItems.reduce((total, item) => total + item.quantity, 0);
      const newTotal = newItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
      
      return {
        ...state,
        items: newItems,
        itemCount: newItemCount,
        total: newTotal,
      };
    case 'UPDATE_ITEM':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id ? action.payload : item
      );
      const updatedItemCount = updatedItems.reduce((total, item) => total + item.quantity, 0);
      const updatedTotal = updatedItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
      
      return {
        ...state,
        items: updatedItems,
        itemCount: updatedItemCount,
        total: updatedTotal,
      };
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      const filteredItemCount = filteredItems.reduce((total, item) => total + item.quantity, 0);
      const filteredTotal = filteredItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
      
      return {
        ...state,
        items: filteredItems,
        itemCount: filteredItemCount,
        total: filteredTotal,
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
      };
    default:
      return state;
  }
};

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);
          dispatch({
            type: 'SET_CART',
            payload: cartData,
          });
        } catch (error) {
          console.error('Failed to load cart from localStorage:', error);
        }
      }
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [isAuthenticated, user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated && user && state.items.length >= 0) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify({
        items: state.items,
        total: state.total,
        itemCount: state.itemCount,
      }));
    }
  }, [state.items, state.total, state.itemCount, isAuthenticated, user]);

  const addToCart = async (product, quantity = 1, customizations = {}) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      const cartItem = {
        id: `${product.id}_${Date.now()}`, // Unique ID for cart item
        productId: product.id,
        name: product.name,
        price: Number(product.price) || 0, // Ensure price is a number
        image: product.image,
        quantity: quantity,
        customizations: customizations,
      };
      
      dispatch({ type: 'ADD_ITEM', payload: cartItem });
      // Removed duplicate toast - let components handle their own notifications
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const item = state.items.find(item => item.id === itemId);
      if (item) {
        const updatedItem = { ...item, quantity };
        dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
        // Removed duplicate toast - let components handle their own notifications
      }
    } catch (error) {
      console.error('Failed to update cart item:', error);
      toast.error('Failed to update item');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      dispatch({ type: 'REMOVE_ITEM', payload: itemId });
      // Removed duplicate toast - let components handle their own notifications
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'CLEAR_CART' });
      if (isAuthenticated && user) {
        localStorage.removeItem(`cart_${user.id}`);
      }
      // Removed duplicate toast - let components handle their own notifications
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const value = {
    cartItems: state.items,
    total: state.total,
    itemCount: state.itemCount,
    isLoading: state.isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};