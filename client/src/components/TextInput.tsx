import React from 'react';

interface TextInputProps {
    name: string;
    type: string;
    placeholder: string;
    requiring: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({ name, type, placeholder, requiring, value, onChange }) => {
        if (requiring === "true") {
            return <input type={type} name={name} placeholder={placeholder} aria-label={placeholder + ' text field'} required={true} autoComplete="off" value={value} onChange={onChange} />
        }
        return <input type={type} name={name} placeholder={placeholder} aria-label={placeholder + ' text field'} required={false} autoComplete="off" value={value} onChange={onChange} />
    };

export default TextInput;