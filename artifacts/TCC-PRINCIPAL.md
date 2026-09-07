# TCC — Coordenação da escrita

## Finalidade e limites deste arquivo

Este é o ponto central de orientação, acompanhamento e decisões para os agentes responsáveis pela parte escrita do TCC sobre a plataforma Nossa Causa, desenvolvida pela empresa fictícia AccioLabs, uma software house situada em Votorantim/SP.

Este documento contém somente a organização inicial do trabalho. Cada responsável deve planejar sua parte em profundidade antes de redigi-la. A estrutura fornecida pelo usuário é uma referência inicial: as adaptações necessárias devem ser propostas pelos agentes em seus planejamentos, justificadas e registradas aqui, sem alterações silenciosas.

Todos os arquivos produzidos para este trabalho devem ficar em `artifacts/`, inclusive planejamentos, textos, imagens, diagramas e materiais auxiliares. Os documentos existentes fora dessa pasta são fontes de consulta.

Capa, apresentação e anexos serão feitos manualmente e estão fora do trabalho dos agentes. Não criar arquivos para esses elementos.

## Instruções obrigatórias para todos os agentes

1. Ler este arquivo, as instruções do repositório e as fontes pertinentes antes de começar. Consultar as decisões e pendências mais recentes em cada retomada.
2. Assumir uma parte no quadro de progresso, registrando responsável e estado antes de editá-la. Cada fase de 1 a 8 deve ter seu próprio responsável e planejamento independente.
3. Planejar antes de escrever: delimitar conteúdo, fontes, evidências, dependências, dúvidas e adaptações propostas. Este arquivo não substitui o planejamento de cada parte.
4. Fazer perguntas ao usuário sempre que houver dúvida sobre conteúdo, interpretação, escopo ou informações ausentes. Registrar a pergunta aqui e marcar o trecho dependente como aguardando esclarecimento. Não contornar o problema, inventar respostas, suprimir a exigência ou adotar uma hipótese silenciosa. O trabalho independente da resposta pode continuar.
5. Usar obrigatoriamente a skill `humanizar` ao redigir e revisar os textos finais, inclusive legendas e materiais textuais destinados ao TCC. Ler suas instruções antes desse uso. Ela não é exigida neste arquivo principal nem nos planejamentos preliminares. Preservar precisão, registro acadêmico e fidelidade às fontes; não modificar citações diretas para humanizá-las.
6. Escrever em português brasileiro, exceto a versão em inglês solicitada para o sumário. Manter linguagem acadêmica clara, sem persona, provocações, emotes ou comentários de bastidores no conteúdo final.
7. Distinguir implementação comprovada, proposta, planejamento e simulação acadêmica. Não apresentar funcionalidades previstas como concluídas nem cronogramas planejados como atividades executadas.
8. Fundamentar afirmações bibliográficas nas fontes efetivamente consultadas. Não inventar autores, resultados, estatísticas, páginas, datas de acesso ou referências. Não tratar a cadeia lógica de `docs/references.md` como conclusão já demonstrada.
9. Manter coerência com as outras partes. Mudanças em nomes, escopo, requisitos, atores, dados, telas ou cronogramas que afetem outros agentes devem ser registradas aqui e comunicadas aos responsáveis.
10. Não sobrescrever o trabalho de outros responsáveis. Atualizar somente os próprios registros e as decisões compartilhadas pertinentes, preservando o conteúdo existente.

## Fontes e locais importantes

Os caminhos abaixo são relativos à raiz do repositório. A lista é um ponto de partida, não uma confirmação de que os documentos estejam completos ou atualizados.

