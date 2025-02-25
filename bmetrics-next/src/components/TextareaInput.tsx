import React from 'react';

interface TextareaInputProps {
    name: string;
    placeholder: string;
    requiring: boolean;
    value: string;
    nameOfClass: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextareaInput: React.FC<TextareaInputProps> = ({ name, nameOfClass, placeholder, requiring, value, onChange }) => {
    return (
        <textarea name={name} className={nameOfClass} placeholder={placeholder} aria-label={placeholder + ' text field'} required={requiring} autoComplete="off" value={value} onChange={onChange} />
    );
};

export default TextareaInput;