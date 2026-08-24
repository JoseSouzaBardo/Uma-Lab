# Importação de dados do Build Generator

| Entidade | Total | Fonte principal |
|---|---:|---|
| Support cards | 245 | `uma_data/dump.json` |
| CMs | 18 | `UMA - pistas CM 1-18.txt` + `analyst/app/data.json` |
| Cenários Global | 4 | `analyst/app/data.json` |
| Fatores azuis | 5 | `gametora_data/factors.json` |
| Fatores rosas | 10 | `gametora_data/factors.json` |
| Fatores brancos de corrida | 37 | `gametora_data/factors.json` |
| Fatores brancos de cenário | 34 | `gametora_data/factors.json` |
| Fatores brancos de skill | 439 | `gametora_data/factors.json` |

O catálogo foi normalizado pelo script `scripts/import-build-generator-data.mjs`. Ele não executa scripts do repositório de pesquisa: lê JSON e o arquivo textual de pistas, valida contagens e gera `client/src/data/build-generator-catalog.json`.

A regra `id + 800000` de skill única herdada só é registrada quando o ID resultante existe no catálogo Global principal. IDs ausentes permanecem como `null`, evitando inferências silenciosas.

Skills de hints de support cards que não aparecem no catálogo Global permanecem em `validation.unresolvedHintSkillIds` para auditoria e não entram no plano automático.