| Local                                                                                           | Uso esperado                                                                                                                                                    |
| ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AGENTS.md`                                                                                     | Regras de trabalho no repositório.                                                                                                                              |
| `docs/nossa-causa-resumo-pt.md`                                                                 | Contexto do produto, problema, modalidades de doação, prioridades e questões em aberto. Leitura comum a todos.                                                  |
| `docs/nossa-causa-summary-en.md`                                                                | Versão em inglês do contexto do produto; consultar para verificar consistência terminológica.                                                                   |
| `docs/references.md`                                                                            | Base bibliográfica inicial, especialmente para as fases 1 e 2. Conferir os trabalhos originais e completar metadados faltantes na bibliografia em `artifacts/`. |
| `artifacts/auxiliares/referencias/`                                                             | Acervo local compartilhado de cópias de consulta das referências acessíveis. Consultar o `README.md` para identificar cada arquivo, sua procedência e limitações.  |
| `artifacts/auxiliares/referencias-utilizadas.md`                                                | Mapa central obrigatório das fontes efetivamente usadas, com localização no texto, finalidade, localizadores e estado de normalização. Deve ser atualizado imediatamente, sem exceção, ao incluir, remover ou deslocar qualquer citação ou uso factual de fonte externa. |
| `apps/web/src/routes/`                                                                          | Evidências de rotas e telas da aplicação.                                                                                                                       |
| `apps/web/src/components/`                                                                      | Componentes e padrões de interface usados pelo sistema.                                                                                                         |
| `packages/rpc/`                                                                                 | Operações, autorização e regras de negócio.                                                                                                                     |
| `packages/validation/`                                                                          | Validações e tipos compartilhados.                                                                                                                              |
| `packages/database/prisma/schemas/`                                                             | Modelos e relacionamentos de dados para conferência do DER.                                                                                                     |
| `packages/database/`                                                                            | Migrações, seed e outros recursos de banco de dados.                                                                                                            |
| `packages/auth/` e `packages/env/src/`                                                          | Autenticação e definições de configuração; não reproduzir segredos ou valores de ambiente.                                                                      |
| `package.json`, `apps/web/package.json` e manifestos dos pacotes                                | Tecnologias e comandos declarados; versões devem ser conferidas no momento da documentação.                                                                     |
| `docs/campaign-lifecycle.md` e `docs/campaign-idempotency.md`                                   | Documentação técnica de campanhas, a confrontar com a implementação.                                                                                            |
| `docs/auth-rate-limiting.md` e `docs/security-exceptions.md`                                    | Material de apoio para segurança, sujeito à conferência de escopo e implementação.                                                                              |
| `docs/database-connections.md` e `docs/observability.md`                                        | Material de apoio operacional.                                                                                                                                  |
| `docs/cronograma-individual-de-implantacao.md`                                                  | Subsídio para a fase 7; verificar se descreve previsão, simulação ou execução.                                                                                  |
| `docs/descricao-do-treinamento-de-implantacao.md` e `docs/treinamento-validacao-operacional.md` | Subsídios para treinamento e validação operacional, sujeitos à mesma conferência.                                                                               |
| `/home/baxthus/.agents/skills/humanizar/SKILL.md`                                               | Skill obrigatória para redação e revisão final. Se indisponível, localizar a skill; se não for encontrada, informar o impedimento ao usuário.                   |

Os resumos apresentam intenção de produto; o código e sua validação sustentam afirmações sobre implementação. A bibliografia fundamenta o problema e os conceitos, mas não prova funcionalidades do Nossa Causa. Havendo divergência entre fontes, registrar e perguntar ao usuário antes de fechar a afirmação afetada.

**Controle obrigatório de referências:** `artifacts/auxiliares/referencias-utilizadas.md` deve permanecer atualizado a todo custo. Nenhuma alteração que inclua, remova ou mude de lugar uma citação, uma menção bibliográfica em prosa ou um uso factual de fonte externa estará concluída antes da atualização correspondente no mapa central. A ausência dessa atualização bloqueia a conclusão da parte afetada e a integração final.

## Consistência compartilhada

### Nomes e escopo já definidos

| Termo                              | Uso comum a todas as partes                                                                                                                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| AccioLabs                          | Empresa fictícia, criada exclusivamente para este TCC, apresentada como software house situada em Votorantim/SP. Não inventar fundação, equipe, clientes, endereço ou histórico adicional. |
| Nossa Causa                        | Nome da plataforma descrita no TCC.                                                                                                                                                        |
| Lumos                              | Nome do repositório/projeto técnico; não substituir o nome do produto por ele.                                                                                                             |
| MVP                                | Recorte do trabalho. Conferir o que está implementado; a prioridade P0 nos resumos não comprova conclusão.                                                                                 |
| Campanha física e campanha virtual | Modalidades descritas no contexto do produto; manter a terminologia entre texto, telas e diagramas.                                                                                        |
| Doação financeira direta           | O resumo prevê dados PIX/conta do organizador. Não pressupor processamento, confirmação ou conciliação de pagamentos pela plataforma.                                                      |
| Manual do usuário                  | Material real a ser produzido para o MVP e usado como referência do treinamento; não alegar entrega ou uso em treinamento sem evidência. D-018 supera a definição anterior de material fictício. |

Funcionalidades futuras ou fora do MVP não devem aparecer como entregas atuais. Os responsáveis devem alinhar atores, nomes de entidades, requisitos e nomenclatura de telas antes de finalizar diagramas e descrições dependentes.

### Registro de decisões comuns

Registrar aqui definições que afetem mais de uma parte, inclusive o recorte temporal/versão do sistema usado como evidência. Identificar se a decisão decorre de instrução do usuário, evidência verificada ou esclarecimento recebido.

| ID    | Decisão                                                                                                                                                                                                                                                                                 | Origem/evidência                                             | Partes afetadas                               | Responsável/data     |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------- | -------------------- |
| D-001 | Limitar o trabalho ao MVP, distinguindo previsão e implementação.                                                                                                                                                                                                                       | Instrução do usuário.                                        | Todas                                         | Configuração inicial |
| D-002 | Fundamentar as fases 1 e 2 nas referências, em substituição a entrevistas, reuniões e atas.                                                                                                                                                                                             | Instrução do usuário.                                        | Fases 1 e 2                                   | Configuração inicial |
| D-003 | Tratar requisitos da fase 5 como requisitos do usuário final.                                                                                                                                                                                                                           | Instrução do usuário.                                        | Fase 5                                        | Configuração inicial |
| D-004 | Tratar o manual do usuário como fictício. Decisão superada por D-018; preservada apenas para registrar a mudança de orientação.                                                                                                                                                          | Instrução inicial do usuário.                                | Fase 7                                        | Configuração inicial |
| D-005 | Interpretar a parte `sumario` como síntese acadêmica no estilo abstract, com RESUMO em português e ABSTRACT em inglês, e não como lista de seções. Preservar o identificador dos arquivos.                                                                                              | Esclarecimento explícito do usuário nesta tarefa.            | Sumário e integração pré-textual              | Codex / 2026-09-05   |
| D-006 | Aplicar às duas versões a estrutura do exemplo fornecido: um parágrafo curto com contextualização, problema e proposta do trabalho, seguido de palavras-chave. Usar somente a estrutura do exemplo, nunca seu conteúdo como fonte. Não exigir blocos de método, resultados e conclusão. | Esclarecimento e exemplo estrutural fornecidos pelo usuário. | Sumário e integração pré-textual              | Codex / 2026-09-05   |
| D-007 | Declarar de forma inequívoca, na introdução e nas partes que apresentarem a organização, que a AccioLabs é uma empresa ficcional criada exclusivamente para o contexto deste TCC. A apresentação deve se limitar a sua caracterização acadêmica, sem biografia empresarial inventada.   | Esclarecimento explícito do usuário nesta tarefa.            | Introdução e partes que mencionarem a empresa | Codex / 2026-09-05   |
| D-008 | Manter cópias de consulta compartilhadas das referências acessíveis em `artifacts/auxiliares/referencias/`. Elas apoiam todas as fases, mas não substituem a conferência da fonte original nem a normalização bibliográfica final.                                                    | Esclarecimento explícito do usuário nesta tarefa.            | Todas as fases e referências bibliográficas   | Codex / 2026-09-05   |
| D-009 | Excluir Liang, Wang e Wang (2022) da lista inicial de referências e dos materiais auxiliares, pois o texto integral está em chinês e o usuário não o considera apropriado para uso no TCC.                                                                                           | Esclarecimento explícito do usuário nesta tarefa.            | Fases 1 e 2; referências bibliográficas       | Codex / 2026-09-05   |
| D-010 | Na Fase 2, classificar separadamente dados e conclusões publicados, definições dos documentos de escopo da Nossa Causa e inferências do projeto. O uso informal de Facebook e WhatsApp será tratado como problema definido pelo projeto, pois as referências disponíveis não o demonstram diretamente. | Planejamento da Fase 2, derivado de D-001 e D-002.           | Fases 1 a 4 e integração                      | Codex / 2026-09-05   |
| D-011 | Considerar como “sistema atual”, na Fase 3, o MVP implementado da Nossa Causa. As seis funcionalidades P0 foram confirmadas pelo usuário como concluídas e serão descritas por suas capacidades e confrontadas com as evidências técnicas do repositório. O documento interno que enumera as prioridades não será citado no texto final. As referências a seu caminho foram removidas dos textos finais existentes; os planejamentos podem mantê-las somente como rastreabilidade interna. | Esclarecimento explícito do usuário nesta tarefa e análise técnica do MVP. | Fases 2, 3, 4, 6 e integração                 | Codex / 2026-09-05   |
| D-013 | Executar a Fase 6 em partes sequenciais e independentes. A lista de telas do tópico 6.2 não terá imagens; as figuras do tópico 6.2.1 serão capturas dos formulários obtidas preferencialmente com o Chrome DevTools MCP. No tópico 6.2.3, TSDoc será a alternativa tecnológica adotada em substituição a JAVADOC/SUMMARY e terá uma única imagem de exemplo, a ser fornecida pelo usuário. | Esclarecimento explícito do usuário nesta tarefa. | Fase 6 e integração | Codex / 2026-09-06 |
| D-014 | Na execução da Parte 5 da Fase 6, adotar TSDoc como alternativa tecnológica a JAVADOC/SUMMARY, considerar sua implementação existente e concentrar sua cobertura em APIs e módulos relevantes, excluindo componentes React. Manter a única imagem do tópico como insumo fornecido pelo usuário. | Esclarecimento explícito do usuário nesta tarefa. | Fase 6 e integração | Codex / 2026-09-07 |
| D-015 | É obrigatório manter `artifacts/auxiliares/referencias-utilizadas.md` atualizado a todo custo. Toda inclusão, remoção ou deslocamento de citação, menção bibliográfica em prosa ou uso factual de fonte externa exige atualização imediata do mapa central; sem ela, a alteração e a parte afetada não estão concluídas. O mapa registrará cada fonte, seus locais de uso, finalidade, localizadores e pendências de normalização, separado da bibliografia final e das fontes internas ou evidências de elaboração própria. | Esclarecimento explícito do usuário nesta tarefa. | Todas as partes e referências bibliográficas | Codex / 2026-09-07 |
| D-016 | Na Fase 4, produzir os diagramas em Mermaid e não citar diretamente arquivos do repositório no texto destinado ao TCC. | Decisões do usuário preservadas após a revisão da orientação sobre referências. | Fase 4 e integração | Codex / 2026-09-07 |
| D-017 | Concluir a Fase 6 com o tópico TSDoc delimitado pela premissa de D-014. A ferramenta, o comando e a saída que não foram verificados não serão apresentados como evidência; a imagem única fornecida pelo usuário fica reservada à integração visual e sua ausência não reabre a fase. | Instrução explícita do usuário nesta tarefa e revisão final da Fase 6. | Fase 6 e integração | Codex / 2026-09-07 |
| D-018 | Produzir e tratar o Manual do Usuário como material real e utilizável para o snapshot do MVP, superando D-004. A existência do documento não será usada como prova de entrega, treinamento ou uso sem evidência correspondente. | Esclarecimento explícito do usuário nesta tarefa. | Fase 7 e integração | Codex / 2026-09-07 |
| D-019 | No cronograma da Fase 7, considerar em 2026 a criação do grupo em 10/02, a definição do tema de 17/02 a 09/03, uma busca exploratória de referências para verificar a viabilidade do TCC de 17/02 a 16/03, uma versão inicial do sistema de 09/03 a 20/06, um protótipo de UI separado de 05/05 a 15/05, a assinatura da ata de 06/04 a 07/04, a pesquisa contínua de referências e produção de documentos intermediários solicitados pelo orientador de 10/03 a 01/09, uma apresentação preparatória do TCC no fim de junho, cuja data exata não foi registrada, a filtragem final das referências de 06/08 a 01/09, e o projeto final do primeiro commit até o último commit da branch `main` que alterou programação. A versão inicial foi abandonada porque decisões estruturais seriam difíceis de modificar sem comprometer sua organização, mas seus conceitos e a maior parte da stack tecnológica foram portados para o projeto final. As etapas exploratória, intermediária e final da pesquisa serão separadas; somente fontes que sustentem conteúdo mantido comporão o texto final e o mapa central. Datas fornecidas, verificadas, retrospectivamente estimadas e planejadas serão distinguidas; datas de pesquisa ou de acesso não serão inventadas como fatos. | Marcos fornecidos pelo usuário e histórico Git conferido no planejamento da Fase 7. | Fase 7, referências e integração | Codex / 2026-09-07 |
| D-020 | Executar a Fase 7 em partes sequenciais com portões de saída; auditar os documentos existentes de implantação e treinamento; e elaborar um plano teórico de backup e restauração para PostgreSQL na Neon, target codificado da arquitetura, sem pressupor recursos de plano contratado nem implantação real. | Esclarecimento explícito do usuário e planejamento da Fase 7. | Fases 7 e 8; integração | Codex / 2026-09-07 |
| D-021 | Na Fase 8, tratar manutenção como o processo de alteração do software do MVP e distingui-la das funções de operação. Backup, recuperação, administração do sistema e atendimento de alertas permanecem no recorte operacional da Fase 7; a Fase 8 poderá abordar a revisão desses procedimentos quando uma mudança de software os afetar. Práticas verificadas no repositório e atividades propostas serão apresentadas separadamente, sem presumir ambiente de produção, equipe de suporte, SLA, rotina de releases ou incidentes reais. | Planejamento da Fase 8 e escopo público da ISO/IEC/IEEE 14764:2022 conferido em 2026-09-07. | Fases 7 e 8; considerações finais e integração | Codex / 2026-09-07 |
| D-022 | Não citar no texto acadêmico o rastreador usado exclusivamente no desenvolvimento interno nem os códigos internos de prioridade das funcionalidades. Na Fase 8, descrever as solicitações por meio de registros de manutenção propostos e neutros. | Esclarecimento explícito do usuário. | Fase 8, considerações finais e integração | Codex / 2026-09-07 |
| D-023 | Adotar uma redação favorável à apresentação acadêmica da Nossa Causa, destacando primeiro a contribuição das evidências e as capacidades do projeto. Limitações metodológicas e funcionais devem permanecer precisas, mas ser concentradas onde forem necessárias, sem repetição de ressalvas defensivas nem formulações que desqualifiquem antecipadamente a proposta. | Esclarecimento explícito do usuário. | Todas, sobretudo Fases 1 e 2 e integração | Codex / 2026-09-07 |

## Organização dos arquivos e passagem para ABNT

Para cada identificador do quadro de progresso, usar inicialmente:

- `artifacts/planejamento-<identificador>.md`: plano, fontes, dúvidas, adaptações e verificações da parte.
- `artifacts/texto-<identificador>.md`: somente o conteúdo destinado ao TCC, após o planejamento.
- `artifacts/imagens/` e `artifacts/diagramas/`: recursos visuais, quando necessários, com nomes descritivos e estáveis.
- `artifacts/auxiliares/`: materiais de apoio que não integram automaticamente o texto final.

Criar esses arquivos somente quando a respectiva atividade começar. Este arquivo principal é o único artefato da etapa inicial.

O Markdown deve facilitar a transferência para um documento ABNT:

- Usar títulos hierárquicos sem saltos: título da parte em `#`, subseções em `##` e subdivisões em `###`.
- Preservar os títulos e a numeração de referência abaixo no planejamento. Ajustes e numeração global definitiva dependem do alinhamento entre as partes e das exigências institucionais.
- Redigir parágrafos comuns, sem quebras de linha artificiais, tabulações para recuo, HTML de apresentação ou formatação que simule páginas.
- Separar texto final de instruções, estados de tarefa e pendências. Não deixar marcadores de dúvida no conteúdo declarado pronto.
- Usar tabelas simples. Cada figura, tabela, quadro e diagrama deve ter identificação, título, fonte e menção no texto. Alinhar a numeração na integração, evitando números duplicados entre partes.
- Manter o arquivo-fonte editável dos diagramas. A exportação apropriada para inserção no documento será produzida na etapa de diagramação final, quando solicitada; enquanto essa etapa estiver adiada, ela não impede a conclusão da parte textual correspondente. Não depender apenas de renderização específica do Markdown.
- Manter citações e referências uniformes, com metadados suficientes para normalização. Registrar página ou outro localizador quando aplicável e conferir os dados na fonte original.
- Consultar o manual/modelo da instituição e as normas aplicáveis antes da normalização final. Não presumir que este Markdown, isoladamente, já esteja formatado conforme ABNT.
- Conforme D-005, a parte `sumario` terá RESUMO e ABSTRACT com conteúdo equivalente, sem lista de seções ou paginação. Caso seja solicitado um sumário de seções posteriormente, suas páginas dependerão da diagramação final.

