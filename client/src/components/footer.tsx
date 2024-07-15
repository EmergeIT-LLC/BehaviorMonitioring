import React from 'react';
import componentStyles from '../styles/components.module.scss';
import facebookIcon from '../Images/facebook-logo-symbol-free-svg-file.png';
import instagramIcon from '../Images/instagram-logo-symbol-free-icons8-logos-file.png'
import Link from '../components/Link';

const Footer: React.FC = () => {
    return (
        <div className={componentStyles.footerBody}>
            <h1 className={componentStyles.companyName}>Behavior Monitoring <span className={componentStyles.trade}>&trade;</span></h1>
            <div className={componentStyles.contact}>
                <div className={componentStyles.email}>Email: <Link href="mailto:jonathan.dameus@emerge-it.net" hrefType='email' placeholder='Jonathan.Dameus@Emerge-IT.net'/></div>
                <div className={componentStyles.cellNumber}>Cell: <Link href="tel:+19542790630" hrefType='phone' placeholder='&#10088;954&#10089; 279&#8211;0630'/></div>
            </div>
            <div className={componentStyles.socialMedia}>
                <a href='https://www.facebook.com/emergeitllc/' aria-label="EmergeIT Facebook page opens in new window"><img src={facebookIcon} alt ="EmergeIT Facebook Page" className={componentStyles.facebookIcon}/></a>
                <a href='https://www.instagram.com/emergeitllc/' aria-label="EmergeIT Instagram page opens in new window"><img src={instagramIcon} alt ="EmergeIT Instagram Page" className={componentStyles.instagramIcon}/></a>
            </div>
        </div>
    );
}

export default Footer;