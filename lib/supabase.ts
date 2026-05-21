import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.SUPABASE_URL || 'https://cqhqyllmahqyfahacdea.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_secret_mock';

if (supabaseUrl && !supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  supabaseUrl = `https://${supabaseUrl}`;
}

export const supabase = createClient(supabaseUrl, supabaseKey);
