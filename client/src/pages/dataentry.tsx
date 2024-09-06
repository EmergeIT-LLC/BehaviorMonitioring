import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import componentStyles from '../styles/components.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import { getCurrentDate, getCurrentTime } from '../function/DateTimes';
import InputFields from '../components/Inputfield';
import SelectDropdown from '../components/Selectdropdown';
import DateFields from '../components/Datefield';
import TimeFields from '../components/Timefield';
import TimerField from '../components/Timer';
import Button from '../components/Button';
import Tab from '../components/Tab';
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
    const [activeTab, setActiveTab] = useState<string>('TargetBehavior');
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
    const [headers, setHeaders] = useState<JSX.Element[]>([]);
    const [count, setCount] = useState<number[]>([]);
    const [duration, setDuration] = useState<(string | null)[]>([]);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

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
        } catch (error) {
            console.error(error);
        }
    };

    const getClientTargetBehaviors = async () => {
        if (selectedClientID === 0) return;

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
                setTargetOptions([{ value: 'null', label: 'Select Target Behavior' }, ...fetchedOptions]);
            } else {
                setStatusMessage(response.data.serverMessage);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getClientSkillAquisitions = async () => {
        if (selectedClientID === 0) return;

        const url = process.env.REACT_APP_Backend_URL + '/aba/getClientSkillAquisition';
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
                setSkillOptions([{ value: 'null', label: 'Select Skill Aquisition' }, ...fetchedOptions]);
            } else {
                setStatusMessage(response.data.serverMessage);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleTargetAMTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        let numericValue = value === '' ? NaN : parseFloat(value);
        if (numericValue <= 0) {
            numericValue = 1;
        }
        setTargetAmt(numericValue);
    };

    const handleSkillAMTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        let numericValue = value === '' ? NaN : parseFloat(value);
        if (numericValue <= 0) {
            numericValue = 1;
        }
        setSkillAmt(numericValue);
    };

    useEffect(() => {
        if (activeTab === 'TargetBehavior' && isInitialized) {
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
        } else if (activeTab === 'SkillAquisition' && isInitialized) {
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
    

    const handleClientChange = (value: string) => {
        let numericValue = value === '' ? NaN : parseFloat(value);
        setSelectedClientID(numericValue);
        setSelectedClient(value);
    };

    useEffect(() => {
        if (activeTab === 'TargetBehavior') {
            getClientTargetBehaviors();
        }
        else if (activeTab === 'SkillAquisition') {
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
            const selectedOption = targetOptions.find(option => option.value.toString() === targetValue);
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

    const renderTargetTableData = (index: number) => {
        const cells = [
            <td key={`target-${index}`}><SelectDropdown name={`TargetBehavior-${index}`} requiring={true} value={selectedTargets[index]} options={targetOptions} onChange={(e) => handleOptionChange(index, e.target.value)} /></td>,
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
    
    const submitDataEntryForm = async () => {
        try {
            if (activeTab === 'TargetBehavior') {
                const url = process.env.REACT_APP_Backend_URL + '/aba/submitTargetBehavior';

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
                if (response.data.statusCode === 200) {
                    //Clear data
                } else {
                    setStatusMessage(response.data.serverMessage);
                }    
            }
            else if (activeTab === 'SkillAquisition') {
                const url = process.env.REACT_APP_Backend_URL + '/aba/submitSkillAquisition';
            }    
        } catch (error) {
            console.error(error);
        }
    }

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
                                    <li><Tab nameOfClass={activeTab === 'TargetBehavior' ? componentStyles.activeTab : ''} placeholder="Target Behavior" onClick={() => setActiveTab('TargetBehavior')}/></li>
                                    {/* <li><Tab nameOfClass={activeTab === 'SkillAquisition' ? componentStyles.activeTab : ''} placeholder="Skill Aquisition" onClick={() => setActiveTab('SkillAquisition')}/></li> */}
                                </ul>

                                <div className={componentStyles.dataEntryContainer}>
                                    {activeTab === 'TargetBehavior' && (
                                        <label className={componentStyles.dataEntryInputAMT}>
                                            Number of target:
                                            <InputFields name="targetAmtField" type="number" placeholder="1" requiring={true} value={targetAmt} onChange={handleTargetAMTChange} />
                                        </label>
                                    )}
                                    {activeTab === 'SkillAquisition' && (
                                            <label className={componentStyles.dataEntryInputAMT}>
                                                Number of skill:
                                                <InputFields name="skillAmtField" type="number" placeholder="1" requiring={true} value={targetAmt} onChange={handleSkillAMTChange} />
                                            </label>
                                    )}
                                    <label className={componentStyles.clientNameDropdown}>
                                        Client:
                                        <SelectDropdown name={`ClientName`} requiring={true} value={selectedClient} options={clientLists} onChange={(e) => handleClientChange(e.target.value)} />
                                    </label>
                                </div>
                                {activeTab === 'TargetBehavior' && (
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
                                {activeTab === 'SkillAquisition' && (
                                    <table className={componentStyles.dataEntryTable}>
                                    <thead>
                                        <tr>
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
                                                <td><SelectDropdown name={`SkillAquisition-${index}`} requiring={true} value={selectedSkills[index]} options={skillOptions} onChange={(e) => handleOptionChange(index, e.target.value)} /></td>
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
                                <Button nameOfClass='submitButton' placeholder='Submit' btnType='button' isLoading={isLoading} onClick={submitDataEntryForm}/>
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