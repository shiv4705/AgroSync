import React, { useState } from "react";
import { FiEdit2, FiSave, FiUser, FiMapPin, FiPhone, FiMail, FiShoppingCart, FiHeart } from "react-icons/fi";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Dishang",
    email: "dishang@example.com",
    phone: "(555) 123-4567",
    address: "123 Farm Street, Ruralia, CA",
    pincode: "95123",
    preferences: ["Organic", "Local", "Seasonal"],
    bio: "I'm passionate about supporting local farmers and eating fresh, sustainably grown food."
  });
  
  const [formData, setFormData] = useState({...profileData});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setProfileData(formData);
    setIsEditing(false);
  };
  
  return (
    <div className="min-h-screen bg-[#0A2725] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-[#0A2725] rounded-2xl shadow-2xl overflow-hidden border border-[#0EA5E9]/20">
        {/* Profile header */}
        <div className="flex justify-between items-center p-6 bg-[#0A2725] border-b border-[#0EA5E9]/20">
          <h2 className="text-2xl font-bold text-white">My Profile</h2>
          {isEditing ? (
            <button 
              onClick={handleSubmit}
              className="flex items-center px-4 py-2 bg-[#0EA5E9] text-white rounded-lg hover:bg-[#0891CE] transition-colors font-medium"
            >
              <FiSave className="mr-2" />
              Save Changes
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-[#0EA5E9] text-white rounded-lg hover:bg-[#0891CE] transition-colors font-medium"
            >
              <FiEdit2 className="mr-2" />
              Edit Profile
            </button>
          )}
        </div>
        
        {/* Profile content */}
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Profile picture */}
            <div className="md:w-1/3 flex flex-col items-center">
              <div className="w-40 h-40 bg-[#0EA5E9] rounded-2xl flex items-center justify-center text-white mb-6">
                <span className="text-5xl font-bold">D</span>
              </div>
              <h3 className="text-xl font-bold text-white">{profileData.name}</h3>
              <p className="text-sm text-[#0EA5E9] mt-1">{profileData.email}</p>
              
              {isEditing && (
                <button className="mt-4 text-sm text-[#0EA5E9] hover:text-[#0891CE] font-medium">
                  Change Profile Picture
                </button>
              )}
            </div>
            
            {/* Profile details */}
            <div className="md:w-2/3">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#0EA5E9] mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-[#0A2725] border border-[#0EA5E9]/20 text-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#0EA5E9] mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-[#0A2725] border border-[#0EA5E9]/20 text-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#0EA5E9] mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-[#0A2725] border border-[#0EA5E9]/20 text-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#0EA5E9] mb-2">
                        Pincode
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-[#0A2725] border border-[#0EA5E9]/20 text-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#0EA5E9] mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-[#0A2725] border border-[#0EA5E9]/20 text-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#0EA5E9] mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 rounded-lg bg-[#0A2725] border border-[#0EA5E9]/20 text-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
                    ></textarea>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start">
                      <FiUser className="mt-1 h-5 w-5 text-[#0EA5E9]" />
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-[#0EA5E9]">Full Name</h4>
                        <p className="text-white font-medium">{profileData.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FiMail className="mt-1 h-5 w-5 text-[#0EA5E9]" />
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-[#0EA5E9]">Email Address</h4>
                        <p className="text-white font-medium">{profileData.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FiPhone className="mt-1 h-5 w-5 text-[#0EA5E9]" />
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-[#0EA5E9]">Phone Number</h4>
                        <p className="text-white font-medium">{profileData.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FiMapPin className="mt-1 h-5 w-5 text-[#0EA5E9]" />
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-[#0EA5E9]">Pincode</h4>
                        <p className="text-white font-medium">{profileData.pincode}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiMapPin className="mt-1 h-5 w-5 text-[#0EA5E9]" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-[#0EA5E9]">Address</h4>
                      <p className="text-white font-medium">{profileData.address}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-[#0EA5E9] mb-2">Preferences</h4>
                    <div className="flex flex-wrap gap-2">
                      {profileData.preferences.map((pref, idx) => (
                        <span 
                          key={idx} 
                          className="px-3 py-1 bg-[#0EA5E9] bg-opacity-10 text-[#0EA5E9] text-sm rounded-full font-medium border border-[#0EA5E9]/20"
                        >
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-[#0EA5E9] mb-2">Bio</h4>
                    <p className="text-white">{profileData.bio}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Recent activity section */}
        <div className="border-t border-[#0EA5E9]/20 bg-[#0A2725] p-8">
          <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-xl bg-[#0EA5E9] bg-opacity-10 text-[#0EA5E9] flex items-center justify-center border border-[#0EA5E9]/20">
                <FiShoppingCart className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <p className="text-white">Ordered from <span className="font-medium text-[#0EA5E9]">Green Acres Farm</span></p>
                <p className="text-sm text-[#0EA5E9]/60 mt-1">March 18, 2025</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-xl bg-[#0EA5E9] bg-opacity-10 text-[#0EA5E9] flex items-center justify-center border border-[#0EA5E9]/20">
                <FiHeart className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <p className="text-white">Added <span className="font-medium text-[#0EA5E9]">Seasonal Vegetable Basket</span> to wishlist</p>
                <p className="text-sm text-[#0EA5E9]/60 mt-1">March 15, 2025</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-xl bg-[#0EA5E9] bg-opacity-10 text-[#0EA5E9] flex items-center justify-center border border-[#0EA5E9]/20">
                <FiUser className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <p className="text-white">Followed <span className="font-medium text-[#0EA5E9]">Sunset Valley Organics</span></p>
                <p className="text-sm text-[#0EA5E9]/60 mt-1">March 10, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;