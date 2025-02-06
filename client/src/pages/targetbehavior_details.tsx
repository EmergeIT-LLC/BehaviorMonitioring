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
            document.title = "Target Behavior - Behavior Monitoring";
        }, []);
    
        const navigate = useNavigate();
        const location = useLocation();
        const userLoggedIn = GetLoggedInUserStatus();
        const loggedInUser = GetLoggedInUser();
        const cookieIsValid = isCookieValid();
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [statusMessage, setStatusMessage] = useState<React.ReactNode>('');
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
            if (!userLoggedIn || !cookieIsValid) {
                navigate('/Login', {
                    state: {
                        previousUrl: location.pathname,
                    }
                });
            } else {
                setIsLoading(true);
                sessionStorage.removeItem('clientID')
                sessionStorage.removeItem('checkedBehaviors')
            }
        }, [userLoggedIn]);

        useEffect(() => {
            if (selectedClientID > 0) {
                getClientTargetBehaviors();
            }
        }, [selectedClientID]);
        
    return (
        <div>
            <h1>Target Behavior Details</h1>
        </div>
    );
}

export default TargetbehaviorDetails;
