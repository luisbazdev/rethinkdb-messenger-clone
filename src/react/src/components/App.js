import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import Main from "./Main";

import Media from "./chat/Media";

import './styles/App.css';

import { AuthContext } from "../contexts/AuthContext";

export default function App(){

    const { session } = React.useContext(AuthContext)

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={session === null ? <Login/> : <Navigate to='/t'/>} />

                <Route path='t' element={session === null ? <Navigate to='/'/> : <Main/>} >
                    <Route path=':userID' element={<Main/>} />
                </Route>

                <Route path='/messenger_media' 
                element={session === null ? <Navigate to='/'/> : <Media/>} 
                />
            </Routes>
        </BrowserRouter>
    )
}