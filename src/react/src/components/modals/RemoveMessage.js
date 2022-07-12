import React, { useState, useRef } from "react";

import '../styles/RemoveMessageModal.css';

import { AuthContext } from '../../contexts/AuthContext';
import { ModalContext } from '../../contexts/ModalContext';

import axios from "axios";

export default function RemoveMessageModal({message}){

    const everyone = useRef(null);
    const myself = useRef(null);

    const [unsentFor, setUnsentFor] = useState(null);

    const { session } = React.useContext(AuthContext);
    const { setSeeRemoveMessageModal } = React.useContext(ModalContext);

    function submitRemoveMessage(){
        axios.patch(`${process.env.REACT_APP_DOMAIN}/api/messages/${message.id}?unsentFor=${unsentFor}`)
        .then(() => setSeeRemoveMessageModal(false));
    }

    return (
        <div className='bg'>
            <div className='modal'>
                <div className='modal_message'>
                    <h3>Who do you want to remove this message for?</h3>
                </div>

                <form onChange={(e) => setUnsentFor(e.target.value)}>
                    {session.user_metadata.sub === message.from && (
                        <div className='modal_section'>
                            <input type='radio' name='unsendFor' value='everyone' ref={everyone}/> 

                            <div className='modal_select'>
                                <h3 className='modal_option' onClick={() => everyone.current.click()}>Unsend for everyone</h3>
                                <span>
                                    This message will be unsent for everyone in the chat. Others may have already seen or forwarded it. 
                                    Unsent messages can still be included in reports.
                                </span>
                            </div>
                        </div>
                    )} 

                    <div className='modal_section'>
                        <input type='radio' name='unsendFor' value={session.user_metadata.sub} ref={myself}/>

                        <div className='modal_select'>
                            <h3 className='modal_option' onClick={() => myself.current.click()}>Remove for you</h3>
                            <span>
                                This message will be removed for you. Others in the chat will still be able to see it.
                            </span>
                        </div>
                    </div>
                </form>

                <div className='modal_confirm'>
                    <button className='modal_cancel' onClick={() => setSeeRemoveMessageModal(false)}>Cancel</button>
                    <button className='modal_remove' disabled={unsentFor === null} onClick={submitRemoveMessage}>Remove</button>
                </div>
            </div>
        </div>
    )
}