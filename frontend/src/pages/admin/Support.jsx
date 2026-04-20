import React, { useState, useEffect } from 'react';
import { Mail, Phone, MessageSquare, ChevronDown, ChevronUp, ExternalLink, Send, CheckCircle, Clock, Inbox } from 'lucide-react';
import DashboardLayout from '../../components/admin/DashboardLayout';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

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
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [activeTab, setActiveTab] = useState('messages');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    const saved = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    setMessages(saved);
  };

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  const handleOpenMessage = (msg) => {
    // Mark as read
    const updated = messages.map(m => m.id === msg.id ? { ...m, status: m.status === 'unread' ? 'read' : m.status } : m);
    localStorage.setItem('contact_messages', JSON.stringify(updated));
    setMessages(updated);
    setSelectedMessage({ ...msg, status: msg.status === 'unread' ? 'read' : msg.status });
    setReplyText('');
    setShowReplyModal(true);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return toast.error('Please write a reply');
    const updated = messages.map(m =>
      m.id === selectedMessage.id
        ? { ...m, reply: replyText, status: 'replied', repliedAt: new Date().toISOString() }
        : m
    );
    localStorage.setItem('contact_messages', JSON.stringify(updated));
    setMessages(updated);
    toast.success(`Reply sent to ${selectedMessage.email}`);
    setShowReplyModal(false);
    setReplyText('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'unread': return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Unread</span>;
      case 'read': return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Read</span>;
      case 'replied': return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Replied</span>;
      default: return null;
    }
  };

  return (
    <DashboardLayout title="Support">
      <div className="space-y-6 max-w-5xl">

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-dark-700">
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'messages' ? 'border-primary-500 text-primary-600 dark:text-accent-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
          >
            <Inbox size={16} />
            Customer Messages
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{unreadCount}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'contact' ? 'border-primary-500 text-primary-600 dark:text-accent-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
          >
            <Phone size={16} />
            Contact Info
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'faq' ? 'border-primary-500 text-primary-600 dark:text-accent-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
          >
            <MessageSquare size={16} />
            FAQ
          </button>
        </div>

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow border border-gray-200 dark:border-dark-700">
            {messages.length === 0 ? (
              <div className="py-16 text-center">
                <Inbox size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No messages yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Customer messages from the Contact page will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-dark-700">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    onClick={() => handleOpenMessage(msg)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors ${msg.status === 'unread' ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-accent-900/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-primary-600 dark:text-accent-400">
                            {msg.name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{msg.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{msg.email}</span>
                          </div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{msg.subject}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{msg.message}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        {getStatusBadge(msg.status)}
                        <span className="text-xs text-gray-400">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contact Info Tab */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow border border-gray-200 dark:border-dark-700 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mb-3">
                <Mail className="text-primary-600 dark:text-accent-400" size={22} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Email Support</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Get help via email</p>
              <a href="mailto:support@farestaurant.com" className="text-sm text-primary-600 dark:text-accent-400 hover:underline font-medium">
                support@farestaurant.com
              </a>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow border border-gray-200 dark:border-dark-700 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mb-3">
                <Phone className="text-primary-600 dark:text-accent-400" size={22} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Phone Support</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Mon–Fri, 8am–6pm</p>
              <a href="tel:+251911234567" className="text-sm text-primary-600 dark:text-accent-400 hover:underline font-medium">
                +251 911 234 567
              </a>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow border border-gray-200 dark:border-dark-700 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mb-3">
                <ExternalLink className="text-primary-600 dark:text-accent-400" size={22} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Contact Page</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Use the contact form</p>
              <a href="/contact" target="_blank" rel="noreferrer" className="text-sm text-primary-600 dark:text-accent-400 hover:underline font-medium">
                Open Contact Page
              </a>
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow border border-gray-200 dark:border-dark-700 divide-y divide-gray-200 dark:divide-dark-700">
            {faqs.map((faq, i) => (
              <div key={i} className="p-5">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between text-left">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={18} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
                </button>
                {openFaq === i && <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Reply Modal */}
      <Modal isOpen={showReplyModal} onClose={() => setShowReplyModal(false)} title="Message Details">
        {selectedMessage && (
          <div className="space-y-4">
            {/* Message info */}
            <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedMessage.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedMessage.email}</p>
                </div>
                <div className="text-right">
                  {getStatusBadge(selectedMessage.status)}
                  <p className="text-xs text-gray-400 mt-1">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Subject: {selectedMessage.subject}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 rounded p-3 border border-gray-200 dark:border-dark-600">
                {selectedMessage.message}
              </p>
            </div>

            {/* Previous reply */}
            {selectedMessage.reply && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle size={14} className="text-green-500" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">
                    Replied on {new Date(selectedMessage.repliedAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-green-800 dark:text-green-300">{selectedMessage.reply}</p>
              </div>
            )}

            {/* Reply box */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {selectedMessage.reply ? 'Send another reply' : 'Reply to customer'}
              </label>
              <textarea
                rows={4}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder={`Write your reply to ${selectedMessage.name}...`}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">
                This reply will be saved and visible in the message thread. In production, it would be emailed to {selectedMessage.email}.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowReplyModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                Close
              </button>
              <button onClick={handleSendReply}
                className="px-4 py-2 bg-primary-600 dark:bg-accent-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-accent-600 transition-colors flex items-center gap-2">
                <Send size={16} />
                Send Reply
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default Support;
