import React from 'react';

import './Navbar.css';

export default function Navbar({session}){

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