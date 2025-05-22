import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../styles/Profile.css'; // Import the CSS file

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    avatar_url: '',
  });

  // Fetch Profile Function
  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/my-profile/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setProfile(response.data);
      setFormData(response.data); // Prefill the form
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setProfile(null); // No profile found
      } else {
        setError("Failed to fetch profile");
      }
    } finally {
      setLoading(false);
    }
  };
  

  // Handle Create or Update Profile
  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      const url = profile
        ? "http://127.0.0.1:8000/update-profile/" // Update profile
        : "http://127.0.0.1:8000/my-profile/"; // Create profile
      const method = profile ? "put" : "post";
  
      const response = await axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        data: formData, 
      });
  
      setProfile(response.data);
      setIsEditing(false);
      fetchProfile(); // Automatically refresh the profile data
    } catch (err) {
      console.error("Error creating or updating profile:", err);
      setError("Failed to save profile");
    }
  };
  

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle Form Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <Navbar />
      <div className="profile-container">
        {loading && <div className="loader">Loading...</div>}
        {error && <div className="error">{error}</div>}

        {profile ? (
          <div className="profile-card">
            <h2>Profile</h2>
            {profile.avatar_url && <img src={profile.avatar_url} alt="Avatar" className="avatar" />}
            <p><strong>Name:</strong> {profile.full_name}</p>
            <p><strong>Bio:</strong> {profile.bio}</p>
            <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
          </div>
        ) : (
          <div className="no-profile">
            <p>No profile found. Please create a profile.</p>
            <button onClick={() => setIsEditing(true)} className="create-btn">Create Profile</button>
          </div>
        )}

        {isEditing && (
          <form onSubmit={handleCreateOrUpdate} className="profile-form">
            <h2>{profile ? "Edit Profile" : "Create Profile"}</h2>
            <div>
              <label>Full Name</label>
              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Bio</label>
              <textarea
                name="bio"
                placeholder="Bio"
                value={formData.bio}
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <label>Avatar URL</label>
              <input
                type="text"
                name="avatar_url"
                placeholder="Avatar URL"
                value={formData.avatar_url}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="submit-btn">{profile ? "Update Profile" : "Create Profile"}</button>
            <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </form>
        )}
      </div>
    </>
  );
}
