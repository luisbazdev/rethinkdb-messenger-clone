import React, { useEffect, useState } from "react";

import axios from "axios";

import '../styles/Media.css';

import { getExtensions } from "../../utils/extensions";

import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { IoMdClose } from 'react-icons/io'

export default function Media(){

    const location = useLocation();

    const [prevPath, setPrevPath] = useState(location.state)
    const [searchParams, setSearchParams] = useSearchParams();

    const [media, setMedia] = useState(null);
    const [path, setPath] = useState('');

    const extensions = getExtensions();

    const navigate = useNavigate()

    function redirectBack(){
        prevPath ? navigate(-1) : navigate('/t')
    }

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_DOMAIN}/api/messages/${searchParams.get('message_id')}`)
        .then((_media) => {
            setPath(`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/files/${_media.data.file_path}`);
            setMedia(_media.data);
        });
    }, [])

    return (
        <div className='media'>
            <IoMdClose id='redirect' onClick={redirectBack}/>

            { media && extensions.image.find(_ext => _ext === media.file_ext)
            && <img alt='File received' className='media_file' src={path}/>}

            { media && extensions.video.find(_ext => _ext === media.file_ext)
            && <video autoPlay controls className='media_file' src={path}/>}
        </div>
    )
}