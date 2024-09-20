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
    setError('');
    setIsLoading(true);

    try {
      const fetchedMovies = await fetch('https://react-http-b7a30-default-rtdb.asia-southeast1.firebasedatabase.app/films.json');
      if (!fetchedMovies.ok) {
        throw new Error('Something went wrong. Retrying...');
      }
      const data = await fetchedMovies.json();
      console.log(fetchedMovies)

      const loadedMovies = []
      for (let key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        })
      }

      setMovies(loadedMovies);
      setIsLoading(false);
      setIsRetrying(false);
      setRetryCount(0);
    } catch (error) {
      console.log(error);
      setIsRetrying(true);
      setError(error.message);

      setRetryCount((prevRetryCount) => {
        if (prevRetryCount >= 3) {
          cancelRetryRequest();
          return prevRetryCount;
        }
        const timeoutId = setTimeout(() => {
          fetchMoviesHandler();
        }, 3000);
        setRetryTimeoutId(timeoutId);
        return prevRetryCount + 1;
      });
    }
  }, [retryTimeoutId, retryCount]);


  const cancelRetryRequest = useCallback(() => {
    setIsRetrying(false)
    setIsLoading(false)
    console.log(retryTimeoutId)
    clearTimeout(retryTimeoutId)
    setError('Retry cancelled')
  }, [retryTimeoutId]);


  useEffect(() => {
    fetchMoviesHandler();
  }, []);


  const addMovieHandler = async (movie) => {
    console.log(movie)
    const addMovie = await fetch('https://react-http-b7a30-default-rtdb.asia-southeast1.firebasedatabase.app/films.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await addMovie.json()
    console.log(data)
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
