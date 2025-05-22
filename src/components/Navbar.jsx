import { Link } from 'react-router-dom';
import { FaSearch, FaSignOutAlt, FaUser } from 'react-icons/fa';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">DevConnect</Link>
        
        <div className="flex items-center space-x-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-700 px-4 py-2 rounded-lg text-white w-64 focus:outline-none"
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
          
          <Link to="/posts" className="hover:text-gray-300">Posts</Link>
          <Link to="/chat" className="hover:text-gray-300">Chats</Link>
          <Link to="/myposts" className="hover:text-gray-300">My Posts</Link>
          <Link to="/profile" className="hover:text-gray-300">
            <FaUser />
          </Link>
          <Link to="/profiles" className="hover:text-gray-300">
            Profiles
          </Link>
          <Link to="/login" className="hover:text-gray-300">
            <FaSignOutAlt />
          </Link>
        </div>
      </div>
    </nav>
  );
}