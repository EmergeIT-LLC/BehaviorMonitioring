import React from 'react';

interface ButtonProps {
    nameOfClass: string;
    placeholder: string;
    btnName? : string;
    btnType: 'submit' | 'reset' | 'button';
    isLoading: boolean;
    onClick: (e: React.FormEvent) => void;
}

const Button: React.FC<ButtonProps> = ({ nameOfClass, placeholder, btnName = placeholder, btnType, isLoading, onClick }) => {
    return (
        <button 
            className={nameOfClass} 
            aria-label={`${btnName} button${isLoading ? ' disabled' : ''}`} 
            type={btnType} 
            onClick={isLoading ? undefined : onClick}
            disabled={isLoading}
        >
            {isLoading ? 'Loading...' : placeholder}
        </button>
    ) 
};

export default Button;