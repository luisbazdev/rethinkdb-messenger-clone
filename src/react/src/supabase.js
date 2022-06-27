import { createClient } from '@supabase/supabase-js';

export var supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_KEY);

export async function signInWithFacebook(){
    const { user, session, error } = await supabase.auth.signIn({
      provider: 'facebook',
    });
}

export async function logOut(){
  const { error } = await supabase.auth.signOut()
}
