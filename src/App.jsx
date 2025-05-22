import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Posts from './pages/Posts';
import MyPosts from './pages/MyPosts';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './ProtectedRoute';
import Profiles from './pages/Profiles';
import ChatApp from './pages/Chat';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        
        {/* Protected route wrapping Home */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/posts" element={<ProtectedRoute><Posts /></ProtectedRoute>} />
        <Route path="/myposts" element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
        <Route path="/profiles" element={<ProtectedRoute><Profiles/></ProtectedRoute>} />
        <Route path='/chat' element={<ProtectedRoute><ChatApp/></ProtectedRoute>}/>
      </Routes>
    </Router>
  );
}

export default App;