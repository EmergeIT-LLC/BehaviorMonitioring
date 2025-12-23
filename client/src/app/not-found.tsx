"use client";
import React from 'react';
import Image from 'next/image';
import componentStyles from '../styles/components.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import Link from '../components/Link';
import Logo from './BMetrics-logo-removebg.png'

export default function NotFound() {
    return (
        <>
            <Header/>
            <div className={componentStyles.pageBody}>
                <main>
                    <div className={componentStyles.pageNotFoundPageBody}>
                        <Image src={Logo} alt="Behavior Monitoring Logo" />
                        <p>The page you are looking for does not exist. <br/> Please return to the <Link href="/" hrefType="link" placeholder="homepage"/> for your convenience.</p>
                    </div>
                </main>
            </div>
          <Footer/>  
        </>
    );
}