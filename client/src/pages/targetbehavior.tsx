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
    const [targetOptions, setTargetOptions] = useState<{ value: string | number; label: string; definition?: string; dateCreated?: string; measurementType?: string; behaviorCat?: string; dataToday?: number; }[]>([]);

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
                const fetchedOptions = response.data.behaviorSkillData.map((behavior: { bsID: number, name: string, definition: string, dateCreated: string, measurement: string, behaviorCategory: string, dataToday: number }) => ({
                    value: behavior.bsID,
                    label: behavior.name,
                    definition: behavior.definition,
                    dateCreated: behavior.dateCreated,
                    measurementType: behavior.measurement,
                    behaviorCategory: behavior.behaviorCategory,
                    dataToday: behavior.dataToday
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

    const handleClientChange = (value: any) => {
        console.log(value)
        setStatusMessage('');
        setTargetOptions([]);
        setSelectedClient(value);
        const numericValue = value === '' ? NaN : parseFloat(value);
        setSelectedClientID(numericValue);
    };

    const submitDataEntryForm = () => {
        alert('Button is functional')
    }

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
                                <Button nameOfClass='tbHRSButton' placeholder='Add' btnType='button' isLoading={isLoading} onClick={submitDataEntryForm}/>
                                <Button nameOfClass='tbHRSButton' placeholder='Graph' btnType='button' isLoading={isLoading} onClick={submitDataEntryForm}/>
                            </div>
                            <p className={componentStyles.statusMessage}>{statusMessage ? <b>{statusMessage}</b> : null}</p>
                            <div className={componentStyles.innerBlock}>
                                <div className={componentStyles.tbHRSTopBar}>
                                    <label className={componentStyles.clientNameDropdown}>
                                        <SelectDropdown name={`ClientName`} requiring={true} value={selectedClient} options={clientLists} onChange={(e) => handleClientChange(e.target.value)} />
                                    </label>
                                    <p>Current Behavior</p>
                                </div>    
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Behavior Name</th>
                                            <th>Definition</th>
                                            <th>Measurement</th>
                                            <th>Data Today</th>
                                            <th>Archive</th>
                                            <th>Edit</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {targetOptions.map((option, index) => (
                                            <tr key={index}>
                                                <td>{option.label}</td>
                                                <td>{option.definition}</td>
                                                <td>{option.measurementType}</td>
                                                <td>{option.dataToday}</td>
                                                <td>Archive</td>
                                                <td>Edit</td>
                                                <td>Delete</td>
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