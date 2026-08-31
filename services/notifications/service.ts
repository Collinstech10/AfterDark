import { adminSupabase } from "@/lib/supabase-server";
export type NotificationType="LUMA_MESSAGE"|"STORY_EVENT"|"MEMORY_DISCOVERY"|"RELATIONSHIP_EVENT"|"RETURN_EVENT"|"SYSTEM";
export async function createNotification(userId:string,type:NotificationType,title:string,body:string,metadata:Record<string,unknown>={}) { const db=adminSupabase(); const {error}=await db.from("notifications").insert({user_id:userId,type,title,body,metadata}); if(error)throw error; }
export async function unreadCount(userId:string){const {count,error}=await adminSupabase().from("notifications").select("id",{count:"exact",head:true}).eq("user_id",userId).eq("read",false);if(error)throw error;return count||0;}
