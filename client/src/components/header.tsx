import React, {useState, useEffect} from 'react';
import componentStyles from '../styles/components.module.scss';
import farBars from '../Images/naviconrww752.png';
import Link from '../components/Link';
import {GetLoggedInUserStatus} from '../function/VerificationCheck';

const Header: React.FC = () => {
    const userIsLoggedIn = GetLoggedInUserStatus();
    let phoneMenu = null;
    const [links, setLinks] = useState<JSX.Element[]>([]);
    const [showMenu, setShowMenu] = useState(false);
    
    useEffect(() => {
        if (userIsLoggedIn) {
            setLinks([
                <li key="home"><Link href='/' hrefType='link' placeholder="Home"/></li>
            ]);
        } else {
            setLinks([
                <li key="home"><Link href='/' hrefType='link' placeholder="Home"/></li>,
                <li key="about"><Link href='/AboutUs' hrefType='link' placeholder="About us"/></li>,
                <li key="contact"><Link href='/ContactUs' hrefType='link' placeholder="Contact us"/></li>
            ]);
        }
    }, [userIsLoggedIn]);
      
    const showPhoneMenuBoolean = () => {
        if (!showMenu){
            setShowMenu(true);
        }
        else {
            setShowMenu(false);
        }
    }

    if (showMenu){
        phoneMenu = 
        <nav className={componentStyles.mobileNav}>
            <ul>
                {links}
            </ul>
        </nav>
    }

    return (
        <div className={componentStyles.headerBody}>
            {/* <a href='/'><img src={companyLogo} alt ="EmergeIT Logo" /></a> */}
            <h1 className={componentStyles.companyName}>Behavior Monitoring <span className={componentStyles.trade}>&trade;</span></h1>
            <img className={componentStyles.farBars} src={farBars} alt ="FarBar Button" onClick={showPhoneMenuBoolean}/>
            {phoneMenu}
            <nav>
                <ul>
                    {links}
                </ul>
            </nav>
        </div>
    );
}

export default Header;