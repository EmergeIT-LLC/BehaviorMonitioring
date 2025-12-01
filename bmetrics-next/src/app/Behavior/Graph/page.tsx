"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import componentStyles from '../../../styles/components.module.scss';
import Header from '../../../components/header';
import Loading from '../../../components/loading';
import { GetLoggedInUserStatus, GetLoggedInUser, isCookieValid } from '../../../function/VerificationCheck';
import { debounceAsync } from '../../../function/debounce';
import Axios from 'axios';
import SelectDropdown from '../../../components/Selectdropdown';
import GraphDataProcessor from '../../../function/GraphDataProcessor';
import Button from '../../../components/Button';

// Define an interface for the selected behavior items
interface SelectedBehavior {
    id: number;
    name: string;
}

const Graph: React.FC = () => {
    const foundData = JSON.parse(sessionStorage.getItem('checkedBehaviors') || '[]');

    const navigate = useRouter();
    const userLoggedIn = GetLoggedInUserStatus();
    const loggedInUser = GetLoggedInUser();
    const cookieIsValid = isCookieValid();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<React.ReactNode>('');
    const clientName = foundData.length > 0 ? foundData[0].clientName : '';
    const measurementType = foundData.length > 0 ? foundData[0].measurementType : '';
    const [selectedData, setSelectedData] = useState<{ id: number; name: string }[]>([]);
    const [fetchedData, setFetchedData] = useState<any[]>([]);
    const [behaviorNames, setBehaviorNames] = useState<Record<number, string>>({}); // New state for behavior names
    const [dateRangeLabel, setDateRangeLabel] = useState<string>("Last 7 Days"); // Default to 7 days
    const [dateRange, setDateRange] = useState<number>(7); // Default to 7 days
    const dateRanges = [ { label: 'Last 7 Days', value: 7 }, { label: 'Last 2 Weeks', value: 14 }, { label: 'Last Month', value: 30 }, { label: 'Last 3 Months', value: 90 }, { label: 'Last 6 Months', value: 180 }, { label: 'Last 9 Months', value: 270 }, { label: 'Last Year', value: 365 } ];

    useEffect(() => {
        checkSelectedId();
    }, [userLoggedIn]);

    onkeydown = (e) => {
        if (e.key === 'Escape') {
            backButtonFuctionality();
        }
    }

    const handleDateRangeChange = (range: number) => {
        const selectedRange = dateRanges.find(r => r.value === range);
        setDateRange(range);
        setDateRangeLabel(selectedRange?.label || "Last 7 Days");
    };

    const checkSelectedId = () => {
        setIsLoading(true);
        if (!userLoggedIn || !cookieIsValid) {
            const previousUrl = encodeURIComponent(location.pathname);
            navigate.push(`/Login?previousUrl=${previousUrl}`);        
        }
        
        try {
            const selectedIDs: SelectedBehavior[] = JSON.parse(sessionStorage.getItem('checkedBehaviors') || '[]'); // Specify the type here
            setSelectedData(selectedIDs);
            
            // Create a mapping of behavior names based on selected IDs
            const namesMap: Record<number, string> = {};
            selectedIDs.forEach((item: SelectedBehavior) => { // Specify the type for item here
                namesMap[item.id] = item.name; // Use the item.id and item.name
            });
            return setBehaviorNames(namesMap); // Update the state with the behavior names
        } catch (error) {
            setStatusMessage("Selected IDs are not found");
        }
        finally {
            setIsLoading(false);
        }
    }

    const getTargetData = async (bID: number) => {
        setIsLoading(true);
        if (!userLoggedIn || !cookieIsValid) {
            const previousUrl = encodeURIComponent(location.pathname);
            navigate.push(`/Login?previousUrl=${previousUrl}`);        
        }
        
        const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/aba/getTargetBehavior';

        try {
            const response = await Axios.post(url, {
                "clientID": sessionStorage.getItem('clientID'),
                "behaviorID": bID,
                "employeeUsername": loggedInUser
            });
            if (response.data.statusCode === 200) {
                return response.data.behaviorSkillData;
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

    // New helper function to filter data based on date range
    const filterDataByDateRange = (data: any[]) => {
        const now = new Date();
        const filtered = data.filter((entry: any) => {
            if (!entry || !entry.sessionDate) return false; // Ensure valid data
            const entryDate = new Date(entry.sessionDate);
            const daysDifference = (now.getTime() - entryDate.getTime()) / (1000 * 3600 * 24);
            return daysDifference <= dateRange;
        });
        return filtered.length > 0 ? filtered : [{ sessionDate: new Date().toISOString(), count: 0 }]; // Ensure no ghost data
    };

    useEffect(() => {
        setStatusMessage(null);
        setFetchedData([]); // Clear the previous graph data

        if (selectedData.length > 0) { // Ensure there's data to fetch
            setIsLoading(true);

            // Create a mapping of behavior names based on selectedData
            const behaviorNames = Object.fromEntries(selectedData.map(item => [item.id, item.name]));

            Promise.all([...new Set(selectedData.map(item => item.id))].map(id => debounceAsync(() => getTargetData(id), 300)()))
                .then((allData) => {
                    const flattenedData = allData.flat().filter(entry => entry !== null);
                    const filteredData = filterDataByDateRange(flattenedData); // Filter data based on date range
                    
                    const isEmptyData = filteredData.length === 0 || 
                        (filteredData.length === 1 && filteredData[0].count === 0 && !filteredData[0].behaviorDataID);

                    if (isEmptyData) {
                        return setStatusMessage("No data available within range");
                    }
    
                    setFetchedData(filteredData);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error(error);
                    setStatusMessage('Error loading data');
                    setIsLoading(false);
                });
        } else if (!isLoading) {
            setStatusMessage('Unable to locate selected data');
        }
    }, [selectedData, dateRange]); // Add dateRange as a dependency so it triggers re-fetch when the range changes
        
    const backButtonFuctionality = () => {
        navigate.back();
    };

    return (
        <>
            <Header />
            <Head>
                <title>Graph - BMetrics</title>
            </Head>
            <div className={componentStyles.pageBody}>
                <main>
                    {isLoading ? 
                        <Loading/> 
                        :
                        <div className={componentStyles.bodyBlock}>
                            <h1 className={componentStyles.pageHeader}>Behavior Graph</h1>
                            <div className={componentStyles.innerBlock}>
                                <p className={componentStyles.statusMessage}>{statusMessage ? <b>{statusMessage}</b> : null}</p>
                                <label className={componentStyles.dateDropdown}>
                                    <b>Graph for the</b>
                                    <SelectDropdown name={`DateRange`} requiring={true} value={dateRange} options={dateRanges.map((range) => ({ value: range.value, label: range.label }))} onChange={(e) => handleDateRangeChange(Number(e.target.value))} />
                                </label>
                                <div className={componentStyles.tbGraphShell}><GraphDataProcessor fetchedData={fetchedData} behaviorNames={behaviorNames} title={`${clientName}'s Behavior(s) Over the ${dateRangeLabel}`} measurementType={measurementType} dateRange={dateRange}/></div>
                                <Button nameOfClass='tbGraphButton' placeholder='Back' btnType='button' isLoading={isLoading} onClick={backButtonFuctionality}/>
                            </div>
                        </div>
                    }
                </main>
            </div>
        </>
    );
}

export default Graph;