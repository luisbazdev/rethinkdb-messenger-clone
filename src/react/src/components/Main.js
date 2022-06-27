import React, { useEffect } from 'react';

import Navbar from './Navbar';
import Chat from './Chat';
import Sidebar from './Sidebar';

import './Main.css';

import { AuthContext } from "../contexts/AuthContext";
import { socket } from '../ws';

export default function Main(){
    
    var { session } = React.useContext(AuthContext)

    useEffect(() => {
        socket.emit('set uid', session.user_metadata.sub);
    }, [])

    return (
        <div className='main'>
            <Navbar session={session}/>
            <Chat session={session}/>
            <Sidebar session={session}/>
        </div>
    )
}