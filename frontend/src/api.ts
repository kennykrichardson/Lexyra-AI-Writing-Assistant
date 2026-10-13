export type WritingStyle = "professional" | "articulate" | "concise" | "confident" | "recruiter-friendly" | "academic";
export interface EnhanceResponse { original_text:string; enhanced_text:string; style:WritingStyle }
const API=(import.meta.env.VITE_API_URL||"https://lexyra-api.onrender.com").replace(/\/+$/,"");
export async function checkHealth():Promise<boolean>{try{return (await fetch(`${API}/api/health`)).ok}catch{return false}}
export async function enhanceText(text:string,style:WritingStyle):Promise<EnhanceResponse>{const r=await fetch(`${API}/api/enhance`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text,style})});const data:unknown=await r.json().catch(()=>null);if(!r.ok){const detail=typeof data==="object"&&data!==null&&"detail" in data&&typeof data.detail==="string"?data.detail:"Lexyra couldn't enhance your writing. Please try again.";throw new Error(detail)}return data as EnhanceResponse}

