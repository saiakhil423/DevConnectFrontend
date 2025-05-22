import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [followStatus, setFollowStatus] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://127.0.0.1:8000/posts/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(response.data);
        console.log("Fetched posts:", response.data); // Log the posts data

        // Check follow status for each user in the posts
        response.data.forEach((post) => {
          checkFollowStatus(post.userId); // Ensure post.userId is defined
        });

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch posts. Please try again later.");
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const checkFollowStatus = async (userId) => {
    if (!userId) {
      console.error("Invalid user ID:", userId);
      return; // Exit if userId is not valid
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `http://127.0.0.1:8000/follow/status/?followed=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFollowStatus((prev) => ({
        ...prev,
        [userId]: response.data.is_following,
      }));
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const handleFollow = async (userId) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("No access token found. Please log in.");
      alert("You must be logged in to follow users.");
      return;
    }

    if (!userId) {
      console.error("Invalid user ID:", userId);
      alert("Invalid user ID. Please try again.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/follow/",
        { followed: userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Followed successfully:", response.data);
      alert("Followed successfully!");
      setFollowStatus((prev) => ({ ...prev, [userId]: true }));
    } catch (error) {
      console.error("Error following user:", error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.error || "Could not follow user"}`);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://127.0.0.1:8000/follow/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFollowStatus((prev) => ({ ...prev, [userId]: false }));
      alert("Unfollowed successfully!");
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostContent) return;

    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch("http://127.0.0.1:8000/posts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newPostContent }),
      });

      if (response.ok) {
        const newPost = await response.json();
        setPosts((prevPosts) => [...prevPosts, newPost]);
        setNewPostContent("");
      } else {
        console.error("Error posting new post:", response.statusText);
      }
    } catch (error) {
      console.error("Error posting new post:", error);
    }
  };

  const fetchCommentsForPost = async (postId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `http://127.0.0.1:8000/posts/${postId}/comments/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, comments: response.data } : post
        )
      );
    } catch (err) {
      alert("Failed to fetch comments. Please try again later.");
    }
  };

  const addComment = async (postId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const commentText = commentInputs[postId] || "";
              
      if (!commentText.trim()) {
        alert("Comment cannot be empty.");
        return;
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/comments/${postId}/add/`,
        {
          user: 1, // Assuming the user is logged in and the user ID is 1 for now
          post: postId,
          text: commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...(post.comments || []), response.data] }
            : post
        )
      );

      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      alert("Failed to add comment. Please try again later.");
    }
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <br />

      <div className="grid gap-6 p-6 bg-gray-100">
        <form onSubmit={handlePostSubmit} className="mb-6">
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-2 border rounded mb-2"
            rows="3"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Post
          </button>
        </form>
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
            <div className="flex items-center mb-4">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg"
                alt="User  Avatar"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h3 className="font-bold text-lg">{post.username}</h3>
                <p className="text-gray-500 text-sm">{post.timeAgo}</p>
              </div>
            </div>

            <p className="text-gray-700 text-base mb-4">{post.text}</p>

            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <button className="hover:text-blue-500 transition-colors">Like</button>
              {followStatus[post.userId] ? (
                <button onClick={() => handleUnfollow(post.userId)} className="text-red-500 hover:text-red-700 transition-colors">
                  Unfollow
                </button>
              ) : (
                <button onClick={() => {
                  const userId = post.userId;
                  if (!userId) {
                    console.error("Invalid user ID:", userId);
                    alert("Invalid user ID. Please try again.");
                    return;
                  }
                  handleFollow(userId);
                }}>
                  Follow
                </button>
              )}
            </div>

            <button onClick={() => fetchCommentsForPost(post.id)} className="mt-4 text-sm text-blue-500 hover:underline">
              View Comments
            </button>

            {post.comments && (
              <div className="mt-4 space-y-3">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="p-3 bg-gray-50 rounded-md border-l-4 border-blue-500 shadow-sm">
                    <p className="text-gray-700">{comment.text}</p>
                    <p className="text-xs text-gray-500">- {comment.username}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentInputs[post.id] || ""}
                onChange={(e) =>
                  setCommentInputs((prev) => ({
                    ...prev,
                    [post.id]: e.target.value,
                  }))
                }
                className="w-full border rounded-md p-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button onClick={() => addComment(post.id)} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                Add Comment
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Posts;