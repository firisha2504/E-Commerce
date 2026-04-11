import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, showCloseButton = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
          {/* Close button */}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={24} />
            </button>
          )}
          
          {/* Title */}
          {title && (
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {title}
            </h3>
          )}
          
          {/* Content */}
          <div className="text-gray-600 dark:text-gray-400">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
