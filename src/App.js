import React, { useEffect, useState, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {

  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRetrying, setIsRetrying] = useState(false)
  const [retryTimeoutId, setRetryTimeoutId] = useState(null);


  const fetchMoviesHandler = useCallback(async() => {
    setIsLoading(true);
    setError('');
    setIsRetrying(true)
    console.log('isLoading before fetch:', isLoading);
    try {
      let fetchedMovies = await fetch('https://swapi.dev/api/films');
      
      if(!fetchedMovies.ok){
        throw new Error('Something went wrong. Retrying.....')
      }
      fetchedMovies = await fetchedMovies.json();
      const updatedMovies = fetchedMovies.results.map((movie) => ({
        id: movie.episode_id,
        title: movie.title,
        openingText: movie.opening_crawl,
        releaseDate: movie.release_date,
      }));

      setMovies(updatedMovies);
      setIsRetrying(false);
      clearTimeout(); 
      console.log('isLoading after fetch:', isLoading);
      setIsLoading(false);
    } catch (error) {
      setError('Something went wrong...Retrying');
      setIsLoading(false)
      const timeoutId = setTimeout(() => {
        fetchMoviesHandler()
      },  5000);
      setRetryTimeoutId(timeoutId)
      console.error('Error fetching movies:', error);
    }
  }, [retryTimeoutId])

  const cancelRetryRequest = useCallback(() =>{
    setIsRetrying(false)
    clearTimeout(retryTimeoutId)
    setIsLoading(false)
    setError('Retrying cancelled')
  }, [retryTimeoutId])

  useEffect(()=>{
    fetchMoviesHandler()
  },[fetchMoviesHandler])

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler} disabled={isLoading} >Fetch Movies</button>
        {isRetrying && <button onClick={cancelRetryRequest}>Cancel</button>}
      </section>
      <section>
        {isLoading && <p>Loading movies</p>}
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && <p>No movies found</p>}
        {error && !isLoading && <p>{error}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
