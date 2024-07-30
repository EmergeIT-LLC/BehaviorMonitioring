import React from 'react';

interface InputProps {
    name: string;
    type: string;
    placeholder: string;
    requiring: boolean;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ name, type, placeholder, requiring, value, onChange }) => {
    switch (type) {
        case ('number') :
            return <input type='number' name={name} placeholder={placeholder} aria-label={placeholder + ' text field'} required={requiring} autoComplete="off" value={value} onChange={onChange} />
        default:
            return <input type='text' name={name} placeholder={placeholder} aria-label={placeholder + ' text field'} required={requiring} autoComplete="off" value={value} onChange={onChange} />
        };    
    }    

export default Input;