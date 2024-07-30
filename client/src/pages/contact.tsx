import React, { useState, useEffect } from 'react';
import componentStyles from '../styles/components.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import Axios from 'axios';
import TextInput from '../components/Inputfield';
import TextareaInput from '../components/TextareaInput';
import SubmitButton from '../components/Button';
import Loading from '../components/loading';
import {CheckEmail} from '../function/EntryCheck';

const Contact: React.FC = () => {
    const [fullName, setFullName] = useState<string>('');
    const [companyName, setCompanyName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [howCanWeHelp, setHowCanWeHelp] = useState<string>('');
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>(0);
    const [reload, setReload] = useState<boolean>(false);

    useEffect(() => {
        document.title = "Contact - Behavior Monitoring";
    }, []);


    return (
        <>
            <Header />
            <div className={componentStyles.pageBody}>
                <main>
                    Contact
                </main>
            </div>
            <Footer />
        </>
    );
}

export default Contact;