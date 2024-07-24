import React from 'react';
import './App.scss';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';
import About from './pages/about';
import Contact from './pages/contact';
import Pagenotfound from './pages/pagenotfound';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path = "/Login" element = {<Login />} Component={Login}/>
        <Route path = "/" element = {<Home />} Component={Home}/>
        <Route path = "/AboutUs" element = {<About />} Component={About}/>
        <Route path = "/ContactUs" element = {<Contact />} Component={Contact}/>
        <Route path = "/*" element = {<Pagenotfound />} Component={Pagenotfound}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;