import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BEARER_TOKEN = import.meta.env.VITE_TMDB_BEARER_TOKEN;

const MovieModal = ({ movie, isOpen, onClose, isInSavedList, onToggleSaved }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [streamingProviders, setStreamingProviders] = useState(null);
  const [providersLoading, setProvidersLoading] = useState(false);

  // Fetch streaming providers when modal opens
  useEffect(() => {
    const fetchStreamingProviders = async () => {
      if (!movie || !TMDB_BEARER_TOKEN) return;

      setProvidersLoading(true);
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/watch/providers`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_BEARER_TOKEN}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          // Get US providers (you can change 'US' to other regions if needed)
          setStreamingProviders(data.results?.US || null);
        }
      } catch (error) {
        console.error('Error fetching streaming providers:', error);
      } finally {
        setProvidersLoading(false);
      }
    };

    if (isOpen && movie) {
      fetchStreamingProviders();
    }
  }, [movie, isOpen]);

  if (!isOpen || !movie) return null;

  const handleToggleSaved = async () => {
    setIsLoading(true);
    try {
      await onToggleSaved(movie.id, isInSavedList);
    } catch (error) {
      console.error('Error toggling saved movie:', error);
      alert('Failed to update saved movies');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
          >
            ×
          </button>
          
          {/* Modal content */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Movie poster */}
              <div className="flex-shrink-0">
                {movie.poster_path ? (
                  <img
                    src={`${IMAGE_BASE}${movie.poster_path}`}
                    alt={movie.title}
                    className="w-48 h-72 object-cover rounded-lg mx-auto"
                  />
                ) : (
                  <div className="w-48 h-72 bg-gray-300 flex items-center justify-center text-gray-600 rounded-lg mx-auto">
                    No Image
                  </div>
                )}
              </div>
              
              {/* Movie details */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{movie.title}</h2>
                
                <div className="mb-4">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="text-gray-600 ml-1">{movie.vote_average?.toFixed(1)}/10</span>
                  <span className="text-gray-500 ml-2">({movie.vote_count} votes)</span>
                </div>
                
                <div className="mb-4">
                  <span className="text-gray-600 font-medium">Release Date: </span>
                  <span className="text-gray-800">{movie.release_date}</span>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Synopsis</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {movie.overview || "No synopsis available."}
                  </p>
                </div>

                {/* Streaming Providers */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Where to Watch</h3>
                  {providersLoading ? (
                    <p className="text-gray-500">Loading streaming info...</p>
                  ) : streamingProviders ? (
                    <div className="max-h-48 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {/* Streaming/Subscription services */}
                      {streamingProviders.flatrate && streamingProviders.flatrate.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">Stream:</p>
                          <div className="flex flex-wrap gap-2">
                            {streamingProviders.flatrate.map((provider) => (
                              <div key={provider.provider_id} className="flex items-center bg-green-50 rounded-lg px-3 py-2 border border-green-200">
                                <img
                                  src={`${IMAGE_BASE}${provider.logo_path}`}
                                  alt={provider.provider_name}
                                  className="w-6 h-6 rounded mr-2"
                                />
                                <span className="text-sm font-medium text-green-800">{provider.provider_name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Rent options */}
                      {streamingProviders.rent && streamingProviders.rent.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">Rent:</p>
                          <div className="flex flex-wrap gap-2">
                            {streamingProviders.rent.map((provider) => (
                              <div key={provider.provider_id} className="flex items-center bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
                                <img
                                  src={`${IMAGE_BASE}${provider.logo_path}`}
                                  alt={provider.provider_name}
                                  className="w-6 h-6 rounded mr-2"
                                />
                                <span className="text-sm font-medium text-blue-800">{provider.provider_name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Buy options */}
                      {streamingProviders.buy && streamingProviders.buy.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">Buy:</p>
                          <div className="flex flex-wrap gap-2">
                            {streamingProviders.buy.map((provider) => (
                              <div key={provider.provider_id} className="flex items-center bg-purple-50 rounded-lg px-3 py-2 border border-purple-200">
                                <img
                                  src={`${IMAGE_BASE}${provider.logo_path}`}
                                  alt={provider.provider_name}
                                  className="w-6 h-6 rounded mr-2"
                                />
                                <span className="text-sm font-medium text-purple-800">{provider.provider_name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* No providers available */}
                      {(!streamingProviders.flatrate || streamingProviders.flatrate.length === 0) &&
                       (!streamingProviders.rent || streamingProviders.rent.length === 0) &&
                       (!streamingProviders.buy || streamingProviders.buy.length === 0) && (
                        <p className="text-gray-500">No streaming information available for this movie.</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No streaming information available for this movie.</p>
                  )}
                </div>

                {/* Add/Remove Button */}
                <div className="mt-6">
                  <button
                    onClick={handleToggleSaved}
                    disabled={isLoading}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      isInSavedList
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading 
                      ? 'Loading...' 
                      : isInSavedList 
                        ? 'Remove from List' 
                        : 'Add to List'
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

MovieModal.propTypes = {
  movie: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isInSavedList: PropTypes.bool,
  onToggleSaved: PropTypes.func
};

export default MovieModal;