import React, { useState, useEffect } from 'react';
import { Coffee, Users, Award, Heart, Upload, X, Edit, Save, Plus, Trash2 } from 'lucide-react';

const About = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    role: '',
    description: ''
  });

  // Load team members from localStorage or use defaults
  useEffect(() => {
    const savedTeam = localStorage.getItem('teamMembers');
    if (savedTeam) {
      setTeamMembers(JSON.parse(savedTeam));
    } else {
      // Default team members
      const defaultTeam = [
        {
          id: 1,
          name: 'Firomsa A.',
          role: 'Founder & Head Chef',
          description: 'With over 20 years of experience in Ethiopian cuisine, Fikadu brings traditional flavors to life.',
          image: localStorage.getItem('team-member-1') || null
        },
        {
          id: 2,
          name: 'Selam T.',
          role: 'Pastry Chef',
          description: 'Specializing in traditional Ethiopian breads and desserts, Selam creates authentic baked goods.',
          image: localStorage.getItem('team-member-2') || null
        },
        {
          id: 3,
          name: 'Mekonnen B.',
          role: 'Coffee Master',
          description: 'Mekonnen performs the traditional coffee ceremony, bringing authentic Ethiopian coffee culture to our guests.',
          image: localStorage.getItem('team-member-3') || null
        }
      ];
      setTeamMembers(defaultTeam);
      localStorage.setItem('teamMembers', JSON.stringify(defaultTeam));
    }
  }, []);

  useEffect(() => {
    // Check if user is admin - only through proper authentication
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Check if this is the admin user
    const isAdminUser = (user.isAdmin === true && user.email === 'admin@farestaurant.com') ||
                       (user.email === 'admin@farestaurant.com'); // Fallback for admin email
    
    setIsAdmin(isAdminUser);
  }, []);

  // Remove the manual admin toggle - security risk
  // const toggleAdminMode = () => {
  //   setIsAdmin(!isAdmin);
  // };

  // Save team members to localStorage
  const saveTeamMembers = (updatedTeam) => {
    setTeamMembers(updatedTeam);
    localStorage.setItem('teamMembers', JSON.stringify(updatedTeam));
  };

  const handleImageUpload = (memberId, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        localStorage.setItem(`team-member-${memberId}`, imageUrl);
        
        const updatedTeam = teamMembers.map(member => 
          member.id === memberId 
            ? { ...member, image: imageUrl }
            : member
        );
        saveTeamMembers(updatedTeam);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (memberId) => {
    localStorage.removeItem(`team-member-${memberId}`);
    const updatedTeam = teamMembers.map(member => 
      member.id === memberId 
        ? { ...member, image: null }
        : member
    );
    saveTeamMembers(updatedTeam);
  };

  const startEditing = (member) => {
    setEditingMember(member.id);
    setEditForm({
      name: member.name,
      role: member.role,
      description: member.description
    });
  };

  const cancelEditing = () => {
    setEditingMember(null);
    setEditForm({ name: '', role: '', description: '' });
  };

  const saveEditing = () => {
    const updatedTeam = teamMembers.map(member => 
      member.id === editingMember 
        ? { ...member, ...editForm }
        : member
    );
    saveTeamMembers(updatedTeam);
    setEditingMember(null);
    setEditForm({ name: '', role: '', description: '' });
  };

  const addNewMember = () => {
    const newId = Math.max(...teamMembers.map(m => m.id), 0) + 1;
    const newMember = {
      id: newId,
      name: 'New Team Member',
      role: 'Position',
      description: 'Add description here...',
      image: null
    };
    const updatedTeam = [...teamMembers, newMember];
    saveTeamMembers(updatedTeam);
    startEditing(newMember);
  };

  const deleteMember = (memberId) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      localStorage.removeItem(`team-member-${memberId}`);
      const updatedTeam = teamMembers.filter(member => member.id !== memberId);
      saveTeamMembers(updatedTeam);
    }
  };
  return (
    <div className="min-h-screen bg-light-theme dark:bg-dark-theme py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">About FA Restaurant</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Experience the authentic taste of Ethiopia with our traditional recipes passed down through generations.
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Our Story</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Founded in 2023, FA Restaurant was born from a passion for sharing the rich culinary heritage of Ethiopia with the world. 
                Our founder, Firomsa , grew up learning traditional recipes from his grandmother in Dire Dawa.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                What started as a small family kitchen has grown into a beloved restaurant that brings people together through food, 
                culture, and community.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Every dish we serve tells a story - from the aromatic spices to the traditional cooking methods that have been 
                perfected over centuries.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-500 to-orange-600 rounded-2xl h-64 w-full"></div>
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xl w-4/5">
                <div className="flex items-center space-x-4">
                  <Coffee className="text-primary-500" size={32} />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">Traditional Coffee</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Authentic Ethiopian coffee ceremony</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-lg text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-accent-900/30 rounded-full mb-4">
                <Heart className="text-primary-500 dark:text-accent-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Authenticity</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We stay true to traditional recipes and cooking methods, ensuring every dish is authentic.
              </p>
            </div>
            
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-lg text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-accent-900/30 rounded-full mb-4">
                <Users className="text-primary-500 dark:text-accent-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Community</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Food brings people together. We're committed to building a welcoming community around our restaurant.
              </p>
            </div>
            
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-lg text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-accent-900/30 rounded-full mb-4">
                <Award className="text-primary-500 dark:text-accent-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Quality</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We source the finest ingredients and prepare each dish with care and attention to detail.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Meet Our Team</h2>
            {isAdmin && (
              <button
                onClick={addNewMember}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus size={20} />
                <span>Add Team Member</span>
              </button>
            )}
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="text-center bg-white dark:bg-dark-800 rounded-xl p-6 shadow-lg">
                {/* Profile Image */}
                <div className="relative w-32 h-32 mx-auto mb-4 group">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary-200 dark:border-accent-700"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  
                  {isAdmin && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <div className="flex space-x-2">
                        <label className="cursor-pointer bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-full transition-colors">
                          <Upload size={16} />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(member.id, e)}
                            className="hidden"
                          />
                        </label>
                        {member.image && (
                          <button
                            onClick={() => removeImage(member.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Member Information */}
                {editingMember === member.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 text-center font-bold"
                      placeholder="Name"
                    />
                    <input
                      type="text"
                      value={editForm.role}
                      onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-primary-500 dark:text-accent-400 text-center font-medium"
                      placeholder="Role/Position"
                    />
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-600 dark:text-gray-400 text-sm resize-none"
                      placeholder="Description"
                    />
                    <div className="flex space-x-2 justify-center">
                      <button
                        onClick={saveEditing}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 text-sm transition-colors"
                      >
                        <Save size={14} />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{member.name}</h3>
                    <p className="text-primary-500 dark:text-accent-400 font-medium mb-2">{member.role}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {member.description}
                    </p>
                    
                    {isAdmin && (
                      <div className="flex space-x-2 justify-center">
                        <button
                          onClick={() => startEditing(member)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 text-sm transition-colors"
                        >
                          <Edit size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => deleteMember(member.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 text-sm transition-colors"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-primary-500 to-orange-600 dark:from-accent-500 dark:to-accent-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Visit Us Today</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Experience the warmth of Ethiopian hospitality and the rich flavors of our traditional cuisine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-primary-600 dark:text-accent-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Get Directions
            </a>
            <a
              href="/reservations"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Make a Reservation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;