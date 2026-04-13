import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import Modal from '../components/common/Modal';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    setShowSuccessModal(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-light-theme dark:bg-dark-theme py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions, feedback, or just want to say hello? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-accent-900/30 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary-600 dark:text-accent-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Our Location</h3>
                    <p className="text-gray-600 dark:text-gray-400">123 Restaurant Street</p>
                    <p className="text-gray-600 dark:text-gray-400">Dire Dawa, Ethiopia</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-accent-900/30 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary-600 dark:text-accent-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Phone Number</h3>
                    <p className="text-gray-600 dark:text-gray-400">+251 911 234 567</p>
                    <p className="text-gray-600 dark:text-gray-400">+251 911 234 568</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-accent-900/30 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary-600 dark:text-accent-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Email Address</h3>
                    <p className="text-gray-600 dark:text-gray-400">info@farestaurant.com</p>
                    <p className="text-gray-600 dark:text-gray-400">reservations@farestaurant.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-accent-900/30 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary-600 dark:text-accent-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Opening Hours</h3>
                    <p className="text-gray-600 dark:text-gray-400">Monday - Friday: 8:00 AM - 10:00 PM</p>
                    <p className="text-gray-600 dark:text-gray-400">Saturday - Sunday: 9:00 AM - 11:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tell us more about your inquiry..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-600 dark:bg-accent-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 dark:hover:bg-accent-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 bg-white dark:bg-dark-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="h-64 bg-gray-200 dark:bg-dark-700 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400">Map would be displayed here</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">123 Restaurant Street, Dire Dawa</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
        title="Message Sent"
      >
        <p className="text-gray-900 dark:text-gray-100 mb-6">
          Thank you for your message! We will get back to you soon.
        </p>
        <div className="flex justify-end">
          <button
            onClick={() => setShowSuccessModal(false)}
            className="bg-primary-600 dark:bg-accent-500 text-white px-6 py-2 rounded-lg hover:bg-primary-700 dark:hover:bg-accent-600 transition-colors"
          >
            OK
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Contact;