import {mkdirSync,copyFileSync} from 'node:fs';
mkdirSync('dist/assets',{recursive:true});
for(const f of ['index.html','style.css','app.js','setores.json'])copyFileSync(f,'dist/'+f);
copyFileSync('assets/logo-mateus.png','dist/assets/logo-mateus.png');
console.log('Build concluído.');
