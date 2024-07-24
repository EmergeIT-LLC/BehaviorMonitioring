import React, {useState, useEffect} from 'react';
import componentStyles from '../styles/components.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';

const Login: React.FC = () => {
    useEffect(() => {
        document.title = "Behavior Monitoring Login Page";
    }, []);

  return (
    <>
        <Header />
        <div className={componentStyles.pageBody}>
            <main>
                <div className={componentStyles.homeBody}>
                    Login
                </div>
            </main>
        </div>
        <Footer />
    </>
  );
}

export default Login;