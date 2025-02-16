// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase credentials
const supabaseUrl = 'https://yazzyrvtglasvevlraut.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhenp5cnZ0Z2xhc3ZldmxyYXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3ODE5NzgsImV4cCI6MjA1NDM1Nzk3OH0.NmZPqtJKzzsgORpQqbXwI6OCzCz_i6PBe0_YhwpywWU'
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
