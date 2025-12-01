"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import componentStyles from '../../../styles/components.module.scss';
import Header from '../../../components/header';
import Loading from '../../../components/loading';
import SelectDropdown from '../../../components/Selectdropdown';
import Checkbox from '../../../components/Checkbox';
import Link from '../../../components/Link';
import { GetLoggedInUserStatus, GetLoggedInUser, isCookieValid } from '../../../function/VerificationCheck';
import { debounceAsync } from '../../../function/debounce';
import Axios from 'axios';
import Button from '../../../components/Button';
import PromptForMerge from '../../../components/PromptForMerge';
import PopoutPrompt from '../../../components/PopoutPrompt';

const Page: React.FC = () => {
    const navigate = useRouter();
    const userLoggedIn = GetLoggedInUserStatus();
    const loggedInUser = GetLoggedInUser();
    const cookieIsValid = isCookieValid();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<React.ReactNode>('');
    const [clientLists, setClientLists] = useState<{ value: string; label: string }[]>([]);
    const [selectedSessionNoteID, setSelectedSessionNoteID] = useState<string | null>(sessionStorage.getItem('sessionNoteID'));
    const [selectedClientID, setSelectedClientID] = useState<string | null>(sessionStorage.getItem('clientID'));
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
    const [isPopoutVisible, setIsPopoutVisible] = useState<boolean>(false);
    const [mergeBehaviorList, setMergeBehaviorList] = useState<{ id: string; name: string }[]>([]);
    const [popupAction, setPopupAction] = useState<string>('');
    const [sessionNotesToActOn, setSessionNotesToActOn] = useState<string>('');
    const [sessionNotesIdToActOn, setSessionNotesIdToActOn] = useState<string>('');
    const [timerCount, setTimerCount] = useState<number>(0);
    const [clearMessageStatus, setClearMessageStatus] = useState<boolean>(false);

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

    onkeydown = (e) => {
        if (e.key === 'Escape') {
            backButtonFuctionality();
        }
    }

    const backButtonFuctionality = () => {
        navigate.back();
    };

    const handleDelete = async () => {
        await debounceAsync(() => deleteSessionNoteCall(sessionNotesIdToActOn, sessionNotesToActOn), 300)();
    };

    const deleteSessionNoteCall = async (sessionNoteId: string, sessionNoteName: string) => {
        setIsLoading(true);
        if (!userLoggedIn || !cookieIsValid) {
            const previousUrl = encodeURIComponent(location.pathname);
            navigate.push(`/Login?previousUrl=${previousUrl}`);        
        }
        
        try {
            const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/aba/deleteSessionNote';
            const response = await Axios.post(url, { "clientID": selectedClientID, sessionNoteId, "employeeUsername": loggedInUser });
            if (response.data.statusCode === 200) {
                setStatusMessage(`Session Note "${sessionNoteName}" has been deleted successfully.`);
                // Update the notesOptions state to remove the deleted behavior
                setTimerCount(3);
                setClearMessageStatus(true);                                   
        } else {
                throw new Error(`Failed to delete "${sessionNoteName}".`);
            }
        } catch (error) {
            return setStatusMessage(String(error));
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header/>
            <Head>
                <title>Session Notes - Detail</title>
            </Head>
            <div className={componentStyles.pageBody}>
                <main>
                    {isLoading ? 
                        <Loading /> 
                        : 
                        <div className={componentStyles.bodyBlock}>
                            <h1 className={componentStyles.pageHeader}>Session Notes - Detail</h1>
                                <div className={componentStyles.tbHRSButtons}>
                                    <Button nameOfClass='tbBackButton' placeholder='Back' btnType='button' isLoading={isLoading} onClick={backButtonFuctionality}/>
                                </div>
                                <div className={componentStyles.innerBlock}>
                                    <p className={componentStyles.statusMessage}>{statusMessage ? <b>{statusMessage}</b> : null}</p>
                                    
                                </div>
                        </div>
                    }
                </main>
            </div>
        </>
    );
}

export default Page;
