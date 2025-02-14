import React from 'react';

interface ButtonProps {
    nameOfClass: string;
    placeholder: string;
    btnName? : string;
    btnType: 'submit' | 'reset' | 'button';
    isLoading?: boolean;
    disabled?: boolean;
    onClick: (e: React.FormEvent) => void;
}

const Button: React.FC<ButtonProps> = ({ nameOfClass, placeholder, btnName = placeholder, btnType, disabled, isLoading, onClick }) => {
    return (
        <button 
            className={nameOfClass} 
            aria-label={`${btnName} button${isLoading ? ' disabled' : ''}`} 
            type={btnType} 
            onClick={isLoading ? undefined : onClick}
            disabled={isLoading || disabled}
        >
            {isLoading ? 'Loading...' : placeholder}
        </button>
    ) 
};

export default Button;