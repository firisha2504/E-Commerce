import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import DashboardLayout from '../../components/admin/DashboardLayout';

const faqs = [
  { q: 'How do I add a new product?', a: 'Go to Products → click "Add Product", fill in the name, price, category, and upload an image.' },
  { q: 'How do I hide a product from the menu?', a: 'In the Products table, click the green "active" badge next to the product. It will turn red and the product will be hidden from customers.' },
  { q: 'How do I update an order status?', a: 'Go to Orders, find the order, click the edit icon, and select the new status from the dropdown.' },
  { q: 'How do I create a special offer?', a: 'Go to Special Offers → click "Add Offer", set the discount type, value, promo code, and validity period.' },
  { q: 'How do I view customer details?', a: 'Go to Customers and click the eye icon next to any customer to see their full profile and order history.' },
  { q: 'How do I change my admin password?', a: 'Go to My Profile → Security section → click "Change Password".' },
];

const Support = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <DashboardLayout title="Support">
      <div className="space-y-6 max-w-4xl">

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow border border-gray-200 dark:border-dark-700 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mb-3">
              <Mail className="text-primary-600 dark:text-accent-400" size={22} />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Email Support</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Get help via email</p>
            <a href="mailto:support@farestaurant.com"
              className="text-sm text-primary-600 dark:text-accent-400 hover:underline font-medium">
              support@farestaurant.com
            </a>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow border border-gray-200 dark:border-dark-700 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mb-3">
              <Phone className="text-primary-600 dark:text-accent-400" size={22} />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Phone Support</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Mon–Fri, 8am–6pm</p>
            <a href="tel:+251911234567"
              className="text-sm text-primary-600 dark:text-accent-400 hover:underline font-medium">
              +251 911 234 567
            </a>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow border border-gray-200 dark:border-dark-700 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mb-3">
              <ExternalLink className="text-primary-600 dark:text-accent-400" size={22} />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Contact Page</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Use the contact form</p>
            <a href="/contact" target="_blank" rel="noreferrer"
              className="text-sm text-primary-600 dark:text-accent-400 hover:underline font-medium">
              Open Contact Page
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow border border-gray-200 dark:border-dark-700">
          <div className="p-6 border-b border-gray-200 dark:border-dark-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <MessageSquare size={20} className="text-primary-600 dark:text-accent-400" />
              Frequently Asked Questions
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-dark-700">
            {faqs.map((faq, i) => (
              <div key={i} className="p-5">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="font-medium text-gray-900 dark:text-gray-100">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp size={18} className="text-gray-400 flex-shrink-0" />
                    : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Support;
