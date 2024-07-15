import React from 'react';

interface TextInputProps {
    name: string;
    placeholder: string;
    requiring: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({ name, placeholder, requiring, value, onChange }) => {
    return (
        <input type="text" name={name} placeholder={placeholder} aria-label={placeholder + ' text field'} required={requiring} autoComplete="off" value={value} onChange={onChange} />
    );
};

export default TextInput;