# Manifesto de evidências — Fase 7: Implantação

## Identificação

- Fase: `fase-07`.
- Partes executadas: Partes 0 a 9 — baseline, cronograma, implantação teórica, manual, treinamento, segurança, backup e consolidação.
- Data da conferência: 2026-09-07.
- Branch de referência: `main`.
- Commit atual da branch: `bc2b2b846690cc234caba8312a8c6d000e2f2963` — `docs: complete phase 6 review`.
- Estado do diretório durante a conferência: alterações documentais locais da Fase 7 ainda não commitadas; nenhuma alteração de código identificada no diretório de trabalho.

Este manifesto registra o ponto de partida para a redação da Fase 7. A fase tem recorte teórico e não exige implantação, treinamento, backup ou restauração realizados. O commit de referência é documental; o último commit da branch `main` que alterou programação permanece identificado separadamente.

## Classificação adotada

| Classe | Significado neste manifesto |
| --- | --- |
| Fornecida | Informação declarada pelo usuário, sem documento adicional conferido nesta etapa. |
| Verificada no repositório | Informação confirmada no histórico Git, código ou documentação local. |
| Planejada | Atividade ou configuração prevista para o cenário acadêmico. |
| Ausente | Informação ou evidência não localizada na conferência atual. |

## Marcos temporais

| Marco | Data ou período | Classe | Base |
| --- | --- | --- | --- |
| Criação do grupo de TCC | 10/02/2026 | Fornecida | Informação do usuário registrada em D-019. |
| Definição do tema | 17/02/2026 a 09/03/2026 | Fornecida | Informação do usuário registrada em D-019. |
| Busca exploratória de referências para viabilidade | 17/02/2026 a 16/03/2026 | Fornecida | Informação do usuário registrada em D-019. As fontes desse levantamento não são, necessariamente, as fontes do texto final. |
| Elaboração da versão inicial do sistema | 09/03/2026 a 20/06/2026 | Fornecida | Informação do usuário registrada em D-019. A versão foi abandonada porque decisões estruturais seriam difíceis de modificar sem comprometer sua organização; conceitos e a maior parte da stack tecnológica foram portados para o projeto final. |
| Pesquisa contínua de referências e documentos intermediários | 10/03/2026 a 01/09/2026 | Fornecida | Informação do usuário registrada em D-019. Subsidiou documentos intermediários solicitados pelo orientador; nem toda obra desse período integra o texto final. |
| Assinatura da ata de criação da equipe | 06/04/2026 a 07/04/2026 | Fornecida | Informação do usuário registrada em D-019. |
| Protótipo de interface do usuário | 05/05/2026 a 15/05/2026 | Fornecida | Informação do usuário registrada em D-019. Artefato separado da versão inicial do sistema. |
| Apresentação preparatória do TCC | Fim de 06/2026; data exata não registrada | Fornecida, com precisão mensal | Informação do usuário registrada em D-019. A data não será reduzida a um dia inventado. |
| Primeiro commit do projeto | 29/07/2026, 22:30:17 (UTC−03:00) | Verificada no repositório | `5958648d7ad5034cb2d2fcee50b0a6ab82dc4c7c` — `chore: init`. |
| Filtragem final das referências | 06/08/2026 a 01/09/2026 | Fornecida | Informação do usuário registrada em D-019. Seleção das referências destinadas ao texto final. |
| Último commit que alterou programação | 05/09/2026, 15:08:29 (UTC−03:00) | Verificada no repositório | `aefaf85b52072a591d30635b5764ce011a972f3c` — alteração em `apps/web/nitro.config.ts` e `packages/logging/src/options.ts`. |
| Commit de referência do snapshot documental | 07/09/2026, 08:22:14 (UTC−03:00) | Verificada no repositório | `bc2b2b846690cc234caba8312a8c6d000e2f2963` — revisão da Fase 6. |

O período registrado do projeto final é de 29/07/2026 a 05/09/2026. A data foi recalculada na consolidação da Fase 7; uma alteração posterior de código, schema, migração, dependência ou configuração executável exigirá atualização do cronograma em uma revisão futura.

## Estado inicial dos elementos da implantação

