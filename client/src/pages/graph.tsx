import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import componentStyles from '../styles/components.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import Loading from '../components/loading';
import SelectDropdown from '../components/Selectdropdown';
import { GetLoggedInUserStatus, GetLoggedInUser, isCookieValid } from '../function/VerificationCheck';
import Axios, { all } from 'axios';
import Button from '../components/Button';
import GraphDataProcessor from '../function/GraphDataProcessor'; // Import the GraphDataProcessor

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
    const [clientName, setClientName] = useState<string>('');
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const [fetchedData, setFetchedData] = useState<any[]>([]);

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
        
    const checkSelectedId = async () => {
        try {
            const selectedIDs = JSON.parse(sessionStorage.getItem('checkedBehaviorIds') || '[]');
            setSelectedData(selectedIDs);
        }
        catch (error) {
            console.log("Selected id's are not found")
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
    }

    useEffect(() => {
        if (selectedData) {
            // Fetch data for each ID in selectedData and wait for all to complete
            Promise.all(selectedData.map(id => getTargetData(id)))
                .then((allData) => {
                    setFetchedData(allData);  // Store all fetched data
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
                                <p className={componentStyles.statusMessage}>{statusMessage ? <b>{statusMessage}</b> : null}</p>
                                <GraphDataProcessor fetchedData={fetchedData} />
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