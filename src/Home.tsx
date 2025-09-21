import React, { useState, useRef, useEffect } from 'react';
import { Search, Download, Play, Pause, Filter, Music, Volume2, Clock, Tag, Heart, Share2 } from 'lucide-react';
import { supabase } from './supabaseClient';

interface Track {
  id: number;
  title: string;
  artist: string | null;
  genre: string | null; // Mapped from 'category' in DB
  duration: string;
  tempo: number | null;
  mood: string | null;
  license: string | null;
  audioUrl: string; // Mapped from 'url' in DB
  artwork: string | null;
  tags: string[];
  downloads: number;
  likes: number | null;
}

const genres = ["All", "Ambient", "Hip Hop", "Corporate", "Indie Folk", "Electronic", "Cinematic"];
const moods = ["All", "Relaxed", "Energetic", "Professional", "Melancholic", "Futuristic", "Epic"];

function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedMood, setSelectedMood] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [downloadingTrackId, setDownloadingTrackId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);

  

  useEffect(() => {
    let filtered = tracks;

    if (searchTerm) {
      filtered = filtered.filter(track =>
        track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedGenre !== "All") {
      filtered = filtered.filter(track => track.genre === selectedGenre);
    }

    if (selectedMood !== "All") {
      filtered = filtered.filter(track => track.mood === selectedMood);
    }

    setFilteredTracks(filtered);
  }, [searchTerm, selectedGenre, selectedMood, tracks]);

  const handlePlayPause = (track: Track) => {
        if (playingTrackId === track.id) {
            if (isPlaying) {
                audioRef.current?.pause();
                setIsPlaying(false);
            } else {
                audioRef.current?.play();
                setIsPlaying(true);
            }
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            const newAudio = new Audio(track.audioUrl);
            audioRef.current = newAudio;
            setPlayingTrackId(track.id);
            setIsPlaying(true);
            
            newAudio.play().catch(error => {
                console.error("Error playing audio:", error);
                setIsPlaying(false);
                setPlayingTrackId(null);
            });

            newAudio.onended = () => {
                setIsPlaying(false);
                setPlayingTrackId(null);
            };
        }
    };

  const handleLike = (trackId: number) => {
    // In a real app, this would update the like count in the database
    alert(`Liked track ${trackId}! (This is a placeholder)`);
  };

  const fetchTracks = async () => {
          const { data, error } = await supabase
              .from('tracks')
              .select('*')
              .order('created_at', { ascending: false }); // Show newest first
  
          if (error) {
              console.error('Error fetching tracks:', error);
              alert(`Error fetching tracks: ${error.message}`);
          } else if (data) {
              // Map database fields to our component's Track interface
              const mappedTracks: Track[] = data.map((dbTrack: any) => ({
                id: dbTrack.id,
                title: dbTrack.title,
                artist: dbTrack.artist,
                genre: dbTrack.category, // Map 'category' from DB to 'genre'
                duration: dbTrack.duration,
                audioUrl: dbTrack.url, // Map 'url' from DB to 'audioUrl'
                downloads: dbTrack.downloads,
                // Provide default/placeholder values for fields not in the DB
                tempo: 120,
                mood: 'Upbeat',
                license: 'Royalty Free',
                artwork: `https://picsum.photos/seed/${dbTrack.id}/300/300`,
                tags: ['music', 'audio'],
                likes: 0,
              }));
              setTracks(mappedTracks);
          }
      };
      useEffect(() => {
              // This effect handles cleanup when the component is unmounted.
              const audio = audioRef.current;
              return () => {
                  audio?.pause();
              };
          }, []);
      
          useEffect(() => {
              fetchTracks();
          }, []);

  const handleDownload = async (track: Track) => {
        setDownloadingTrackId(track.id);
        try {
            const response = await fetch(track.audioUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch track: ${response.statusText}`);
            }
            const blob = await response.blob();

            // Create a temporary URL for the blob
            const blobUrl = window.URL.createObjectURL(blob);

            // Create a temporary anchor element to trigger the download
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${track.title}.mp3`; // Suggest a filename
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);

        } catch (error) {
            console.error("Download failed:", error);
            alert("Sorry, the download could not be completed.");
        } finally {
            setDownloadingTrackId(null);
        }
    };

  return (
    <>
      {/* Hero Section */}
      <div className="relative flex items-center justify-center"> 
        <div className="relative w-full">
          <img src="/pics/pexels-pixabay-257904.jpg" alt="Secure" className="w-full object-cover opacity-25" />
          <div className='absolute inset-0 flex flex-col items-center justify-center text-center px-4'>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Your one stop solution for every edit</h2>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl">Discover high-quality, music tracks for your projects. Perfect for creators, filmmakers, and editors.</p>
            <button className="bg-orange-600 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg mt-32 transition-all duration-200">Explore</button> 
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search tracks, artists, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mood</label>
                <select
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {moods.map(mood => (
                    <option key={mood} value={mood}>{mood}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">{filteredTracks.length}</div>
            <div className="text-gray-400 text-sm">Available Tracks</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">100%</div>
            <div className="text-gray-400 text-sm">Free</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-500">24/7</div>
            <div className="text-gray-400 text-sm">Access</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">HD</div>
            <div className="text-gray-400 text-sm">Quality</div>
          </div>
        </div>
      </div>

      {/* Track Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTracks.map((track) => (
            <div key={track.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 border border-gray-700 hover:border-purple-500/50 group">
              {/* Artwork */}
              <div className="relative overflow-hidden">
                <img
                  src={track.artwork || `https://picsum.photos/seed/${track.id}/300/300`}
                  alt={track.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    track.license === 'Creative Commons' ? 'bg-green-500/20 text-green-400' :
                    track.license === 'Royalty Free' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {track.license}
                  </span>
                </div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handlePlayPause(track)}
                    className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-3 transform hover:scale-110 transition-all duration-200 shadow-lg"
                  >
                    {playingTrackId === track.id && isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6 ml-1" />
                    )}
                  </button>
                </div>
              </div>

              {/* Track Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors">{track.title}</h3>
                    <p className="text-gray-400 text-sm">{track.artist}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {track.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Track Details */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{track.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Volume2 className="h-4 w-4" />
                    <span>{track.tempo || 'N/A'} BPM</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Tag className="h-4 w-4" />
                    <span>{track.genre || 'Misc'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Music className="h-4 w-4" />
                    <span>{track.mood || 'General'}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                  <span>{track.downloads.toLocaleString()} downloads</span>
                  <span>{track.likes || 0} likes</span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownload(track)}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 group"
                  >
                    <Download className="h-4 w-4 group-hover:animate-bounce" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => handleLike(track.id)}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-red-400 p-2 rounded-lg transition-all duration-200"
                  >
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-blue-400 p-2 rounded-lg transition-all duration-200">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTracks.length === 0 && (
          <div className="text-center py-12">
            <Music className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400">No tracks found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;