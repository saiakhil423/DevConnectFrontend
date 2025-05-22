import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to DevConnect</h1>
          <p className="text-xl text-gray-600">
            Connect with developers, share your knowledge, and grow together
          </p>
        </div>
      </div>
    </div>
  );
}