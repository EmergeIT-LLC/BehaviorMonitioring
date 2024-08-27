import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import componentStyles from '../styles/components.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
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
    const [duration, setDuration] = useState<string[]>([]);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    // Refill
    useEffect(() => {
        const storedData = localStorage.getItem('dataEntryState');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setActiveTab(parsedData.activeTab);
            setTargetAmt(parsedData.targetAmt);
            setSkillAmt(parsedData.skillAmt);
            setSelectedClient(parsedData.selectedClient);
            setSelectedClientID(parsedData.selectedClientID);
            setSelectedTargets(parsedData.selectedTargets || []);
            setSelectedSkills(parsedData.selectedSkills || []);
            setSelectedMeasurementTypes(parsedData.selectedMeasurementTypes || []);
            setDates(parsedData.dates || []);
            setTimes(parsedData.times || []);
            setCount(parsedData.count || []);
            setDuration(parsedData.duration || []);
        }
        setIsInitialized(true); // Mark the initialization as complete
    }, []);
    
    // Update storage
    useEffect(() => {
        if (isInitialized) {
            const dataToStore = {
                activeTab, targetAmt, skillAmt, selectedClient, selectedClientID,
                selectedTargets, selectedSkills, selectedMeasurementTypes,
                dates, times, count, duration
            };
            localStorage.setItem('dataEntryState', JSON.stringify(dataToStore));
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

    const getCurrentDate = (): string => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; // Returns 'YYYY-MM-DD'
    };

    const getCurrentTime = (): string => {
        const now = new Date();
        return now.toTimeString().slice(0, 5); // returns 'HH:MM'
    };

    const getClientNames = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/aba/getAllClientInfo';
        try {
            const response = await Axios.post(url, { "employeeUsername": loggedInUser });
            if (response.data.statusCode === 200) {
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
        if (activeTab === 'TargetBehavior' && targetAmt > 0) {
            if (selectedTargets) {
                setSelectedTargets(Array(targetAmt).fill(selectedTargets));
            }
            else {
                setSelectedTargets(Array(targetAmt).fill(null));
            }
            setDates(Array(targetAmt).fill(getCurrentDate()));
            setTimes(Array(targetAmt).fill(getCurrentTime()));
        }
        else if (activeTab === 'SkillAquisition' && skillAmt > 0) {
            if (selectedSkills) {
                setSelectedSkills(Array(skillAmt).fill(selectedSkills));
            }
            else {
                setSelectedSkills(Array(skillAmt).fill(null));
            }
            setDates(Array(skillAmt).fill(getCurrentDate()));
            setTimes(Array(skillAmt).fill(getCurrentTime()));
        }
    }, [targetAmt, skillAmt]);

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
    };

    useEffect(() => {
        const newSelectedMeasurements = selectedTargets.map(targetValue => {
            const selectedOption = targetOptions.find(option => option.value.toString() === targetValue);
            return selectedOption ? selectedOption.measurementType || '' : '';
        });
        setSelectedMeasurementTypes(newSelectedMeasurements);
    }, [selectedTargets, targetOptions]);

    const handleDateChange = (index: number, value: string) => {
        const newDates = [...dates];
        newDates[index] = value;
        setDates(newDates);
    };

    const handleTimeChange = (index: number, value: string) => {
        const newTimes = [...times];
        newTimes[index] = value;
        setTimes(newTimes);
    };

    useEffect(() => {
        const loadData = () => {
            const storedTargets = JSON.parse(localStorage.getItem('selectedTargets') || '[]');
            const storedDates = JSON.parse(localStorage.getItem('dates') || '[]');
            const storedTimes = JSON.parse(localStorage.getItem('times') || '[]');
            const storedCounts = JSON.parse(localStorage.getItem('count') || '[]');
            const storedMeasurementTypes = JSON.parse(localStorage.getItem('selectedMeasurementTypes') || '[]');

            if (storedTargets.length) setSelectedTargets(storedTargets);
            if (storedDates.length) setDates(storedDates);
            if (storedTimes.length) setTimes(storedTimes);
            if (storedCounts.length) setCount(storedCounts);
            if (storedMeasurementTypes.length) setSelectedMeasurementTypes(storedMeasurementTypes);
        };

        const generateHeaders = () => {
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

        loadData();  // Load data when component mounts
        setHeaders(generateHeaders());
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

    const renderTableData = (index: number) => {
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
                        (<TimerField name={`duration-${index}`} required={true} onChange={(time) => handleDurationChange(index, time)} />) : null}
                </td>
            );
        }
        return cells;
    };
    
    const submitDataEntryForm = () => {
        if (activeTab === 'TargetBehavior') {
            //To be filled out soon
        }
        else if (activeTab === 'SkillAquisition') {
            //To be filled out soon
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
                                                    {renderTableData(index)}
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