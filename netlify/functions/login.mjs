import {reply,token,adminPassword} from '../shared.mjs';
import {timingSafeEqual} from 'node:crypto';
const handler=async e=>{if(e.httpMethod!=='POST')return reply(405,{error:'Método não permitido'});try{const d=JSON.parse(e.body||'{}');const password=adminPassword();if(!password){console.error('ADMIN_PASSWORD ausente no ambiente da função');return reply(503,{error:'ADMIN_PASSWORD indisponível na função em produção.'});}const a=Buffer.from(String(d.senha||'')),b=Buffer.from(password);if(a.length!==b.length||!timingSafeEqual(a,b))return reply(401,{error:'Senha incorreta'});return reply(200,{token:token()});}catch{return reply(400,{error:'Dados inválidos'});}};

export default async function(request){
 const url=new URL(request.url);
 const result=await handler({httpMethod:request.method,headers:Object.fromEntries(request.headers),queryStringParameters:Object.fromEntries(url.searchParams),body:["GET","HEAD"].includes(request.method)?undefined:await request.text()});
 return new Response(result.body,{status:result.statusCode,headers:result.headers});
}
