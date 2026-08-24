# Self-test de sanidade — M4

## Escopo da rodada

Esta rodada foi executada depois da implementação do M4 e em ordem independente da interface: verificação de tipos, testes unitários, invariantes de dados, contratos de segurança e compilação de produção. O objetivo foi verificar que o relatório consolida os módulos existentes sem abrir caminho para uma previsão de vitória ou um ajuste automático de parâmetros.

| Verificação | Resultado | Evidência |
|---|---|---|
| Tipagem TypeScript | Aprovada | `pnpm check` concluiu sem erros. |
| Testes unitários | Aprovados | 13 arquivos de teste e 43 testes passaram. |
| Invariantes de catálogo | Aprovados | 99 variantes, 591 skills, 18 CMs e 245 support cards; IDs validados como únicos. |
| Segurança do M2 | Aprovada | O self-test confirma que Rushed e Pace Down são localizados por intervalo e que não há `winRate` ou chance de vitória no motor. |
| Segurança do M3 | Aprovada | Mínimo de 20 pares, validação temporal e status de rascunho/bloqueio confirmados. |
| Contrato M4 | Aprovado | Markdown e JSON presentes, com aviso explícito de compatibilidade e risco estimados. |
| Compilação de produção | Aprovada | `pnpm build` concluiu; permanece apenas o aviso de chunk JavaScript acima de 500 kB. |

## Comando reproduzível

```bash
pnpm check && pnpm test && pnpm self-test && pnpm build
```

O comando `pnpm self-test` foi adicionado ao projeto. Ele valida 16 invariantes de sanidade sem depender do navegador: cobertura de catálogos, IDs estáveis, geometria da CM 1, limites declarados pelo M4 e bloqueios do M2 e M3.

> **Resultado da rodada:** 16 invariantes aprovadas, 0 falhas; 43 testes unitários aprovados, 0 falhas.

## Limites que continuam válidos

O self-test prova consistência interna do código e dos dados importados. Ele não substitui observação de corrida real, não calibra RNG, não mede taxa de ativação de skill, não estima colocação nem garante comportamento em todas as versões futuras do jogo. A coleta de pares M2–observação continua necessária para liberar qualquer rascunho do M3.
