"use client";
import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import componentStyles from '../../styles/components.module.scss';
import Header from '../../components/header';
import Footer from '../../components/footer';

const About: React.FC = () => {

    return (
        <>
        <Header/>
        <Head>
            <title>About - BMetrics</title>
        </Head>
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