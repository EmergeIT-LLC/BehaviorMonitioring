"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import componentStyles from '../../styles/components.module.scss';
import Header from '../../components/header';
import Button from '../../components/Button';
import Loading from '../../components/loading';
import { GetLoggedInUserStatus, isCookieValid } from '../../function/VerificationCheck';
import Axios from 'axios';

const SkillAquisition: React.FC = () => {
    const navigate = useRouter();
    const userLoggedIn = GetLoggedInUserStatus();
    const cookieIsValid = isCookieValid();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!userLoggedIn || !cookieIsValid) {
            navigate.push('/Login', {
                query: {
                    previousUrl: location.pathname,
                }
            });
        }
        else {
            setIsLoading(true);
            //Get skill aquisition
        }
        setIsLoading(false);
    }, [userLoggedIn]);

  return (
    <>
        <Header />
        <Head>
            <title>Skills - BMetrics</title>
        </Head>
        <div className={componentStyles.pageBody}>
            <main>
                {isLoading ? 
                    <Loading/> 
                    :
                    <div className={componentStyles.saBody}>
                        Skill Aquisition
                    </div>
                }
            </main>
        </div>
    </>
  );
}

export default SkillAquisition;