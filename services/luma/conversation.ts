import { adminSupabase } from "@/lib/supabase-server";
import { generateLumaResponse, type ChatTurn } from "@/services/ai/provider";
import { LUMA_SYSTEM } from "@/services/luma/personality";
import { relevantMemories, extractMemory } from "./memory";

export async function continueConversation(userId:string, content:string, conversationId?:string){
  const db=adminSupabase(); let id=conversationId;
  if(id){const {data}=await db.from("conversations").select("id").eq("id",id).eq("user_id",userId).maybeSingle();if(!data)throw new Error("Conversation not found");}
  else {const {data,error}=await db.from("conversations").insert({user_id:userId}).select("id").single();if(error)throw error;id=data.id;}
  const {data:userMessage,error:userError}=await db.from("messages").insert({conversation_id:id,user_id:userId,role:"user",content}).select("id").single();if(userError)throw userError;
  const [{data:previous},memories]=await Promise.all([db.from("messages").select("role,content").eq("conversation_id",id).order("created_at",{ascending:false}).limit(12),relevantMemories(userId,content)]);
  const memoryContext=memories.length?`\nRelevant private memories:\n${memories.map(m=>`- ${m.title}: ${m.content}`).join("\n")}`:"";
  const turns:ChatTurn[]=(previous??[]).reverse().map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.content}));
  const reply=await generateLumaResponse(LUMA_SYSTEM+memoryContext,turns);
  await db.from("messages").insert({conversation_id:id,user_id:userId,role:"assistant",content:reply});
  void extractMemory(userId,userMessage.id,content);
  return {reply,conversationId:id};
}