## Quadro de progresso

Estados: **Não iniciado**, **Em planejamento**, **Aguardando esclarecimento**, **Em redação**, **Em revisão** e **Concluído**. Estes estados são exclusivos deste documento e não autorizam mudanças de estado no Linear.

Ao atualizar, informar responsável, arquivos produzidos e pendências relevantes. Uma parte só está concluída após planejamento, redação, conferência das fontes, aplicação da skill `humanizar` e revisão de consistência. A exportação de diagramas, quando condicionada à diagramação final, é uma atividade de integração e não altera esse estado.

| Parte / identificador                         | Responsável | Estado       | Planejamento / texto                                                    | Dependências ou observações                                                                                                                                                                                                                                                                             |
| --------------------------------------------- | ----------- | ------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sumário — `sumario`                           | Codex       | Concluído    | `artifacts/planejamento-sumario.md`; `artifacts/texto-sumario.md`       | Abertura revisada em ambos os idiomas em 2026-09-05, com apoio em Ghoorah, Mariyani-Squire e Amin (2025). Fonte e limites registrados no planejamento para consolidação bibliográfica. Revisão acadêmica e de equivalência concluída; revalidar na integração com as fases e normalizar conforme P-001. |
| Introdução — `introducao`                     | Codex       | Concluído    | `artifacts/planejamento-introducao.md`; `artifacts/texto-introducao.md` | D-007 aplicada: AccioLabs é apresentada como empresa ficcional criada exclusivamente para o TCC. Redação revista em 2026-09-07 conforme D-023; revalidar a coerência com as fases durante a integração final.                                                                                              |
| Fase 1 — `fase-01`                            | Codex      | Concluído      | `artifacts/planejamento-fase-01.md`; `artifacts/texto-fase-01.md`      | Redação e fontes revistas em 2026-09-07 conforme D-023. A fase apresenta a contribuição da pesquisa bibliográfica e documental para o projeto, mantendo seu alcance metodológico e a coerência com a Fase 2.                                                                                     |
| Fase 2 — `fase-02`                            | Codex       | Concluído       | `artifacts/planejamento-fase-02.md`; `artifacts/texto-fase-02.md`    | Redação, quadro e fontes revistos em 2026-09-07 conforme D-023. D-010 permanece atendida ao distinguir dados publicados, documentos de projeto e inferências, com ênfase na contribuição de cada base para a Nossa Causa.                                                                                  |
| Fase 3 — `fase-03`                            | Codex       | Concluído      | `artifacts/planejamento-fase-03.md`; `artifacts/texto-fase-03.md`    | Planejamento, redação, conferência técnica e revisão concluídos em 2026-09-05. A fase analisa o MVP implementado da Nossa Causa, descreve seus controles pelas funcionalidades P0 e não cita o documento interno que enumera essas prioridades. A verificação de tipos foi concluída com êxito; revalidar a coerência com as Fases 4 e 6 na integração. |
| Fase 4 — `fase-04`                            | Codex       | Concluído | `artifacts/planejamento-fase-04.md`; `artifacts/texto-fase-04.md`; fontes Mermaid em `artifacts/diagramas/` | Correções de coerência concluídas em 2026-09-05: casos de uso detalhados, relações entre atores e atributos das modalidades no DER. Em 2026-09-07, os fundamentos conceituais receberam referências da OMG (2017), de Chen (1976), da documentação de DER do Mermaid e da OWASP, registradas no mapa central. A exportação dos diagramas foi adiada por instrução do usuário para a etapa condicional de diagramação final e não impede a conclusão da fase. |
| Fase 5 — `fase-05`                            | Codex       | Concluído | `artifacts/planejamento-fase-05.md`; `artifacts/texto-fase-05.md` | Planejamento, redação, conferência e revisão concluídos em 2026-09-06. Conforme D-003, a fase descreve os requisitos do usuário final por capacidades necessárias, sem inventar configurações mínimas nem incluir requisitos de hospedagem. |
| Fase 6 — `fase-06`                            | Codex       | Concluído | `artifacts/planejamento-fase-06.md`; `artifacts/texto-fase-06.md`; `artifacts/imagens/fase-06/formularios/`; `artifacts/diagramas/fase-06-classes.mmd` | Partes 0 a 6 concluídas e revisadas em 2026-09-07. A fase reúne o padrão do sistema, o inventário de quinze telas, dezenove capturas de formulários, o diagrama de classe e o tópico TSDoc delimitado pela premissa de D-014. A auditoria documental incluiu OWASP, WebAuthn e chamadas TSDoc diferenciadas. Conforme D-017, ferramenta, comando e saída TSDoc não são apresentados como evidências verificadas; a imagem única do tópico permanece reservada à integração visual e não altera o estado da fase. |
| Fase 7 — `fase-07`                            | Codex       | Concluído | `artifacts/planejamento-fase-07.md`; `artifacts/texto-fase-07.md`; `artifacts/manual-do-usuario.md`; `artifacts/auxiliares/fase-07-evidencias.md` | Fase implementada em 2026-09-07. O texto consolida cronograma, implantação teórica, treinamento, segurança e recuperação; o manual é uma entrega real, revisada contra o snapshot, sem alegação de teste prático ponta a ponta. Vercel e Neon permanecem targets codificados. Nenhuma implantação, treinamento, backup ou restauração foi declarada como executada. |
| Fase 8 — `fase-08`                            | Codex       | Concluído | `artifacts/planejamento-fase-08.md`; `artifacts/texto-fase-08.md`; `artifacts/auxiliares/fase-08-evidencias.md` | Fase concluída em 2026-09-07. D-021 separa manutenção de software das funções operacionais da Fase 7. O texto distingue recursos verificados, ausências e atividades propostas; a classificação e o processo foram conferidos na ISO/IEC/IEEE 14764:2022 e no SWEBOK Guide V4.0a, registrados no mapa central. Lint e type-check passaram; a ausência de suíte de testes e CI rastreados e o resultado da auditoria de dependências permanecem limites explícitos. |
| Considerações finais — `consideracoes-finais` | A atribuir  | Não iniciado | —                                                                       | Depende das conclusões efetivamente sustentadas nas fases.                                                                                                                                                                                                                                              |
| Referências bibliográficas — `referencias`    | Codex       | Em planejamento | `artifacts/planejamento-referencias.md`; `artifacts/auxiliares/referencias-utilizadas.md` | Planejamento e mapa central criados em 2026-09-07 conforme D-015. O inventário relaciona as fontes externas já usadas no RESUMO, no ABSTRACT e nas Fases 1, 2, 4, 6, 7 e 8, incluindo ISO/IEC/IEEE 14764:2022 e SWEBOK Guide V4.0a na Fase 8. Permanecem a atualização pelas partes futuras, a conferência dos metadados e a produção de `artifacts/referencias.md` na integração. |

