import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import componentStyles from '../styles/components.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import Loading from '../components/loading';
import { GetLoggedInUserStatus, GetLoggedInUser, isCookieValid } from '../function/VerificationCheck';
import Axios from 'axios';
import Button from '../components/Button';
import GraphDataProcessor from '../function/GraphDataProcessor';

// Define an interface for the selected behavior items
interface SelectedBehavior {
    id: number;
    name: string;
}

const Graph: React.FC = () => {
    useEffect(() => {
        document.title = "Target Behavior Graph - Behavior Monitoring";
    }, []);

    const navigate = useNavigate();
    const location = useLocation();
    const userLoggedIn = GetLoggedInUserStatus();
    const loggedInUser = GetLoggedInUser();
    const cookieIsValid = isCookieValid();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<React.ReactNode>('');
    const [selectedData, setSelectedData] = useState<{ id: number; name: string }[]>([]);
    const [fetchedData, setFetchedData] = useState<any[]>([]);
    const [behaviorNames, setBehaviorNames] = useState<Record<number, string>>({}); // New state for behavior names

    useEffect(() => {
        if (!userLoggedIn || !cookieIsValid) {
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        } else {
            setIsLoading(true);
            checkSelectedId();
            setIsLoading(false);
        }
    }, [userLoggedIn]);

    const checkSelectedId = () => {
        try {
            const selectedIDs: SelectedBehavior[] = JSON.parse(sessionStorage.getItem('checkedBehaviors') || '[]'); // Specify the type here
            setSelectedData(selectedIDs);
            
            // Create a mapping of behavior names based on selected IDs
            const namesMap: Record<number, string> = {};
            selectedIDs.forEach((item: SelectedBehavior) => { // Specify the type for item here
                namesMap[item.id] = item.name; // Use the item.id and item.name
            });
            setBehaviorNames(namesMap); // Update the state with the behavior names
        } catch (error) {
            setStatusMessage("Selected IDs are not found");
        }
    }

    const getTargetData = async (bID: number) => {
        const url = process.env.REACT_APP_Backend_URL + '/aba/getTargetBehavior';

        try {
            const response = await Axios.post(url, {
                "behaviorID": bID,
                "employeeUsername": loggedInUser
            });
            if (response.data.statusCode === 200) {
                return response.data.behaviorSkillData;
            } else {
                setStatusMessage(response.data.serverMessage);
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    useEffect(() => {
        setStatusMessage(null);

        if (selectedData.length > 0) { // Ensure there's data to fetch
            setIsLoading(true);
    
            // Create a mapping of behavior names based on selectedData
            const behaviorNames = Object.fromEntries(selectedData.map(item => [item.id, item.name]));
    
            Promise.all(selectedData.map(item => getTargetData(item.id)))
                .then((allData) => {
                    const flattenedData = allData.flat().filter(entry => entry !== null);
                    setFetchedData(flattenedData);
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
    }, [selectedData]);
    
    const backButtonFuctionality = () => {
        navigate(-1);
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
                            <h1 className={componentStyles.pageHeader}>Graph Target Behavior</h1>
                            <div className={componentStyles.innerBlock}>
                                <p className={componentStyles.statusMessage}>{statusMessage ? <b>{statusMessage}</b> : null}</p>
                                <div className={componentStyles.tbGraphShell}><GraphDataProcessor fetchedData={fetchedData} behaviorNames={behaviorNames} /></div>
                                <Button nameOfClass='tbGraphButton' placeholder='Back' btnType='button' isLoading={isLoading} onClick={backButtonFuctionality}/>
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