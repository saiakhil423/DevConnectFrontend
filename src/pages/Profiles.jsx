

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from "axios";

const Profiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/profiles/", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setProfiles(response.data);
    } catch (err) {
      setError("Failed to fetch profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  if (loading) return <p>Loading profiles...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="profile-list">
        <h1 className="heading">User Profiles</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((profile) => (
            <div key={profile.id} className="p-4 border rounded-lg shadow"> 
              <img
                src={profile.avatar_url || "https://via.placeholder.com/150"}
                alt={`${profile.full_name}'s avatar`}
                className="w-24 h-24 rounded-full mx-auto"
              />
              <h2 className="text-xl font-semibold mt-2 text-center">{profile.full_name}</h2>
              <p className="text-sm text-gray-600 text-center">{profile.bio || "No bio available"}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Profiles;

