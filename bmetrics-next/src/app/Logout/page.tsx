"use client";
import React, {useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import componentStyles from '../../styles/components.module.scss';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Button from '../../components/Button';
import Loading from '../../components/loading';
import { ClearLoggedInUser, GetLoggedInUser, GetLoggedInUserStatus, DeleteCookies } from '../../function/VerificationCheck';
import Axios from 'axios';

const Logout: React.FC = () => {
    const navigate = useRouter();
    const loggedInUser = GetLoggedInUser();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<string>('');

    useEffect(() => {
        executeLogout();
    }, []);

    onkeydown = (e) => {
        if (e.key === 'Enter') {
            routeChange();
        }
    }

    const submitLogoutForm = () => {
        setIsLoading(true);

        const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/employee/verifyEmployeeLogout';

        Axios.post(url, {
            username : loggedInUser
        })
        .then((response) => {
            if (response.data.statusCode === 200) {
                DeleteCookies(response.data.cookie.name, response.data.cookie.options.expirationTime, response.data.cookie.options.path);
            }
            else {
                throw new Error(response.data.serverMessage);
            }
        })
        .catch((error) => {
            return setStatusMessage(String(error));
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
        navigate.push('/Login');
    }

  return (
    <>
        <Header />
        <Head>
            <title>Logout - BMetrics</title>
        </Head>
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