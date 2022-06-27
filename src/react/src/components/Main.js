import React, { useEffect } from 'react';

import Navbar from './Navbar';
import Chat from './Chat';
import Sidebar from './Sidebar';

import './Main.css';

import { io } from "socket.io-client";

import axios from "axios";

export default function Main(){

    var socket;

    useEffect(() => {
        socket = io(process.env.DOMAIN);
        // socket.emit('set uid', session.uid);
    }, [])

    return (
        <div className='main'>
            <Navbar/>
            <Chat/>
            <Sidebar/>
        </div>
    )
}