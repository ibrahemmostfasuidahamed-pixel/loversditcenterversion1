/*
 SETUP STEPS:
 1. Create account at supabase.com
 2. New project → copy URL and anon key
 3. Add to .env.local:
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
 4. Go to SQL Editor → run db-schema.sql
 5. npm install @supabase/supabase-js
 6. Done!
*/

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
