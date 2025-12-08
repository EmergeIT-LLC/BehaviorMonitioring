"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import componentStyles from '../../styles/components.module.scss';
import Header from '../../components/header';
import InputFields from '../../components/Inputfield';
import Button from '../../components/Button';
import Loading from '../../components/loading';
import { GetLoggedInUserStatus } from '../../function/VerificationCheck';
import Axios from 'axios';

const Dashboard: React.FC = () => {
    const navigate = useRouter();
    const userLoggedIn = GetLoggedInUserStatus();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!userLoggedIn) {
            const previousUrl = encodeURIComponent(location.pathname);
            navigate.push(`/Login?previousUrl=${previousUrl}`);        
        }
        setIsLoading(false);
    }, [userLoggedIn]);

  return (
    <>
        <Header />
        <Head>
            <title>Dashboard - BMetrics</title>
        </Head>
        <div className={componentStyles.pageBody}>
            <main>
                {isLoading ? 
                    <Loading/> 
                    :
                    <div className={componentStyles.DashboardBody}>
                        Dashboard
                    </div>
                }
            </main>
        </div>
    </>
  );
}

export default Dashboard;