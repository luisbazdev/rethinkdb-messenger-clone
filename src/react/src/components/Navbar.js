import React, { useEffect } from 'react';

import './Navbar.css';

import { supabase } from '../supabase';

export default function Navbar({session}){

    const handleInserts = (payload) => {
        // ...
    }

    async function init(){
        var { data: todos, error } = supabase
        .from('profiles')
        .on('INSERT', handleInserts)
        .subscribe()
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <div className='nav'>
            <div className='header'>
                <img src={session.user_metadata.picture} id='profile'/>
                <strong>Chats</strong>
            </div>
            <div className='chats'>
                
                {/* {inboxes.map((inbox) => <Inbox inbox={inbox}/>)} */}
            </div>
        </div>
    )
}