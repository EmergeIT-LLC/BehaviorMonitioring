import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import componentStyles from '../styles/components.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import InputFields from '../components/TextInput';
import Button from '../components/Button';
import Loading from '../components/loading';
import { GetLoggedInUserStatus, isCookieValid } from '../function/VerificationCheck';
import Axios from 'axios';

const Home: React.FC = () => {
    useEffect(() => {
        document.title = "Behavior Monitoring Home Page";
    }, []);

    const navigate = useNavigate();
    const location = useLocation();
    const userLoggedIn = GetLoggedInUserStatus();
    const cookieIsValid = isCookieValid();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!userLoggedIn && !cookieIsValid) {
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
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
                    <div className={componentStyles.homeBody}>
                        Home
                    </div>
                }
            </main>
        </div>
        <Footer />
    </>
  );
}

export default Home;