## Estrutura inicial e atribuição por parte

Os tópicos abaixo preservam a estrutura solicitada e as ressalvas explícitas do usuário. Não constituem um plano detalhado nem resolvem as adaptações que cabem aos responsáveis.

### Elementos pré-textuais — Sumário

- Produzir versão em português e versão em inglês.
- Significado esclarecido pelo usuário em D-005: resumo textual no estilo abstract. Usar os títulos RESUMO e ABSTRACT, preservando `sumario` como identificador de acompanhamento.
- Seguir em ambos os idiomas a estrutura definida em D-006: contextualização, problema e proposta em parágrafo único, seguido de palavras-chave. O exemplo do usuário é referência de estrutura, não fonte de conteúdo.
- Capa e apresentação: elaboração manual, fora do escopo.

### Introdução

- Histórico da empresa; o que é; o que faz; localização.
- Dados definidos: AccioLabs, empresa fictícia, software house, Votorantim/SP.
- O responsável planejará a apresentação do projeto e perguntará sobre informações adicionais necessárias ao histórico fictício.

### Fase 1 — Percepção da necessidade

- Fundamentar a necessidade nas referências de `docs/references.md`.
- Substituir a base originalmente indicada como entrevistas, reuniões e atas pela pesquisa bibliográfica/documental. Não inventar coleta de campo.

