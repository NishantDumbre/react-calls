import React, { useEffect, useState, useCallback } from 'react';
import MovieForm from './components/MovieForm';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryTimeoutId, setRetryTimeoutId] = useState(null);
  const [retryCount, setRetryCount] = useState(0)


  const fetchMoviesHandler = useCallback(async () => {
    setError('')
    setIsLoading(true)

    try {
      let fetchedMovies = await fetch('https://swapi.dev/api/films');
      fetchedMovies = await fetchedMovies.json();
      if (!fetchedMovies.ok) {
        throw new Error('Something went wrong. Retrying.....')
      }

      const updatedMovies = fetchedMovies.results.map((movie) => ({
        id: movie.episode_id,
        title: movie.title,
        openingText: movie.opening_crawl,
        releaseDate: movie.release_date,
      }));

      setMovies(updatedMovies)
      setIsLoading(false)
      setIsRetrying(false)
      setRetryCount(0)
      console.log('is it loading?', isLoading)

    } catch (error) {
      console.log(error)
      setIsRetrying(true)
      setError(error)
      if (retryCount < 3) {
        setRetryCount((prevRetryCount) => prevRetryCount + 1);
        const timeoutId = setTimeout(() => {
          fetchMoviesHandler();
        }, 3000);
        setRetryTimeoutId(timeoutId);
      } else {
        setIsRetrying(false);
        setError('Failed to fetch movies after 3 retries.');
      }
    }
  }, []);


  const cancelRetryRequest = useCallback(() => {
    setIsRetrying(false)
    setIsLoading(false)
    console.log(retryTimeoutId)
    clearTimeout(retryTimeoutId)
    setError('Retry cancelled')
  }, [retryTimeoutId]);


  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);


  const addMovieHandler = (movie) => {
    console.log(movie);
  };


  return (
    <React.Fragment>
      <section>
        <MovieForm onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler} disabled={isLoading}>
          Fetch Movies
        </button>
        {isRetrying && (
          <button onClick={cancelRetryRequest}>Cancel Retry</button>
        )}
      </section>
      <section>
        {isLoading && <p>Loading movies...</p>}
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && !error && movies.length === 0 && <p>No movies found</p>}
        {error && !isLoading && <p>{error}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
