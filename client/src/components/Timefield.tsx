import React from 'react';

interface InputProps {
    name: string;
    requiring: boolean;
    value: string;
    nameOfClass?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ name, nameOfClass, requiring, value, onChange }) => {
        return <input type='time' name={name} className={nameOfClass} required={requiring} autoComplete='off' value={value} onChange={onChange}/>
    }    

export default Input;