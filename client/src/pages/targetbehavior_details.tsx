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
        const bID = sessionStorage.getItem('behaviorID');
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [statusMessage, setStatusMessage] = useState<React.ReactNode>('');
        const [targetBehaviorData, setTargetBehaviorData] = useState<[]>([]);
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
            if ((sessionStorage.getItem('clientID') === null && clientID === null) || (sessionStorage.getItem('behaviorID') === null && bID === null)) {
                navigate('/TargetBehavior');
            }

            sessionStorage.removeItem('clientID');
            sessionStorage.removeItem('behaviorID');
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
                                    <table className={componentStyles.tbHRSTable}>
                                        <thead>
                                            <tr>
                                                <th>Behavior Name</th>
                                                <th>Definition</th>
                                                <th>Measurement</th>
                                                <th>Data Today</th>
                                                <th>Graph</th>
                                                <th>More Options</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {targetBehaviorData.map((option, index) => (
                                                <tr key={index}>
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
