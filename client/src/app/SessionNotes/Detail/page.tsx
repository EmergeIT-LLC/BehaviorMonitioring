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
import { GetLoggedInUserStatus, GetLoggedInUser } from '../../../function/VerificationCheck';
import { debounceAsync } from '../../../function/debounce';
import { api } from '../../../lib/Api';
import type { GetSessionNotesDataResponse } from '../../../dto/aba/requests/notes/GetSessionNotesDataResponse';
import type { DeleteSessionNotesResponse } from '../../../dto/aba/responses/notes/DeleteSessionNotesResponse';
import type { Notes } from '../../../dto/aba/common/notes/notes';
import Button from '../../../components/Button';
import PromptForMerge from '../../../components/PromptForMerge';
import PopoutPrompt from '../../../components/PopoutPrompt';

const Page: React.FC = () => {
    const navigate = useRouter();
    const userLoggedIn = GetLoggedInUserStatus();
    const loggedInUser = GetLoggedInUser();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<React.ReactNode>('');
    const [selectedSessionNoteID, setSelectedSessionNoteID] = useState<string | null>(sessionStorage.getItem('sessionNoteId'));
    const [clientID, setClientID] = useState<string | null>(sessionStorage.getItem('clientID'));
    const [sessionNotesData, setSessionNotesData] = useState<Notes[]>([]);
    const [sessionNotesToActOn, setSessionNotesToActOn] = useState<string>('');
    const [sessionNotesIdToActOn, setSessionNotesIdToActOn] = useState<string>('');
    const [timerCount, setTimerCount] = useState<number>(0);
    const [clearMessageStatus, setClearMessageStatus] = useState<boolean>(false);

    useEffect(() => {
        if ((sessionStorage.getItem('clientID') === null && clientID === null) 
            || (sessionStorage.getItem('sessionNoteID') === null && selectedSessionNoteID === null)
            || (sessionStorage.getItem('clientID') === undefined && clientID === undefined)
            || (sessionStorage.getItem('sessionNoteID') === undefined && selectedSessionNoteID === undefined)
        ) {
            navigate.push('/SessionNotes');
        }
        debounceAsync(getSessionNoteDetails, 300)();
        sessionStorage.removeItem('clientID');
        sessionStorage.removeItem('sessionNoteId');
    }, [userLoggedIn]);

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

    const getSessionNoteDetails = async () => {
        setIsLoading(true);
        if (!userLoggedIn) {
            const previousUrl = encodeURIComponent(location.pathname);
            navigate.push(`/Login?previousUrl=${previousUrl}`);
        }

        const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/aba/getASessionNote';

        try {
            const response = await api<GetSessionNotesDataResponse>('post', '/aba/getASessionNote', { "clientID": clientID, "sessionNoteId": selectedSessionNoteID, "employeeUsername": loggedInUser });
            if (response.statusCode === 200) {
                return setSessionNotesData(response.sessionNotesData);
            } else {
                throw new Error(response.serverMessage);
            }
        } catch (error) {
            setStatusMessage(String(error));
        }
        finally {
            setIsLoading(false);
            console.log(sessionNotesData);
        }
    };

    const handleDelete = async () => {
        await debounceAsync(() => deleteSessionNoteCall(sessionNotesIdToActOn, sessionNotesToActOn), 300)();
    };

    const deleteSessionNoteCall = async (sessionNoteId: string, sessionNoteName: string) => {
        setIsLoading(true);
        if (!userLoggedIn) {
            const previousUrl = encodeURIComponent(location.pathname);
            navigate.push(`/Login?previousUrl=${previousUrl}`);        
        }
        
        try {
            const response = await api<DeleteSessionNotesResponse>('post', '/aba/deleteSessionNote', {
                "clientID": clientID, 
                "sessionNoteId": sessionNoteId, 
                "employeeUsername": loggedInUser 
            });
            if (response.statusCode === 200) {
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
