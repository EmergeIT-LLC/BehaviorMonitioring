import React from 'react';
import './App.scss';
import ProtectedRoute from './function/ProtectedRoute';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/login';
import Logout from './pages/logout';
import Home from './pages/home';
import About from './pages/about';
import Contact from './pages/contact';
import Admin from './pages/admin';
import TargetBehavior from './pages/targetbehavior';
import AddTargetBehavior from './pages/targetbehavior_add';
import SkillAquisition from './pages/skillaquisition';
import AddSkillAquisition from './pages/skillaquisition_add';
import DataEntry from './pages/dataentry';
import Pagenotfound from './pages/pagenotfound';
import Graph from './pages/graph';
import Archive from './pages/archive';
import ArchiveDetail from './pages/archive_details';
import TargetbehaviorDetails from './pages/targetbehavior_details';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path = "/Login" element = {<Login />} Component={Login}/>
        <Route path = "/Logout" element = { <Logout />} Component={Logout}/>
        <Route path = "/AboutUs" element = {<About />} Component={About}/>
          <Route path = "/ContactUs" element = {<Contact />} Component={Contact}/>
        <Route element={<ProtectedRoute />}>
          <Route path = "/" element = {<Home />} Component={Home}/>
          <Route path='/Admin' element = {<Admin />} Component={Admin}/>
          <Route path = "/TargetBehavior" element = {<TargetBehavior />} Component={TargetBehavior}/>
          <Route path = "/TargetBehavior/Add" element = {<AddTargetBehavior />} Component={AddTargetBehavior} />
          <Route path = "/TargetBehavior/Graph" element = {<Graph />} Component={Graph} />
          <Route path = "/TargetBehavior/Archive" element = {<Archive />} Component={Archive}/>
          <Route path = "/TargetBehavior/Archive/Detail" element = {<ArchiveDetail />} Component={ArchiveDetail}/>
          <Route path="/TargetBehavior/Detail" element={<TargetbehaviorDetails />} Component={TargetbehaviorDetails} />
          {/* <Route path = "/SkillAquisition" element = {<SkillAquisition />} Component={SkillAquisition}/> */}
          {/* <Route path = "/SkillAquisition-Add" element = {<AddSkillAquisition />} Component={AddSkillAquisition} /> */}
          <Route path = "/DataEntry" element = {<DataEntry />} Component={DataEntry}/>
        </Route>
        <Route path = "/*" element = {<Pagenotfound />} Component={Pagenotfound}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;