import React, { useEffect, useState } from 'react';

import '../styles/Navbar.css';

import { supabase } from '../../supabase';

import Inbox from './Inbox';

import { Link }  from 'react-router-dom'

import { AuthContext } from "../../contexts/AuthContext";
import { ChatContext } from "../../contexts/ChatContext";

export default function Navbar(){

    const { session } = React.useContext(AuthContext)
    const { currentChat, setCurrentChat } = React.useContext(ChatContext)

    const [inboxes, setInboxes] = useState([])

    function handler(payload){
        const _inbox = payload.new;
        setInboxes((_inboxes) => [..._inboxes, _inbox]);
    }
    
    function start(){
        // Query records in the 'profiles' table
        queryProfiles();

        // Listen for INSERTS in the 'profiles' table
        supabase
        .from('profiles')
        .on('INSERT', handler)
        .subscribe();
    }

    async function queryProfiles(){
        const { data: _inboxes} = await supabase
        .from('profiles')
        .select('*')
        .not('user_id', 'eq', session.user_metadata.sub)

        setInboxes(_inboxes);
    }   

    useEffect(() => {
        start()
    }, [])

    return (
        <div className='nav'>
            <div className='header'>
                <img src={session.user_metadata.picture} alt='User profile' id='navbar_profile'/>
                <strong>Chats</strong>
            </div>
            <div className='chats'>
                {inboxes.map((inbox) => 
                <Link onClick={() => setCurrentChat(inbox)} 
                key={inbox.user_id} 
                to={`./${inbox.user_id}`}> 
                    <Inbox session={session} inbox={inbox} selected={inbox === currentChat}/> 
                </Link>)}
            </div>
        </div>
    )
}