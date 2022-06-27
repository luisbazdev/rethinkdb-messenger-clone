import { createClient } from '@supabase/supabase-js';

var supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function signInWithFacebook() {
    const { user, session, error } = await supabase.auth.signIn({
      provider: 'facebook',
    });
}
