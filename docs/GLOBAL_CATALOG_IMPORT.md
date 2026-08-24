# Importação do catálogo Global

| Entidade | Total | Chave primária |
|---|---:|---|
| Variantes de personagem | 99 | global:uma:<personagem>:<variante> |
| Personagens-base | 64 | Nome normalizado dentro da variante |
| Skills | 591 | ID do catálogo Global |
| Skills com custo de SP registrado | 472 | ID do catálogo Global |

O arquivo client/src/data/global-catalog.json foi gerado pelo script scripts/import-global-catalog.mjs a partir dos dois arquivos brutos fornecidos pelo usuário. IDs de skills são preservados sem transformação. IDs de variantes são chaves locais determinísticas porque o arquivo de personagens não contém um ID numérico oficial para cada skin. Custos ausentes permanecem nulos até haver fonte Global correspondente.
