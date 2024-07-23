import React from 'react';
import componentStyles from '../styles/components.module.scss';
import Link from '../components/Link';

const Footer: React.FC = () => {
    return (
        <div className={componentStyles.footerBody}>
            <h1 className={componentStyles.companyName}>
                Behavior Monitoring <span className={componentStyles.trade}>&trade;</span>
            </h1>
            <div className={componentStyles.rightSide}>
                <Link href="https://emerge-it.net" hrefType='' placeholder='EmergeIT LLC'/>
                <Link href="/privacy-policy" hrefType='' placeholder='Privacy Policy'/>
                <Link href="/terms" hrefType='' placeholder='Terms and Conditions'/>
            </div>
            <p className={componentStyles.copyRight}>
                Copyright 2024 EmergeIT LLC
            </p>
        </div>
    );
}

export default Footer;
