import React, { useEffect } from 'react';

import Navbar from './nav/Navbar';
import Chat from './chat/Chat';

import './styles/Main.css';

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
            <Navbar/>
            {currentChat != null && <Chat/> }
        </div>
    )
}