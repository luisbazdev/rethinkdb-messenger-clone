import React from "react"

import '../styles/Message.css'

import { getExtensions } from "../../utils/extensions";
import { formatMessage } from "../../libs/string";

import { ChatContext } from "../../contexts/ChatContext";
import { ModalContext } from '../../contexts/ModalContext';

import { Link } from "react-router-dom";

import { BsThreeDotsVertical } from 'react-icons/bs'

export default function Message({message, own, unsent, setToggled, toggled, session}){

    // let date = formatDate(message.createdAt);

    let path = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/files/${message.file_path}`;

    let extensions = getExtensions();

    const { currentChat } = React.useContext(ChatContext)
    const { setMessageToRemove, setSeeRemoveMessageModal } = React.useContext(ModalContext);

    return (
        <div className={`message_box ${own ? 'own' : ''}`}>
            {/* <div className='message_date'>
                <p>{date}</p>
            </div> */}
            <div className='message'>
                {!own && <img alt='User profile' src={currentChat.avatar_url} className='message_user_avatar'/>}

                {/* Make a new component for this and
                style it better */}
                {own && (
                    <div className={`options_box ${toggled ? 'options_box_toggled' : ''}`}>
                        { toggled && <div className='options'>
                            <button onClick={() => {
                                setMessageToRemove(message)
                                setSeeRemoveMessageModal(true)
                                setToggled(null)
                            }}>Remove</button>
                        </div>}
                        <BsThreeDotsVertical id='options' onClick={() => {
                            if(!toggled)
                                setToggled(message)
                            else
                                setToggled(null);
                        }}/>
                    </div>
                )}

                {!unsent ? (
                    <div>
                        {message.message && 
                            <div className='message_content message_own'>
                                <p>{message.message}</p>
                            </div>
                        }
                
                        {extensions.image.find(_ext => _ext === message.file_ext) 
                        && (
                            <Link to={`/messenger_media?thread_id=${message.from}&message_id=${message.id}`} state={{prevPath: true}}> 
                                <img alt='File received' className='message_file' src={path}/> 
                            </Link>
                        )}
                
                        {extensions.video.find(_ext => _ext === message.file_ext) 
                        && (
                            <Link to={`/messenger_media?thread_id=${message.from}&message_id=${message.id}`} state={{prevPath: true}}> 
                                <video controls 
                                className='message_file' 
                                src={path}/>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className='message_content message_unsent'>
                        <p>{formatMessage(session.user_metadata.sub, message, currentChat.user_name)}</p>
                    </div>
                )}

                {!own && (
                    <div className={`options_box ${toggled ? 'options_box_toggled' : ''}`}>
                        { toggled && <div className='options'>
                            <button onClick={() => {
                                setMessageToRemove(message)
                                setSeeRemoveMessageModal(true)
                                setToggled(null)
                            }}>Remove</button>
                        </div>}
                        <BsThreeDotsVertical id='options' onClick={() => {
                            if(!toggled)
                                setToggled(message)
                            else
                                setToggled(null);
                        }}/>
                    </div>
                )}
            </div>
        </div>
    )
}