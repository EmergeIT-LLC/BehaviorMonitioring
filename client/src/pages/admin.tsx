import React, {useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import componentStyles from '../styles/components.module.scss'
import Header from '../components/header';
import InputFields from '../components/Inputfield';
import Link from '../components/Link';
import Loading from '../components/loading';
import { GetLoggedInUserStatus, GetAdminStatus, isCookieValid } from '../function/VerificationCheck';
import Axios from 'axios';

const Admin: React.FC = () => {
    useEffect(() => {
        document.title = "Admin Portal - BMetrics";
    }, []);

    const navigate = useNavigate();
    const location = useLocation();
    const userLoggedIn = GetLoggedInUserStatus();
    const userIsAdmin = GetAdminStatus();
    const cookieIsValid = isCookieValid();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!userLoggedIn || !cookieIsValid) {
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        }
        else if (!userIsAdmin) {
            navigate('/', {
                state : {
                    previousUrl: location.pathname,
                }
            })
        }
        setIsLoading(false);
    }, [userLoggedIn]);

    return (
        <>
        <Header/>
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