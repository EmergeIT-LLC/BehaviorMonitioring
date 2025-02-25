import React from 'react';

interface InputProps {
    name: string;
    requiring: boolean;
    value: string | number;
    futureDating?: boolean;
    nameOfClass?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ name, nameOfClass, requiring, value, futureDating, onChange,}) => {
    const today = new Date();
    const localDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString().split('T')[0];
    return <input type='date' name={name} className={nameOfClass} required={requiring} autoComplete='off' value={value} max={!futureDating ? localDate : undefined} onChange={onChange}/>
}    

export default Input;