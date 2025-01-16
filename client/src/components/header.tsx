import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import componentStyles from '../styles/components.module.scss';
import farBars from '../Images/naviconrww752.png';
import Link from '../components/Link';
import Button from './Button';
import {GetLoggedInUserStatus, GetAdminStatus} from '../function/VerificationCheck';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const userIsLoggedIn = GetLoggedInUserStatus();
    const userIsAdmin = GetAdminStatus();
    let phoneMenu = null;
    const [buttonLabel, setButtonLabel] = useState<string>('Login');
    const [links, setLinks] = useState<JSX.Element[]>([]);
    const [showMenu, setShowMenu] = useState<boolean>(false);
    
    useEffect(() => {
        if (userIsLoggedIn) {
            setButtonLabel('Logout');
            const userLinks = [
                <li key="home"><Link href='/' hrefType='link' placeholder="Home" /></li>,
                <li key="targetBehavior"><Link href='/TargetBehavior' hrefType='link' placeholder="Target Behavior" /></li>,
                // <li key="skillAquisition"><Link href='/SkillAquisition' hrefType='link' placeholder="Skill Aquisition" /></li>,
                <li key="dataEntry"><Link href='/DataEntry' hrefType='link' placeholder="Data Entry" /></li>,
            ];
            if (userIsAdmin) {
                userLinks.push(<li key="admin"><Link href='/Admin' hrefType='link' placeholder="Admin" /></li>);
            }
            setLinks(userLinks);
        } else {
            setButtonLabel('Login');
            setLinks([
                <li key="home"><Link href='/' hrefType='link' placeholder="Home"/></li>,
                <li key="about"><Link href='/AboutUs' hrefType='link' placeholder="About us"/></li>,
                <li key="contact"><Link href='/ContactUs' hrefType='link' placeholder="Contact us"/></li>
            ]);
        }
    }, [userIsLoggedIn]);

    const routeChange = () => {
        if (userIsLoggedIn) {
            navigate('/logout');
        }
        else {
            navigate('/login');
        }
    }
      
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
            <h1 className={componentStyles.companyName}>BMetrics <span className={componentStyles.trade}>&trade;</span></h1>
            <img className={componentStyles.farBars} src={farBars} alt ="FarBar Button" onClick={showPhoneMenuBoolean}/>
            <Button nameOfClass='loginButton' placeholder={buttonLabel} btnType='button' onClick={routeChange}/>
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