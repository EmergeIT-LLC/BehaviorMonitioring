import React, {useState, useEffect, } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import componentStyles from '../styles/components.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import InputFields from '../components/Inputfield';
import Button from '../components/Button';
import Loading from '../components/loading';
import { GetLoggedInUserStatus, SetCookies } from '../function/VerificationCheck'
import { CheckUsername, CheckPassword } from '../function/EntryCheck';
import { SetLoggedInUser } from '../function/VerificationCheck';
import Axios from 'axios';

const Login: React.FC = () => {
    useEffect(() => {
        document.title = "Login - BMetrics";
    }, []);

    const navigate = useNavigate();
    const location = useLocation();
    const userLoggedIn = GetLoggedInUserStatus();
    const [uName, setuName] = useState<string>('');
    const [pWord, setPWord] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<string>('');

    useEffect(() => {
        if (userLoggedIn) {
            navigate('/');
        }
    }, [userLoggedIn, navigate]);

    onkeydown = (e) => {
        if (e.key === 'Enter') {
            submitLoginForm();
        }
    }

    const submitLoginForm = () => {
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

        Axios.post(process.env.REACT_APP_Backend_URL + '/employee/verifyEmployeeLogin', {
            username: uName,
            password: pWord
        })
        .then((response) => {
            if (response.data.statusCode === 200) {
                SetLoggedInUser(response.data.loginStatus, response.data.uName, response.data.isAdmin);
                SetCookies(response.data.cookie.name, response.data.cookie.value, response.data.cookie.options.expirationTime, response.data.cookie.options.path, response.data.cookie.options.secure, response.data.cookie.options.sameSite);
                if (location.state == null) {
                    navigate('/');
                } else if (location.state.previousUrl !== location.pathname) {
                    navigate(location.state);
                }
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

  return (
    <>
        <Header />
        <div className={componentStyles.pageBody}>
            <main>
                {isLoading ? 
                    <Loading/>
                    :
                    <form className={componentStyles.loginForm} onSubmit={submitLoginForm}>
                        <h2>Login</h2>
                        <InputFields name="usernameField" type="text" placeholder="Username" requiring={true} value={uName} onChange={(e) => setuName(e.target.value)}/>
                        <InputFields name="passwordField" type="password" placeholder="Password" requiring={true} value={pWord} onChange={(e) => setPWord(e.target.value)}/>
                        <Button nameOfClass='loginButton' placeholder='Login' btnType='button' isLoading={isLoading} onClick={submitLoginForm}/>
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