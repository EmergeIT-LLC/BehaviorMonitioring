"use client";
import React, { useState, useEffect, JSX } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import componentStyles from '../../styles/components.module.scss';
import Header from '../../components/header';
import { getCurrentDate, getCurrentTime } from '../../function/DateTimes';
import InputFields from '../../components/Inputfield';
import SelectDropdown from '../../components/Selectdropdown';
import DateFields from '../../components/Datefield';
import TimeFields from '../../components/Timefield';
import TimerField from '../../components/Timer';
import Button from '../../components/Button';
import TextareaInput from '../../components/TextareaInput';
import Tab from '../../components/Tab';
import Loading from '../../components/loading';
import { GetLoggedInUserStatus, GetLoggedInUser, isCookieValid } from '../../function/VerificationCheck';
import Axios from 'axios';

const DataEntry: React.FC = () => {
    useEffect(() => {
        const storedData = sessionStorage.getItem('dataEntryState');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setActiveTab(parsedData.activeTab);
            setTargetAmt(parsedData.targetAmt);
            setSkillAmt(parsedData.skillAmt);
            setSelectedClient(parsedData.selectedClient);
            setSelectedClientID(parsedData.selectedClientID);
            setSelectedTargets(parsedData.selectedTargets);
            setSelectedSkills(parsedData.selectedSkills);
            setSelectedMeasurementTypes(parsedData.selectedMeasurementTypes);
            if (selectedTargets.length > 1 || selectedSkills.length > 1) {
                setDates(parsedData.dates);
                setTimes(parsedData.times);
            }
            setCount(parsedData.count);
            setDuration(parsedData.duration);
        }
        setIsInitialized(true);
    }, []);

    const navigate = useRouter();
    const userLoggedIn = GetLoggedInUserStatus();
    const loggedInUser = GetLoggedInUser();
    const cookieIsValid = isCookieValid();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<React.ReactNode>('');
    const [activeTab, setActiveTab] = useState<string>('Behavior');
    const [targetAmt, setTargetAmt] = useState<number>(1);
    const [skillAmt, setSkillAmt] = useState<number>(1);
    const [clientLists, setClientLists] = useState<{ value: string; label: string }[]>([]);
    const [selectedClient, setSelectedClient] = useState<string>('');
    const [selectedClientID, setSelectedClientID] = useState<number>(0);
    const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedMeasurementTypes, setSelectedMeasurementTypes] = useState<string[]>([]);
    const [dates, setDates] = useState<string[]>([]);
    const [times, setTimes] = useState<string[]>([]);
    const [targetOptions, setTargetOptions] = useState<{ value: string | number; label: string; measurementType?: string; }[]>([]);
    const [skillOptions, setSkillOptions] = useState<{ value: string | number; label: string; measurementType?: string; }[]>([]);
    const [sessionNoteDate, setSessionNoteDate] = useState<string>(getCurrentDate());
    const [sessionNoteTime, setSessionNoteTime] = useState<string>(getCurrentTime());
    const [sessionNotes, setSessionNotes] = useState<string>('');
    const [headers, setHeaders] = useState<JSX.Element[]>([]);
    const [count, setCount] = useState<number[]>([]);
    const [duration, setDuration] = useState<(string | null)[]>([]);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [timerCount, setTimerCount] = useState<number>(0);
    const [clearMessageStatus, setClearMessageStatus] = useState<boolean>(false);
        
    // Update storage
    useEffect(() => {
        if (isInitialized) {
            const dataToStore = {
                activeTab, targetAmt, skillAmt, selectedClient, selectedClientID,
                selectedTargets, selectedSkills, selectedMeasurementTypes,
                dates, times, count, duration
            };
            sessionStorage.setItem('dataEntryState', JSON.stringify(dataToStore));
        }
    }, [activeTab, targetAmt, skillAmt, selectedClient, selectedClientID, selectedTargets, selectedSkills, selectedMeasurementTypes, dates, times, count, duration, isInitialized]);

    useEffect(() => {
        getClientNames();
    }, [userLoggedIn]);

    useEffect(() => {
        if (timerCount > 0) {
            const timer = setTimeout(() => setTimerCount(timerCount - 1), 1000);
            return () => clearTimeout(timer);
        }
        if (timerCount === 0 && clearMessageStatus) {
            sessionStorage.removeItem('dataEntryState');
            setClearMessageStatus(false);
            setStatusMessage('');
        }
    }, [timerCount, clearMessageStatus]);

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
        setIsLoading(false);
    };

    const getClientTargetBehaviors = async () => {
        if (selectedClientID === 0) return;

        setIsLoading(true);
        if (!userLoggedIn || !cookieIsValid) {
            const previousUrl = encodeURIComponent(location.pathname);
            navigate.push(`/Login?previousUrl=${previousUrl}`);        
        }

        const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/aba/getClientTargetBehavior';
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
                setTargetOptions([{ value: 'null', label: 'Select A Behavior' }, ...fetchedOptions]);
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

    const getClientSkillAquisitions = async () => {
        if (selectedClientID === 0) return;

        setIsLoading(true);
        if (!userLoggedIn || !cookieIsValid) {
            const previousUrl = encodeURIComponent(location.pathname);
            navigate.push(`/Login?previousUrl=${previousUrl}`);        
        }

        const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/aba/getClientSkillAquisition';
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
                setSkillOptions([{ value: 'null', label: 'Select A Skill' }, ...fetchedOptions]);
            } else {
                throw new Error(response.data.serverMessage);
            }
        } catch (error) {
            return setStatusMessage(String(error));
        }
        setIsLoading(false);
    };

    const handleTargetAMTChange = (input: number | React.ChangeEvent<HTMLInputElement>) => {
        let numericValue: number;
    
        if (typeof input === 'number') {
            numericValue = input;
        } else {
            let value = input.target.value;
            numericValue = value === '' ? NaN : parseFloat(value);
        }
    
        if (numericValue <= 0 || isNaN(numericValue)) {
            numericValue = 1;
        }
    
        setTargetAmt(numericValue);
    };
    
    const handleSkillAMTChange = (input: number | React.ChangeEvent<HTMLInputElement>) => {
        let numericValue: number;

        if (typeof input === 'number') {
            numericValue = input;
        } else {
            let value = input.target.value;
            numericValue = value === '' ? NaN : parseFloat(value);
        }
    
        if (numericValue <= 0 || isNaN(numericValue)) {
            numericValue = 1;
        }
    
        setTargetAmt(numericValue);
    };

    useEffect(() => {
        if (activeTab === 'Behavior' && isInitialized) {
            setSelectedTargets(prev => {
                const newTargets = Array(targetAmt).fill(''); // Initialize with empty strings instead of null
                return newTargets.map((_, i) => prev[i] || '');
            });
                
            setDates(prev => {
                const newDates = Array(targetAmt).fill(getCurrentDate());
                return newDates.map((_, i) => prev[i] || getCurrentDate());
            });
    
            setTimes(prev => {
                const newTimes = Array(targetAmt).fill(getCurrentTime());
                return newTimes.map((_, i) => prev[i] || getCurrentTime());
            });
        } else if (activeTab === 'Skill' && isInitialized) {
            setSelectedSkills(prev => {
                const newSkills = Array(skillAmt).fill(''); // Initialize with empty strings instead of null
                return newSkills.map((_, i) => prev[i] || '');
            });
                
            setDates(prev => {
                const newDates = Array(skillAmt).fill(getCurrentDate());
                return newDates.map((_, i) => prev[i] || getCurrentDate());
            });
    
            setTimes(prev => {
                const newTimes = Array(skillAmt).fill(getCurrentTime());
                return newTimes.map((_, i) => prev[i] || getCurrentTime());
            });        }
    }, [targetAmt, activeTab, isInitialized]);
    

    const handleClientChange = (value: any) => {
        setStatusMessage('')
        setSelectedClient(value.name);
        let numericValue = value.id === '' ? NaN : parseFloat(value.id);
        setSelectedClientID(numericValue);
    };

    useEffect(() => {
        if (activeTab === 'Behavior') {
            setTargetOptions([{ value: 'null', label: 'Select A Behavior' }]);
            getClientTargetBehaviors();
        }
        else if (activeTab === 'Skill') {
            setSkillOptions([{ value: 'null', label: 'Select A Skill' }]);
            getClientSkillAquisitions();
        }
    }, [selectedClientID]);    

    const handleOptionChange = (index: number, value: string) => {
        if (!value) return; // Prevent empty strings from being set

        const updatedTargets = [...selectedTargets];
        updatedTargets[index] = value;
        setSelectedTargets(updatedTargets);
    
        // Handle clearing or resetting duration and count based on the new value
        if (value !== 'Duration' && value !== 'Rate') {
            // Clear the duration or count for the index if no longer needed
            setDuration(prevDurations => {
                const newDurations = [...prevDurations];
                newDurations[index] = null; // Set to null or default value
                return newDurations;
            });
    
            setCount(prevCounts => {
                const newCounts = [...prevCounts];
                newCounts[index] = NaN; // Set to null or default value
                return newCounts;
            });
        }
    };
    
    useEffect(() => {
        const newSelectedMeasurements = selectedTargets.map(targetValue => {
            const selectedOption = targetOptions.find(option => String(option.value) === targetValue);
            return selectedOption ? selectedOption.measurementType || '' : '';
        });
        setSelectedMeasurementTypes(newSelectedMeasurements);
    }, [selectedTargets, targetOptions]);

    const handleDateChange = (index: number, value: string) => {
        if (!value) return; // Prevent empty strings from being set
        const newDates = [...dates];
        newDates[index] = value;
        setDates(newDates);
    };

    const handleTimeChange = (index: number, value: string) => {
        if (!value) return; // Prevent empty strings from being set
        const newTimes = [...times];
        newTimes[index] = value;
        setTimes(newTimes);
    };

    useEffect(() => {
        const loadData = () => {
            if (selectedClient.length > 0) { setSelectedClient(selectedClient); }
            if (selectedClientID > 0) setSelectedClientID(selectedClientID);
            if (selectedTargets.length > 0) setSelectedTargets(selectedTargets);
            if (dates.length > 0) setDates(dates);
            if (times.length > 0) setTimes(times);
            if (count.length > 0) setCount(count);
            if (selectedMeasurementTypes.length > 0) setSelectedMeasurementTypes(selectedMeasurementTypes);
        };

        const generateTargetTableHeaders = () => {
            const newHeaders: JSX.Element[] = [
                <th key="remove"></th>,
                <th key="target">Target:</th>,
                <th key="sessionDate">Session Date:</th>,
                <th key="time">Time:</th>
            ];

            if (selectedMeasurementTypes.includes('Frequency') || selectedMeasurementTypes.includes('Rate')) {
                newHeaders.push(<th key="count">Count:</th>);
            }
            if (selectedMeasurementTypes.includes('Duration') || selectedMeasurementTypes.includes('Rate')) {
                newHeaders.push(<th key="duration">Duration:</th>);
            }    
            return newHeaders;
        };

        if (isInitialized) {
            loadData();  // Load data when component mounts
        }
        setHeaders(generateTargetTableHeaders());
    }, [selectedMeasurementTypes]);

    const renderTargetTableData = (index: number) => {
        const cells = [
            <td key={`remove-${index}`}><Button nameOfClass='tbRemoveButton' placeholder='Remove' btnType='button' onClick={() => removeEntry(index)}/></td>,
            <td key={`target-${index}`}><SelectDropdown name={`Target-${index}`} requiring={true} value={selectedTargets[index]} options={targetOptions} onChange={(e) => handleOptionChange(index, e.target.value)} /></td>,
            <td key={`sessionDate-${index}`}><DateFields name={`SessionDate-${index}`} requiring={true} value={dates[index]} onChange={(e) => handleDateChange(index, e.target.value)} /></td>,
            <td key={`time-${index}`}><TimeFields name={`SessionTime-${index}`} requiring={true} value={times[index]} onChange={(e) => handleTimeChange(index, e.target.value)} /></td>
        ];

        if (headers.some(header => header.key === 'count')) {
            cells.push(
                <td key={`count-${index}`}>
                    {selectedMeasurementTypes[index] === 'Frequency' || selectedMeasurementTypes[index] === 'Rate' ? 
                        (<InputFields name={`count-${index}`} type="number" placeholder="1" requiring={true} value={count[index]} onChange={(e) => handleCountChange(index, e)} />)  : null}
                </td>
            );
        }

        if (headers.some(header => header.key === 'duration')) {
            cells.push(
                <td key={`duration-${index}`}>
                    {selectedMeasurementTypes[index] === 'Duration' || selectedMeasurementTypes[index] === 'Rate' ? 
                        (<TimerField name={`duration-${index}`} required={true} initialValue={duration[index] || "00:00:00"} onChange={(time) => handleDurationChange(index, time)} />) : null}
                </td>
            );
        }
        return cells;
    };

    const handleCountChange  = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let numericValue = value === '' ? NaN : parseFloat(value);
        if (numericValue <= -1) {
            numericValue = 0;
        }
        const newCounts = [...count];
        newCounts[index] = numericValue;
        setCount(newCounts);
    };

    const handleDurationChange = (index: number, time: { hour: number; minute: number; second: number }) => {
        const timeString = `${time.hour}:${time.minute}:${time.second}`;
        const newDurations = [...duration];
        newDurations[index] = timeString;
        setDuration(newDurations);
    };
    
    const submitDataEntryForm = async () => {
        setIsLoading(true);
        if (!userLoggedIn || !cookieIsValid) {
            const previousUrl = encodeURIComponent(location.pathname);
            navigate.push(`/Login?previousUrl=${previousUrl}`);        
        }

        try {
            if (activeTab === 'Behavior') {
                const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/aba/submitTargetBehavior';

                const response = await Axios.post(url, {
                    "clientID": selectedClientID,
                    "targetAmt": targetAmt,
                    "selectedTargets": selectedTargets,
                    "selectedMeasurementTypes": selectedMeasurementTypes,
                    "dates": dates,
                    "times": times,
                    "count": count,
                    "duration": duration,
                    "employeeUsername": loggedInUser
                });
                if (response.data.statusCode === 201) {
                    setStatusMessage(<>{response.data.serverMessage}</>);
                    setTargetAmt(1);
                    setSkillAmt(1);
                    setSelectedTargets([]);
                    setSelectedSkills([]);
                    setSelectedMeasurementTypes([]);
                    setTimerCount(3);
                    setClearMessageStatus(true);                                   
                } else {
                    throw new Error(response.data.serverMessage);
                }    
            }
            else if (activeTab === 'Skill') {
                const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/aba/submitSkillAquisition';

                const response = await Axios.post(url, {
                    "clientID": selectedClientID,
                    "employeeUsername": loggedInUser
                });
                if (response.data.statusCode === 201) {
                    setStatusMessage(<>{response.data.serverMessage}</>);
                    setTargetAmt(1);
                    setSkillAmt(1);
                    setSelectedTargets([]);
                    setSelectedSkills([]);
                    setSelectedMeasurementTypes([]);
                    setTimerCount(3);
                    setClearMessageStatus(true);                                   
                } else {
                    throw new Error(response.data.serverMessage);
                }
            }
            else if (activeTab === 'Session Notes') {
                const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/aba/submitSessionNotes';

                const response = await Axios.post(url, {
                    "clientID": selectedClientID,
                    "sessionDate": sessionNoteDate,
                    "sessionTime": sessionNoteTime,
                    "sessionNotes": sessionNotes,
                    "employeeUsername": loggedInUser
                });
                if (response.data.statusCode === 201) {
                    setStatusMessage(<>{response.data.serverMessage}</>);
                    setSessionNotes('');
                    setTimerCount(3);
                    setClearMessageStatus(true);                                   
                } else {
                    throw new Error(response.data.serverMessage);
                }
            }
        } catch (error) {
            return setStatusMessage(String(error));
        }
        finally {
            setIsLoading(false);
        }
    }

    const removeEntry = (index: number) => {
        if (activeTab === 'Behavior') {
            const newSelectedTargets = [...selectedTargets];
            newSelectedTargets.splice(index, 1);
            setSelectedTargets(newSelectedTargets);

            if (index === 0 && targetOptions.length > 0) {
                handleOptionChange(index, String(targetOptions[0].value));
            }
            handleTargetAMTChange(targetAmt - 1);
    
        }
        else if (activeTab === 'Skill') {
            const newSelectedSkills = [...selectedSkills];
            newSelectedSkills.splice(index, 1);
            setSelectedSkills(newSelectedSkills);
            handleSkillAMTChange(skillAmt - 1);
        }
    }

    return (
        <>
            <Header />
            <Head>
                <title>Data Entry - BMetrics</title>
            </Head>
            <div className={componentStyles.pageBody}>
                <main>
                    {isLoading ?
                        <Loading />
                        :
                        <div className={componentStyles.bodyBlock}>
                            <div className={componentStyles.innerBlock}>
                                {statusMessage && <p className={componentStyles.statusMessage}>{statusMessage ? <b>{statusMessage}</b> : null}</p>}
                                <ul className={componentStyles.innerTab}>
                                    <li><Tab nameOfClass={activeTab === 'Behavior' ? componentStyles.activeTab : ''} placeholder="Behavior" onClick={() => setActiveTab('Behavior')}/></li>
                                    {/* <li><Tab nameOfClass={activeTab === 'Skill' ? componentStyles.activeTab : ''} placeholder="Skill" onClick={() => setActiveTab('Skill')}/></li> */}
                                    <li><Tab nameOfClass={activeTab === 'Session Notes' ? componentStyles.activeTab : ''} placeholder="Session Notes" onClick={() => setActiveTab('Session Notes')}/></li>
                                </ul>

                                <div className={componentStyles.dataEntryContainer}>
                                    {activeTab === 'Behavior' && (
                                        <label className={componentStyles.dataEntryInputAMT}>
                                            Number of target:
                                            <InputFields name="targetAmtField" type="number" placeholder="1" requiring={true} value={targetAmt} onChange={handleTargetAMTChange} />
                                        </label>
                                    )}
                                    {activeTab === 'Skill' && (
                                            <label className={componentStyles.dataEntryInputAMT}>
                                                Number of skill:
                                                <InputFields name="skillAmtField" type="number" placeholder="1" requiring={true} value={skillAmt} onChange={handleSkillAMTChange} />
                                            </label>
                                    )}
                                    {activeTab === 'Session Notes' && (
                                        <label className={componentStyles.dataEntryInputAMT}>
                                            Date and Time:
                                            <DateFields name='sessionNoteDate' nameOfClass={componentStyles.sessionNoteDate} requiring={true} value={sessionNoteDate} onChange={(e) => setSessionNoteDate(e.target.value)} />
                                            <TimeFields name='sessionNoteTime' nameOfClass={componentStyles.sessionNoteTime} requiring={true} value={sessionNoteTime} onChange={(e) => setSessionNoteTime(e.target.value)} />
                                        </label>
                                    )}
                                    <label className={componentStyles.clientNameDropdown}>
                                        Client:
                                        <SelectDropdown name={`ClientName`} requiring={true} value={selectedClientID} options={clientLists} onChange={(e) => handleClientChange({ name: e.target.options[e.target.selectedIndex].text || '', id: e.target.value})} />
                                    </label>
                                </div>
                                {activeTab === 'Behavior' && (
                                    <table className={componentStyles.dataEntryTable}>
                                        <thead>
                                            <tr>
                                                {headers}                                            
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {targetAmt > 0 && dates.map((date, index) =>
                                                <tr key={index}>
                                                    {renderTargetTableData(index)}
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                )}
                                {activeTab === 'Skill' && (
                                    <table className={componentStyles.dataEntryTable}>
                                    <thead>
                                        <tr>
                                            <th>Remove:</th>
                                            <th>Target:</th>
                                            <th>Session Date:</th>
                                            <th>Time:</th>
                                            {targetAmt > 0 && dates.map((date, index) =>
                                                selectedMeasurementTypes[index] && (
                                                    <th key={index}></th>
                                                )
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {skillAmt > 0 && dates.map((date, index) =>
                                            <tr key={index}>
                                                <td><SelectDropdown name={`Skill-${index}`} requiring={true} value={selectedSkills[index]} options={skillOptions} onChange={(e) => handleOptionChange(index, e.target.value)} /></td>
                                                <td><DateFields name={`SessionDate-${index}`} requiring={true} value={dates[index]} onChange={(e) => handleDateChange(index, e.target.value)} /></td>
                                                <td><TimeFields name={`SessionTime-${index}`} requiring={true} value={times[index]} onChange={(e) => handleTimeChange(index, e.target.value)} /></td>
                                                {selectedMeasurementTypes.includes('frequency') && (
                                                    <td></td>
                                                )}
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                )}
                                {activeTab === 'Session Notes' && (
                                    <div className={componentStyles.sessionNotesContainer}>
                                        <label>
                                            <span>Enter session notes for <b>{selectedClient}</b></span>
                                            <TextareaInput name='sessionNotesTextField' nameOfClass={componentStyles.sessionNotesTextField} placeholder="Enter session notes..." requiring={true} value={sessionNotes} onChange={(e) => setSessionNotes(e.target.value)}/>
                                        </label>
                                    </div>
                                )}
                                <Button nameOfClass='submitButton' placeholder='Submit' btnType='submit' isLoading={isLoading} onClick={submitDataEntryForm}/>
                            </div>
                        </div>
                    }
                </main>
            </div>
        </>
    );
}

export default DataEntry;