import React, { useEffect, useState} from 'react';

import './Chat.css';

import { logOut } from '../supabase';

import axios from "axios";

export default function Chat({session}){
    // const [message, setMessage] = useState('')

    useEffect(() => {
        axios.post(`${process.env.REACT_APP_DOMAIN}/api/changes`, {
            from: session.user_metadata.sub,
            // target: ...,
        })
    }, [])

    function sendMessage(){
        axios.post(`${process.env.REACT_APP_DOMAIN}/api/messages`, {
            from: session.user_metadata.sub,
            // target: ...,
            // message
        })
        .then(() => {
            // ...
        })
    }

    return (
        <div className='chat'>
            <h1>Chat</h1>
            <button onClick={logOut}>log out</button>
        </div>
    )
}