# UMA — Workspace de Dados e Ferramentas (Umamusume: Pretty Derby)

Coleção de bancos de dados em texto, ferramentas e um protótipo de analisador para o jogo
Umamusume: Pretty Derby (servidor Global), montados entre 20 e 21/08/2026.

## Estrutura

| Arquivo/Pasta | Conteúdo |
|---|---|
| `UMA - dados gerais (completo).txt` | Banco de dados das 99 cartas de personagem (aptidões, crescimento, skills) |
| `UMA - skills (completo).txt` | Banco de 591 skills (efeitos, condições, variantes, escala dinâmica) |
| `UMA - support cards (completo).txt` | 245 support cards (efeitos no Nv 50, efeito único, hints, eventos) |
| `UMA - pistas CM 1-18.txt` | Layout das pistas das Champions Meeting 1–18 (fases, retas, curvas, inclinações, stat thresholds) |
| `UMA - fatores de heranca.txt` | Fatores (sparks) de herança: azuis, rosas, verdes e brancos |
| `UMA - cenarios de treino.txt` | Os 4 cenários de treino do Global (URA, Unity, Trackblazer, Grand Live) |
| `UMA - metas de CM (comunidade).txt` | Meta da comunidade por CM (game8 + uma.guide) |
| `RELATORIO - revisao e correcoes.md` | Relatório geral de fontes, correções e metodologia |
| `RELATORIO - validacao de pistas.md` | Validação cruzada das pistas (gametora × umalator × in-game) |
| `analyst/` | **Analisador de CM** (protótipo web: `app/index.html` + `app/data.json`).|
| `umalator-global/` | Cópia do simulador de corridas **umalator** (alpha123/uma-tools), versão Global.|
| `uma_data/`, `gametora_data/`, `game8_guides/`, `uma_guides/` | Dados brutos baixados e scripts geradores (o "rastro" de como cada .txt foi produzido) |

## Como rodar os aplicativos

```bash
# Analisador de CM
cd analyst/app && python3 -m http.server 8081
# Simulador umalator
cd umalator-global && python3 -m http.server 8080
```

## Fontes e atribuição

- **uma.guide** (https://uma.guide) — dados de personagens, skills, support cards; guias de CM
  (CM9–18). Textos dos guias reproduzidos com atribuição.
- **gametora.com** — dados de pistas (CM), fatores de herança, cenários de treino e artigos
  "Uma Musume Legacies"/cenários. Textos adaptados com atribuição.
- **game8.co** — guias de Champions Meeting (CM1–18): análise de pista, metas de status,
  tier lists, skills/suportes recomendados. Textos extraídos e reproduzidos com atribuição.
- **alpha123/uma-tools** (https://github.com/alpha123/uma-tools) — o simulador umalator-global,
  incluído na pasta `umalator-global/` sob os termos da licença GPL-3.0 (cópia da licença em
  `umalator-global/LICENSE`).

## ⚠️ Licenças — leia antes de publicar este repositório

1. **umalator-global/ (alpha123/uma-tools): GPL-3.0.** Você pode hospedar e redistribuir desde que
   mantenha a licença (já incluída), os avisos de copyright do autor e disponibilize o código-fonte
   (o próprio conteúdo da pasta). **Modificação feita:** o arquivo `bundle.js` foi levemente
   alterado para neutralizar o bloqueio anti-iframe do app (necessário para rodar em preview);
   a alteração está documentada aqui e o código-fonte (o próprio bundle) acompanha o repositório.
2. **Ícones dentro de `umalator-global/uma-tools/icons/`:** são assets do jogo (© Cygames).
   A distribuição em repositórios de fãs é prática comum, mas não há licença formal — se quiser
   ser conservador, exclua essa pasta (o simulador continua funcionando, apenas sem imagens).
3. **Textos de guias** (game8, uma.guide, gametora) reproduzidos nos arquivos: são conteúdo
   protegido por direito autoral dos respectivos sites/autores, usados aqui para referência
   pessoal com atribuição. Para um repositório público, mantenha a atribuição (presente nos
   cabeçalhos dos arquivos e neste README) e considere reduzir a reprodução integral dos textos
   aos pontos de dados — posso gerar versões "enxutas" se preferir.
4. **Dados factuais** (números de status, condições de skills, layout de pistas) não são
   protegidos por direito autoral, mas a coleta foi feita de sites de terceiros — a atribuição
   nos cabeçalhos é questão de boa prática e transparência.

## Aviso

Ferramentas e dados são informativos e foram extraídos automaticamente; valide decisões
importantes no jogo ou no simulador. Nenhuma afiliação com a Cygames.
