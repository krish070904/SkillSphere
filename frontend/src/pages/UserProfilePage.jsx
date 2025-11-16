import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axios.jsx";

const UserProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFollowing, setisFollowing] = useState(false);
  const { user, token } = useContext(AuthContext);
  const { id } = useParams();
  const profileId = id || user?.id;

  useEffect(() => {
    if (!profileId) return;

    //using it for fetching profile by id
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/users/${profileId}`);

        setProfile(res.data.user);
        setPosts(res.data.posts);
        setisFollowing(res.data.isFollowing);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  const handleFollow = async () => {
    setisFollowing((prev) => !prev);
    try {
      await axiosInstance.post(`/users/${profileId}/follow`);
    } catch (err) {
      console.error(err);
      setisFollowing((prev) => !prev);
    }
  };

  if (loading) return <p>Loading profile...</p>;

  if (!profile) return <p>Profile not found</p>;

  return (
    <div>
      <h1>USerProfilePAge</h1>

      <div>
        <h1>{profile.name}</h1>
        <p>{profile.email}</p>
        {profileId !== user._id && (
          <button onClick={handleFollow}>
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}

        <h2>Posts</h2>
        {posts.length === 0 ? (
          <p>No posts yet</p>
        ) : (
          posts.map((post) => (
            <div key={post._id}>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
