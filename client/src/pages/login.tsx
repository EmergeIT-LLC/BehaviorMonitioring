import React, {useState, useEffect} from 'react';
import componentStyles from '../styles/components.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import InputFields from '../components/TextInput';
import Button from '../components/Button';

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
        else if (!CheckEmail(email)) {
            setIsLoading(false);
            return setStatusMessage('Email is not a valid email address!')
        }

        const url = process.env.REACT_APP_Backend_URL + '/user/contactUs_formSubmission';

        Axios.post(url, {
            fullName: fullName,
            companyName: companyName,
            email: email,
            howCanWeHelp: howCanWeHelp
        })
        .then((response) => {
            const message = response.data.message;
            setStatusMessage(message);

            if (message === 'Email sent!') {
                setCount(3);
                setReload(true);
            }
        })
        .catch((error) => {
            setStatusMessage('An error occurred while submitting the form.');
            console.log(error);
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
                    <Button nameOfClass='loginButton' placeholder='Login' btnType='button' onClick={submitForm}/>
                </form>
            </main>
        </div>
        <Footer />
    </>
  );
}

export default Login;