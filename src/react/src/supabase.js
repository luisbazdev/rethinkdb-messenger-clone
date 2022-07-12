import { createClient } from '@supabase/supabase-js';

export var supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_KEY);

export async function signInWithFacebook(){
  await supabase.auth.signIn({
    provider: 'facebook',
  });
}

export async function logOut(){
  await supabase.auth.signOut()
}