### Fase 2 — Levantamento de dados

- Problemas e documentos que os sustentam.
- Usar as referências como base; indicar a origem dos dados e distinguir dados publicados de inferências para o projeto.

### Fase 3 — Análise do sistema atual

- Controles existentes, informatizados ou não.
- Respeitar o recorte do MVP. O responsável deve esclarecer ambiguidades sobre o que será considerado “sistema atual”, sem atribuir processos observados a uma organização sem evidência.

### Fase 4 — Projeto lógico: sistema proposto

- 4.1. UML: pesquisa com referência bibliográfica/on-line.
- 4.2. Diagrama de caso de uso: pesquisa com referência bibliográfica/on-line e exemplo do projeto.
- 4.3. Diagrama de implementação.
- 4.4. DER.

O responsável definirá em seu planejamento as adaptações e o significado dos diagramas solicitados, perguntando ao usuário quando houver dúvida. A modelagem deve corresponder ao recorte documentado do sistema.

### Fase 5 — Projeto físico

- 5.1. Requisitos de hardware/software/equipamento.
- Descrever requisitos do usuário final, não requisitos de hospedagem. Não estabelecer mínimos arbitrários sem justificativa ou validação.

### Fase 6 — Desenvolvimento

- 6.1. Padrão do sistema.
- 6.2. Lista de telas de entrada/consulta/relatório.
- 6.2.1. Imagem de cada formulário do software.
- 6.2.2. Diagrama de classe: pesquisa com referência bibliográfica/on-line e exemplo do projeto.
- 6.2.3. Documentação do código: JAVADOC ou SUMMARY na estrutura original; o responsável deverá propor posteriormente um equivalente adequado às tecnologias do projeto.

