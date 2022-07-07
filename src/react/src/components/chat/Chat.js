import React, { useEffect, useState } from 'react';

import '../styles/Chat.css';

import Messages from './Messages';
import Submit from './Submit';
import Header from './Header';

export default function Chat(){

    return (
        <div className='chat'>
            <Header/>
            <Messages/>
            <Submit/>
        </div>
    )
}