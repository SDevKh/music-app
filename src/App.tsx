import { Routes, Route, Link } from 'react-router-dom';
import { Music } from 'lucide-react';
import Home from './Home';
import Categories from './categories';
import About from './about';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className=" p-2 rounded-lg">
                <img src="pics\logo.png" alt="Logo" className="h-20 w-20" />
              </div>
              <div>
                <h1 className="text-xl font-bold">ADIT</h1>
                <p className="text-xs text-gray-400">Free Music for Creators</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">Browse</Link>
              <Link to="/categories" className="text-gray-300 hover:text-white transition-colors">Categories</Link>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Licensing</a>
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/about" element={<About />} />
      </Routes>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
                  <Music className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold">SoundLibrary</span>
              </div>
              <p className="text-gray-400 text-sm">
                Free, high-quality music for content creators, filmmakers, and editors.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Library</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Browse All</a></li>
                <li><a href="#" className="hover:text-white transition-colors">New Releases</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Popular</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Collections</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Licensing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Attribution</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Submit Music</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 SoundLibrary. All music provided under Creative Commons, Public Domain, or Royalty-Free licenses.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;