O responsável planejará as adaptações às telas e à arquitetura existentes. Não criar telas, relatórios ou estruturas de classes fictícias apenas para preencher os títulos.

### Fase 7 — Implantação

- 7.1. Cronograma do projeto inteiro.
- 7.2. Descrição da implantação: tempo e envolvidos.
- 7.3. Cronograma individual da implantação.
- 7.4. Descrição do treinamento: tempo, envolvidos e referência ao manual do usuário.
- 7.5. Cronograma do treinamento.
- 7.6. Segurança.
- 7.6.1. Sistema: senha e criptografia.
- 7.6.2. Backup: planejamento, estratégias e execução.

Conforme D-018, o Manual do Usuário será produzido como material real e utilizável para o snapshot documentado do MVP em `artifacts/`. Sua existência não comprova entrega ou uso em treinamento. Não incluir anexos automáticos. Datas, participantes, treinamentos, implantação e restaurações não podem ser apresentados como realizados sem evidência.

### Fase 8 — Manutenção do sistema

- Planejar o conteúdo relativo à manutenção do sistema dentro do recorte adotado.
- Distinguir práticas existentes de atividades propostas, mantendo coerência com a fase 7.

### Considerações finais

- Retomar o problema, o trabalho desenvolvido, os resultados sustentados e as limitações do MVP.
- Não declarar validações, impactos ou resultados de uso que não tenham sido demonstrados.

