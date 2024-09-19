import React, {useRef} from 'react'
import classes from './MovieForm.module.css'
import FormElements from './FormElements'

const MovieForm = () => {

    const titleRef = useRef()
    const openingRef = useRef()
    const releaseRef = useRef()

    const addMovieHandler = (e) =>{
        e.preventDefault()
        const output = `${titleRef.current.value} ${openingRef.current.value} ${releaseRef.current.value} `
        console.log(output)
    }

  return (
    <div className={classes.form}>
        <form onSubmit={addMovieHandler}>
            <FormElements input={{type:'text', required:true}} label='Title' ref={titleRef} />
            <FormElements input={{type:'textarea', required:true}} label='Opening Text' ref={openingRef} />
            <FormElements input={{type:'text', required:true}} label='Release Date' ref={releaseRef} />
            <button type='submit'>Add Movie</button>
        </form>
    </div>
  )
}

export default MovieForm