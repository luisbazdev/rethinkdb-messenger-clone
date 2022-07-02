import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Main from "./components/Main";

import './App.css';

import { AuthContext } from "./contexts/AuthContext";

export default function App(){

    const { session } = React.useContext(AuthContext)

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={session == null ? <Login/> : <Navigate to='/t'/>} />
                    <Route path='t' element={session != null ? <Main/> : <Navigate to='/'/>} >
                      <Route path=':userID' element={<Main/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}