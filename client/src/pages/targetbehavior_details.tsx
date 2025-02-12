import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import componentStyles from '../styles/components.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import Loading from '../components/loading';
import Link from '../components/Link';
import { GetLoggedInUserStatus, GetLoggedInUser, isCookieValid } from '../function/VerificationCheck';
import Axios from 'axios';
import Button from '../components/Button';
import PromptForMerge from '../components/PromptForMerge';
import PopoutPrompt from '../components/PopoutPrompt';

const TargetbehaviorDetails: React.FC = () => {
        useEffect(() => {
            document.title = "Target Behavior Details - Behavior Monitoring";
        }, []);
    
        const navigate = useNavigate();
        const location = useLocation();
        const userLoggedIn = GetLoggedInUserStatus();
        const loggedInUser = GetLoggedInUser();
        const cookieIsValid = isCookieValid();
        const clientID = sessionStorage.getItem('clientID');
        const clientName = sessionStorage.getItem('clientName');
        const bID = sessionStorage.getItem('behaviorID');
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [statusMessage, setStatusMessage] = useState<React.ReactNode>('');
        const [behaviorBase, setBehaviorBase] = useState<{  name: string; definition?: string; dateCreated?: string; measurement?: string; behaviorCat?: string; dataToday?: number; clientName: string; }[]>([]);
        const [targetBehaviorData, setTargetBehaviorData] = useState<{ clientName: string; sessionDate: string; sessionTime: string; count: string | number; duration: string | number; trial: string; entered_by: string; date_entered: string; time_entered: string; }[]>([]);
        const [targetOptions, setTargetOptions] = useState<{ value: string | number; label: string; definition?: string; dateCreated?: string; measurementType?: string; behaviorCat?: string; dataToday?: number; }[]>([]);
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
            if ((sessionStorage.getItem('clientID') === null && clientID === null) 
                || (sessionStorage.getItem('behaviorID') === null && bID === null)
                || (sessionStorage.getItem('clientID') === undefined && clientID === undefined)
                || (sessionStorage.getItem('behaviorID') === undefined && bID === undefined)
            ) {
                navigate('/TargetBehavior');
            }

            sessionStorage.removeItem('clientID');
            sessionStorage.removeItem('behaviorID');
            getClientTargetBehaviorBaseData();
            getClientTargetBehaviorData();
        }, [userLoggedIn]);

        onkeydown = (e) => {
            if (e.key === 'Escape') {
                backButtonFuctionality();
            }
        }

        const backButtonFuctionality = () => {
            navigate(-1);
        };

        const getClientTargetBehaviorBaseData = async () => {
            setIsLoading(true);
            if (!userLoggedIn || !cookieIsValid) {
                navigate('/Login', {
                    state: {
                        previousUrl: location.pathname,
                    }
                });
            }

            const url = process.env.REACT_APP_Backend_URL + '/aba/getAClientTargetBehavior';

            try {
                const response = await Axios.post(url, {
                    "clientID": clientID,
                    "behaviorID": bID,
                    "employeeUsername": loggedInUser
                });
                if (response.data.statusCode === 200) {
                    setBehaviorBase(response.data.behaviorSkillData);
                } else {
                    setStatusMessage(response.data.serverMessage);
                }    

                console.log(response.data);
            } catch (error) {
                console.log(error);
            }
            finally {
                setIsLoading(false);
            }
        }

        const getClientTargetBehaviorData = async () => {
            setIsLoading(true);
            if (!userLoggedIn || !cookieIsValid) {
                navigate('/Login', {
                    state: {
                        previousUrl: location.pathname,
                    }
                });
            }

            const url = process.env.REACT_APP_Backend_URL + '/aba/getTargetBehavior';

            try {
                const response = await Axios.post(url, {
                    "clientID": clientID,
                    "behaviorID": bID,
                    "employeeUsername": loggedInUser
                });
                if (response.data.statusCode === 200) {
                    setTargetBehaviorData(response.data.behaviorSkillData);

                } else {
                    setStatusMessage(response.data.serverMessage);
                }    
            } catch (error) {
                console.log(error);
            }
            finally {
                setIsLoading(false);
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
                                <h1 className={componentStyles.pageHeader}>Target Behavior Details</h1>
                                <div className={componentStyles.tbHRSButtons}>
                                    <Button nameOfClass='tbBackButton' placeholder='Back' btnType='button' isLoading={isLoading} onClick={backButtonFuctionality}/>
                                </div>
                                <div className={componentStyles.innerBlock}>
                                    <p className={componentStyles.statusMessage}>{statusMessage ? <b>{statusMessage}</b> : null}</p>
                                    { behaviorBase.length > 0 &&
                                        <div className={componentStyles.tbHeaderDetails}>
                                            <p><b>Client Name</b>: {behaviorBase[0].clientName}</p>
                                            <p><b>Behavior Name</b>: {behaviorBase[0].name} </p>
                                            <p><b>Measurement</b>: {behaviorBase[0].measurement}</p>
                                            <p><b>Definition</b>: {behaviorBase[0].definition} </p>
                                        </div>
                                    }
                                    <table className={componentStyles.tbHRSDetailTable}>
                                        <thead>
                                            <tr>
                                                <th>Count</th>
                                                <th>Duration</th>
                                                {/* <th>Trial</th> */}
                                                <th>Session Date</th>
                                                <th>Session Time</th>
                                                <th>Entered By</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {targetBehaviorData.map((option, index) => (
                                                <tr key={index}>
                                                    <td><div>{option.count}</div></td>
                                                    <td><div>{option.duration}</div></td>
                                                    {/* <td><div>{option.trial}</div></td> */}
                                                    <td><div>{option.sessionDate}</div></td>
                                                    <td><div>{option.sessionTime}</div></td>
                                                    <td><div>{option.entered_by}</div></td>
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

export default TargetbehaviorDetails;
