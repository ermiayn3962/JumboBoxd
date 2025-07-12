import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import MovieModal from './movieModal';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const MovieCarousel = ({ fetchMovies, title = "Movies", savedMovieIds = [], onToggleSaved, infiniteScroll = false }) => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (fetchMovies) {
      setIsLoading(true);
      fetchMovies().then(movieData => {
        setMovies(movieData);
        setIsLoading(false);
      }).catch(error => {
        console.error('Error fetching movies:', error);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [fetchMovies]);

  // Load more movies for infinite scroll
  const loadMoreMovies = useCallback(async () => {
    if (!infiniteScroll || isLoadingMore || !fetchMovies) return;

    setIsLoadingMore(true);
    try {
      const newMovies = await fetchMovies();
      setMovies(prev => {
        // Filter out duplicates based on movie ID
        const existingIds = new Set(prev.map(movie => movie.id));
        const uniqueNewMovies = newMovies.filter(movie => !existingIds.has(movie.id));
        return [...prev, ...uniqueNewMovies];
      });
    } catch (error) {
      console.error('Error loading more movies:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [fetchMovies, infiniteScroll, isLoadingMore]);

  // Handle scroll for infinite loading
  useEffect(() => {
    if (!infiniteScroll) return;

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const { scrollLeft, scrollWidth, clientWidth } = container;
      const threshold = 200; // Load more when 200px from the end

      if (scrollLeft + clientWidth >= scrollWidth - threshold) {
        loadMoreMovies();
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [infiniteScroll, loadMoreMovies]);

  const openModal = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{title}</h2>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading movies...</p>
      ) : movies.length === 0 ? (
        <p className="text-center text-gray-500">List is empty</p>
      ) : (
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto whitespace-nowrap scrollbar-hide touch-auto snap-x snap-mandatory"
        >
          <div className="inline-flex space-x-4 px-2">
            {movies.map(movie => (
              <div key={movie.id} className="w-60 flex-shrink-0 snap-start">
                <div 
                  className="rounded-xl overflow-hidden shadow-md bg-white cursor-pointer hover:shadow-lg transition-shadow duration-300"
                  onClick={() => openModal(movie)}
                >
                  {movie.poster_path ? (
                    <img
                      src={`${IMAGE_BASE}${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-80 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-80 bg-gray-300 flex items-center justify-center text-gray-600">
                      No Image
                    </div>
                  )}
                  <div className="p-2 text-center bg-gray-800 text-white font-medium text-lg truncate">
                    {movie.title}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading indicator for infinite scroll */}
            {infiniteScroll && isLoadingMore && (
              <div className="w-60 flex-shrink-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                  Loading more...
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Movie Modal */}
      <MovieModal 
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={closeModal}
        isInSavedList={selectedMovie ? savedMovieIds.includes(selectedMovie.id) : false}
        onToggleSaved={onToggleSaved}
      />
    </div>
  );
};

MovieCarousel.propTypes = {
  fetchMovies: PropTypes.func,
  title: PropTypes.string,
  savedMovieIds: PropTypes.array,
  onToggleSaved: PropTypes.func,
  infiniteScroll: PropTypes.bool
};

export default MovieCarousel;