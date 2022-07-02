import React from "react";

import './Inbox.css';

export default function Inbox({inbox, selected}){
    return (
        <div className="inbox" id={selected ? 'selected' : ''}>
            <img id='inbox_profile' src={inbox.avatar_url}/>
            <div className="details">
                <p>{inbox.user_name}</p>
                <p></p>
            </div>
        </div>
    )
}