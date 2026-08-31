import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/supabase-server";
import { allow } from "@/lib/rate-limit";
import { continueConversation } from "@/services/luma/conversation";
const bodySchema=z.object({message:z.string().trim().min(1).max(1200),conversationId:z.string().uuid().optional()});
export async function POST(request:Request){ const parsed=bodySchema.safeParse(await request.json()); if(!parsed.success)return NextResponse.json({error:"Say that again?"},{status:400}); let user;try{user=await requireUser(request);}catch{return NextResponse.json({error:"Please sign in to speak with Luma."},{status:401});}if(!allow(user.id))return NextResponse.json({error:"Luma needs a moment."},{status:429});try{const result=await continueConversation(user.id,parsed.data.message,parsed.data.conversationId);return NextResponse.json(result,{headers:{"Cache-Control":"no-store"}});}catch{return NextResponse.json({error:"Luma went quiet for a moment."},{status:503});} }