### Elementos pós-textuais — Referências bibliográficas

- Consolidar as fontes efetivamente citadas, incluindo as pesquisas conceituais e técnicas das fases.
- Manter `artifacts/auxiliares/referencias-utilizadas.md` atualizado imediatamente e sem exceção; a integração não poderá ser concluída enquanto o mapa não refletir todos os locais de uso e seus localizadores.
- Conferir autoria, título, publicação, data, DOI/URL e demais elementos aplicáveis; eliminar duplicações.
- Anexos: elaboração manual, fora do escopo.

## Dúvidas, impedimentos e esclarecimentos

O agente que identificar uma dúvida deve registrá-la e fazer a pergunta ao usuário; registrar não substitui perguntar. A ausência de resposta não autoriza concluir o trecho por suposição. Depois da resposta, registrar a resolução e atualizar as partes afetadas.

| ID    | Parte   | Pergunta / informação necessária                                                                                                            | Responsável        | Estado                                                             | Resposta e impacto                                                                                                                                                                                                                                                                              |
| ----- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P-001 | Sumário | A instituição exige modelo, limite de palavras e regras para palavras-chave de RESUMO e ABSTRACT? Pergunta enviada ao usuário nesta tarefa. | Codex / 2026-09-05 | Modelo de escrita esclarecido; normalização institucional pendente | O usuário forneceu exemplo e determinou o uso exclusivo de sua estrutura em ambos os idiomas (D-006). Isso permite planejar e redigir. Não informou limite institucional de palavras; não fixar exigência numérica nem declarar conformidade ABNT sem consulta ao manual na normalização final. |
| P-002 | Fase 1 | Você pode disponibilizar os PDFs, cópias ou links acessíveis da dissertação de Rodrigues (2022) e do artigo de Liang, Wang e Wang (2022), ambos listados em `docs/references.md`? Os acessos originais recusaram ou excederam a leitura automatizada. | Codex / 2026-09-05 | Resolvida em 2026-09-05 | A cópia da dissertação de Rodrigues foi disponibilizada em `artifacts/auxiliares/referencias/`. Liang, Wang e Wang (2022) foi excluído da lista de referências conforme D-009; não será usado no TCC. |

