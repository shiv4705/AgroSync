import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { 
  User, 
  Bell, 
  Settings, 
  Edit, 
  MapPin, 
  Calendar,
  LogOut,
  Check,
  Pencil,
  Loader
} from 'lucide-react';

function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
    emailNotifications: false,
    publicProfile: false,
    showLocation: false
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Fetch user data when component mounts
  useEffect(() => {
    fetchUserData();
    fetchNotifications();
    fetchUserSettings();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if we have a token in localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please login.');
      }

      // First try to get from localStorage for immediate display
      const cachedUser = JSON.parse(localStorage.getItem('user'));
      if (cachedUser) {
        setUserData(cachedUser);
      }
      
      // Then fetch fresh data from the server
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch profile');
      }

      const data = await response.json();
      
      // Update the state with the fetched user data
      setUserData(data.user || data);
      
      // Also update localStorage with fresh data
      localStorage.setItem('user', JSON.stringify(data.user || data));
      
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError(error.message);
      
      // If there's an authentication error, redirect to login
      if (error.message.includes('token') || error.message.includes('login')) {
        alert('Please login to view your profile');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      // This API endpoint might not exist yet - you would need to implement it
      const response = await fetch('http://localhost:5000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Don't show error UI for notifications, just use empty array
    }
  };
  
  const fetchUserSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      // This API endpoint might not exist yet - you would need to implement it
      const response = await fetch('http://localhost:5000/api/user/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings({
          emailNotifications: data.emailNotifications || false,
          publicProfile: data.publicProfile || false,
          showLocation: data.showLocation || false
        });
      }
    } catch (error) {
      console.error("Error fetching user settings:", error);
      // Use defaults in case of error
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Format date to display member since
  const formatMemberSince = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long'
    });
  };

  if (loading && !userData) {
    return (
      <div className="min-h-screen bg-[#1a332e] flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-white">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="min-h-screen bg-[#1a332e]">
        <Navbar />
        <div className="pt-24 px-6 max-w-xl mx-auto text-center">
          <div className="bg-red-500/10 p-6 rounded-xl">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={() => navigate('/login')}
              className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a332e]">
      <Navbar />
      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-3">
            <div className="bg-[#2d4f47] rounded-xl overflow-hidden">
              {/* Cover Image */}
              <div className="h-32 bg-gradient-to-r from-teal-500 to-blue-500 relative">
                <button className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              
              {/* Profile Info */}
              <div className="px-6 pb-6">
                <div className="relative -mt-16 mb-4">
                  <div className="w-32 h-32 rounded-full bg-[#1a332e] border-4 border-[#2d4f47] mx-auto overflow-hidden">
                    <img
                      src={userData?.profile_image || `https://ui-avatars.com/api/?name=${userData?.name || 'User'}&background=1a332e&color=fff`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${userData?.name || 'User'}&background=1a332e&color=fff`;
                      }}
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-1">{userData?.name || 'User'}</h2>
                  <p className="text-gray-400 mb-2">{userData?.email}</p>
                  <div className="flex items-center justify-center text-gray-400 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{userData?.location || 'Location not set'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="px-3 py-1 bg-teal-500/10 text-teal-400 rounded-full text-sm">
                      {userData?.role || 'User'}
                    </span>
                    <span className="px-3 py-1 bg-teal-500/10 text-teal-400 rounded-full text-sm">
                      Member since {formatMemberSince(userData?.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="mt-8 space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-teal-500 text-white'
                            : 'text-gray-400 hover:bg-teal-500/10 hover:text-teal-400'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {tab.label}
                      </button>
                    );
                  })}
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-9">
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#2d4f47] rounded-xl p-6 border border-teal-500/20"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                  <button className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors">
                    <Pencil className="w-5 h-5" />
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 mb-2">Full Name</label>
                    <p className="text-white">{userData?.name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Email</label>
                    <p className="text-white">{userData?.email}</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Location</label>
                    <p className="text-white">{userData?.location || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Phone</label>
                    <p className="text-white">{userData?.mobile || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Member Since</label>
                    <p className="text-white">{formatMemberSince(userData?.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Role</label>
                    <p className="text-white capitalize">{userData?.role || 'User'}</p>
                  </div>
                </div>

                <div className="mt-8">
                  <label className="block text-gray-400 mb-2">Bio</label>
                  <p className="text-white">
                    {userData?.bio || "No bio available. Add a bio to tell others about yourself."}
                  </p>
                </div>

                {userData?.role === 'farmer' && (
                  <div className="mt-8">
                    <h3 className="text-white font-bold mb-4">Farmer Verification</h3>
                    <div className="flex items-center gap-3">
                      {userData?.verified ? (
                        <>
                          <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm flex items-center">
                            <Check className="w-4 h-4 mr-1" />
                            Verified Farmer
                          </span>
                          <p className="text-gray-400 text-sm">Your farm has been verified by our team.</p>
                        </>
                      ) : (
                        <>
                          <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-sm">
                            Verification Pending
                          </span>
                          <p className="text-gray-400 text-sm">We're reviewing your farm details.</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-[#2d4f47] rounded-xl p-6 border border-teal-500/20">
                  <h2 className="text-2xl font-bold text-white mb-2">Notifications</h2>
                  <p className="text-gray-400">Manage your notifications and preferences</p>

                  <div className="mt-8 space-y-4">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="p-4 rounded-lg bg-[#1a332e] border border-teal-500/20"
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-2 rounded-full bg-teal-500/10">
                              <Bell className="w-5 h-5 text-teal-400" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-white font-medium mb-1">{notification.title}</h3>
                              <p className="text-gray-400 text-sm">{notification.message}</p>
                              <p className="text-gray-500 text-sm mt-2">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No notifications at this time</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-[#2d4f47] rounded-xl p-6 border border-teal-500/20">
                  <h3 className="text-xl font-bold text-white mb-6">Notification Preferences</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-gray-300">Email notifications</span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={() => setSettings(prev => ({
                            ...prev,
                            emailNotifications: !prev.emailNotifications
                          }))}
                          className="sr-only"
                        />
                        <div className={`w-10 h-6 rounded-full transition-colors ${
                          settings.emailNotifications ? 'bg-teal-500' : 'bg-gray-600'
                        }`}>
                          <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                            settings.emailNotifications ? 'translate-x-5' : 'translate-x-1'
                          } mt-1`} />
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-[#2d4f47] rounded-xl p-6 border border-teal-500/20">
                  <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white font-bold mb-4">Password</h3>
                      <button className="px-4 py-2 bg-teal-500/10 text-teal-400 rounded-lg hover:bg-teal-500/20 transition-colors">
                        Change Password
                      </button>
                    </div>

                    <div>
                      <h3 className="text-white font-bold mb-4">Privacy Settings</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-gray-300">Public profile visibility</span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={settings.publicProfile}
                              onChange={() => setSettings(prev => ({
                                ...prev,
                                publicProfile: !prev.publicProfile
                              }))}
                              className="sr-only"
                            />
                            <div className={`w-10 h-6 rounded-full transition-colors ${
                              settings.publicProfile ? 'bg-teal-500' : 'bg-gray-600'
                            }`}>
                              <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                                settings.publicProfile ? 'translate-x-5' : 'translate-x-1'
                              } mt-1`} />
                            </div>
                          </div>
                        </label>

                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-gray-300">Show my location</span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={settings.showLocation}
                              onChange={() => setSettings(prev => ({
                                ...prev,
                                showLocation: !prev.showLocation
                              }))}
                              className="sr-only"
                            />
                            <div className={`w-10 h-6 rounded-full transition-colors ${
                              settings.showLocation ? 'bg-teal-500' : 'bg-gray-600'
                            }`}>
                              <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                                settings.showLocation ? 'translate-x-5' : 'translate-x-1'
                              } mt-1`} />
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white font-bold mb-4">Delete Account</h3>
                      <p className="text-gray-400 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;