import { connectLambda } from '@netlify/blobs';
import {randomUUID} from 'node:crypto';
import {store,reply,admin,validate,clean} from './_shared.mjs';
export const handler=async e=>{try{
 connectLambda(e);
 if(e.httpMethod==='POST'){
  const d=JSON.parse(e.body||'{}');const error=validate(d);if(error)return reply(400,{error});
  const s=store();const record={id:randomUUID(),...clean(d),criadoEm:new Date().toISOString()};await s.setJSON(record.id,record);return reply(201,{ok:true,id:record.id});
 }
 if(!admin(e))return reply(401,{error:'Acesso restrito'});
 const s=store();
 if(e.httpMethod==='GET'){const result=await s.list({paginate:false});const rows=await Promise.all(result.blobs.map(b=>s.get(b.key,{type:'json'})));return reply(200,{rows:rows.filter(Boolean)});}
 const id=e.queryStringParameters?.id;if(!id||!/^[0-9a-f-]{36}$/i.test(id))return reply(400,{error:'ID inválido'});
 if(e.httpMethod==='DELETE'){await s.delete(id);return reply(200,{ok:true});}
 if(e.httpMethod==='PUT'){const old=await s.get(id,{type:'json'});if(!old)return reply(404,{error:'Não encontrado'});const d=JSON.parse(e.body||'{}');const error=validate(d);if(error)return reply(400,{error});await s.setJSON(id,{...old,...clean(d),editadoEm:new Date().toISOString()});return reply(200,{ok:true});}
 return reply(405,{error:'Método não permitido'});
 }catch(err){console.error('records:',err);return reply(500,{error:err?.name==='MissingBlobsEnvironmentError'?'Netlify Blobs sem credenciais: configure BLOBS_SITE_ID e BLOBS_TOKEN nas variáveis de ambiente.':'Falha ao salvar ou consultar. Confira os logs de Functions no Netlify.'});}};
