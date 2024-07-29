import React from 'react';
import './App.scss';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/login';
import Logout from './pages/logout';
import Home from './pages/home';
import About from './pages/about';
import Contact from './pages/contact';
import TargetBehavior from './pages/targetbehavior';
import AddTargetBehavior from './pages/targetbehavior_add';
import SkillAquisition from './pages/skillaquisition';
import AddSkillAquisition from './pages/skillaquisition_add';
import DataEntry from './pages/dataentry';
import Pagenotfound from './pages/pagenotfound';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path = "/Login" element = {<Login />} Component={Login}/>
        <Route path = "/Logout" element = { <Logout />} Component={Logout}/>
        <Route path = "/" element = {<Home />} Component={Home}/>
        <Route path = "/AboutUs" element = {<About />} Component={About}/>
        <Route path = "/ContactUs" element = {<Contact />} Component={Contact}/>
        <Route path = "/TargetBehavior" element = {<TargetBehavior />} Component={TargetBehavior}/>
        <Route path = "/TargetBehavior-Add" element = {<AddTargetBehavior />} Component={AddTargetBehavior} />
        {/* <Route path = "/SkillAquisition" element = {<SkillAquisition />} Component={SkillAquisition}/> */}
        {/* <Route path = "/SkillAquisition-Add" element = {<AddSkillAquisition />} Component={AddSkillAquisition} /> */}
        <Route path = "/DataEntry" element = {<DataEntry />} Component={DataEntry}/>
        <Route path = "/*" element = {<Pagenotfound />} Component={Pagenotfound}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;