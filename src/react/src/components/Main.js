import React from 'react';

import Navbar from './Navbar';
import Chat from './Chat';
import Sidebar from './Sidebar';

import './Main.css';

export default function Main(){

    return (
        <div className='main'>
            <Navbar/>
            <Chat/>
            <Sidebar/>
        </div>
    )
}