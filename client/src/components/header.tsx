import React, {useState} from 'react';
import componentStyles from '../styles/components.module.scss';
import farBars from '../Images/naviconrww752.png';
import Link from '../components/Link';

const Header: React.FC = () => {
    let menu = null;
    let links = null;
    const [showMenu, setShowMenu] = useState(false);
  
    const showMenuBoolean = () => {
        if (!showMenu){
            setShowMenu(true);
        }
        else {
            setShowMenu(false);
        }
    }

    if (showMenu){
        menu = 
        <nav className={componentStyles.mobileNav}>
            <ul>
                <li><Link href='/' hrefType='link' placeholder="Home"/></li>
                <li><Link href='/AboutUs' hrefType='link' placeholder="About us"/></li>
                <li><Link href='/ContactUs' hrefType='link' placeholder="Contact us"/></li>
            </ul>
        </nav>
    }

    return (
        <div className={componentStyles.headerBody}>
            {/* <a href='/'><img src={companyLogo} alt ="EmergeIT Logo" /></a> */}
            <h1 className={componentStyles.companyName}>Behavior Monitoring <span className={componentStyles.trade}>&trade;</span></h1>
            <img className={componentStyles.farBars} src={farBars} alt ="FarBar Button" onClick={showMenuBoolean}/>
            {menu}
            <nav>
                <ul>
                    <li><Link href='/' hrefType='link' placeholder="Home"/></li>
                    <li><Link href='/AboutUs' hrefType='link' placeholder="About us"/></li>
                    <li><Link href='/ContactUs' hrefType='link' placeholder="Contact us"/></li>
                </ul>
            </nav>
        </div>
    );
}

export default Header;