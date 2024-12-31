import React, { forwardRef, useEffect, useState } from "react"
import './TextInput.css';

type TextInputProps = {
    className?: string
    value?: string
    validation?: (value: string) => boolean
    validationError?: string
    onChange?: (value: string) => void
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props: TextInputProps, ref) => {
    const [value, setValue] = useState<string>(props.value ?? '');
    const [error, setError] = useState<string>();

    useEffect(() => {
        setValue(props.value ?? '');
    }, [props.value])

    useEffect(() => {
        if (value) {
            if (props.validation && !props.validation(value)) {
                setError(props.validationError);
            }
            props.onChange && props.onChange(value);
        }
    }, [value])

    return (
        <div className={`input-container ${props.className}`}>
            <input ref={ref} className="input" type="text" value={value} placeholder="Type here" onChange={(event) => {
                setValue(event.target.value);
            }} />
            {error && <div className="error">{error}</div>}
        </div>
    )
})

export default TextInput;