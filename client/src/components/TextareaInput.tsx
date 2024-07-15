import React from 'react';

interface TextareaInputProps {
    name: string;
    placeholder: string;
    requiring: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextareaInput: React.FC<TextareaInputProps> = ({ name, placeholder, requiring, value, onChange }) => {
    return (
        <textarea name={name} placeholder={placeholder} aria-label={placeholder + ' text field'} required={requiring} autoComplete="off" value={value} onChange={onChange} />
    );
};

export default TextareaInput;