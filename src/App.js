import React, { useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {

  const [movies, setMovies] = useState([])

  const fetchMoviesHandler = async () =>{
      let fetchedMovies = await fetch('https://swapi.dev/api/films')
      fetchedMovies = await fetchedMovies.json()
      const updatedmovies = fetchedMovies.results.map((movie)  =>{
        return{
          id:movie.episode_id,
          title:movie.title,
          openingText:movie.opening_crawl,
          releaseDate:movie.release_date
        }
      })
      setMovies(updatedmovies)
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        <MoviesList movies={movies} />
      </section>
    </React.Fragment>
  );
}

export default App;
