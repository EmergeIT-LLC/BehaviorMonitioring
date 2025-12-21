"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import componentStyles from '../../../styles/components.module.scss';
import Header from '../../../components/header';
import Loading from '../../../components/loading';
import { GetLoggedInUserStatus, GetLoggedInUser } from '../../../function/VerificationCheck';
import { debounceAsync } from '../../../function/debounce';
import { api } from '../../../lib/Api';
import type { GetSessionNotesResponse, DeleteSessionNoteResponse, SessionNote } from '../../../dto';
import Button from '../../../components/Button';

const Page: React.FC = () => {
    const navigate = useRouter();
    const userLoggedIn = GetLoggedInUserStatus();
    const loggedInUser = GetLoggedInUser();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<React.ReactNode>('');
    const [selectedSessionNoteID, setSelectedSessionNoteID] = useState<string | null>(sessionStorage.getItem('sessionNoteId'));
    const [clientID, setClientID] = useState<string | null>(sessionStorage.getItem('clientID'));
    const [sessionNotesData, setSessionNotesData] = useState<SessionNote[]>([]);
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
        debounceAsync(getASessionNoteDetails, 300)();
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

    const getASessionNoteDetails = async () => {
        setIsLoading(true);
        if (!userLoggedIn) {
            const previousUrl = encodeURIComponent(location.pathname);
            navigate.push(`/Login?previousUrl=${previousUrl}`);
        }

        try {
            const response = await api<GetSessionNotesResponse>('post', '/aba/getASessionNote', { "clientID": clientID, "sessionNoteId": selectedSessionNoteID, "employeeUsername": loggedInUser });
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
            const response = await api<DeleteSessionNoteResponse>('post', '/aba/deleteSessionNote', {
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
                                    <div className={componentStyles.detailBlock}>
                                        {sessionNotesData.map((note: SessionNote) => (
                                            <div key={note.sessionNoteDataID}>
                                                <div className={componentStyles.tbHeaderDetails}>
                                                    <p><b>Client Name:</b> {note.clientName}</p>
                                                    <p><b>Session Date:</b> {note.sessionDate}</p>
                                                    <p><b>Session Time:</b> {note.sessionTime}</p>
                                                    <p><b>Session Notes:</b></p>
                                                </div>
                                                <div className={componentStyles.detailSection}>
                                                    <p>{note.sessionNotes}</p>
                                                </div>
                                                <div className={componentStyles.tbHeaderDetails}>
                                                    <p><b>Entered By:</b> {note.entered_by}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                        </div>
                    }
                </main>
            </div>
        </>
    );
}

export default Page;
