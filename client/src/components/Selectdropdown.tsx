import React from 'react';

interface SelectDropdownProps {
    name: string;
    requiring: boolean;
    value: string | number;
    options: | { value: string | number; label: string }[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({ name, requiring, value, options, onChange }) => {
    return (
        <select name={name} value={value} required={requiring} onChange={onChange}>
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default SelectDropdown;