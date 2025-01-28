import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import componentStyles from '../styles/components.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import Button from '../components/Button';
import Loading from '../components/loading';
import { GetLoggedInUserStatus, GetLoggedInUser, isCookieValid } from '../function/VerificationCheck';
import Axios from 'axios';
import SelectDropdown from '../components/Selectdropdown';
import Link from '../components/Link';
import InputFields from '../components/Inputfield';
import TextareaInput from '../components/TextareaInput';

const AddTargetBehavior: React.FC = () => {
    useEffect(() => {
        document.title = "Add Target Behavior - Behavior Monitoring";
    }, []);

    const navigate = useNavigate();
    const location = useLocation();
    const userLoggedIn = GetLoggedInUserStatus();
    const loggedInUser = GetLoggedInUser();
    const cookieIsValid = isCookieValid();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<React.ReactNode>('');
    const [clearMessageStatus, setClearMessageStatus] = useState<boolean>(false);
    const [timerCount, setTimerCount] = useState<number>(0);
    const [clientLists, setClientLists] = useState<{ value: string; label: string }[]>([]);
    const [selectedClient, setSelectedClient] = useState<string>('');
    const [selectedClientID, setSelectedClientID] = useState<number>(0);
    const [behaviorName, setBehaviorName] = useState<string>('');

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
            getClientNames();
        }
        setIsLoading(false);
    }, [userLoggedIn]);

    const getClientNames = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/aba/getAllClientInfo';
        try {
            const response = await Axios.post(url, { "employeeUsername": loggedInUser });
            if (response.data.statusCode === 200) {
                setSelectedClient(response.data.clientData[0].fName + " " + response.data.clientData[0].lName);
                setSelectedClientID(response.data.clientData[0].clientID);
                const fetchedOptions = response.data.clientData.map((clientData: { clientID: number, fName: string, lName: string }) => ({
                    value: clientData.clientID,
                    label: `${clientData.fName} ${clientData.lName}`,
                }));
                setClientLists(fetchedOptions);
            } else {
                setStatusMessage(response.data.serverMessage);
            }
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const handleClientChange = (value: any) => {
        setStatusMessage('');
        setSelectedClient(value);
        const numericValue = value === '' ? NaN : parseFloat(value);
        setSelectedClientID(numericValue);
    };


    useEffect(() => {
        if (timerCount > 0) {
            const timer = setTimeout(() => setTimerCount(timerCount - 1), 1000);
            return () => clearTimeout(timer);
        }
        if (timerCount === 0 && clearMessageStatus) {
            setClearMessageStatus(false);
            setStatusMessage('')
        }
    }, [timerCount, clearMessageStatus]);

    const backButtonFuctionality = () => {
        navigate(-1);
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
                        <h1 className={componentStyles.pageHeader}>Add Target Behavior</h1>
                        <div className={componentStyles.tbHRSButtons}>
                            <Button nameOfClass='tbGraphButton' placeholder='Back' btnType='button' isLoading={isLoading} onClick={backButtonFuctionality}/>
                        </div>
                        <p className={componentStyles.statusMessage}>{statusMessage ? <b>{statusMessage}</b> : null}</p>
                        <div className={componentStyles.innerBlock}>
                            <div className={componentStyles.tbAddBehavior}>
                                <label className={componentStyles.clientNameDropdown}>
                                    Current Behavior for:
                                    <SelectDropdown name={`ClientName`} requiring={true} value={selectedClient} options={clientLists} onChange={(e) => handleClientChange(e.target.value)} />
                                </label>
                                <label>
                                    Enter a behavior name:
                                    <InputFields name="behaviorNameField" type="text" placeholder="Behavior Name" requiring={true} value={behaviorName} onChange={(e) => setBehaviorName(e.target.value)}/>
                                </label>
                                <label className={componentStyles.behaviorCategoryDropdown}>
                                    Select a Behavior Category:
                                    <SelectDropdown name={`ClientName`} requiring={true} value={selectedClient} options={clientLists} onChange={(e) => handleClientChange(e.target.value)} />
                                </label>
                                <label className={componentStyles.behaviorCategoryDropdown}>
                                    Enter a definition for the behavior:
                                    <TextareaInput name="definitionTextField" placeholder="Behavior Definition" requiring={true} value={behaviorName} onChange={(e) => setBehaviorName(e.target.value)}/>
                                </label>
                            </div>
                        </div>
                    </div>
                }
            </main>
        </div>
        <Footer />
    </>
  );
}

export default AddTargetBehavior;