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
| Manual do usuário                  | Material fictício para o contexto acadêmico da implantação e do treinamento; não alegar uso real ou treinamento realizado sem evidência.                                                   |

Funcionalidades futuras ou fora do MVP não devem aparecer como entregas atuais. Os responsáveis devem alinhar atores, nomes de entidades, requisitos e nomenclatura de telas antes de finalizar diagramas e descrições dependentes.

### Registro de decisões comuns

Registrar aqui definições que afetem mais de uma parte, inclusive o recorte temporal/versão do sistema usado como evidência. Identificar se a decisão decorre de instrução do usuário, evidência verificada ou esclarecimento recebido.

| ID    | Decisão                                                                                                                                                                                                                                                                                 | Origem/evidência                                             | Partes afetadas                               | Responsável/data     |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------- | -------------------- |
| D-001 | Limitar o trabalho ao MVP, distinguindo previsão e implementação.                                                                                                                                                                                                                       | Instrução do usuário.                                        | Todas                                         | Configuração inicial |
| D-002 | Fundamentar as fases 1 e 2 nas referências, em substituição a entrevistas, reuniões e atas.                                                                                                                                                                                             | Instrução do usuário.                                        | Fases 1 e 2                                   | Configuração inicial |
| D-003 | Tratar requisitos da fase 5 como requisitos do usuário final.                                                                                                                                                                                                                           | Instrução do usuário.                                        | Fase 5                                        | Configuração inicial |
| D-004 | Tratar o manual do usuário como fictício.                                                                                                                                                                                                                                               | Instrução do usuário.                                        | Fase 7                                        | Configuração inicial |
| D-005 | Interpretar a parte `sumario` como síntese acadêmica no estilo abstract, com RESUMO em português e ABSTRACT em inglês, e não como lista de seções. Preservar o identificador dos arquivos.                                                                                              | Esclarecimento explícito do usuário nesta tarefa.            | Sumário e integração pré-textual              | Codex / 2026-09-05   |
| D-006 | Aplicar às duas versões a estrutura do exemplo fornecido: um parágrafo curto com contextualização, problema e proposta do trabalho, seguido de palavras-chave. Usar somente a estrutura do exemplo, nunca seu conteúdo como fonte. Não exigir blocos de método, resultados e conclusão. | Esclarecimento e exemplo estrutural fornecidos pelo usuário. | Sumário e integração pré-textual              | Codex / 2026-09-05   |
| D-007 | Declarar de forma inequívoca, na introdução e nas partes que apresentarem a organização, que a AccioLabs é uma empresa ficcional criada exclusivamente para o contexto deste TCC. A apresentação deve se limitar a sua caracterização acadêmica, sem biografia empresarial inventada.   | Esclarecimento explícito do usuário nesta tarefa.            | Introdução e partes que mencionarem a empresa | Codex / 2026-09-05   |
| D-008 | Manter cópias de consulta compartilhadas das referências acessíveis em `artifacts/auxiliares/referencias/`. Elas apoiam todas as fases, mas não substituem a conferência da fonte original nem a normalização bibliográfica final.                                                    | Esclarecimento explícito do usuário nesta tarefa.            | Todas as fases e referências bibliográficas   | Codex / 2026-09-05   |
| D-009 | Excluir Liang, Wang e Wang (2022) da lista inicial de referências e dos materiais auxiliares, pois o texto integral está em chinês e o usuário não o considera apropriado para uso no TCC.                                                                                           | Esclarecimento explícito do usuário nesta tarefa.            | Fases 1 e 2; referências bibliográficas       | Codex / 2026-09-05   |

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
- Manter o arquivo-fonte editável dos diagramas e uma exportação apropriada para inserção no documento. Não depender apenas de renderização específica do Markdown.
- Manter citações e referências uniformes, com metadados suficientes para normalização. Registrar página ou outro localizador quando aplicável e conferir os dados na fonte original.
- Consultar o manual/modelo da instituição e as normas aplicáveis antes da normalização final. Não presumir que este Markdown, isoladamente, já esteja formatado conforme ABNT.
- Conforme D-005, a parte `sumario` terá RESUMO e ABSTRACT com conteúdo equivalente, sem lista de seções ou paginação. Caso seja solicitado um sumário de seções posteriormente, suas páginas dependerão da diagramação final.

## Quadro de progresso

Estados: **Não iniciado**, **Em planejamento**, **Aguardando esclarecimento**, **Em redação**, **Em revisão** e **Concluído**. Estes estados são exclusivos deste documento e não autorizam mudanças de estado no Linear.

Ao atualizar, informar responsável, arquivos produzidos e pendências relevantes. Uma parte só está concluída após planejamento, redação, conferência das fontes, aplicação da skill `humanizar` e revisão de consistência.

