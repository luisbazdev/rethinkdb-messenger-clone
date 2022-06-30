import React, { useEffect, useState } from 'react';

import './Navbar.css';

import { supabase } from '../supabase';

import Inbox from './Inbox';

import { Link }  from 'react-router-dom'

import { ChatContext } from "../contexts/ChatContext";

export default function Navbar({session}){

    const { setCurrentChat } = React.useContext(ChatContext)

    var [inboxes, setInboxes] = useState([])

    const handleInserts = (payload) => {
        // ...
    }
    
    // Rename 'init' and 'init2' functions
    // and add logic for 'handleInserts'
    async function init(){
        var { data: todos, error } = supabase
        .from('profiles')
        .on('INSERT', handleInserts)
        .subscribe()
    }

    async function init2(){
        const { data: _inboxes, error } = await supabase
        .from('profiles')
        .select('*')

        setInboxes(_inboxes)
    }   

    useEffect(() => {
        init()
        init2()
    }, [])


    return (
        <div className='nav'>
            <div className='header'>
                <img src={session.user_metadata.picture} id='navbar_profile'/>
                <strong>Chats</strong>
            </div>
            <div className='chats'>
                {inboxes.map((inbox) => <Link onClick={() => setCurrentChat(inbox)} key={inbox.user_id} to={`./${inbox.user_id}`}> <Inbox inbox={inbox}/> </Link>)}
            </div>
        </div>
    )
}