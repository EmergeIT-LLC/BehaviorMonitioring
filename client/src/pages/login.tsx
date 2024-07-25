import React, {useState, useEffect} from 'react';
import componentStyles from '../styles/components.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import InputFields from '../components/TextInput';
import Button from '../components/Button';
import { CheckUsername, CheckPassword } from '../function/EntryCheck';
import { SetLoggedInUser } from '../function/VerificationCheck';
import Axios from 'axios';

const Login: React.FC = () => {
    useEffect(() => {
        document.title = "Behavior Monitoring Login Page";
    }, []);

    const [uName, setuName] = useState<string>('');
    const [pWord, setPWord] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<string>('');

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
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

        const url = process.env.REACT_APP_Backend_URL + '/employee/verifyEmployeeLogin';

        Axios.post(url, {
            username: uName,
            password: pWord
        })
        .then((response) => {
            if (response.data.statusCode === 200) {
                SetLoggedInUser(response.data.loginStatus, response.data.uName, response.data.isAdmin);
                //Set cookie
                //set redirect
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
                <form className={componentStyles.loginForm} onSubmit={submitForm}>
                    <h2>Login</h2>
                    <InputFields name="usernameField" type="text" placeholder="Username" requiring='true' value={uName} onChange={(e) => setuName(e.target.value)}/>
                    <InputFields name="passwordField" type="password" placeholder="Password" requiring='true' value={pWord} onChange={(e) => setPWord(e.target.value)}/>
                    <Button nameOfClass='loginButton' placeholder='Login' btnType='button' isLoading={isLoading} onClick={submitForm}/>
                    <p className={componentStyles.statusMessage}>{statusMessage ? statusMessage : null}</p>
                </form>
            </main>
        </div>
        <Footer />
    </>
  );
}

export default Login;