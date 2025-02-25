import React from 'react';

interface TabProps {
    nameOfClass: string;
    placeholder: string;
    onClick: (e: React.FormEvent) => void;
}

const Tab: React.FC<TabProps> = ({ nameOfClass, placeholder, onClick }) => {
    return <button className={nameOfClass} aria-label={placeholder + ' tab'} type='button' role='tab' onClick={onClick}>{placeholder}</button>;
};

export default Tab;