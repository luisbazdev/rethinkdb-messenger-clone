import React, { useEffect } from 'react';

import Navbar from './Navbar';
import Chat from './Chat';
import Sidebar from './Sidebar';

import './Main.css';

import { ChatContext } from "../contexts/ChatContext";
import { AuthContext } from "../contexts/AuthContext";

import { socket } from '../ws';

export default function Main(){
    
    var { session } = React.useContext(AuthContext)
    var { currentChat } = React.useContext(ChatContext)

    useEffect(() => {
        socket.emit('set uid', session.user_metadata.sub);

        return () => {
            socket.off();
        }
    }, [])

    return (
        <div className='main'>
            <Navbar session={session}/>
            {currentChat != null && <Chat session={session}/> }
            {/* {currentChat != null && <Sidebar session={session}/> } */}
        </div>
    )
}