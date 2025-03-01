import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://yazzyrvtglasvevlraut.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhenp5cnZ0Z2xhc3ZldmxyYXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3ODE5NzgsImV4cCI6MjA1NDM1Nzk3OH0.NmZPqtJKzzsgORpQqbXwI6OCzCz_i6PBe0_YhwpywWU";


const supabase = createClient(SUPABASE_URL,SUPABASE_ANON_KEY);

export default supabase;
