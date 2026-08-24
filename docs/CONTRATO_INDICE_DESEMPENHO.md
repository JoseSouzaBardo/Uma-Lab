# Contrato do índice composto de desempenho

## Escopo

O índice composto é um resumo **descritivo** do histórico local de uma build em sessões comparáveis. Ele não estima chance real de vitória, não escolhe a melhor build, não altera regras do catálogo e não calibra o M3.

## Amostra mínima

O painel só revela o índice numérico depois de **cinco sessões comparáveis** da mesma build e CM. Antes disso, mostra contadores e uma faixa de evidência insuficiente. Cinco sessões permitem um primeiro resumo visual, mas não constituem validação estatística nem liberam calibração.

## Componentes iniciais

| Componente | Cálculo | Peso | Fonte |
|---|---:|---:|---|
| Vitória binária | vitórias ÷ sessões | 70% | colocação final observada igual a 1 |
| Colocação normalizada | média de `(N − colocação) ÷ (N − 1)` | 30% | colocação final observada; `N = 9` na CM completa |
| Índice composto | `100 × (0,70 × vitória + 0,30 × colocação)` | — | somente após 5 sessões |

Cada entrada mantém data, sessão, CM, colocação e vitória como fatos. A normalização usa nove corredoras como tamanho padrão da CM, sem afirmar que o modelo atual já interpreta equipes de três corredoras.

## Ativações de skills

Ativações por ID continuam sendo exibidas como **fatos de aderência**. Elas não entram no índice nesta etapa porque a coleta ainda não registra de modo completo quais skills tiveram oportunidade observável de ativar. Ausência de ativação não pode ser convertida automaticamente em falha. Quando o protocolo registrar oportunidades, será possível acrescentar uma taxa ponderada de ativação com os pesos das skills prioritárias.

## Faixas de leitura

| Estado | Regra | Significado |
|---|---|---|
| Evidência insuficiente | 0–4 sessões | Mostra fatos, mas esconde o índice. |
| Índice inicial | 5–9 sessões | Resumo descritivo inicial; requer repetição. |
| Em acompanhamento | 10–19 sessões | Mais pontos de comparação, ainda sem concluir causalidade. |
| Histórico ampliado | 20+ sessões | Histórico descritivo robustecido; M3 continua exigindo seus próprios pares e validação temporal. |

## Relação com o M3

O M3 só considera seus pares compatíveis de snapshot M2 e observação, cobertura, diversidade e validação temporal. Vitória, colocação, índice e ativações não reduzem o mínimo de 20 pares e não aplicam parâmetros automaticamente.
