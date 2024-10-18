import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import componentStyles from '../styles/components.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import Loading from '../components/loading';
import SelectDropdown from '../components/Selectdropdown';
import Checkbox from '../components/Checkbox';
import { GetLoggedInUserStatus, GetLoggedInUser, isCookieValid } from '../function/VerificationCheck';
import Axios from 'axios';
import Button from '../components/Button';


const Graph: React.FC = () => {
    useEffect(() => {
        document.title = "Target Behavior - Behavior Monitoring";
    }, []);

    const navigate = useNavigate();
    const location = useLocation();
    const {selectedClientID} = useParams();
    const userLoggedIn = GetLoggedInUserStatus();
    const loggedInUser = GetLoggedInUser();
    const cookieIsValid = isCookieValid();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<React.ReactNode>('');
    const [clientName, setClientName] = useState<string>('');
    const [targetOptions, setTargetOptions] = useState<{ value: string | number; label: string; definition?: string; dateCreated?: string; measurementType?: string; behaviorCat?: string; dataToday?: number; }[]>([]);
    const [checkedState, setCheckedState] = useState<boolean[]>([]); // Track checked state
    const [checkedCount, setCheckedCount] = useState<number>(0); // Track how many are checked
    const maxCheckedLimit = 4; // Define a limit for checkboxes

    useEffect(() => {
        if ((!userLoggedIn || !cookieIsValid)) {
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        } else {
            setIsLoading(true);

            if (selectedClientID) {
                getClientName();
                getClientTargetBehaviors();
            }
        }
    }, [userLoggedIn]);

    const getClientName = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/aba/getClientInfo';
        try {
            const response = await Axios.post(url, { 
                "clientID": selectedClientID,
                "employeeUsername": loggedInUser 
            });
            if (response.data.statusCode === 200) {
                console.log(response.data)
                setClientName(response.data.clientData.fName + " " + response.data.clientData.lName);
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
                const fetchedOptions = response.data.behaviorSkillData.map((behavior: { bsID: number, name: string, definition: string, dateCreated: string, measurement: string, behaviorCategory: string }) => ({
                    value: behavior.bsID,
                    label: behavior.name,
                    definition: behavior.definition,
                    dateCreated: behavior.dateCreated,
                    measurementType: behavior.measurement,
                    behaviorCategory: behavior.behaviorCategory,
                }));
                setTargetOptions(fetchedOptions);
                // Initialize checkedState to false for all options
                setCheckedState(new Array(fetchedOptions.length).fill(false));
            } else {
                setStatusMessage(response.data.serverMessage);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckBoxChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedCheckedState = checkedState.map((item, idx) => 
            idx === index ? e.target.checked : item // Update only the clicked checkbox
        );

        const totalChecked = updatedCheckedState.filter(Boolean).length; // Count checked boxes

        // Enforce the max checked limit
        if (totalChecked <= maxCheckedLimit) {
            setCheckedState(updatedCheckedState);
            setCheckedCount(totalChecked);
            setStatusMessage('');

            if (totalChecked === maxCheckedLimit) {
                setStatusMessage(`You can only select up to ${maxCheckedLimit} behaviors.`);
            }
        }

    };

    const graphButtonFuctionality = () => {
        alert('Graph button is function')
    }

    const backButtonFuctionality = () => {
        alert('Back button is function')
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
                            <h1 className={componentStyles.pageHeader}>Graph Target Behavior</h1>
                            <div className={componentStyles.innerBlock}>
                                {statusMessage && <p className={componentStyles.statusMessage}>{statusMessage ? <b>{statusMessage}</b> : null}</p>}
                                <div className={componentStyles.tbHRSTopBar}><label className={componentStyles.clientNameDropdown}>Client: {clientName}</label></div>    
                                <table className={componentStyles.tbGraphTable}>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Behavior Name</th>
                                            <th>Measurement</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {targetOptions.map((option, index) => (
                                            <tr key={index}>
                                                <td><div><Checkbox nameOfClass='tbGraphTable' label={option.label} isChecked={checkedState[index]} onChange={handleCheckBoxChange(index)} disabled={!checkedState[index] && checkedCount >= maxCheckedLimit} /></div></td>
                                                <td><div>{option.label}</div></td>
                                                <td><div>{option.measurementType}</div></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className={componentStyles.tbGraphButtons}>
                                    <Button nameOfClass='tbGraphButton' placeholder='Graph' btnType='button' isLoading={isLoading} onClick={graphButtonFuctionality}/>
                                    <Button nameOfClass='tbGraphButton' placeholder='Back' btnType='button' isLoading={isLoading} onClick={backButtonFuctionality}/>
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

export default Graph;