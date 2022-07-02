import React from 'react';

import { signInWithFacebook } from '../supabase';

export default function Login(){

    return (
        <div>
            <h1>Login page</h1>
            <button onClick={signInWithFacebook}>Login with Facebook</button>
        </div>
    )
}