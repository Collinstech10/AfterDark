"use client";
import { createClient } from "@supabase/supabase-js";
export function browserSupabase(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;if(!url||!key)throw new Error("Afterdark is not configured yet.");return createClient(url,key);}
