import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import componentStyles from '../styles/components.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import Link from '../components/Link';
import InputFields from '../components/Inputfield';
import SelectDropdown from '../components/Selectdropdown';
import DateFields from '../components/Datefield';
import TimeFields from '../components/Timefield';
import Button from '../components/Button';
import Loading from '../components/loading';
import { GetLoggedInUserStatus, GetLoggedInUser, isCookieValid } from '../function/VerificationCheck';
import Axios from 'axios';

const DataEntry: React.FC = () => {
    useEffect(() => {
        document.title = "Data Entry - Behavior Monitoring";
    }, []);

    const navigate = useNavigate();
    const location = useLocation();
    const userLoggedIn = GetLoggedInUserStatus();
    const loggedInUser = GetLoggedInUser();
    const cookieIsValid = isCookieValid();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [targetAmt, setTargetAmt] = useState<number>(1);
    const [clientLists, setClientLists] = useState<{ value: string; label: string }[]>([]);
    const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
    const [dates, setDates] = useState<string[]>([]);
    const [times, setTimes] = useState<string[]>([]);
    const [targetOptions, setTargetOptions] = useState<{ value: string | number; label: string }[]>([]);

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
            //Prep page
            //getClientNames();
            getClientTargetBehaviors();
        }
        setIsLoading(false);
    }, [userLoggedIn]);

    const getClientNames = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/aba/getClientInfo';
                
        await Axios.post(url, {
            "employeeUsername" : loggedInUser
        })
        .then((response) => {
            if (response.data.statusCode === 200) {
                const fetchedOptions = response.data.clientDetails.map((clientDetails: { cID: number, fName: string, lName: string }) => ({
                    value: clientDetails.cID,
                    label: clientDetails.fName + " " + clientDetails.lName,
                }));
                
                // Prepend the default option to the fetched options
                const combinedOptions = [{ value: 'null', label: 'Select Target Behavior' }, ...fetchedOptions];
                setClientLists(combinedOptions);            
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
    }

    const getClientTargetBehaviors = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/aba/getClientTargetBehavior';
                
        await Axios.post(url, {
            "clientID" : 1,
            "employeeUsername" : loggedInUser
        })
        .then((response) => {
            if (response.data.statusCode === 200) {
                const fetchedOptions = response.data.behaviorSkillData.map((behavior: { bsID: number, name: string }) => ({
                    value: behavior.bsID,
                    label: behavior.name,
                }));
                
                // Prepend the default option to the fetched options
                const combinedOptions = [{ value: 'null', label: 'Select Target Behavior' }, ...fetchedOptions];
                setTargetOptions(combinedOptions);            
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
    }

    const handleTargetAMTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        let numericValue = value === '' ? NaN : parseFloat(value);
        if (numericValue <= 0) {
            numericValue = 1;
        }
        setTargetAmt(numericValue);
    };

    useEffect(() => {
        // Initialize dates array with empty strings based on targetAmt
        if (targetAmt > 0) {
            setSelectedTargets(Array(targetAmt).fill(''));
            setDates(Array(targetAmt).fill(''));
            setTimes(Array(targetAmt).fill(''));
        }
    }, [targetAmt]);

    const handleOptionChange = (index: number, value: string) => {
        const selectedOptions = [...selectedTargets];
        selectedOptions[index] = value;
        setSelectedTargets(selectedOptions);
    };

    const handleDateChange = (index: number, value: string) => {
        const newDates = [...dates];
        newDates[index] = value;
        setDates(newDates);
    };

    const handleTimeChange = (index: number, value: string) => {
        const newTimes = [...times];
        newTimes[index] = value;
        setDates(newTimes);
    };

    return (
        <>
            <Header />
            <div className={componentStyles.pageBody}>
                <main>
                    {isLoading ?
                        <Loading />
                        :
                        <div className={componentStyles.bodyBlock}>
                            <h1 className={componentStyles.pageHeader}>Data Entry</h1>
                            <div className={componentStyles.innerBlock}>
                                <p className={componentStyles.statusMessage}>{statusMessage ? statusMessage : null}</p>
                                <ul className={componentStyles.innerTab}>
                                    <li><Link href='/DataEntry/TargetBehavior' hrefType='link' placeholder="Target Behavior" /></li>
                                    <li><Link href='/DataEntry/SkillAquisition' hrefType='link' placeholder="Skill Aquisition" /></li>
                                </ul>

                                <label className={componentStyles.dataEntryInputAMT}>Number of target:
                                    <InputFields name="targetAmtField" type="number" placeholder="1" requiring={true} value={targetAmt} onChange={handleTargetAMTChange} />
                                </label>

                                <table className={componentStyles.dataEntryTable}>
                                    <thead>
                                        <tr>
                                            <th>Target:</th>
                                            <th>Session Date:</th>
                                            <th>Time:</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {targetAmt > 0 && dates.map((date, index) =>
                                            <tr key={index}>
                                                <td><SelectDropdown name={`TargetBehavior-${index}`} requiring={true} value={selectedTargets[index]} options={targetOptions} onChange={(e) => handleOptionChange(index, e.target.value)} /></td>
                                                <td><DateFields name={`SessionDate-${index}`} requiring={true} value={dates[index]} onChange={(e) => handleDateChange(index, e.target.value)} /></td>
                                                <td><TimeFields name={`SessionTime-${index}`} requiring={true} value={times[index]} onChange={(e) => handleTimeChange(index, e.target.value)} /></td>
                                            </tr>
                                        )}
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

export default DataEntry;