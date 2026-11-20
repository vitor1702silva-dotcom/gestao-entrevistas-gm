# Gestão de Entrevistas — Grupo Mateus

Formulário público e painel administrativo. GitHub + Netlify Functions + Netlify Blobs, sem Supabase.

## Publicar

1. Envie **o conteúdo** deste ZIP à raiz do repositório GitHub (não envie o ZIP fechado nem coloque tudo dentro de uma pasta).
2. No Netlify, importe o repositório. Build command: `npm run build`; Publish directory: `dist`. O `netlify.toml` já contém essas configurações.
3. Em **Site configuration → Environment variables**, crie:
   - `ADMIN_PASSWORD`: senha forte exclusiva da Coordenação.
   - `ADMIN_SECRET`: segredo aleatório de pelo menos 32 caracteres, diferente da senha.
4. Se os logs da função `records` mostrarem `MissingBlobsEnvironmentError`, crie também:
   - `BLOBS_SITE_ID`: ID do site (Site ID / Project ID) obtido no Netlify.
   - `BLOBS_TOKEN`: token de acesso pessoal do Netlify com acesso ao site, gerado na conta Netlify. **Não compartilhe esse token e nunca coloque no GitHub.**
5. Após alterar variáveis, faça **Trigger deploy → Deploy site**. Teste o envio de uma pesquisa fictícia e confira o dashboard.

## Segurança

O repositório pode ser público; as senhas e tokens devem ficar apenas nas variáveis de ambiente do Netlify. O formulário público aceita envios anônimos; considere proteção anti-spam/rate limiting antes de divulgar amplamente. A área de coordenação usa token assinado com validade de 8 horas. A autenticação anterior de outro projeto **não é reutilizada automaticamente**.

## Observações

Este pacote foi preparado para implantação, mas **não foi testado na conta Netlify do usuário**. Para investigar falhas, consulte Netlify → Functions → `records` → logs. A exclusão é permanente; faça exportações periódicas.
