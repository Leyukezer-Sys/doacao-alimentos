import { createClient } from '@supabase/supabase-js';
import APIKEY from './api-key';

const SUPABASE_URL = 'https://iskgoesuujklrmegkebf.supabase.co';
const SUPABASE_KEY = APIKEY.Token;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);