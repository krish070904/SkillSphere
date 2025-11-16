import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import axiosInstance from "../api/axios.jsx";

const FeedPage = () => {
  const { user, token } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch posts from backend
  const fetchPosts = async () => {
    if (!hasNextPage || !token) return;

    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.get(`/posts?page=${page}&limit=${limit}`);
      // Check if backend returned data correctly
      if (!res.data?.data || !Array.isArray(res.data.data)) {
        console.error("Invalid posts response:", res.data);
        setHasNextPage(false);
        return;
      }

      const newPosts = res.data.data.map((p) => ({
        ...p,
        likedByUser: p.likes?.includes(user.id),
      }));

      // Merge new posts and remove duplicates by _id
      setPosts((prev) => {
        const combined = [...prev, ...newPosts];
        const uniquePosts = Array.from(new Map(combined.map(p => [p._id, p])).values());
        return uniquePosts;
      });

      setHasNextPage(res.data.hasNextPage ?? false);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Run fetch when token is available
  useEffect(() => {
    if (token) fetchPosts();
  }, [token]);

  // Handle like button click
  const handleLike = async (postId) => {
    try {
      // Optimistic UI update
      setPosts(prev =>
        prev.map(p =>
          p._id === postId
            ? {
                ...p,
                likeCount: p.likedByUser ? p.likeCount - 1 : p.likeCount + 1,
                likedByUser: !p.likedByUser,
              }
            : p
        )
      );

      await axiosInstance.post(`/posts/${postId}/like`);
    } catch (err) {
      console.error(err);
      // Rollback in case of error
      setPosts(prev =>
        prev.map(p =>
          p._id === postId
            ? {
                ...p,
                likeCount: p.likedByUser ? p.likeCount - 1 : p.likeCount + 1,
                likedByUser: !p.likedByUser,
              }
            : p
        )
      );
      alert("Failed to like the post. Try again.");
    }
  };

  const PostCard = ({ post }) => (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
      <h2>{post.title}</h2>
      <p>{post.description}</p>
      <p>Category: {post.category}</p>
      <p>By: {post.createdBy.name}</p>
      <p>
        Likes: {post.likeCount} | Comments: {post.commentCount}
      </p>
      <button onClick={() => handleLike(post._id)}>
        {post.likedByUser ? "Unlike" : "Like"}
      </button>
      <button>View Comments</button>
    </div>
  );

  if (!token) return <p>Loading user data...</p>;

  return (
    <div>
      <h1>FeedPage</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {posts.length === 0 && !loading && <p>No posts yet</p>}

      {posts.map(post => <PostCard key={post._id} post={post} />)}

      {hasNextPage && !loading && (
        <button onClick={fetchPosts}>Load More</button>
      )}

      {loading && <p>Loading...</p>}
    </div>
  );
};

export default FeedPage;
