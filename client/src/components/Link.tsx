import React from 'react';

interface LinkProps {
    href: string;
    hrefType: string;
    placeholder: string;
}

const Link: React.FC<LinkProps> = ({ href, hrefType, placeholder }) => {
    switch (hrefType) {
        case "email":
            return <a href={href} aria-label={'email ' + placeholder}>{placeholder}</a>
        case "phone":
            return <a href={href} aria-label={'call ' + placeholder}>{placeholder}</a>
        default:
            return <a href={href} aria-label={placeholder + ' link'}>{placeholder}</a>
    }
    
};

export default Link;