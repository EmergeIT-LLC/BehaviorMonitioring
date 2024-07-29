import React, {useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import componentStyles from '../styles/components.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import Button from '../components/Button';
import Loading from '../components/loading';
import { ClearLoggedInUser, GetLoggedInUser, GetLoggedInUserStatus, DeleteCookies } from '../function/VerificationCheck';
import Axios from 'axios';

const Logout: React.FC = () => {
    useEffect(() => {
        document.title = "Logout - Behavior Monitoring";
        executeLogout();
    }, []);

    const navigate = useNavigate();
    const location = useLocation();
    const loggedInUser = GetLoggedInUser();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<string>('');

    onkeydown = (e) => {
        if (e.key === 'Enter') {
            routeChange();
        }
    }

    const submitLogoutForm = () => {
        setIsLoading(true);

        const url = process.env.REACT_APP_Backend_URL + '/employee/verifyEmployeeLogout';

        Axios.post(url, {
            username : loggedInUser
        })
        .then((response) => {
            if (response.data.statusCode === 200) {
                DeleteCookies(response.data.cookie.name, response.data.cookie.options.expirationTime, response.data.cookie.options.path);
            }
            else {
                if (response.data.statusCode === 401) {
                    setStatusMessage(response.data.serverMessage);
                }
                else {
                    throw new Error(response.data.serverMessage);
                }
            }
        })
        .catch((error) => {
            console.error(error.message);
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    const executeLogout = () => {
        if (GetLoggedInUserStatus()) {
            submitLogoutForm();
            ClearLoggedInUser();
        }
    }

    const routeChange = () => {
        if (location.state !== null) {
            navigate('/login', {
                state: {
                    previousUrl: null,
                }
            });
        }
        else {
            navigate('/login');
        }
    }

  return (
    <>
        <Header />
        <div className={componentStyles.pageBody}>
            <main>
                {isLoading ?
                    <Loading/>
                    :

                    <form className={componentStyles.logoutForm}>
                        <h2>Logout</h2>
                        <p>You have been logged out <br/> Select the login button below to sign in</p>
                        <Button nameOfClass='loginButton' placeholder='Login' btnType='button' isLoading={isLoading} onClick={routeChange}/>
                        <p className={componentStyles.statusMessage}>{statusMessage ? statusMessage : null}</p>
                    </form>
                }
            </main>
        </div>
        <Footer />
    </>
  );
}

export default Logout;