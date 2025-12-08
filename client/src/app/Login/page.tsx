"use client";
import React, {useState, useEffect, } from 'react';
import Head from 'next/head';
import { useRouter, useSearchParams } from 'next/navigation';
import componentStyles from '../../styles/components.module.scss';
import Header from '../../components/header';
import Footer from '../../components/footer';
import InputFields from '../../components/Inputfield';
import Button from '../../components/Button';
import Loading from '../../components/loading';
import { GetLoggedInUserStatus } from '../../function/VerificationCheck'
import { CheckUsername, CheckPassword } from '../../function/EntryCheck';
import { SetLoggedInUser } from '../../function/VerificationCheck';
import { debounceAsync } from '../../function/debounce';
import Axios from 'axios';

const Login: React.FC = () => {
    const searchParams = useSearchParams();
    const previousUrl = searchParams.get('previousUrl');
    const navigate = useRouter();
    const [userStatus, setUserStatus] = useState<boolean>(GetLoggedInUserStatus());    
    const [uName, setuName] = useState<string>('');
    const [pWord, setPWord] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<string>('');

    useEffect(() => {
        if (userStatus) {
            navigate.push(previousUrl || '/');
        }
    }, [userStatus, navigate, previousUrl]);

    onkeydown = (e) => {
        if (e.key === 'Enter') {
            debounceAsync(submitLoginForm, 300)();
        }
    }

    const submitLoginForm = async () => {
        setIsLoading(true);

        if (uName.length < 1 || pWord.length < 1) {
            setIsLoading(false);
            return setStatusMessage('All fields must be filled out');
        }
        else if (!CheckUsername(uName)) {
            setIsLoading(false);
            return setStatusMessage('Username is not valid')
        }
        else if (!CheckPassword(pWord)) {
            setIsLoading(false);
            return setStatusMessage('Password is incorrect')  
        }

        await Axios.post(process.env.NEXT_PUBLIC_BACKEND_UR + '/auth/verifyEmployeeLogin', {
            username: uName,
            password: pWord
        })
        .then((response) => {
            if (response.data.statusCode === 200) {
                SetLoggedInUser(response.data.loginStatus, response.data.accessToken, response.data.user);
                setUserStatus(true);
                navigate.push(previousUrl || '/');
            }
            else {
                throw new Error(response.data.serverMessage);
            }
        })
        .catch((error) => {
            return setStatusMessage(error.message);
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

  return (
    <>
        <Header />
        <Head>
            <title>Login - BMetrics</title>
        </Head>
        <div className={componentStyles.pageBody}>
            <main>
                {isLoading ? 
                    <Loading/>
                    :
                    <form className={componentStyles.loginForm} onSubmit={submitLoginForm}>
                        <h2>Login</h2>
                        <InputFields name="usernameField" type="text" placeholder="Username" requiring={true} value={uName} onChange={(e) => setuName(e.target.value)}/>
                        <InputFields name="passwordField" type="password" placeholder="Password" requiring={true} value={pWord} onChange={(e) => setPWord(e.target.value)}/>
                        <Button nameOfClass='loginButton' placeholder='Login' btnType='button' isLoading={isLoading} onClick={debounceAsync(submitLoginForm, 300)}/>
                        <p className={componentStyles.statusMessage}>{statusMessage ? statusMessage : null}</p>
                    </form>
                }
            </main>
        </div>
        <Footer />
    </>
  );
}

export default Login;