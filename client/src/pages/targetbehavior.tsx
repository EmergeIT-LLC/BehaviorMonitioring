import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import componentStyles from '../styles/components.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import Loading from '../components/loading';
import SelectDropdown from '../components/Selectdropdown';
import { GetLoggedInUserStatus, GetLoggedInUser, isCookieValid } from '../function/VerificationCheck';
import Axios from 'axios';
import Button from '../components/Button';

const TargetBehavior: React.FC = () => {
    useEffect(() => {
        document.title = "Target Behavior - Behavior Monitoring";
    }, []);

    const navigate = useNavigate();
    const location = useLocation();
    const userLoggedIn = GetLoggedInUserStatus();
    const loggedInUser = GetLoggedInUser();
    const cookieIsValid = isCookieValid();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<React.ReactNode>('');
    const [clientLists, setClientLists] = useState<{ value: string; label: string }[]>([]);
    const [selectedClient, setSelectedClient] = useState<string>('');
    const [selectedClientID, setSelectedClientID] = useState<number>(0);
    const [targetOptions, setTargetOptions] = useState<{ value: string | number; label: string; measurementType?: string; }[]>([]);

    useEffect(() => {
        if (!userLoggedIn || !cookieIsValid) {
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        } else {
            setIsLoading(true);
            getClientNames();
        }
    }, [userLoggedIn]);

    useEffect(() => {
        if (selectedClientID > 0) {
            getClientTargetBehaviors();
        }
    }, [selectedClientID]);

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

    const getClientTargetBehaviors = async () => {
        setIsLoading(true);
        const url = process.env.REACT_APP_Backend_URL + '/aba/getClientTargetBehavior';
        try {
            const response = await Axios.post(url, {
                "clientID": selectedClientID,
                "employeeUsername": loggedInUser
            });
            if (response.data.statusCode === 200) {
                const fetchedOptions = response.data.behaviorSkillData.map((behavior: { bsID: number, name: string, measurement: string }) => ({
                    value: behavior.bsID,
                    label: behavior.name,
                    measurementType: behavior.measurement
                }));
                setTargetOptions(fetchedOptions);
            } else {
                setStatusMessage(response.data.serverMessage);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClientChange = (value: string) => {
        setStatusMessage('');
        setTargetOptions([]);
        setSelectedClient(value);
        const numericValue = value === '' ? NaN : parseFloat(value);
        setSelectedClientID(numericValue);
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
                            <h1 className={componentStyles.pageHeader}>Target Behavior</h1>
                            <div className={componentStyles.tbHRSButtons}>
                                buttons go here
                            </div>
                            <div className={componentStyles.innerBlock}>
                                <p className={componentStyles.statusMessage}>{statusMessage ? <b>{statusMessage}</b> : null}</p>
                                <label className={componentStyles.clientNameDropdown}>
                                    Client:
                                    <SelectDropdown name={`ClientName`} requiring={true} value={selectedClient} options={clientLists} onChange={(e) => handleClientChange(e.target.value)} />
                                </label>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Measurement Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {targetOptions.map((option, index) => (
                                            <tr key={index}>
                                                <td>{option.measurementType}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }
                </main>
            </div>
            <Footer />
        </>
    );
}

export default TargetBehavior;