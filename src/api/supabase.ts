import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_KEY = 'sua-chave-publica';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);