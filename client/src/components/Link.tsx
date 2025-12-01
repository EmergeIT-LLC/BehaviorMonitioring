import React from 'react';
import NextLink from 'next/link';

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
            return (
                <NextLink href={href} aria-label={placeholder + ' link'} passHref>
                    {placeholder}
                </NextLink>
            );
    }
    
};

export default Link;