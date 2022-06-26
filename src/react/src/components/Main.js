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
        socket = io('http://localhost:8877');

        // socket.emit('set uid', session.uid);
    }, [])

    useEffect(() => {
        axios.get('http://localhost:8877/api/messages')
        .then((res) => console.log('sent'))
    }, [])

    return (
        <div className='main'>
            <Navbar/>
            <Chat/>
            <Sidebar/>
        </div>
    )
}