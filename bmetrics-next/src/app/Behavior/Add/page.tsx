"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import componentStyles from '../../../styles/components.module.scss';
import Header from '../../../components/header';
import Button from '../../../components/Button';
import Loading from '../../../components/loading';
import { GetLoggedInUserStatus, GetLoggedInUser, isCookieValid } from '../../../function/VerificationCheck';
import Axios from 'axios';
import SelectDropdown from '../../../components/Selectdropdown';
import InputFields from '../../../components/Inputfield';
import TextareaInput from '../../../components/TextareaInput';

interface Behavior {
    behaviorName: string;
    behaviorDefinition: string;
    behaviorMeasurement: string;
    behaviorCategory: string;
    type: string;
    clientID: number;
    clientName: string;
}

const AddTargetBehavior: React.FC = () => {
    const navigate = useRouter();
    const userLoggedIn = GetLoggedInUserStatus();
    const loggedInUser = GetLoggedInUser();
    const cookieIsValid = isCookieValid();
    const behaviorOrSkill = 'Behavior';
    const behaviorCategories = ['Select a Behavior Category', 'Aggression', 'Dangerous Acts', 'Disrobing', 'Disruption', 'Elopement', 'Feeding/Mealtime', 'Inappropriate Social', 'Moto Stereotypy', 'Noncompliance/Refusal', 'Other', 'Property Destruction', 'Rituals/Compulsive/Habit/Tics', 'Self-Injury', 'Sexual Behavior', 'Sleep/Toileting', 'Verbal', 'Visual Stereotype', 'Vocal'].map((category) => ({ value: category, label: category }));
    const behaviorMeasurements = ['Select a Measurement Type', 'Frequency', 'Duration', 'Rate'].map((measurement) => ({ value: measurement, label: measurement }));
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<React.ReactNode>('');
    const [clearMessageStatus, setClearMessageStatus] = useState<boolean>(false);
    const [timerCount, setTimerCount] = useState<number>(0);
    const [clientLists, setClientLists] = useState<{ value: string; label: string }[]>([]);
    const [selectedClient, setSelectedClient] = useState<string>('');
    const [selectedClientID, setSelectedClientID] = useState<number>(0);
    const [behaviorName, setBehaviorName] = useState<string>('');
    const [behaviorCategorySelected, setBehaviorCategorySelected] = useState<string>('');
    const [otherBehaviorCategories, setOtherBehaviorCategory] = useState<string>('');
    const [behaviorDefinition, setBehaviorDefinition] = useState<string>('');
    const [behaviorMeasurementSelected, setBehaviorMeasurementSelected] = useState<string>('');
    const [behaviorsToAdd, setBehaviorsToAdd] = useState<{ clientName: string, clientID: number, behaviorName: string, behaviorCategory: string, behaviorDefinition: string, behaviorMeasurement: string, type: string }[]>([]);

    useEffect(() => {
        getClientNames();
    }, [userLoggedIn]);

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
                throw new Error(response.data.serverMessage);
            }
        } catch (error) {
            return setStatusMessage(String(error));
        }
        finally {
            setIsLoading(false);
        }
    };

    const handleClientChange = (value: any) => {
        setSelectedClient(value.name);
        const numericValue = value.id === '' ? NaN : parseFloat(value.id);
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
        navigate.back();
    };

    const addBehavior = () => {
        if (behaviorName.length < 3 || behaviorCategorySelected === 'Select a Behavior Category' || behaviorDefinition.length < 3 || behaviorMeasurementSelected === 'Select a Measurement Type') {
            setStatusMessage('Please fill out all fields');
        } else {
            const newBehavior = { clientName: selectedClient, clientID: selectedClientID, behaviorName: behaviorName, behaviorCategory: behaviorCategorySelected === 'Other' ? otherBehaviorCategories : behaviorCategorySelected, behaviorDefinition: behaviorDefinition, behaviorMeasurement: behaviorMeasurementSelected, type: behaviorOrSkill };
            setBehaviorsToAdd([...behaviorsToAdd, newBehavior]);
            setBehaviorName('');
            setBehaviorCategorySelected('Select a Behavior Category');
            if (otherBehaviorCategories.length > 0) {
                setOtherBehaviorCategory('');
            }
            setBehaviorDefinition('');
            setBehaviorMeasurementSelected('Select a Measurement Type');
        }
    }

    const submitBehavior = async () => {
        setIsLoading(true);
        if (!userLoggedIn || !cookieIsValid) {
            const previousUrl = encodeURIComponent(location.pathname);
            navigate.push(`/Login?previousUrl=${previousUrl}`);

        }
        
        const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/aba/addNewTargetBehavior';
        try {
            const response = await Axios.post(url, {
                "employeeUsername": loggedInUser,
                "behaviors": behaviorsToAdd
            });
            if (response.data.statusCode === 204) {
                setStatusMessage(response.data.serverMessage);
                setBehaviorsToAdd([]);
                setClearMessageStatus(true);
                setTimerCount(5);
            } else if (response.data.statusCode === 500 && response.data.failedBehaviors) {
                setStatusMessage(response.data.serverMessage);
                const failedBehaviors: Behavior[] = response.data.failedBehaviors;
                setBehaviorsToAdd(failedBehaviors);
            } else {
                throw new Error(response.data.serverMessage)
            }
        } catch (error) {
            return setStatusMessage(String(error));
        }
        finally {
            setIsLoading(false);
        }
    }

    const removeBehavior = (index: number) => {
        const newBehaviors = [...behaviorsToAdd];
        newBehaviors.splice(index, 1);
        setBehaviorsToAdd(newBehaviors);
    }

  return (
    <>
        <Header />
        <Head>
            <title>Add Behavior - BMetrics</title>
        </Head>
        <div className={componentStyles.pageBody}>
            <main>
                {isLoading ? 
                    <Loading/> 
                    :
                    <div className={componentStyles.bodyBlock}>
                        <h1 className={componentStyles.pageHeader}>Add Behavior</h1>
                        <div className={componentStyles.tbHRSButtons}>
                            <Button nameOfClass='tbBackButton' placeholder='Back' btnType='button' isLoading={isLoading} onClick={backButtonFuctionality}/>
                        </div>
                        <p className={componentStyles.statusMessage}>{statusMessage ? <b>{statusMessage}</b> : null}</p>
                        <div className={componentStyles.innerBlock}>
                            <div className={componentStyles.tbAddBehavior}>
                                <label className={componentStyles.clientNameDropdown}>
                                    <span>Current Behavior for:</span>
                                    <SelectDropdown name={`ClientName`} requiring={true} value={selectedClientID} options={clientLists} onChange={(e) => handleClientChange({ name: e.target.options[e.target.selectedIndex].text || '', id: e.target.value})} />
                                </label>
                                <label>
                                    <span>Enter a behavior name:</span>
                                    <InputFields name="behaviorNameField" type="text" placeholder="Behavior Name" requiring={true} value={behaviorName} onChange={(e) => setBehaviorName(e.target.value)}/>
                                </label>
                                <label>
                                    <span>Select a Behavior Category:</span>
                                    <SelectDropdown name='behaviorCategoryDropdown' requiring={true} value={behaviorCategorySelected} options={behaviorCategories} onChange={(e) => setBehaviorCategorySelected(e.target.value)} />
                                </label>
                                { behaviorCategorySelected === 'Other' &&
                                    <label>
                                        <span>Enter a behavior Category:</span>
                                        <InputFields name="behaviorCategoryField" type="text" placeholder="Behavior Category" requiring={true} value={otherBehaviorCategories} onChange={(e) => setOtherBehaviorCategory(e.target.value)}/>
                                    </label>
                                }
                                <label>
                                    <span>Enter a definition for the behavior:</span>
                                    <TextareaInput name='definitionTextField' nameOfClass={componentStyles.definitionTextField} placeholder="Behavior Definition" requiring={true} value={behaviorDefinition} onChange={(e) => setBehaviorDefinition(e.target.value)}/>
                                </label>
                                <label>
                                    <span>Select a Measurement Type:</span>
                                    <SelectDropdown name='behaviorMeasurementDropdown' requiring={true} value={behaviorMeasurementSelected} options={behaviorMeasurements} onChange={(e) => setBehaviorMeasurementSelected(e.target.value)} />
                                </label>
                                <Button nameOfClass={componentStyles.tbAddButton} placeholder='Add' btnType='button' isLoading={isLoading} onClick={addBehavior}/>
                            </div>
                            { behaviorsToAdd.length > 0 &&
                                <div className={componentStyles.tbAddedBehaviors}>
                                    <h2>Behaviors to Add</h2>
                                    <ul>
                                        {behaviorsToAdd.map((behavior, index) => (
                                            <li key={index}>
                                                <div className={componentStyles.tbTitleButton}>
                                                    <h3>{behavior.behaviorName}</h3>
                                                    <Button nameOfClass='tbRemoveButton' placeholder='X' btnName='Remove' btnType='button' onClick={() => removeBehavior(index)}/>
                                                </div>
                                                <p><b>Client:</b> {behavior.clientName}</p>
                                                <p><b>Category:</b> {behavior.behaviorCategory}</p>
                                                <p><b>Definition:</b> {behavior.behaviorDefinition}</p>
                                                <p><b>Measurement:</b> {behavior.behaviorMeasurement}</p>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button nameOfClass='tbSubmitButton' placeholder='Submit' btnType='button' isLoading={isLoading} onClick={submitBehavior}/>
                                </div>
                            }
                        </div>
                    </div>
                }
            </main>
        </div>
    </>
  );
}

export default AddTargetBehavior;