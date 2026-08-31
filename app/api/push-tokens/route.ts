import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser, adminSupabase } from "@/lib/supabase-server";
const schema=z.object({token:z.string().min(20).max(4096)});
export async function POST(request:Request){const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"Invalid device."},{status:400});try{const user=await requireUser(request);const {error}=await adminSupabase().from("push_tokens").upsert({user_id:user.id,token:parsed.data.token,last_seen_at:new Date().toISOString()},{onConflict:"token"});if(error)throw error;return NextResponse.json({ok:true});}catch{return NextResponse.json({error:"Could not save this device."},{status:400});}}
