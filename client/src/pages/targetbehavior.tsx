import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import componentStyles from '../styles/components.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import Loading from '../components/loading';
import SelectDropdown from '../components/Selectdropdown';
import Checkbox from '../components/Checkbox';
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
    const [checkedBehaviors, setCheckedBehaviors] = useState<{ id: string; name: string }[]>([]);
    const [checkedMeasurementType, setCheckedMeasurementType] = useState<string>('');
    const [checkedState, setCheckedState] = useState<boolean[]>([]); // Track checked state
    const maxCheckedLimit = 4; // Define a limit for checkboxes

    useEffect(() => {
        if (!userLoggedIn || !cookieIsValid) {
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        } else {
            setIsLoading(true);
            sessionStorage.removeItem('checkedBehaviors')
            getClientNames();
        }
    }, [userLoggedIn]);

    useEffect(() => {
        if (selectedClientID > 0) {
            getClientTargetBehaviors();
        }
    }, [selectedClientID]);

    useEffect(() => {
        if (checkedBehaviors.length > 0) {
            const firstCheckedBehaviorID = checkedBehaviors[0].id;
            const firstCheckedBehavior = targetOptions.find(option => option.value === Number(firstCheckedBehaviorID));
    
            if (firstCheckedBehavior && firstCheckedBehavior.measurementType !== checkedMeasurementType) {
                setCheckedMeasurementType(firstCheckedBehavior.measurementType || '');
            }
        }
    }, [checkedBehaviors, targetOptions, checkedMeasurementType]);

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
                const fetchedOptions = response.data.behaviorSkillData.map((behavior: { bsID: number, name: string, definition: string, dateCreated: string, measurement: string, behaviorCategory: string }) => ({
                    value: behavior.bsID,
                    label: behavior.name,
                    definition: behavior.definition,
                    dateCreated: behavior.dateCreated,
                    measurementType: behavior.measurement,
                    behaviorCategory: behavior.behaviorCategory,
                }));
                setTargetOptions(fetchedOptions);
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

    const handleClientChange = (value: any) => {
        setStatusMessage('');
        setTargetOptions([]);
        setSelectedClient(value);
        const numericValue = value === '' ? NaN : parseFloat(value);
        setSelectedClientID(numericValue);
        setCheckedState(new Array(targetOptions.length).fill(false)); // Reset checkboxes
    };

    const handleCheckBoxChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedCheckedState = [...checkedState];
        const selectedBehavior = targetOptions[index];
        
        if (e.target.checked) {
            const currentCheckedCount = updatedCheckedState.filter(Boolean).length;
        
            if (currentCheckedCount < maxCheckedLimit) {
                updatedCheckedState[index] = true;
                setCheckedState(updatedCheckedState);
                
                // Add clientName and measurementType to the checked behavior data
                setCheckedBehaviors(prev => {
                    const newCheckedBehaviors = [
                        ...prev, 
                        {
                            id: String(selectedBehavior.value),
                            name: selectedBehavior.label,
                            clientName: selectedClient,  // Add clientName
                            measurementType: selectedBehavior.measurementType,  // Add measurementType
                        }
                    ];
                    sessionStorage.setItem('checkedBehaviors', JSON.stringify(newCheckedBehaviors));
                    return newCheckedBehaviors;
                });
            }
        } else {
            updatedCheckedState[index] = false;
            setCheckedState(updatedCheckedState);
            setCheckedBehaviors(prev => {
                const newCheckedBehaviors = prev.filter(behavior => behavior.id !== String(selectedBehavior.value));
                sessionStorage.setItem('checkedBehaviors', JSON.stringify(newCheckedBehaviors));
                return newCheckedBehaviors;
            });
        }
    };
        
    const isCheckboxDisabled = (index: number) => {
        const selectedMeasurementType = checkedBehaviors.length > 0 ? targetOptions.find(option => option.value === Number(checkedBehaviors[0].id))?.measurementType : null;
        const currentBehaviorMeasurementType = targetOptions[index].measurementType;
        return checkedBehaviors.length > 0 && currentBehaviorMeasurementType !== selectedMeasurementType && !checkedState[index];
    };
        
    const addBehaviorDetail = () => {
        navigate(`/TargetBehavior/Add/${selectedClientID}`);
    }

    const openBehaviorDetail = (id: string | number) => {
        navigate(`/TargetBehavior/Detail/${id}`);
    }

    const graphBehaviorCall = (index: number | string, name: string) => {
        const storedCheckedBehaviors = JSON.parse(sessionStorage.getItem('checkedBehaviors') || '[]');
        
        // Find the corresponding behavior object in targetOptions to get its measurementType
        const selectedBehavior = targetOptions.find(option => option.value === index);
        
        if (!selectedBehavior) return; // If no behavior is found, exit
    
        // Create the behavior object with additional clientName and measurementType
        const behaviorObject = { 
            id: index, 
            name: name,
            clientName: selectedClient,  // Add clientName
            measurementType: selectedBehavior.measurementType,  // Add measurementType
        };
        
        // Check if the behavior is already in the storedCheckedBehaviors array
        if (!storedCheckedBehaviors.some((behavior: { id: string }) => behavior.id === index)) {
            storedCheckedBehaviors.push(behaviorObject);
            sessionStorage.setItem('checkedBehaviors', JSON.stringify(storedCheckedBehaviors));
        }
    
        navigate(`/TargetBehavior/graph`);
    };
                
    const mergeBehaviorCall = () => {
        const storedCheckedIds = JSON.parse(sessionStorage.getItem('checkedBehaviorIds') || '[]');
        if (storedCheckedIds.length < 2) {
            setStatusMessage('You need to select two or more behaviors to merge')
        }
        else {
            navigate(`/TargetBehavior/Edit`);
        }
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
                                <Button nameOfClass='tbHRSAddButton' placeholder='Add' btnType='button' isLoading={isLoading} onClick={addBehaviorDetail}/>
                            </div>
                            <p className={componentStyles.statusMessage}>{statusMessage ? <b>{statusMessage}</b> : null}</p>
                            <div className={componentStyles.innerBlock}>
                                <div className={componentStyles.tbHRSTopBar}>
                                    <label className={componentStyles.clientNameDropdown}>
                                        Current Behavior for
                                        <SelectDropdown name={`ClientName`} requiring={true} value={selectedClient} options={clientLists} onChange={(e) => handleClientChange(e.target.value)} />
                                    </label>
                                </div>    
                                <table className={componentStyles.tbHRSTable}>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Behavior Name</th>
                                            <th>Definition</th>
                                            <th>Measurement</th>
                                            <th>Data Today</th>
                                            <th>Graph</th>
                                            <th>Merge</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {targetOptions.map((option, index) => (
                                            <tr key={index}>
                                                <td><div><Checkbox nameOfClass='tbGraphTable' label={option.label} isChecked={checkedState[index]} onChange={handleCheckBoxChange(index)} disabled={isCheckboxDisabled(index)}/></div></td>
                                                <td onClick={() => openBehaviorDetail(option.value)}><div>{option.label}</div></td>
                                                <td onClick={() => openBehaviorDetail(option.value)}><div>{option.definition}</div></td>
                                                <td onClick={() => openBehaviorDetail(option.value)}><div>{option.measurementType}</div></td>
                                                <td onClick={() => openBehaviorDetail(option.value)}><div>0</div></td>
                                                <td><div><Button nameOfClass='tbHRSGraphButton' placeholder='Graph' btnType='button' isLoading={isLoading} onClick={(e) => {e.stopPropagation(); graphBehaviorCall(option.value, option.label)}}/></div></td>
                                                <td><div><Button nameOfClass='tbHRSMergeButton' placeholder='Merge' btnType='button' isLoading={isLoading} onClick={(e) => {e.stopPropagation(); mergeBehaviorCall()}}/></div></td>
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