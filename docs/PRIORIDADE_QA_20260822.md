# Verificação visual — Prioridade de skills

## Rotas verificadas

A nova área foi revisada em `/?tab=priority` no desktop e em viewport estreito. O seletor de build, o seletor detalhado das 18 CMs, a fita de fases, a lista de prioridades, os pesos e a busca manual ficaram presentes e legíveis nas duas verificações.

## Achados registrados

| Elemento | Resultado |
|---|---|
| Contexto de corrida | A CM selecionada expõe local, superfície, distância, direção, estação, clima, terreno, inclinações, curvas, retas, Position Keep e Spurt. |
| Classificação | O painel destaca até três centrais e diferencia suporte, contexto, exclusão e ajuste manual. |
| Fichas de skill | Cada item apresenta uma trilha Abertura/Meio/Final/Spurt e uma faixa de distância sugerida, reduzindo a aparência de lista genérica. |
| Ajuste manual | Peso, remoção do núcleo automático e adição de skill permanecem em controles visíveis e separados da lógica automática. |
| Limites | A própria interface afirma que o feedback é local, não treina modelo, não altera regras e não desbloqueia o M3. |

## Nota de responsividade

Em viewport de 375 px, os controles continuam em fluxo vertical, sem sobreposição aparente. A captura de página inteira preserva uma faixa ampla de fundo à direita, comportamento já observado nas verificações anteriores do preview; recomenda-se teste manual no navegador local para a ergonomia final de toque.
