import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import componentStyles from '../styles/components.module.scss';
import Header from '../components/header';
import Button from '../components/Button';
import Loading from '../components/loading';
import { GetLoggedInUserStatus, isCookieValid } from '../function/VerificationCheck';
import Axios from 'axios';

const SkillAquisition: React.FC = () => {
    useEffect(() => {
        document.title = "Skills - BMetrics";
    }, []);

    const navigate = useNavigate();
    const location = useLocation();
    const userLoggedIn = GetLoggedInUserStatus();
    const cookieIsValid = isCookieValid();
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
            //Get skill aquisition
        }
        setIsLoading(false);
    }, [userLoggedIn]);

  return (
    <>
        <Header />
        <div className={componentStyles.pageBody}>
            <main>
                {isLoading ? 
                    <Loading/> 
                    :
                    <div className={componentStyles.saBody}>
                        Skill Aquisition
                    </div>
                }
            </main>
        </div>
    </>
  );
}

export default SkillAquisition;