"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import componentStyles from '../../../styles/components.module.scss';
import Header from '../../../components/header';
import Loading from '../../../components/loading';
import SelectDropdown from '../../../components/Selectdropdown';
import { GetLoggedInUserStatus, GetLoggedInUser, isCookieValid } from '../../../function/VerificationCheck';
import Axios from 'axios';
import Button from '../../../components/Button';
import PopoutPrompt from '../../../components/PopoutPrompt';


const Archive: React.FC = () => {
    const navigate = useRouter();
    const userLoggedIn = GetLoggedInUserStatus();
    const loggedInUser = GetLoggedInUser();
    const cookieIsValid = isCookieValid();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [timerCount, setTimerCount] = useState<number>(0);
    const [clearMessageStatus, setClearMessageStatus] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<React.ReactNode>('');
    const [clientLists, setClientLists] = useState<{ value: string; label: string }[]>([]);
    const [selectedClient, setSelectedClient] = useState<string>('');
    const [selectedClientID, setSelectedClientID] = useState<number>(0);
    const [archivedBehaviors, setArchivedBehaviors] = useState<{ value: string | number; label: string; definition?: string; dateCreated?: string; measurementType?: string; behaviorCat?: string; }[]>([]);
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
    const [isPopoutVisible, setIsPopoutVisible] = useState<boolean>(false);
    const [mergeBehaviorList, setMergeBehaviorList] = useState<{ id: string; name: string }[]>([]);
    const [popupAction, setPopupAction] = useState<string>('');
    const [behaviorNameToActOn, setBehaviorNameToActOn] = useState<string>('');
    const [behaviorIdToActOn, setBehaviorIdToActOn] = useState<string>('');

    useEffect(() => {
        getClientNames();
    }, [userLoggedIn]);

        useEffect(() => {
            if (selectedClientID > 0) {
                getClientArchivedBehaviors();
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
    }, [timerCount, clearMessageStatus]);;

    const getClientNames = async () => {
        setIsLoading(true);
        if (!userLoggedIn || !cookieIsValid) {
            const previousUrl = encodeURIComponent(location.pathname);
            navigate.push(`/Login?previousUrl=${previousUrl}`);        
        }
        
        const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/aba/getAllClientInfo';
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

    const getClientArchivedBehaviors = async () => {
        setIsLoading(true);
        if (!userLoggedIn || !cookieIsValid) {
            const previousUrl = encodeURIComponent(location.pathname);
            navigate.push(`/Login?previousUrl=${previousUrl}`);        
        }

        const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/aba/getClientArchivedBehavior';
        try {
            const response = await Axios.post(url, {
                "clientID": selectedClientID,
                "employeeUsername": loggedInUser
            });
            if (response.data.statusCode === 200) {
                setArchivedBehaviors([]);

                const fetchedOptions = response.data.behaviorSkillData.map((behavior: { bsID: number, name: string, definition: string, dateCreated: string, measurement: string, behaviorCategory: string }) => ({
                    value: behavior.bsID,
                    label: behavior.name,
                    definition: behavior.definition,
                    dateCreated: behavior.dateCreated,
                    measurementType: behavior.measurement,
                    behaviorCategory: behavior.behaviorCategory,
                }));

                setArchivedBehaviors(fetchedOptions);
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
        setArchivedBehaviors([]);
        setSelectedClient(value);
        const numericValue = value === '' ? NaN : parseFloat(value);
        setSelectedClientID(numericValue);
    };

    const openBehaviorDetail = (id: string | number) => {
        sessionStorage.setItem('clientID', String(selectedClientID));
        sessionStorage.setItem('archivedBehaviorID', String(id));
        navigate.push(`/TargetBehavior/Archive_Detail`);
    }
    
    const openPopout = (action: string, behaviorId: string, behaviorName: string) => {
        setPopupAction(action);
        setBehaviorNameToActOn(behaviorName);
        setBehaviorIdToActOn(behaviorId);
        setIsPopoutVisible(true);
    };

    const handleReactivationDelete = async () => {
        if (popupAction === 'Reactivate') {
            await reactivateBehaviorCall(behaviorIdToActOn, behaviorNameToActOn);
        } else if (popupAction === 'Delete') {
            await deleteBehaviorCall(behaviorIdToActOn, behaviorNameToActOn);
        }
        setIsPopoutVisible(false); // Close the popout after action
    };

    const reactivateBehaviorCall = async (behaviorId: string, behaviorName: string) => {
        setIsLoading(true);
        if (!userLoggedIn || !cookieIsValid) {
            const previousUrl = encodeURIComponent(location.pathname);
            navigate.push(`/Login?previousUrl=${previousUrl}`);        
        }

        try {
            const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/aba/activateBehavior';
            const response = await Axios.post(url, {  "clientID": selectedClientID, behaviorId, "employeeUsername": loggedInUser });
            if (response.data.statusCode === 200) {
                setStatusMessage(`Behavior "${behaviorName}" has been reactived successfully.`);
                getClientArchivedBehaviors();
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
            const previousUrl = encodeURIComponent(location.pathname);
            navigate.push(`/Login?previousUrl=${previousUrl}`);        
        }

        try {
            const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/aba/deleteBehavior';
            const response = await Axios.post(url, { "clientID": selectedClientID, behaviorId, "employeeUsername": loggedInUser });
            if (response.data.statusCode === 200) {
                setStatusMessage(`Behavior "${behaviorName}" has been deleted successfully.`);
                getClientArchivedBehaviors();
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

    const backButtonFuctionality = () => {
        navigate.back();
    };

    onkeydown = (e) => {
        if (e.key === 'Escape') {
            backButtonFuctionality();
        }
    }

    return (
        <>
        <Header />
        <Head>
            <title>Archived Behavior - BMetrics</title>
        </Head>
        <div className={componentStyles.pageBody}>
            <main>
                {isLoading ? <Loading /> : 
                    <div className={componentStyles.bodyBlock}>
                        <h1 className={componentStyles.pageHeader}>Archived Behavior</h1>
                        <div className={componentStyles.tbHRSButtons}>
                            <Button nameOfClass='tbGraphButton' placeholder='Back' btnType='button' isLoading={isLoading} onClick={backButtonFuctionality}/>
                        </div>
                        <p className={componentStyles.statusMessage}>{statusMessage ? <b>{statusMessage}</b> : null}</p>
                            <div className={componentStyles.innerBlock}>
                                <div className={componentStyles.tbHRSTopBar}>
                                    <label className={componentStyles.clientNameDropdown}>
                                        Archived Behavior for
                                        <SelectDropdown name={`ClientName`} requiring={true} value={selectedClient} options={clientLists} onChange={(e) => handleClientChange(e.target.value)} />
                                    </label>
                                </div>
                                <table className={componentStyles.archiveTable}>
                                    <thead>
                                        <tr>
                                            <th>Behavior Name</th>
                                            <th>Definition</th>
                                            <th>Measurement</th>
                                            <th>Reactivate</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {archivedBehaviors.map((option, index) => (
                                            <tr key={index}>
                                                <td onClick={() => openBehaviorDetail(option.value)}><div>{option.label}</div></td>
                                                <td onClick={() => openBehaviorDetail(option.value)}><div>{option.definition}</div></td>
                                                <td onClick={() => openBehaviorDetail(option.value)}><div>{option.measurementType}</div></td>
                                                <td><div><Button nameOfClass='tbHRSButton' placeholder='Reactivate' btnType='button' isLoading={isLoading} onClick={(e) => {e.stopPropagation(); const selectedBehavior = archivedBehaviors[index]; openPopout('Reactivate', String(selectedBehavior.value), selectedBehavior.label);}}/></div></td>
                                                <td><div><Button nameOfClass='tbHRSButton' placeholder='Delete' btnType='button' isLoading={isLoading} onClick={(e) => {e.stopPropagation(); const selectedBehavior = archivedBehaviors[index]; openPopout('Delete', String(selectedBehavior.value), selectedBehavior.label);}}/></div></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <PopoutPrompt title={`${popupAction} Behavior`} message={`Are you sure you want to ${popupAction.toLowerCase()} the behavior "${behaviorNameToActOn}"?`} onConfirm={handleReactivationDelete} onCancel={() => setIsPopoutVisible(false)} isVisible={isPopoutVisible} behaviorNameSelected={behaviorNameToActOn} />
                            </div>
                    </div>
                }
            </main>
        </div>
        </>
    );
}

export default Archive;