| Elemento | Estado | Evidência ou limitação |
| --- | --- | --- |
| MVP | Verificado no repositório | O commit atual consolida a Fase 6; o recorte funcional e suas evidências permanecem em `artifacts/texto-fase-06.md` e `artifacts/auxiliares/fase-06-evidencias.md`. |
| Hospedagem da aplicação | Target codificado | `apps/web/nitro.config.ts` usa o preset Vercel; `docs/database-connections.md` prevê Vercel na região `gru1`. O adaptador está definido no código, ainda que a fase não exija comprovar operação. |
| Banco PostgreSQL | Target definido | `docs/database-connections.md` prevê Neon em `sa-east-1`. Para hostnames da Neon, a validação exige endpoint agrupado no runtime e direto nas migrações; outras URLs PostgreSQL são aceitas fora desse target. Não há necessidade de credencial, projeto, plano ou conexão real nesta fase. |
| Implantação | Rascunho localizado | `docs/cronograma-individual-de-implantacao.md` continha 11 etapas e 59 horas, organizadas de `D-10` a `D+7`, com entrada em produção e independência de fornecedor. O documento precisava ser adaptado ao recorte teórico e aos targets codificados. |
| Treinamento completo | Rascunho localizado | `docs/descricao-do-treinamento-de-implantacao.md` previa dois encontros de duas horas vinculados a `D-2` e `D-1`, além de materiais e atividades cuja existência não estava comprovada. |
| Validação operacional de uma hora | Rascunho localizado | `docs/treinamento-validacao-operacional.md` apresentava um recorte do segundo encontro e vinculava sua conclusão à entrada em produção. |
| Manual do Usuário | Não localizado | Não havia `artifacts/manual-do-usuario.md` no baseline. O manual precisaria ser produzido e conferido contra o snapshot antes da revisão do treinamento. |
| Backup e restauração | Cobertura insuficiente | O cronograma existente mencionava backup e retorno, mas não definia uma estratégia específica para PostgreSQL na Neon nem tratava a recuperação dos objetos externos ao banco. Não havia evidência de backup, restauração ou teste executado. |

## Inventário operacional inicial

| Fonte local | Estado observado | Uso previsto na Fase 7 |
| --- | --- | --- |
| `docs/cronograma-individual-de-implantacao.md` | Cronograma de 11 etapas e 59 horas, estruturado em torno da entrada em produção e sem reconhecer Vercel e Neon como targets fixos. | Rascunho a auditar e adaptar para 7.3. |
| `docs/descricao-do-treinamento-de-implantacao.md` | Treinamento com dois encontros de duas horas, vinculado ao cronograma de produção e a materiais ainda não comprovados. | Rascunho a auditar para 7.4 e 7.5. |
| `docs/treinamento-validacao-operacional.md` | Recorte de uma hora dos três primeiros tópicos do segundo encontro, também vinculado à entrada em produção. | Rascunho a conciliar com a agenda revisada. |
| `docs/database-connections.md` | Documenta Vercel e Neon como targets, com uso de conexão agrupada no runtime e direta nas migrações. | Base técnica para 7.2, 7.3 e 7.6.2; conferir documentação oficial sem pressupor plano, capacidade ou recursos contratados na Parte 8. |
| `docs/auth-rate-limiting.md`, `docs/security-exceptions.md` | Documentam controles e exceções operacionais de segurança. | Conferir com código e fontes oficiais na Parte 7. |
| `docs/observability.md`, `docs/request-deadlines.md`, `docs/payload-budgets.md` | Definem práticas previstas para observabilidade e execução em Vercel. | Conferir como dependências da implantação nas Partes 2 e 3. |
| `packages/env/src/database-url.ts` | Diferencia URLs Neon agrupada e direta. | Confirmar a separação de conexões no cronograma individual e no plano de backup. |
| `apps/web/nitro.config.ts` e `apps/web/vercel.json` | Contêm configuração executável orientada à Vercel. | Evidenciar a Vercel como target codificado da aplicação. |

## Materiais produzidos na execução

