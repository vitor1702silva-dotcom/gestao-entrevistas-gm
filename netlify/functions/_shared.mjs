import {getStore} from '@netlify/blobs';
import {createHmac,timingSafeEqual} from 'node:crypto';
export function export function store(){
 return getStore({
  name:'entrevistas-gm',
  consistency:'strong'
 });
}
 const siteID=process.env.BLOBS_SITE_ID || process.env.SITE_ID;
 const token=process.env.BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
 if(siteID && token)return getStore({name:'entrevistas-gm',siteID,token,consistency:'strong'});
 return getStore({name:'entrevistas-gm',consistency:'strong'});
}
export const reply=(statusCode,data)=>({statusCode,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':'*'},body:JSON.stringify(data)});
export function token(){const payload=Buffer.from(JSON.stringify({role:'coord',exp:Date.now()+8*3600000})).toString('base64url');return payload+'.'+createHmac('sha256',process.env.ADMIN_SECRET).update(payload).digest('hex');}
export function admin(e){const secret=process.env.ADMIN_SECRET;if(!secret||secret.length<32)return false;const auth=e.headers.authorization||e.headers.Authorization||'';const t=auth.replace(/^Bearer /i,'');const [payload,sig]=t.split('.');if(!payload||!sig)return false;const expected=createHmac('sha256',secret).update(payload).digest('hex');if(sig.length!==expected.length||!timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return false;try{const data=JSON.parse(Buffer.from(payload,'base64url').toString());return data.role==='coord'&&data.exp>Date.now();}catch{return false;}}
export function validate(d){if(!/^\d{4}-\d{2}-\d{2}$/.test(d.data||'')||!['CD 86','CD 87','CD 88'].includes(d.filial)||typeof d.setor!=='string'||!d.setor.trim())return 'Confira data, filial e setor.';for(const k of ['convocados','comparecimento','aprovados'])if(!Number.isInteger(Number(d[k]))||Number(d[k])<0)return 'Informe quantidades inteiras e não negativas.';if(+d.comparecimento>+d.convocados||+d.aprovados>+d.comparecimento)return 'Aprovados ≤ comparecimento ≤ convocados.';if(!Array.isArray(d.destinos))return 'Destinos inválidos.';let sum=0;for(const x of d.destinos){if(!x.setor||x.setor===d.setor||!Number.isInteger(+x.quantidade)||+x.quantidade<1)return 'Confira os destinos.';sum+=+x.quantidade;}if(sum>+d.aprovados)return 'Aprovações em outros setores excedem o total de aprovados.';if(String(d.observacao||'').length>2000)return 'Observação muito longa.';return null;}
export function clean(d){return {data:d.data,filial:d.filial,setor:d.setor,convocados:+d.convocados,comparecimento:+d.comparecimento,aprovados:+d.aprovados,destinos:d.destinos.map(x=>({setor:x.setor,quantidade:+x.quantidade})),observacao:String(d.observacao||'').trim()};}
