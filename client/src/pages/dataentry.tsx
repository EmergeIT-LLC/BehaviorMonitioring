import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import componentStyles from '../styles/components.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import Link from '../components/Link';
import InputFields from '../components/Inputfield';
import Button from '../components/Button';
import Loading from '../components/loading';
import { GetLoggedInUserStatus, isCookieValid } from '../function/VerificationCheck';
import Axios from 'axios';

const DataEntry: React.FC = () => {
    useEffect(() => {
        document.title = "Data Entry - Behavior Monitoring";
    }, []);

    const navigate = useNavigate();
    const location = useLocation();
    const userLoggedIn = GetLoggedInUserStatus();
    const cookieIsValid = isCookieValid();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [targetAmt, setTargetAmt] = useState<number>(1);

    useEffect(() => {
        if (!userLoggedIn || !cookieIsValid) {
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        }
        else {
            setIsLoading(true);
            //Prep page
        }
        setIsLoading(false);
    }, [userLoggedIn]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numericValue = value === '' ? NaN : parseFloat(value);
        setTargetAmt(numericValue);
    };

  return (
    <>
        <Header />
        <div className={componentStyles.pageBody}>
            <main>
                {isLoading ? 
                    <Loading/> 
                    :
                    <div className={componentStyles.bodyBlock}>
                        <h1 className={componentStyles.pageHeader}>Data Entry</h1>
                        <div className={componentStyles.innerBlock}>
                            <ul className={componentStyles.innerTab}>
                                <li><Link href='/DataEntry/TargetBehavior' hrefType='link' placeholder="Target Behavior" /></li>
                                <li><Link href='/DataEntry/SkillAquisition' hrefType='link' placeholder="Skill Aquisition" /></li>
                            </ul>

                            <p>Number of target:
                                <InputFields name="targetAmtField" type="number" placeholder="1" requiring={true} value={targetAmt} onChange={handleChange}/>
                            </p>
                        </div>
                    </div>
                }
            </main>
        </div>
        <Footer />
    </>
  );
}

export default DataEntry;