## Conferência para integração

- [ ] Todas as partes têm responsável, planejamento e estado atualizado.
- [ ] Dúvidas que afetam o conteúdo final foram respondidas e decisões comuns foram registradas.
- [ ] Adaptações propostas pelos agentes foram alinhadas entre as partes.
- [ ] AccioLabs, Nossa Causa, atores, funcionalidades e recorte do MVP são descritos de forma consistente.
- [ ] Textos diferenciam fatos, implementação, propostas e simulações acadêmicas.
- [ ] Textos finais foram redigidos e revisados com a skill `humanizar`, preservando o registro acadêmico.
- [ ] Citações e bibliografia foram conferidas nas fontes; toda citação tem referência correspondente.
- [ ] Telas, diagramas e descrições correspondem à mesma versão/recorte do sistema.
- [ ] Figuras e tabelas têm identificação, título, fonte e referência no texto.
- [ ] Cronogramas, envolvidos e treinamento são coerentes; o manual real está identificado, versionado e alinhado ao snapshot do MVP.
- [x] RESUMO e ABSTRACT seguem a mesma estrutura de contextualização, problema e proposta, em parágrafo único seguido de palavras-chave equivalentes, conforme D-005 e D-006; o conteúdo provém das fontes do TCC, não do exemplo estrutural.
- [ ] Conteúdo e hierarquia do Markdown estão preparados para transferência e normalização no documento ABNT institucional.
- [ ] Todos os artefatos produzidos estão em `artifacts/`; capa, apresentação e anexos permanecem fora do trabalho dos agentes.
