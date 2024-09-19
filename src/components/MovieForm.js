import React, {useRef} from 'react'
import classes from './MovieForm.module.css'
import FormElements from './FormElements'

const MovieForm = (props) => {

    const titleRef = useRef()
    const openingRef = useRef()
    const releaseRef = useRef()

    const submitHandler = (e) =>{
        e.preventDefault()
        const movie = {
            title: titleRef.current.value,
            openingText: openingRef.current.value,
            releaseDate: releaseRef.current.value
        }
        props.onAddMovie(movie)
    }

  return (
    <div className={classes.form}>
        <form onSubmit={submitHandler}>
            <FormElements input={{type:'text', required:true}} label='Title' ref={titleRef} />
            <FormElements input={{type:'textarea', required:true}} label='Opening Text' ref={openingRef} />
            <FormElements input={{type:'text', required:true}} label='Release Date' ref={releaseRef} />
            <button type='submit'>Add Movie</button>
        </form>
    </div>
  )
}

export default MovieForm