"use client";
import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import componentStyles from '../../styles/components.module.scss';
import Header from '../../components/header';
import InputFields from '../../components/Inputfield';
import Link from '../../components/Link';
import Loading from '../../components/loading';
import { GetLoggedInUserStatus, GetAdminStatus } from '../../function/VerificationCheck';
import Axios from 'axios';

const Admin: React.FC = () => {
    const navigate = useRouter();
    const userLoggedIn = GetLoggedInUserStatus();
    const userIsAdmin = GetAdminStatus();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!userLoggedIn) {
            const previousUrl = encodeURIComponent(location.pathname);
            navigate.push(`/Login?previousUrl=${previousUrl}`);        
        }
        else if (!userIsAdmin) {
            navigate.push('/');        
        }
        setIsLoading(false);
    }, [userLoggedIn]);

    return (
        <>
        <Header/>
        <Head>
            <title>Admin - BMetrics</title>
        </Head>
        <div className={componentStyles.pageBody}>
            <main>
                {isLoading ? 
                    <Loading/> 
                    :
                    <div className={componentStyles.bodyBlock}>
                        <div className={componentStyles.innerBlock}>
                            <Link href='/admin/manageAdmins' hrefType='link' placeholder="Manage admins" />
                            <Link href='/admin/manageClients' hrefType='link' placeholder="Manage clients" />
                            <Link href='/admin/manageHomes' hrefType='link' placeholder="Manage homes" />
                        </div>
                    </div>
                }
            </main>
        </div>
        </>
    );
}

export default Admin;