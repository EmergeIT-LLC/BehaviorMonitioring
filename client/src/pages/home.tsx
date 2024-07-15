import React from 'react';
import componentStyles from '../styles/components.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';

const Home: React.FC = () => {
  return (
    <>
        <Header />
        <div className={componentStyles.pageBody}>
            <main>
                <div className={componentStyles.homeBody}>
                    Home
                </div>
            </main>
        </div>
        <Footer />
    </>
  );
}

export default Home;