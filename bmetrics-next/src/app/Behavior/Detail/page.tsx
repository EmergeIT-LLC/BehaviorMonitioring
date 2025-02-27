"use client";
import React, { useState, useEffect, JSX } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import componentStyles from '../../../styles/components.module.scss';
import Header from '../../../components/header';
import Loading from '../../../components/loading';
import { GetLoggedInUserStatus, GetLoggedInUser, isCookieValid } from '../../../function/VerificationCheck';
import Axios from 'axios';
import Button from '../../../components/Button';
import PopoutPrompt from '../../../components/PopoutPrompt';

const TargetbehaviorDetails: React.FC = () => {
    const navigate = useRouter();
    const userLoggedIn = GetLoggedInUserStatus();
    const loggedInUser = GetLoggedInUser();
    const cookieIsValid = isCookieValid();
    const [clientID, setClientID] = useState<string | null>(sessionStorage.getItem('clientID'));
    const [bID, setBID] = useState<string | null>(sessionStorage.getItem('behaviorID'));
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<React.ReactNode>('');
    const [behaviorBase, setBehaviorBase] = useState<{  bsID: string | number; name: string; definition?: string; dateCreated?: string; measurement?: string; behaviorCat?: string; dataToday?: number; clientName: string; clientID: string | number; }[]>([]);
    const [targetBehaviorData, setTargetBehaviorData] = useState<{ behaviorDataID: string; clientName: string; sessionDate: string; sessionTime: string; count: string | number; duration: string | number; trial: string; entered_by: string; date_entered: string; time_entered: string; }[]>([]);
    const [isPopoutVisible, setIsPopoutVisible] = useState<boolean>(false);
    const [popupAction, setPopupAction] = useState<string>('');
    const [dataIdToActOn, setDataIdToActOn] = useState<string>('');
    const [timerCount, setTimerCount] = useState<number>(0);
    const [clearMessageStatus, setClearMessageStatus] = useState<boolean>(false);
    const [headers, setHeaders] = useState<JSX.Element[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25; // Number of items per page
    const totalPages = Math.ceil(targetBehaviorData.length / itemsPerPage);
    const paginatedData = targetBehaviorData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        if ((sessionStorage.getItem('clientID') === null && clientID === null) 
            || (sessionStorage.getItem('behaviorID') === null && bID === null)
            || (sessionStorage.getItem('clientID') === undefined && clientID === undefined)
            || (sessionStorage.getItem('behaviorID') === undefined && bID === undefined)
        ) {
            navigate.push('/Behavior');
        }

        sessionStorage.removeItem('clientID');
        sessionStorage.removeItem('behaviorID');
        getClientTargetBehaviorBaseData();
        getClientTargetBehaviorData();
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

    const getClientTargetBehaviorBaseData = async () => {
        setIsLoading(true);
        setBehaviorBase([]);
        if (!userLoggedIn || !cookieIsValid) {
            const previousUrl = encodeURIComponent(location.pathname);
            navigate.push(`/Login?previousUrl=${previousUrl}`);
        }

        const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/aba/getAClientTargetBehavior';

        try {
            const response = await Axios.post(url, {
                "clientID": clientID,
                "behaviorID": bID,
                "employeeUsername": loggedInUser
            });
            if (response.data.statusCode === 200) {
                setBehaviorBase(response.data.behaviorSkillData);
                generateTargetTableHeaders(response.data.behaviorSkillData[0].measurement);
            } else {
                throw new Error(response.data.serverMessage);
            }    
        } catch (error) {
            return setStatusMessage(String(error));
        }
        finally {
            setIsLoading(false);
        }
    }

    const getClientTargetBehaviorData = async () => {
        setIsLoading(true);
        setTargetBehaviorData([]);
        if (!userLoggedIn || !cookieIsValid) {
            const previousUrl = encodeURIComponent(location.pathname);
            navigate.push(`/Login?previousUrl=${previousUrl}`);

        }

        const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/aba/getTargetBehavior';

        try {
            const response = await Axios.post(url, {
                "clientID": clientID,
                "behaviorID": bID,
                "employeeUsername": loggedInUser
            });
            if (response.data.statusCode === 200) {
                return setTargetBehaviorData(response.data.behaviorSkillData.reverse());
            } else {
                throw new Error(response.data.serverMessage);
            }    
        } catch (error) {
            return setStatusMessage(String(error));
        }
        finally {
            setIsLoading(false);
        }
    }

    const generateTargetTableHeaders = (measurement: string) => {
        setHeaders([]);
        const headers: JSX.Element[] = [];
        if (measurement === 'Frequency' || measurement === 'Rate') {
            headers.push(<th key="count">Count:</th>);
        }
        if (measurement === 'Duration' || measurement === 'Rate') {
            headers.push(<th key="duration">Duration:</th>);
        }

        headers.push(<th key="sessionDate">Session Date</th>)
        headers.push(<th key="sessionTime">Session Time</th>);
        headers.push(<th key='enteredBy'>Entered By</th>);
        headers.push(<th key='delete'></th>)
        setHeaders(headers);
    }

    const generateTargetTableData = (measurement: string) => {
        return paginatedData.map((data, index) => (
            <tr key={index}>
                {measurement === 'Frequency' || measurement === 'Rate' ? <td><div>{data.count}</div></td> : null}
                {measurement === 'Duration' || measurement === 'Rate' ? <td><div>{data.duration}</div></td> : null}
                <td><div>{data.sessionDate}</div></td>
                <td><div>{data.sessionTime}</div></td>
                <td><div>{data.entered_by}</div></td>
                <td><div><Button nameOfClass='deleteButton' placeholder='Delete' btnType='button' isLoading={isLoading}  onClick={() => { openPopout('Delete', data.behaviorDataID); }} /></div></td>
            </tr>
        ));
    };

    const openPopout = (action: string, behaviorDataId: string) => {
        setPopupAction(action);
        setDataIdToActOn(behaviorDataId);
        setIsPopoutVisible(true);
    };

    const handleDeleteCancel = () => {
        setIsPopoutVisible(false);
    };

    const handleDelete = async () => {
        setIsPopoutVisible(false);
        if (popupAction === 'Delete') {
            await deleteDataCall(dataIdToActOn);
        }
    };

    const deleteDataCall = async (behaviorDataId: string) => {
        setIsLoading(true);
        if (!userLoggedIn || !cookieIsValid) {
            const previousUrl = encodeURIComponent(location.pathname);
            navigate.push(`/Login?previousUrl=${previousUrl}`);

        }
        
        try {
            const url = process.env.NEXT_PUBLIC_BACKEND_UR + '/aba/deleteBehaviorData';
            const response = await Axios.post(url, { "clientID": behaviorBase[0].clientID, "behaviorId": behaviorBase[0].bsID, behaviorDataId, "employeeUsername": loggedInUser });
            if (response.data.statusCode === 200) {
                setStatusMessage(`Behavior "${behaviorDataId}" has been deleted successfully.`);
                setClientID(String(behaviorBase[0].clientID));
                setBID(String(behaviorBase[0].bsID));
                await getClientTargetBehaviorBaseData();
                await getClientTargetBehaviorData();           
                setTimerCount(3);
                setClearMessageStatus(true);  
            } else {
                setStatusMessage(`Failed to delete "${behaviorDataId}".`);
            }
        } catch (error) {
            console.error(error);
            setStatusMessage('An error occurred while deleting.');
        }
        finally {
            setIsLoading(false);
        }
    };

    const getPageNumbers = () => {
        const totalNumbers = 5; // Number of page buttons to show
        const totalBlocks = totalNumbers + 2; // Including the ellipses
    
        if (totalPages > totalBlocks) {
            const startPage = Math.max(2, currentPage - 2);
            const endPage = Math.min(totalPages - 1, currentPage + 2);
            let pages = [];
    
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
    
            if (currentPage > 3) {
                pages.unshift('...');
            }
    
            if (currentPage < totalPages - 2) {
                pages.push('...');
            }
    
            pages.unshift(1);
            pages.push(totalPages);
    
            return pages;
        }
    
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    };

    // Function to handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            <Header />
            <Head>
                <title>Behavior Details - BMetrics</title>
            </Head>
                <div className={componentStyles.pageBody}>
                    <main>
                        {isLoading ? 
                            <Loading /> 
                            :
                            <div className={componentStyles.bodyBlock}>
                                <h1 className={componentStyles.pageHeader}>Behavior Details</h1>
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
                                                {headers}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {behaviorBase.length > 0 && generateTargetTableData(String(behaviorBase[0].measurement))}
                                        </tbody>
                                    </table>
                                    <div className={componentStyles.pagination}>
                                        <Button nameOfClass='paginationLeftButton' placeholder='&lt;' btnType='button' onClick={() => handlePageChange(currentPage - 1)} disabled = {currentPage <= 1}/>
                                        {getPageNumbers().map((page, index) => (<button key={index} onClick={() => typeof page === 'number' && handlePageChange(page)} className={`${componentStyles.paginationButton} ${currentPage === page ? componentStyles.active : ''}`} disabled={currentPage === page}> {page} </button>))}
                                        <Button nameOfClass='paginationRightButton' placeholder='&gt;' btnType='button' onClick={() => handlePageChange(currentPage + 1)} disabled = {currentPage >= totalPages}/>
                                    </div>
                                    <PopoutPrompt title={`${popupAction} Behavior Data`} message={`Are you sure you want to ${popupAction.toLowerCase()} the behavior "${dataIdToActOn}"?`} onConfirm={handleDelete} onCancel={() => handleDeleteCancel()} isVisible={isPopoutVisible} behaviorNameSelected={dataIdToActOn} />
                                </div>
                            </div>
                        }
                    </main>
                </div>
        </>
    );
}

export default TargetbehaviorDetails;