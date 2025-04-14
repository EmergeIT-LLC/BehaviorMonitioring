"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import componentStyles from '../../styles/components.module.scss';
import Header from '../../../components/header';
import Loading from '../../../components/loading';
import SelectDropdown from '../../../components/Selectdropdown';
import Checkbox from '../../../components/Checkbox';
import Link from '../../../components/Link';
import { GetLoggedInUserStatus, GetLoggedInUser, isCookieValid } from '../../../function/VerificationCheck';
import { getClientNames } from '../../../function/ApiCalls';
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
    const [selectedClient, setSelectedClient] = useState<string>('');
    const [selectedClientID, setSelectedClientID] = useState<number>(0);
    const [notesOptions, setNotesOptions] = useState<{  value: number, clientID: number, clientName: string, sessionDate: string, sessionTime: string, label: string, entered_by: string }[]>([]);
    const [checkedNotes, setCheckedNotes] = useState<{ id: string; name: string; }[]>([]);
    const [checkedState, setCheckedState] = useState<boolean[]>([]); // Track checked state
    const maxCheckedLimit = 4; // Define a limit for checkboxes
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

    // Fetch client details on component mount

    const getClientSessionNotes = async () => {
        setIsLoading(true);
        if (!userLoggedIn || !cookieIsValid) {
            const previousUrl = encodeURIComponent(location.pathname);
            navigate.push(`/Login?previousUrl=${previousUrl}`);        
        }

        const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/aba/getSessionNotes';
        try {
            const response = await Axios.post(url, {
                "clientID": selectedClientID,
                "employeeUsername": loggedInUser
            });
            if (response.data.statusCode === 200) {
                const labelLength = 50;
                setNotesOptions([]);
                setCheckedState([]);
                setCheckedNotes([]);
                sessionStorage.removeItem('checkedNotes');

                const fetchedOptions = response.data.sessionNotesData.map((notes: { sessionNoteDataID: number, clientID: number, clientName: string, sessionDate: string, sessionTime: string, sessionNotes: string, entered_by: string }) => ({
                    value: notes.sessionNoteDataID,
                    label: notes.sessionNotes.length > labelLength ? notes.sessionNotes.substring(0, labelLength) + '...' : notes.sessionNotes,
                    clientID: notes.clientID,
                    clientName: notes.clientName,
                    sessionDate: notes.sessionDate,
                    sessionTime: notes.sessionTime,
                    sessionNotes: notes.sessionNotes,
                    entered_by: notes.entered_by,
                }));
                console.log(fetchedOptions);
                setNotesOptions(fetchedOptions);
                setCheckedState(new Array(fetchedOptions.length).fill(false));
            } else {
                throw new Error(response.data.serverMessage);
            }
        } catch (error) {
            return setStatusMessage(String(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleEllipsisClick = (index: number) => {
        if (activeMenu === index) {
            closeMenu(); // Close if clicked again
        } else {
            setActiveMenu(index); // Open for the clicked row
        }
    };
    
    const getMenuPosition = (menuIndex: number) => {
        const ellipsisButton = document.querySelectorAll('.tbHRSEllipsesButton')[menuIndex];
        if (ellipsisButton) {
            const buttonRect = ellipsisButton.getBoundingClientRect();
            const menuTop = buttonRect.top + window.scrollY; // Account for scrolling
            const menuLeft = buttonRect.left + window.scrollX + buttonRect.width; // Offset for width
            return {
                top: `${menuTop}px`,
                left: `${menuLeft}px`,
            };
        }
        return { top: '0px', left: '0px' };
    };
            
    const closeMenu = () => setActiveMenu(null); // Close the menu

    const openPopout = (action: string, sessionId: string, sessionNote: string) => {
        setPopupAction(action);
        setSessionNotesToActOn(sessionId);
        setSessionNotesIdToActOn(sessionNote);
        setIsPopoutVisible(true);
    };

    const openNotesDetail = (id: string | number) => {
        sessionStorage.setItem('clientID', String(selectedClientID));
        sessionStorage.setItem('behaviorID', String(id));
        navigate.push(`/SessionNotes/Detail`);
    }

    const handleDelete = async () => {
        setIsPopoutVisible(false);
        await deleteBehaviorCall(sessionNotesIdToActOn, sessionNotesToActOn);
    };

    const deleteBehaviorCall = async (behaviorId: string, behaviorName: string) => {
        setIsLoading(true);
        if (!userLoggedIn || !cookieIsValid) {
            const previousUrl = encodeURIComponent(location.pathname);
            navigate.push(`/Login?previousUrl=${previousUrl}`);        
        }
        
        try {
            const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/aba/deleteBehavior';
            const response = await Axios.post(url, { "clientID": selectedClientID, behaviorId, "employeeUsername": loggedInUser });
            if (response.data.statusCode === 200) {
                setStatusMessage(`Behavior "${behaviorName}" has been deleted successfully.`);
                // Update the notesOptions state to remove the deleted behavior
                setTimerCount(3);
                setClearMessageStatus(true);                                   
        } else {
                throw new Error(`Failed to delete "${behaviorName}".`);
            }
        } catch (error) {
            return setStatusMessage(String(error));
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            
        </div>
    );
}

export default Page;
