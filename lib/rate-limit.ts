type Entry={count:number;reset:number};const buckets=new Map<string,Entry>();
export function allow(key:string,limit=20,windowMs=60_000){const now=Date.now();const existing=buckets.get(key);if(!existing||existing.reset<now){buckets.set(key,{count:1,reset:now+windowMs});return true;}if(existing.count>=limit)return false;existing.count++;return true;}
