import { useState, useEffect } from 'react';
import { Calendar, User, Tag, Clock, Eye } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  views: number;
  featured: boolean;
}

const samplePosts: BlogPost[] = [
  {
    id: 1,
    title: "The Evolution of Music Production",
    excerpt: "How technology transformed music creation in the digital age.",
    author: "Alex Johnson",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "Technology",
    tags: ["Music Production", "Digital", "Technology"],
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop",
    views: 1247,
    featured: true
  },
  {
    id: 2,
    title: "Building Your Home Studio",
    excerpt: "Everything you need to know about setting up your first recording studio.",
    author: "Sarah Chen",
    date: "2024-01-10",
    readTime: "8 min read",
    category: "Tutorial",
    tags: ["Home Studio", "Recording", "Equipment"],
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=400&fit=crop",
    views: 892,
    featured: false
  }
];

function Blog() {
  const [posts] = useState<BlogPost[]>(samplePosts);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);

  const categories = ['All', 'Technology', 'Tutorial', 'Legal', 'Reviews'];

  useEffect(() => {
    const featured = posts.find(post => post.featured);
    setFeaturedPost(featured || posts[0]);
  }, [posts]);

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Music Blog
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Insights, tutorials, and stories from the world of music production
            </p>
          </div>
        </div>
      </div>

      {featuredPost && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center mb-4">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                  <span className="ml-3 text-gray-400 text-sm">{featuredPost.category}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-300 mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-400">
                  <User className="h-4 w-4 mr-2" />
                  <span className="mr-4">{featuredPost.author}</span>
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="mr-4">{new Date(featuredPost.date).toLocaleDateString()}</span>
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{featuredPost.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <article
              key={post.id}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 border border-gray-700 hover:border-purple-500/50 cursor-pointer"
            >
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-gray-900/80 backdrop-blur text-white px-3 py-1 rounded-full text-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">
                  {post.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  {post.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{post.views}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <span className="text-sm text-gray-400">{post.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Blog;