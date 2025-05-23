import React, {useState, useEffect} from 'react';
import componentStyles from '../styles/components.module.scss'
import Header from '../components/header';
import Footer from '../components/footer';

const About: React.FC = () => {
    useEffect(() => {
        document.title = "About - BMetrics";
    }, []);

    return (
        <>
        <Header/>
        <div className={componentStyles.pageBody}>
            <main>
                <div className={componentStyles.aboutBody}>
                    About
                </div>
            </main>
        </div>
        <Footer/>
        </>
    );
}

export default About;