import React from 'react';

interface ButtonProps {
    nameOfClass: string;
    placeholder: string;
    btnType: 'submit' | 'reset' | 'button';
    isLoading: boolean;
    onClick: (e: React.FormEvent) => void;
}

const Button: React.FC<ButtonProps> = ({ nameOfClass, placeholder, btnType, isLoading, onClick }) => {
    return !isLoading ?
    (
        <button className={nameOfClass} aria-label={placeholder + ' button'} type={btnType} onClick={onClick}>{placeholder}</button>
    ) 
    :
    (
        <button className={nameOfClass} aria-label={placeholder + ' button disabled'} type={btnType} disabled>Loading...</button>
    );
};

export default Button;