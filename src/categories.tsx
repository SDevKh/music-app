import React, { useState, useRef, useEffect } from 'react';
import { Search, Download, Play, Pause } from 'lucide-react';
import { supabase } from './supabaseClient';

interface Track {
    id: number;
    title: string;
    artist: string;
    category: string;
    duration: string;
    downloads: number;
    url: string;
}

const categories = ['All', 'Cinematic', 'Classical', 'Pop', 'Rock', 'Jazz'];
const sampleTracks: Track[] = [
    { id: 1, title: 'Epic Adventure', artist: 'John Doe', category: 'Cinematic', duration: '3:45', downloads: 120, url: '/tracks/epic-adventure.mp3' },
    { id: 2, title: 'Calm Piano', artist: 'Jane Smith', category: 'Classical', duration: '2:30', downloads: 85, url: '/tracks/calm-piano.mp3' },
    { id: 3, title: 'Upbeat Pop', artist: 'The Beats', category: 'Pop', duration: '4:00', downloads: 200, url: '/tracks/upbeat-pop.mp3' },
    { id: 4, title: 'Rock Anthem', artist: 'Rockers', category: 'Rock', duration: '3:15', downloads: 150, url: '/tracks/rock-anthem.mp3' },
    { id: 5, title: 'Jazz Vibes', artist: 'Smooth Jazz Band', category: 'Jazz', duration: '5:20', downloads: 95, url: '/tracks/jazz-vibes.mp3' },
];

function Categories() {    
    const [tracks, setTracks] = useState<Track[]>(sampleTracks);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [uploading, setUploading] = useState(false);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [downloadingTrackId, setDownloadingTrackId] = useState<number | null>(null);

    const fetchTracks = async () => {
        const { data, error } = await supabase
            .from('tracks')
            .select('*')
            .order('created_at', { ascending: false }); // Show newest first

        if (error) {
            console.error('Error fetching tracks:', error);
            alert(`Error fetching tracks: ${error.message}`);
        } else if (data) {
            setTracks(data);
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

    const filteredTracks = tracks.filter(track => {
        const matchesCategory = selectedCategory === 'All' || track.category === selectedCategory;
        const matchesSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase()) || track.artist.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

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
            const newAudio = new Audio(track.url);
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
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };
    const handleClearSearch = () => {
        setSearchTerm('');
    };
    const handleClearFilters = () => {
        setSelectedCategory('All');
        setSearchTerm('');
    };    
    const handleDownload = async (track: Track) => {
        setDownloadingTrackId(track.id);
        try {
            const response = await fetch(track.url);
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

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileToUpload(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!fileToUpload) {
            alert("Please select a file to upload.");
            return;
        }

        try {
            setUploading(true);
            const fileName = `${Date.now()}-${fileToUpload.name}`;
            const { data, error } = await supabase.storage
                .from('music-tracks') // The bucket you created
                .upload(fileName, fileToUpload, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (error) {
                throw error;
            }

            if (data) {
                // Get the public URL for the newly uploaded file
                const { data: urlData } = supabase.storage
                    .from('music-tracks')
                    .getPublicUrl(data.path);

                if (urlData) {
                    const newTrackForDb = {
                        title: fileToUpload.name.replace(/\.[^/.]+$/, ""), // Use filename as title
                        artist: 'Uploaded Artist', // Placeholder
                        category: 'Uploaded', // Placeholder
                        duration: '?:??', // Placeholder, would need a library to read metadata
                        downloads: 0,
                        url: urlData.publicUrl, // Use the correct public URL
                    };

                    const { error: insertError } = await supabase
                        .from('tracks')
                        .insert([newTrackForDb]);

                    if (insertError) {
                        throw insertError;
                    }

                    // Refetch tracks from the database to include the new one
                    await fetchTracks();

                    alert(`File uploaded successfully and added to the list!`);
                } else {
                    alert(`File uploaded, but could not get public URL.`);
                }
            }

        } catch (error: any) {
            let errorMessage = `Error uploading file: ${error.message}`;
            if (error.message === 'Bucket not found') {
                errorMessage +=
                '\n\nPlease make sure you have created a bucket named "music-tracks" in your Supabase project and set it to public.';
            } else if (error.message.includes('security policy')) {
                errorMessage +=
                '\n\nThis is a permissions error. Please check that you have a Row Level Security (RLS) policy in place to allow uploads to the "music-tracks" bucket.';
            } else if (error.message.includes('violates row-level security policy for table "tracks"')) {
                errorMessage +=
                '\n\nThis is a database permissions error. Please check that you have a Row Level Security (RLS) policy in place to allow inserting into the "tracks" table.';
            }
            alert(errorMessage);
        } finally {
            setUploading(false);
            setFileToUpload(null);
            // Clear the file input
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white overflow-hidden">   
      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 w-full md:w-1/2">
            <div className="relative w-full">
              <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tracks, artists, or tags..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {searchTerm && (  
                <button
                  onClick={handleClearSearch}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                >
                  &#10005;
                </button>
              )}
            </div>
          </div>
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => handleClearFilters()}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                >
                    Clear Filters
                </button>  
                <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                >
                    {categories.map(category => (  
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row items-center gap-4">
            <h3 className="text-lg font-semibold text-white">Upload a new track</h3>
            <input
                id="file-upload"
                type="file"
                accept="audio/mp3,audio/wav"
                onChange={handleFileSelected}
                className="flex-grow text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            <button
                onClick={handleUpload}
                disabled={uploading || !fileToUpload}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
      </div>
        {/* Track List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTracks.map(track => (
                    <div key={track.id} className="bg-gray-800 rounded-lg p-4 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold mb-1">{track.title}</h3>
                            <p className="text-sm text-gray-400 mb-2">by {track.artist}</p>
                            <p className="text-sm text-gray-400 mb-2">Category: {track.category}</p>
                            <p className="text-sm text-gray-400 mb-2">Duration: {track.duration}</p>
                            <p className="text-sm text-gray-400 mb-2">Downloads: {track.downloads}</p>
                        </div>  
                        <div className="mt-4 flex items-center justify-between">
                            <button
                                onClick={() => handlePlayPause(track)}
                                className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2"
                            >
                                {playingTrackId === track.id && isPlaying ? <Pause /> : <Play />}
                                <span>Play</span>
                            </button>
                            <button
                                onClick={() => handleDownload(track)}
                                disabled={downloadingTrackId === track.id}
                                className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
                            >
                                {downloadingTrackId === track.id ? (
                                    <span>Downloading...</span>
                                ) : (
                                    <><Download /><span>Download</span></>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
    );
}

export default Categories;