import React from 'react'
import classes from './FormElements.module.css'

const FormElements = React.forwardRef((props, ref) => {
    return (
        <div className={classes.formdiv}>
            <label htmlFor={props.input.id} className={classes.label} >{props.label}</label>
            {props.input.type === 'textarea' ? (
                <textarea {...props.input} className={classes.textarea} rows='5' ref={ref}></textarea>
            ) : (
                <input {...props.input} className={classes.input} ref={ref} />
            )}
        </div>
    )
})

export default FormElements