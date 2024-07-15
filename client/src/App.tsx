import React from 'react';
import './App.scss';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import Contact from './pages/contact';
import Pagenotfound from './pages/pagenotfound';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<Home />} />
        <Route path = "/AboutUs" element = {<About />} />
        <Route path = "/ContactUs" element = {<Contact />} />
        <Route path = "/*" element = {<Pagenotfound />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;