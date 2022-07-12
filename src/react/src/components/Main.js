import React, { useEffect } from 'react';

import Navbar from './nav/Navbar';
import Chat from './chat/Chat';

import './styles/Main.css';

import { AuthContext } from "../contexts/AuthContext";
import { ChatContext } from "../contexts/ChatContext";
import { ModalContext } from "../contexts/ModalContext";

import { socket } from '../ws';

import RemoveMessageModal from './modals/RemoveMessage';

export default function Main(){
    
    var { session } = React.useContext(AuthContext)
    var { currentChat } = React.useContext(ChatContext)
    var { messageToRemove, seeRemoveMessageModal } = React.useContext(ModalContext)

    useEffect(() => {
        socket.emit('set uid', session.user_metadata.sub);

        return () => {
            socket.off();
        }
    }, [])

    return (
        <div className='main'>
            { seeRemoveMessageModal && <RemoveMessageModal message={messageToRemove}/> }
            
            <Navbar/>
            {currentChat != null && <Chat/> }
        </div>
    )
}