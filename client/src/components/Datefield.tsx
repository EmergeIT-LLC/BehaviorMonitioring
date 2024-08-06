import React from 'react';

interface InputProps {
    name: string;
    requiring: boolean;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ name, requiring, value, onChange }) => {
        return <input type='date' name={name} required={requiring} autoComplete='off' value={value} onChange={onChange}/>
    }    

export default Input;