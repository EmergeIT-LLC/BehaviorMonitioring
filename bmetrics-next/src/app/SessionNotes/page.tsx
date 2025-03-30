"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import componentStyles from '../../styles/components.module.scss';
import Header from '../../components/header';
import Loading from '../../components/loading';
import SelectDropdown from '../../components/Selectdropdown';
import Checkbox from '../../components/Checkbox';
import Link from '../../components/Link';
import { GetLoggedInUserStatus, GetLoggedInUser, isCookieValid } from '../../function/VerificationCheck';
import Axios from 'axios';
import Button from '../../components/Button';
import PromptForMerge from '../../components/PromptForMerge';
import PopoutPrompt from '../../components/PopoutPrompt';

const SessionNotes: React.FC = () => {

        const navigate = useRouter();
        const userLoggedIn = GetLoggedInUserStatus();
        const loggedInUser = GetLoggedInUser();
        const cookieIsValid = isCookieValid();
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [statusMessage, setStatusMessage] = useState<React.ReactNode>('');
        const [clientLists, setClientLists] = useState<{ value: string; label: string }[]>([]);
        const [selectedClient, setSelectedClient] = useState<string>('');
        const [selectedClientID, setSelectedClientID] = useState<number>(0);
        const [targetOptions, setTargetOptions] = useState<{ value: string | number; label: string; definition?: string; dateCreated?: string; measurementType?: string; behaviorCat?: string; dataToday?: number; }[]>([]);
        const [checkedBehaviors, setCheckedBehaviors] = useState<{ id: string; name: string; measurementType: string | undefined }[]>([]);
        const [checkedState, setCheckedState] = useState<boolean[]>([]); // Track checked state
        const maxCheckedLimit = 4; // Define a limit for checkboxes
        const [activeMenu, setActiveMenu] = useState<number | null>(null);
        const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
        const [isPopoutVisible, setIsPopoutVisible] = useState<boolean>(false);
        const [mergeBehaviorList, setMergeBehaviorList] = useState<{ id: string; name: string }[]>([]);
        const [popupAction, setPopupAction] = useState<string>('');
        const [behaviorNameToActOn, setBehaviorNameToActOn] = useState<string>('');
        const [behaviorIdToActOn, setBehaviorIdToActOn] = useState<string>('');
        const [timerCount, setTimerCount] = useState<number>(0);
        const [clearMessageStatus, setClearMessageStatus] = useState<boolean>(false);
    
    return (
        <>
            <Header />
            <Head>
                <title>Session Notes - BMetrics</title>
            </Head>
            <div className={componentStyles.pageBody}>
                <main>
                    {isLoading ?
                        <Loading />
                        :
                        <div className={componentStyles.bodyBlock}>
                            <div className={componentStyles.tbHRSButtons}>
                                <Link href='/DataEntry' hrefType='link' placeholder="Add Session Notes" />
                                <Link href='/SessionNotes/Archive' hrefType='link' placeholder="Archived Behavior" />
                            </div>
                            <p className={componentStyles.statusMessage}>{statusMessage ? <b>{statusMessage}</b> : null}</p>
                            <div className={componentStyles.innerBlock}>
                                <div className={componentStyles.tbHRSTopBar}>
                                    <label className={componentStyles.clientNameDropdown}>
                                        Current Behavior for
                                        <SelectDropdown name={`ClientName`} requiring={true} value={selectedClientID} options={clientLists} onChange={(e) => handleClientChange({ name: e.target.options[e.target.selectedIndex].text || '', id: e.target.value})} />
                                    </label>
                                </div>
                                <table className={componentStyles.tbHRSTable}>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Session Date</th>
                                            <th>Session Notes</th>
                                            <th>Entered By</th>
                                            <th>More Options</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    }
                </main>
            </div>
        </>
    );
}

export default SessionNotes;