import React, { useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {

  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const loaderToggle = () =>{
    return new Promise((resolve, reject) =>{
      setTimeout(() => {
        setIsLoading(!isLoading)
        resolve()
      }, 2000);

    })
  }

  const fetchMoviesHandler = async () =>{
      await loaderToggle()
      console.log(isLoading)
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
      
      await loaderToggle()
      console.log(isLoading)
      setMovies(updatedmovies)
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler} disabled={isLoading} >Fetch Movies</button>
      </section>
      <section>
        <MoviesList movies={movies} />
      </section>
    </React.Fragment>
  );
}

export default App;
