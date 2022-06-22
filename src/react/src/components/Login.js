import React from 'react';

import FacebookLogin from 'react-facebook-login';

import { AuthContext } from '../contexts/AuthContext';

import { Navigate } from 'react-router-dom';

export default function Login(){

    const { session, setSession } = React.useContext(AuthContext)

    const responseFacebook = (response) => {
        setSession({id: response.id, email: response.email, name: response.name, picture: response.picture.data.url})
    }

    if(session != null)
        return <Navigate to='/t/124'/>

    return (
        <div>
            <h1>Login page</h1>
            <FacebookLogin
            appId='805270520394035'
            // autoLoad={true}
            fields="name,email,picture"
            callback={responseFacebook}
            />
        </div>
    )
}