O Manual do Usuário real foi produzido em `artifacts/manual-do-usuario.md` e revisado contra o snapshot, sem teste prático ponta a ponta. O texto consolidado da fase está em `artifacts/texto-fase-07.md`. Os documentos de cronograma e treinamento em `docs/` foram atualizados para remover alegações de entrada em produção e alinhar o cenário aos targets Vercel e Neon. Os demais itens de implantação, treinamento, backup e restauração continuam classificados como planejamento acadêmico e não dependem de contas, URLs ou execuções reais.

## Limites para as próximas partes

1. A redação deverá apresentar implantação, treinamento, backup e restauração como planejamento acadêmico, sem necessidade de evidência de execução.
2. O cronograma geral registrará separadamente a busca exploratória de viabilidade, a pesquisa contínua que subsidiou documentos intermediários e a filtragem final das referências. Datas de acesso bibliográfico serão sempre reais.
3. Vercel e Neon são targets codificados da arquitetura; a existência de uma implantação efetiva está fora do escopo.
4. O cronograma individual foi revisado para os targets Vercel e Neon.
5. O manual foi produzido antes da revisão final do treinamento.
6. A estratégia de Neon não atribui retenção, recuperação pontual ou restauração que dependam de plano não especificado.

## Resultado das Partes 1 a 9

| Parte | Resultado | Limite preservado |
| --- | --- | --- |
| 1 — Cronograma geral | Quadro cronológico consolidado em `artifacts/texto-fase-07.md`, com três etapas de pesquisa separadas; a origem e a classificação dos períodos permanecem neste manifesto. | Nenhuma data de acesso foi inventada. |
| 2 e 3 — Implantação e cronograma individual | Cenário de 59 horas consolidado e cronograma em `docs/` auditado. | Sem entrada em produção, conta externa ou execução alegada. |
| 4 — Manual do Usuário | Manual real produzido e revisado contra o snapshot documentado. | Não declara teste prático ponta a ponta, entrega ou treinamento realizado. |
| 5 e 6 — Treinamento | Descrição de dois encontros e recorte de uma hora revisados. | Todos os encontros são previstos. |
| 7 — Segurança | Controles de código, limites e fontes oficiais conferidos. | Garantias de fornecedor não foram atribuídas sem configuração. |
| 8 — Backup Neon | Estratégia teórica com cópias independentes do banco e dos objetos, retenção proposta, restauração isolada e condicionamento de PITR à configuração. | Nenhuma cópia, retenção ou restauração foi declarada como existente. |
| 9 — Consolidação | Texto, manual, documentos operacionais, mapa de referências e cópias locais de consulta atualizados. | Referências externas receberam data real de acesso em 2026-09-07. |

## Pendências encaminhadas

| Pendência | Parte responsável | Condição para encerramento |
| --- | --- | --- |
| Confirmar ano dos marcos fornecidos e atualizar os limites do Git. | Parte 1 | Concluída no cronograma geral. |
| Delimitar modalidade, duração e papéis do cenário de implantação. | Parte 2 | Concluída como cenário teórico de 59 horas. |
| Conciliar o cronograma individual com Vercel, Neon e o snapshot do MVP. | Parte 3 | Concluída; cronograma auditado e atualizado. |
| Produzir manual real. | Parte 4 | Concluída; manual produzido e revisado contra o snapshot, sem alegação de teste prático ponta a ponta. |
| Atualizar agenda, materiais e critérios do treinamento. | Partes 5 e 6 | Concluída; descrição, recorte e cronograma delimitam os fluxos selecionados e usam o manual como referência para o conjunto completo. |
| Conferir controles de segurança e suas fontes. | Parte 7 | Concluída; afirmações sustentadas por código ou fonte oficial. |
| Delimitar RPO, RTO e procedimento de recuperação sem assumir plano Neon específico. | Parte 8 | Concluída como estratégia teórica; recursos da Neon permanecem condicionados à configuração futura. |

## Resultado da Parte 0

- [x] Commit de referência registrado.
- [x] Limites temporais do projeto final recalculados na branch `main`.
- [x] Documentos e configurações operacionais inventariados.
- [x] Estado de implantação, treinamento, manual e backup classificado.
- [x] Ausências de evidência e pendências registradas sem preenchimento por suposição.
- [x] Nenhum tópico da Fase 7 foi redigido como atividade concluída.
