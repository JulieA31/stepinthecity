// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://ndkduznyyohboyxyqvpp.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ka2R1em55eW9oYm95eHlxdnBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4OTY1NjUsImV4cCI6MjA0ODQ3MjU2NX0.nS3WwMEMfRG38DpD9n2qj-5G4xHVLr1NbLy-cyBsusw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);