import React from 'react';

import './Sidebar.css'

import { ChatContext } from "../contexts/ChatContext";

export default function Sidebar(){
    const { currentChat } = React.useContext(ChatContext)

    return (
        <div className='sidebar'>
            <h1>Sidebar</h1>
        </div>
    )
}