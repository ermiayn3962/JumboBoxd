import { useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import MovieCarousel from '../components/movieCarousel';
import NavBar from '../components/navBar';
import { apiCall } from '../utils/general';

const TMDB_BEARER_TOKEN = import.meta.env.VITE_TMDB_BEARER_TOKEN; 

function HomePage() {
    const { user } = useUser();
    const [savedMovieIds, setSavedMovieIds] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);

    // Fetch saved movie IDs when user changes
    useEffect(() => {
        const fetchSavedMovieIds = async () => {
            try {
                const savedMoviesData = await apiCall(`movie/saved/${user.id}`, 'GET');
                setSavedMovieIds(savedMoviesData.savedMovies || []);
            } catch (error) {
                console.error('Error fetching saved movie IDs:', error);
                setSavedMovieIds([]);
            }
        };

        fetchSavedMovieIds();
    }, [user]);

    const fetchPopularMovies = async () => {
        try {
            if (!TMDB_BEARER_TOKEN) {
                console.error('TMDB Bearer token is missing');
                return [];
            }

            const res = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${TMDB_BEARER_TOKEN}`
                }
            });

            if (!res.ok) {
                console.error('TMDB API error:', res.status, res.statusText);
                return [];
            }

            const data = await res.json();
            return data.results || [];
        } catch (error) {
            console.error('Error fetching movies:', error);
            return [];
        }
    };

    const fetchRandomMovies = async () => {
        try {
            if (!TMDB_BEARER_TOKEN) {
                console.error('TMDB Bearer token is missing');
                return [];
            }

            // Generate a random page number between 1 and 500 (TMDB limit)
            const randomPage = Math.floor(Math.random() * 500) + 1;

            const res = await fetch(`https://api.themoviedb.org/3/discover/movie?language=en-US&page=${randomPage}&sort_by=popularity.desc&include_adult=false`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${TMDB_BEARER_TOKEN}`
                }
            });

            if (!res.ok) {
                console.error('TMDB API error:', res.status, res.statusText);
                return [];
            }

            const data = await res.json();
            return data.results || [];
        } catch (error) {
            console.error('Error fetching random movies:', error);
            return [];
        }
    };

    const fetchSavedMovies = async () => {
        try {
            const clerkID = user.id;
            
            // Get saved movie IDs from your backend
            const savedMoviesData = await apiCall(`movie/saved/${clerkID}`, 'GET');
            const movieIDs = savedMoviesData.savedMovies || [];
            
            if (movieIDs.length === 0) {
                return [];
            }
            
            // Fetch full movie details from TMDB for each saved movie ID
            const moviePromises = movieIDs.map(async (movieID) => {
                try {
                    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?language=en-US`, {
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${TMDB_BEARER_TOKEN}`
                        }
                    });
                    return await res.json();
                } catch (error) {
                    console.error(`Error fetching movie ${movieID}:`, error);
                    return null;
                }
            });
            
            const movies = await Promise.all(moviePromises);
            return movies.filter(movie => movie !== null); // Filter out failed requests
            
        } catch (error) {
            console.error('Error fetching saved movies:', error);
            return [];
        }
    };

    const handleToggleSaved = async (movieId, isCurrentlySaved) => {
        try {
            const endpoint = isCurrentlySaved ? 'movie/remove' : 'movie/add';
            const body = {
                clerkID: user.id,
                movieID: movieId
            };

            await apiCall(endpoint, 'PUT', body);

            // Update local state
            if (isCurrentlySaved) {
                setSavedMovieIds(prev => prev.filter(id => id !== movieId));
            } else {
                setSavedMovieIds(prev => [...prev, movieId]);
            }

            // Force refresh both carousels
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error('Error toggling saved movie:', error);
            throw error; // Re-throw so the modal can handle the error
        }
    };

    return (
        <div>
            <NavBar />
            <div className="pt-4">
                <MovieCarousel 
                    key={`saved-${refreshKey}`}
                    fetchMovies={fetchSavedMovies} 
                    title="My Saved Movies" 
                    savedMovieIds={savedMovieIds}
                    onToggleSaved={handleToggleSaved}
                />
                <MovieCarousel 
                    key={`popular-${refreshKey}`}
                    fetchMovies={fetchPopularMovies} 
                    title="Popular Movies" 
                    savedMovieIds={savedMovieIds}
                    onToggleSaved={handleToggleSaved}
                />
                <MovieCarousel 
                    key={`discover-${refreshKey}`}
                    fetchMovies={fetchRandomMovies} 
                    title="Discover Movies" 
                    savedMovieIds={savedMovieIds}
                    onToggleSaved={handleToggleSaved}
                    infiniteScroll={true}
                />
            </div>
        </div>
    );
}

export default HomePage;