| Parte / identificador                         | Responsável | Estado       | Planejamento / texto                                                    | Dependências ou observações                                                                                                                                                                                                                                                                             |
| --------------------------------------------- | ----------- | ------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sumário — `sumario`                           | Codex       | Concluído    | `artifacts/planejamento-sumario.md`; `artifacts/texto-sumario.md`       | Abertura revisada em ambos os idiomas em 2026-09-05, com apoio em Ghoorah, Mariyani-Squire e Amin (2025). Fonte e limites registrados no planejamento para consolidação bibliográfica. Revisão acadêmica e de equivalência concluída; revalidar na integração com as fases e normalizar conforme P-001. |
| Introdução — `introducao`                     | Codex       | Concluído    | `artifacts/planejamento-introducao.md`; `artifacts/texto-introducao.md` | D-007 aplicada: AccioLabs é apresentada como empresa ficcional criada exclusivamente para o TCC; revalidar a coerência com as fases durante a integração final.                                                                                                                                         |
| Fase 1 — `fase-01`                            | Codex      | Concluído      | `artifacts/planejamento-fase-01.md`; `artifacts/texto-fase-01.md`      | Redação, conferência das fontes locais e revisão acadêmica concluídas em 2026-09-05. A fase se baseia em pesquisa bibliográfica/documental, sem coleta de campo; revalidar a coerência com a Fase 2 na integração.                                                                                |
| Fase 2 — `fase-02`                            | A atribuir  | Não iniciado | —                                                                       | Base em referências; alinhar com a fase 1.                                                                                                                                                                                                                                                              |
| Fase 3 — `fase-03`                            | A atribuir  | Não iniciado | —                                                                       | Esclarecer o sentido de sistema atual e respeitar o MVP.                                                                                                                                                                                                                                                |
| Fase 4 — `fase-04`                            | A atribuir  | Não iniciado | —                                                                       | Alinhar requisitos, atores e dados com as fases 2, 3 e 6.                                                                                                                                                                                                                                               |
| Fase 5 — `fase-05`                            | A atribuir  | Não iniciado | —                                                                       | Requisitos para o usuário final.                                                                                                                                                                                                                                                                        |
| Fase 6 — `fase-06`                            | A atribuir  | Não iniciado | —                                                                       | Evidências da aplicação e coerência com os diagramas.                                                                                                                                                                                                                                                   |
| Fase 7 — `fase-07`                            | A atribuir  | Não iniciado | —                                                                       | Cronogramas, implantação, treinamento, segurança e backup.                                                                                                                                                                                                                                              |
| Fase 8 — `fase-08`                            | A atribuir  | Não iniciado | —                                                                       | Coerência com desenvolvimento e implantação.                                                                                                                                                                                                                                                            |
| Considerações finais — `consideracoes-finais` | A atribuir  | Não iniciado | —                                                                       | Depende das conclusões efetivamente sustentadas nas fases.                                                                                                                                                                                                                                              |
| Referências bibliográficas — `referencias`    | A atribuir  | Não iniciado | —                                                                       | Consolidação das fontes efetivamente citadas em todas as partes.                                                                                                                                                                                                                                        |

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

O manual do usuário é fictício. O responsável deverá planejar como identificá-lo e citá-lo, esclarecendo se será necessário produzir um material auxiliar em `artifacts/`. Não incluir anexos automáticos. Datas, participantes, treinamentos, implantação e restaurações não podem ser apresentados como realizados sem evidência.

### Fase 8 — Manutenção do sistema

- Planejar o conteúdo relativo à manutenção do sistema dentro do recorte adotado.
- Distinguir práticas existentes de atividades propostas, mantendo coerência com a fase 7.

### Considerações finais

- Retomar o problema, o trabalho desenvolvido, os resultados sustentados e as limitações do MVP.
- Não declarar validações, impactos ou resultados de uso que não tenham sido demonstrados.

### Elementos pós-textuais — Referências bibliográficas

- Consolidar as fontes efetivamente citadas, incluindo as pesquisas conceituais e técnicas das fases.
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
- [ ] Cronogramas, envolvidos e treinamento são coerentes; o manual está identificado como fictício.
- [x] RESUMO e ABSTRACT seguem a mesma estrutura de contextualização, problema e proposta, em parágrafo único seguido de palavras-chave equivalentes, conforme D-005 e D-006; o conteúdo provém das fontes do TCC, não do exemplo estrutural.
- [ ] Conteúdo e hierarquia do Markdown estão preparados para transferência e normalização no documento ABNT institucional.
- [ ] Todos os artefatos produzidos estão em `artifacts/`; capa, apresentação e anexos permanecem fora do trabalho dos agentes.
