# Coleta real e pareamento — CM 1

O fluxo de coleta da CM 1 foi desenhado para registrar evidências de forma rápida e local. A unidade principal agora é uma **sessão de corrida**, não uma observação isolada. Uma sessão registra o contexto fixo da Taurus Cup e todos os participantes que você decidiu anotar naquela tentativa.

> A sessão não prevê vitória nem exige vídeo. Ela preserva fatos que você conseguiu observar e deixa inferências claramente marcadas.

## Como registrar uma sessão

Use **Registrar sessão CM 1** no topo do laboratório ou na área de Dados Coletados. O formulário já fixa `CM 1 · Tokyo · Turf · 2400 m · esquerda · firme`, evitando que uma corrida seja classificada com pista errada. Informe a data, escolha a fonte de evidência e, se quiser, escreva apenas o nome ou caminho relativo de uma captura/vídeo guardado no seu computador.

| Campo | O que registrar | Regra de interpretação |
|---|---|---|
| Fonte de evidência | Anotação manual, captura local ou vídeo local. | Nenhum arquivo é enviado nem armazenado pelo aplicativo. |
| Participante | Build, estratégia e colocação. | A mesma build e a mesma colocação não podem aparecer duas vezes na sessão. |
| Fatos observados | Late Start, Rushed, Pace Down, bloqueio, ultrapassagem e recovery. | Marque somente eventos que você identificou. Campo vazio significa “não registrado”, não “não ocorreu”. |
| Inferência de stamina | Possível falta de stamina. | Mantida fora dos fatos observados e usada como inferência explícita. |
| Skills | IDs de skills que você viu ativar. | IDs inexistentes são ignorados; use o catálogo para confirmar IDs. |

## Pareamento com o M2

Antes de fazer a corrida, em **Diagnosticar**, você pode salvar uma trajetória M2 da build. Ao registrar o participante real, o seletor oferece apenas snapshots que tenham a mesma build, `cm-01` e estratégia. Assim, o pareamento manual nunca pode ligar Gold Ship End Closer da CM 1 a uma simulação de outra CM ou outro estilo.

O vínculo é opcional. Sem snapshot, a sessão ainda entra no livro de bordo como evidência descritiva. Com snapshot, a aplicação gera uma observação compatível para o M3 e ela passa a contar para cobertura, validação e possíveis rascunhos de calibração. O vínculo continua sujeito aos bloqueios de volume e validação temporal do M3.

## Como preservar a coleta

As sessões são armazenadas localmente no navegador atual. O cartão **CM 1 · livro de sessões reais** permite baixar um JSON independente com todas as sessões, participantes e vínculos. Use esse arquivo como backup regular da coleta.

O backup SQLite e a exportação de builds do modo desktop ainda cobrem os dados de builds, não esse novo livro de sessões. Por isso, enquanto a persistência SQLite de sessões não for implementada, exporte o JSON das sessões antes de limpar dados do navegador ou mudar de computador.

## Fluxo recomendado após cada corrida

Primeiro, salve o snapshot M2 da build que será usada. Depois, faça a corrida e registre apenas os fatos confiáveis. Por fim, associe o snapshot compatível, se ele existir. Para reduzir esforço, comece anotando sua própria build e inclua adversárias somente quando você tiver a build delas registrada no laboratório.

O painel de sessões mostra quantos participantes foram pareados. Não trate esse número como qualidade de recomendação por si só: o M3 ainda exige cobertura suficiente e uma separação temporal entre treino e validação.
