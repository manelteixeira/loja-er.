import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";

const SUPABASE_URL = "https://ncxpfdqbzqgzysawlumm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Wn7YnfIk0j4OSPn4MERTvw_4m4_Y9vw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
