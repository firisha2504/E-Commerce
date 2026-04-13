import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: true,
  isAuthenticated: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user)); // Store user data
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'LOGIN_FAILURE':
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // Remove user data on login failure
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // Remove user data on logout
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getProfile();
          let user = response.data.user;
          
          // Load saved profile image from localStorage
          if (user?.id) {
            const savedImage = localStorage.getItem(`admin_profile_image_${user.id}`);
            if (savedImage) {
              user = { ...user, profileImage: savedImage };
            }
          }
          
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user, token },
          });
        } catch (error) {
          dispatch({ type: 'LOGIN_FAILURE' });
        }
      } else {
        dispatch({ type: 'LOGIN_FAILURE' });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authAPI.login({ email, password });
      let user = response.data.user;
      
      // Load saved profile image from localStorage after login
      if (user?.id) {
        const savedImage = localStorage.getItem(`admin_profile_image_${user.id}`);
        if (savedImage) {
          user = { ...user, profileImage: savedImage };
        }
      }
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user,
          token: response.data.token,
        },
      });
      return response.data; // Return the response data including user info
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authAPI.register(userData);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.data.user,
          token: response.data.token,
        },
      });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      dispatch({ type: 'UPDATE_USER', payload: response.data.user });
    } catch (error) {
      throw error;
    }
  };

  const updateProfileImage = (imageUrl) => {
    const updatedUser = { ...state.user, profileImage: imageUrl };
    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    updateProfileImage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};