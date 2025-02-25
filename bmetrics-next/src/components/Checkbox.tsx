import React from 'react';

interface CheckboxProps {
    nameOfClass: string;
    label: string;
    isChecked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
    onClick?: (e: React.FormEvent) => void;
}


const Checkbox: React.FC<CheckboxProps> =  ({nameOfClass, label, isChecked, onChange, disabled, onClick}) => {
    return (
        <input type='checkbox' className={nameOfClass} id={label} checked={isChecked} onChange={onChange} disabled={disabled} onClick={onClick}/>
    );
}

export default Checkbox;