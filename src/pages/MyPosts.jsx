// import Navbar from '../components/Navbar';

// export default function MyPosts() {
//   const myPosts = [
//     {
//       id: 1,
//       content: 'Working on a new project using Vite and React. The developer experience is amazing!',
//       timeAgo: '1 day ago'
//     },
//     {
//       id: 2,
//       content: 'Just learned about React hooks. They make state management so much easier!',
//       timeAgo: '3 days ago'
//     }
//   ];


//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Navbar />
//       <div className="container mx-auto px-4 py-8">
//         <h2 className="text-2xl font-bold mb-6">My Posts</h2>
//         <div className="grid gap-6">
//           {myPosts.map(post => (
//             <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
//               <div className="flex items-center mb-4">
//                 <img
//                   src="https://api.dicebear.com/7.x/avataaars/svg"
//                   alt="User"
//                   className="w-10 h-10 rounded-full mr-4"
//                 />
//                 <div>
//                   <h3 className="font-bold">My Post</h3>
//                   <p className="text-gray-500 text-sm">{post.timeAgo}</p>
//                 </div>
//               </div>
//               <p className="text-gray-700 mb-4">{post.content}</p>
//               <div className="flex items-center text-gray-500 text-sm">
//                 <button className="mr-4 hover:text-blue-500">Like</button>
//                 <button className="hover:text-blue-500">Comment</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

export default function MyPosts() {
  const [myPosts, setMyPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [newContent, setNewContent] = useState('');

  // Fetch user's posts from the API
  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/my-posts/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Add the access token here
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setMyPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchMyPosts();
  }, []);

  // Handle edit post
  const handleEdit = (post) => {
    setIsEditing(true);
    setCurrentPost(post);
    setNewContent(post.text);
  };

  // Handle update post
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!newContent) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/my-posts/${currentPost.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ text: newContent }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setMyPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
        );
        setIsEditing(false);
        setCurrentPost(null);
        setNewContent('');
      } else {
        console.error('Error updating post:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  // Handle delete post
  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/my-posts/${postId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.ok) {
        setMyPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } else {
        console.error('Error deleting post:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">My Posts</h2>
        
        {isEditing ? (
          <form onSubmit={handleUpdate} className="mb-6">
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full p-2 border rounded mb-2"
              rows="3"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Update </button>
            <button type="button" onClick={() => setIsEditing(false)} className="ml-2 bg-gray-300 text-black px-4 py-2 rounded">
              Cancel
            </button>
          </form>
        ) : null}

        <div className="grid gap-6">
          {myPosts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg"
                  alt="User "
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-bold">{post.username}</h3>
                  <p className="text-gray-500 text-sm">{post.timeAgo}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{post.text}</p>
              <div className="flex items-center text-gray-500 text-sm">
                <button onClick={() => handleEdit(post)} className="mr-4 hover:text-blue-500">Edit</button>
                <button onClick={() => handleDelete(post.id)} className="hover:text-blue-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}