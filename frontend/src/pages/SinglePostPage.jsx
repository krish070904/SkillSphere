import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import axiosInstance from "../api/axios.jsx";

const SinglePostPage = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

 
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/posts/${id}`);
       
        setPost({ ...res.data, comments: res.data.comments || [] });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setCommentLoading(true);

    try {
      
      const tempComment = {
        _id: Date.now(),
        text: commentText,
        user: user,
      };
      setPost((prev) => ({
        ...prev,
        comments: [...prev.comments, tempComment],
      }));
      setCommentText("");

      
      const res = await axiosInstance.post(
        `/posts/${id}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

       
      setPost((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c._id === tempComment._id ? res.data : c
        ),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) return <p>Loading post...</p>;
  if (!post) return <p>Post not found</p>;

  const comments = post.comments || [];

  return (
    <div>
      <h1>SinglePostPage</h1>
      <h2>{post.title}</h2>
      <p>{post.description}</p>
      <p>Category: {post.category}</p>
      <p>By: {post.createdBy?.name || "Unknown"}</p>

      <h3>Comments</h3>
      {comments.length === 0 ? (
        <p>No comments yet</p>
      ) : (
        comments.map((c) => (
          <div key={c._id} style={{ marginBottom: "8px" }}>
            <b>{c.user?.name || "Unknown"}</b>: {c.text}
          </div>
        ))
      )}

      {user && (
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            required
          />
          <br />
          <button type="submit" disabled={commentLoading}>
            {commentLoading ? "Adding..." : "Add Comment"}
          </button>
        </form>
      )}
    </div>
  );
};

export default SinglePostPage;
