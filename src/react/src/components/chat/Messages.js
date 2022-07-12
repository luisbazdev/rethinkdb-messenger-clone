import React, { useEffect, useState } from 'react';

import axios from "axios";

import Message from './Message';

import { AuthContext } from "../../contexts/AuthContext";
import { useParams } from 'react-router-dom';
import { socket } from '../../ws';

export default function Messages(){

    const { session } = React.useContext(AuthContext);

    const [messages, setMessages] = useState([]);
    const [writing, setWriting] = useState(false)

    const [toggled, setToggled] = useState(null)

    const { userID } = useParams();

    useEffect(() => {
        if(userID){
            axios.get(`${process.env.REACT_APP_DOMAIN}/api/messages?from=${session.user_metadata.sub}&target=${userID}&orderBy=asc`)
            .then((_messages) => {
                setMessages(_messages.data)
            })
        }
    }, [userID])

    useEffect(() => {
        socket.on('received message', (_message) => {
            /**
             * 'messages' state gets updated in the following cases:
             * 
             * 1. The user is the sender
             * 2. The user is the receiver and they're on the
             * same chat as the sender
             */
            if(_message.new_val.from === session.user_metadata.sub || _message.new_val.from === userID)
                setMessages((_messages) => [..._messages, _message.new_val]);
        })
        
        socket.on('unsent message', (_message) => {
            if(_message.new_val.from === session.user_metadata.sub || _message.new_val.from === userID){
                // ...
            }
        })

        socket.on('start writing', (_from) => {
            if(userID === _from)
                setWriting(true);
        })

        socket.on('stop writing', (_from) => {
            if(userID === _from)
                setWriting(false);
        })

        return () => {
            socket.off();
        }
    }, [userID])

    return (
        <div className='chat_messages'>
            {messages.map((msg) => 
            <Message 
                key={msg.id} message={msg} 
                own={msg.from === session.user_metadata.sub}
                unsent={msg.unsentFor === 'everyone'} 
                setToggled={setToggled} 
                toggled={toggled === msg}
                session={session}
            />)}
            {writing && <Message key={'writing'} message={{message: '...'}} own={false}/>}
        </div>
    )
}