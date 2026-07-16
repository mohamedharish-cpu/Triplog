import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mqqutdekgohejkfamgxg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xcXV0ZGVrZ29oZWprZmFtZ3hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0Mzg2MjgsImV4cCI6MjA5NzAxNDYyOH0.nA5hEXz7lJa1UaZ8F8T--e3htuItioCL_IUszZ0UjT0";

export const supabase = createClient(supabaseUrl, supabaseKey);