import { adminSupabase } from "@/lib/supabase-server";
import { generateLumaResponse } from "@/services/ai/provider";

export type RelevantMemory={title:string;content:string;importance:number};
export async function relevantMemories(userId:string, message:string):Promise<RelevantMemory[]>{
  const words=message.toLowerCase().match(/[a-z]{4,}/g)?.slice(0,4)??[];
  const db=adminSupabase();
  let query=db.from("memories").select("title,content,importance").eq("user_id",userId).eq("discovered",true).order("importance",{ascending:false}).limit(6);
  if(words.length)query=query.or(words.map(word=>`content.ilike.%${word}%`).join(","));
  const {data}=await query;
  return data??[];
}

export async function extractMemory(userId:string, sourceMessageId:string, text:string){
  if(text.trim().length<30)return;
  const raw=await generateLumaResponse("Extract one personal, durable memory only when the message gives a meaningful preference, fact, promise, or fear. Return JSON exactly: {\"title\":string,\"content\":string,\"importance\":number}, or {} when none.",[{role:"user",content:text}]);
  try{const memory=JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0]??"{}");if(!memory.title||!memory.content)return;await adminSupabase().from("memories").insert({user_id:userId,title:String(memory.title).slice(0,120),content:String(memory.content).slice(0,800),importance:Math.max(1,Math.min(10,Number(memory.importance)||4)),source_message_id:sourceMessageId,discovered:true});}catch{/* extraction is best-effort */}
}
