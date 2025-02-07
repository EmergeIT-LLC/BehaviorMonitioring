import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import componentStyles from '../styles/components.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import Loading from '../components/loading';
import SelectDropdown from '../components/Selectdropdown';
import Checkbox from '../components/Checkbox';
import Link from '../components/Link';
import { GetLoggedInUserStatus, GetLoggedInUser, isCookieValid } from '../function/VerificationCheck';
import Axios from 'axios';
import Button from '../components/Button';
import PromptForMerge from '../components/PromptForMerge';
import PopoutPrompt from '../components/PopoutPrompt';

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
    const [checkedBehaviors, setCheckedBehaviors] = useState<{ id: string; name: string; measurementType: string | undefined }[]>([]);
    const [checkedState, setCheckedState] = useState<boolean[]>([]); // Track checked state
    const maxCheckedLimit = 4; // Define a limit for checkboxes
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
    const [isPopoutVisible, setIsPopoutVisible] = useState<boolean>(false);
    const [mergeBehaviorList, setMergeBehaviorList] = useState<{ id: string; name: string }[]>([]);
    const [popupAction, setPopupAction] = useState<string>('');
    const [behaviorNameToActOn, setBehaviorNameToActOn] = useState<string>('');
    const [behaviorIdToActOn, setBehaviorIdToActOn] = useState<string>('');
    const [timerCount, setTimerCount] = useState<number>(0);
    const [clearMessageStatus, setClearMessageStatus] = useState<boolean>(false);

    useEffect(() => {
        if (!userLoggedIn || !cookieIsValid) {
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        } else {
            setIsLoading(true);
            sessionStorage.removeItem('clientID')
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
        if (timerCount > 0) {
            const timer = setTimeout(() => setTimerCount(timerCount - 1), 1000);
            return () => clearTimeout(timer);
        }
        if (timerCount === 0 && clearMessageStatus) {
            setClearMessageStatus(false);
            setStatusMessage('')
        }
    }, [timerCount, clearMessageStatus]);

    const getClientNames = async () => {
        setIsLoading(true);
        if (!userLoggedIn || !cookieIsValid) {
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        }
        
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
        } catch (error) {
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    };

    const getClientTargetBehaviors = async () => {
        setIsLoading(true);
        if (!userLoggedIn || !cookieIsValid) {
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        }

        const url = process.env.REACT_APP_Backend_URL + '/aba/getClientTargetBehavior';
        try {
            const response = await Axios.post(url, {
                "clientID": selectedClientID,
                "employeeUsername": loggedInUser
            });
            if (response.data.statusCode === 200) {
                setTargetOptions([]);
                setCheckedState([]);
                setCheckedBehaviors([]);
                sessionStorage.removeItem('checkedBehaviors');

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
        setSelectedClient(value.name);
        const numericValue = value.id === '' ? NaN : parseFloat(value.id);
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
        const currentCheckedCount = checkedState.filter(Boolean).length;
    
        return (
            (checkedBehaviors.length > 0 && currentBehaviorMeasurementType !== selectedMeasurementType && !checkedState[index]) ||
            (!checkedState[index] && currentCheckedCount >= maxCheckedLimit)
        );
    };
            
    const addBehaviorDetail = () => {
        navigate(`/TargetBehavior/Add`);
    }

    const openBehaviorDetail = (id: string | number) => {
        navigate(`/TargetBehavior/Detail/${id}`);
    }

    const graphBehaviorCall = (index: number | string, name: string) => {
        sessionStorage.setItem('clientID', String(selectedClientID));
        const storedCheckedBehaviors = JSON.parse(sessionStorage.getItem('checkedBehaviors') || '[]');
        const selectedBehavior = targetOptions.find(option => option.value === index);
    
        if (!selectedBehavior) return;
    
        const behaviorObject = { 
            id: index, 
            name, 
            clientName: selectedClient,
            measurementType: selectedBehavior.measurementType,
        };
    
        const updatedBehaviors = [...storedCheckedBehaviors.filter((b: any) => b.id !== index), behaviorObject];
        sessionStorage.setItem('checkedBehaviors', JSON.stringify(updatedBehaviors));
    
        navigate(`/TargetBehavior/graph`);
    };

    const handleEllipsisClick = (index: number) => {
        if (activeMenu === index) {
            closeMenu(); // Close if clicked again
        } else {
            setActiveMenu(index); // Open for the clicked row
        }
    };
    
    const getMenuPosition = (menuIndex: number) => {
        const ellipsisButton = document.querySelectorAll('.tbHRSEllipsesButton')[menuIndex];
        if (ellipsisButton) {
            const buttonRect = ellipsisButton.getBoundingClientRect();
            const menuTop = buttonRect.top + window.scrollY; // Account for scrolling
            const menuLeft = buttonRect.left + window.scrollX + buttonRect.width; // Offset for width
            return {
                top: `${menuTop}px`,
                left: `${menuLeft}px`,
            };
        }
        return { top: '0px', left: '0px' };
    };
            
    const closeMenu = () => setActiveMenu(null); // Close the menu    
                
    const mergeBehaviorCall = () => {
        if (checkedBehaviors.length < 2) {
            setStatusMessage('You need to select two or more behaviors to merge');
            return;
        }
    
        const measurementType = checkedBehaviors[0].measurementType;
        const allSameType = checkedBehaviors.every((behavior) => behavior.measurementType === measurementType);
    
        if (!allSameType) {
            setStatusMessage('An error occurred during the merge');
            return;
        }
    
        setMergeBehaviorList(checkedBehaviors.map(({ id, name }) => ({ id, name })));
        setIsPopupVisible(true);
    };

    const handleMergeConfirm = async (targetBehaviorId: string) => {
        setIsPopupVisible(false);
        setIsLoading(true);
        if (!userLoggedIn || !cookieIsValid) {
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        }
        
        try {
            const url = process.env.REACT_APP_Backend_URL + '/aba/mergeBehaviors';
            const response = await Axios.post(url, {
                "clientID": selectedClientID,
                targetBehaviorId,
                mergeBehaviorIds: checkedBehaviors
                    .filter((behavior) => behavior.id !== targetBehaviorId)
                    .map((behavior) => behavior.id),
                "employeeUsername": loggedInUser

            });
    
            if (response.data.statusCode === 200) {
                setStatusMessage('Behaviors merged successfully.');
                getClientTargetBehaviors();
                setTimerCount(3);
                setClearMessageStatus(true);                                   
            } else {
                setStatusMessage(response.data.serverMessage || 'Merge failed');
            }
        } catch (error) {
            console.error(error);
            setStatusMessage('An error occurred while merging behaviors');
        }
        finally {
            setIsLoading(false);
        }
    };
    
    const handleArchiveDelete = async () => {
        setIsPopoutVisible(false);
        if (popupAction === 'Archive') {
            await archiveBehaviorCall(behaviorIdToActOn, behaviorNameToActOn);
        } else if (popupAction === 'Delete') {
            await deleteBehaviorCall(behaviorIdToActOn, behaviorNameToActOn);
        }
    };

    const archiveBehaviorCall = async (behaviorId: string, behaviorName: string) => {
        setIsLoading(true);
        if (!userLoggedIn || !cookieIsValid) {
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        }
        
        try {
            const url = process.env.REACT_APP_Backend_URL + '/aba/archiveBehavior';
            const response = await Axios.post(url, {  "clientID": selectedClientID, behaviorId, "employeeUsername": loggedInUser });
            if (response.data.statusCode === 200) {
                setStatusMessage(<> Behavior "{behaviorName}" has been archived successfully. <br /> "{behaviorName}" will be archived for 7 years before deletion.</>);
                getClientTargetBehaviors();
                setTimerCount(3);
                setClearMessageStatus(true);                                   
            } else {
                setStatusMessage(`Failed to archive "${behaviorName}".`);
            }
        } catch (error) {
            console.error(error);
            setStatusMessage('An error occurred while archiving.');
        }
        finally {
            setIsLoading(false);
        }
    };

    const deleteBehaviorCall = async (behaviorId: string, behaviorName: string) => {
        setIsLoading(true);
        if (!userLoggedIn || !cookieIsValid) {
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        }
        
        try {
            const url = process.env.REACT_APP_Backend_URL + '/aba/deleteBehavior';
            const response = await Axios.post(url, { "clientID": selectedClientID, behaviorId, "employeeUsername": loggedInUser });
            if (response.data.statusCode === 200) {
                setStatusMessage(`Behavior "${behaviorName}" has been deleted successfully.`);
                getClientTargetBehaviors();
                setTimerCount(3);
                setClearMessageStatus(true);                                   
        } else {
                setStatusMessage(`Failed to delete "${behaviorName}".`);
            }
        } catch (error) {
            console.error(error);
            setStatusMessage('An error occurred while deleting.');
        }
        finally {
            setIsLoading(false);
        }
    };

    const openPopout = (action: string, behaviorId: string, behaviorName: string) => {
        setPopupAction(action);
        setBehaviorNameToActOn(behaviorName);
        setBehaviorIdToActOn(behaviorId);
        setIsPopoutVisible(true);
    };

    const handleArchiveMergeDeleteCancel = () => {
        setIsPopupVisible(false);
        setIsPopoutVisible(false);
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
                                <Button nameOfClass='tbHRSAddButton' placeholder='Add Behavior' btnType='button' isLoading={isLoading} onClick={addBehaviorDetail}/>
                                <Link href='/TargetBehavior/Archive' hrefType='link' placeholder="Archived Behavior" />
                            </div>
                            <p className={componentStyles.statusMessage}>{statusMessage ? <b>{statusMessage}</b> : null}</p>
                            <div className={componentStyles.innerBlock}>
                                <div className={componentStyles.tbHRSTopBar}>
                                    <label className={componentStyles.clientNameDropdown}>
                                        Current Behavior for
                                        <SelectDropdown name={`ClientName`} requiring={true} value={selectedClientID} options={clientLists} onChange={(e) => handleClientChange({ name: e.target.options[e.target.selectedIndex].text || '', id: e.target.value})} />
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
                                            <th>More Options</th>
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
                                                <td><div><Button nameOfClass='tbHRSEllipsesButton' btnName='More options' placeholder='...' btnType='button' isLoading={isLoading} onClick={(e) => {e.stopPropagation(); handleEllipsisClick(index)}}/></div></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {activeMenu !== null && (
                                    <div className={componentStyles.popoutMenu} style={getMenuPosition(activeMenu)}>
                                        <ul>
                                            <li onClick={() => { closeMenu(); mergeBehaviorCall(); }}>Merge</li>
                                            <li onClick={() => { const selectedBehavior = targetOptions[activeMenu]; closeMenu(); openPopout('Archive', String(selectedBehavior.value), selectedBehavior.label); }}>Archive</li>
                                            <li onClick={() => { const selectedBehavior = targetOptions[activeMenu]; closeMenu(); openPopout('Delete', String(selectedBehavior.value), selectedBehavior.label); }}>Delete</li>
                                            <li onClick={closeMenu}>Close Menu</li>
                                        </ul>
                                    </div>
                                )}
                                <PromptForMerge isVisible={isPopupVisible} behaviors={mergeBehaviorList} onConfirm={handleMergeConfirm} onCancel={handleArchiveMergeDeleteCancel} />
                                <PopoutPrompt title={`${popupAction} Behavior`} message={`Are you sure you want to ${popupAction.toLowerCase()} the behavior "${behaviorNameToActOn}"?`} onConfirm={handleArchiveDelete} onCancel={() => setIsPopoutVisible(false)} isVisible={isPopoutVisible} behaviorNameSelected={behaviorNameToActOn} />
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