import crypto from "crypto";
export function validPaystackSignature(raw:string, signature:string|null){const key=process.env.PAYSTACK_SECRET_KEY;if(!key||!signature)return false;const expected=Buffer.from(crypto.createHmac("sha512",key).update(raw).digest("hex"));const received=Buffer.from(signature);return expected.length===received.length&&crypto.timingSafeEqual(expected,received);}
