# Planejamento — Fase 7: Implantação

## Identificação e estado

- Identificador: `fase-07`.
- Responsável pelo planejamento: Codex.
- Data do planejamento: 2026-09-07.
- Estado: concluído em 2026-09-07.
- Recorte: planejamento teórico de implantação do MVP da plataforma Nossa Causa, no snapshot funcional adotado ao final da Fase 6.
- Entrega textual prevista: `artifacts/texto-fase-07.md`.
- Entregas auxiliares previstas: `artifacts/auxiliares/fase-07-evidencias.md` e `artifacts/manual-do-usuario.md`.

A Fase 7 será executada em partes sequenciais, cada uma com um portão de saída próprio. A divisão evita consolidar de uma só vez cronologia acadêmica, implantação, treinamento, segurança, manual e recuperação de dados. O texto final somente será montado depois que os blocos tiverem sido conferidos individualmente.

## Objetivo

A fase deverá descrever o percurso temporal do projeto, elaborar um plano teórico de implantação do MVP, organizar o treinamento previsto, apresentar os controles de segurança pertinentes ao recorte e definir uma estratégia teórica de backup e restauração adequada ao uso da Neon como fornecedora do PostgreSQL.

O texto distinguirá fatos comprovados, datas fornecidas pelo usuário, datas verificadas no Git, estimativas retrospectivas e atividades futuras. Implantação, treinamento, backup e restauração serão apresentados como planejamento acadêmico, não como execução. O Manual do Usuário será produzido como material real e utilizável para a versão documentada do MVP, e não como um documento apenas mencionado para preencher a estrutura acadêmica.

## Decisões e dados fornecidos pelo usuário

1. A execução deverá ser dividida em partes pequenas, realizadas uma por vez.
2. O cronograma geral deverá considerar a criação do grupo de TCC em 10/02/2026.
3. A definição do tema ocorreu de 17/02/2026 a 09/03/2026.
4. A assinatura da ata de criação da equipe ocorreu de 06/04/2026 a 07/04/2026.
5. Uma versão inicial do sistema foi elaborada de 09/03/2026 a 20/06/2026. Ela foi abandonada porque decisões estruturais seriam difíceis de modificar sem comprometer sua organização, mas seus conceitos e a maior parte da stack tecnológica foram portados para o projeto final.
6. O período do projeto final deverá começar no primeiro commit do projeto e terminar no último commit que alterou a programação.
7. Entre 17/02/2026 e 16/03/2026 ocorreu uma busca exploratória de referências para verificar a viabilidade do TCC. Esse levantamento não corresponde às mesmas fontes usadas no texto final.
8. O Manual do Usuário deverá ser tratado como um material real.
9. O cronograma individual de implantação e a descrição do treinamento existentes em `docs/` deverão ser auditados antes do reaproveitamento, pois podem estar desatualizados.
10. O planejamento de backup deverá considerar a Neon como fornecedora do banco de dados.
11. No fim de junho de 2026 ocorreu uma apresentação preparatória do TCC. A data exata não foi registrada.
12. Entre 10/03/2026 e 01/09/2026, a pesquisa de referências ocorreu de forma contínua e subsidiou documentos intermediários solicitados pelo orientador. A filtragem final das referências ocorreu de 06/08/2026 a 01/09/2026.
13. Um protótipo de interface do usuário foi elaborado de 05/05/2026 a 15/05/2026, separadamente da versão inicial do sistema.

As datas sem ano foram interpretadas como pertencentes a 2026, porque os marcos informados se alinham ao histórico Git do projeto no mesmo ano. Essa interpretação deverá ser confirmada antes da redação do tópico 7.1 caso surja qualquer evidência em sentido contrário.

## Limite de integridade do registro temporal

O pedido de distribuir retrospectivamente a pesquisa ao longo do ano não autoriza apresentar datas inventadas como fatos. A cronologia adotará quatro classes explícitas:

| Classe | Uso no trabalho | Exemplos iniciais |
| --- | --- | --- |
| Data fornecida | Marco informado pelo usuário, preservado como tal, inclusive quando o período é aproximado. | Grupo, tema, pesquisas de viabilidade e contínua, apresentação preparatória, ata, versão inicial e protótipo de UI. |
| Data verificada | Marco sustentado por evidência consultável. | Commits que delimitam o projeto final. |
| Período retrospectivo estimado | Organização aproximada sem prova de execução naquelas datas. | Eventual distribuição temática da pesquisa após 09/03/2026. |
| Data planejada | Atividade futura, descrita no futuro ou como previsão. | Implantação, treinamento, backup e teste de restauração. |

Não serão retrodatadas datas de acesso bibliográfico. A busca exploratória de viabilidade, fornecida pelo usuário para 17/02/2026 a 16/03/2026, será registrada separadamente da pesquisa contínua de 10/03/2026 a 01/09/2026, usada nos documentos intermediários solicitados pelo orientador. A filtragem final das referências, de 06/08/2026 a 01/09/2026, selecionou o subconjunto destinado ao texto final. Cada acesso das fontes efetivamente citadas deverá usar a data real em que foi consultado ou conferido. Onde faltar informação, será usado um marcador interno de pendência, e não uma data plausível inventada.

## Evidências temporais já verificadas

O histórico da branch `main` foi consultado em 2026-09-07. Os limites iniciais para o item “projeto final” são:

| Marco | Data | Evidência | Tratamento previsto |
| --- | --- | --- | --- |
| Primeiro commit do projeto | 29/07/2026, 22:30:17 (UTC−03:00) | Commit `5958648d7ad5034cb2d2fcee50b0a6ab82dc4c7c`, `chore: init`. | Início do período do projeto final. |
| Último commit que alterou programação | 05/09/2026, 15:08:29 (UTC−03:00) | Commit `aefaf85b52072a591d30635b5764ce011a972f3c`, que alterou `apps/web/nitro.config.ts` e `packages/logging/src/options.ts`. | Fim inicial do período do projeto final. |

Esse limite deverá ser recalculado no início da Parte 1. Commits posteriores de documentação não ampliam automaticamente o período de programação; commits posteriores que alterem código, configuração executável, schema, migração ou dependências deverão ampliar a data final.

Referências internas de agentes ou checkpoints fora da linha principal não serão usadas para definir o cronograma. A fonte temporal será a branch `main`, acompanhada da inspeção dos arquivos alterados nos commits limítrofes.

## Adaptações dos tópicos da Fase 7

### 7.1. Cronograma do projeto inteiro

O cronograma geral reunirá os marcos fornecidos, a versão inicial do sistema, o protótipo de UI, a busca exploratória de referências para viabilidade, a pesquisa contínua que subsidiou os documentos intermediários, a filtragem final das referências, a apresentação preparatória do TCC, o desenvolvimento do projeto final, a redação do TCC e a implantação planejada. Atividades sobrepostas serão preservadas em vez de forçar uma sequência artificial. A elaboração da versão inicial começa em 09/03/2026, no último dia do intervalo de definição do tema, e essa sobreposição deverá aparecer no quadro.

A busca exploratória ocorreu de 17/02/2026 a 16/03/2026 e teve a finalidade de verificar a viabilidade do tema; suas fontes não serão incluídas automaticamente no mapa de referências nem na bibliografia final. De 10/03/2026 a 01/09/2026, a pesquisa de referências ocorreu de forma contínua e subsidiou documentos intermediários solicitados pelo orientador. A filtragem final, entre 06/08/2026 e 01/09/2026, selecionou as referências destinadas ao texto final. A versão inicial do sistema, elaborada de 09/03/2026 a 20/06/2026, foi substituída porque seria difícil modificar suas decisões estruturais sem comprometer a organização existente; seus conceitos e a maior parte da stack tecnológica foram levados ao projeto final. O protótipo de UI, de 05/05/2026 a 15/05/2026, será mantido como marco separado. A data de publicação de uma obra e a data real de acesso não serão confundidas com o período em que a pesquisa ocorreu.

### 7.2. Descrição da implantação

O tópico explicará a modalidade teórica de implantação, o tempo estimado e os papéis envolvidos. A seção será apresentada como planejamento acadêmico para o MVP.

O conteúdo mínimo abrangerá:

- versão e escopo considerados no cenário de implantação;
- ambiente de hospedagem da aplicação e serviços externos definidos na arquitetura-alvo;
- Neon como fornecedora do PostgreSQL;
- responsável técnico, participantes de homologação e representantes do treinamento;
- preparação, migrações, testes rápidos, monitoramento e retorno simulados;
- tempo total e sequência de execução teórica, conciliados com o cronograma individual;
- critérios teóricos de liberação, adiamento e encerramento.

Os envolvidos serão identificados por papéis, salvo se houver necessidade acadêmica de nomes. A Vercel é o target da aplicação: o adaptador Nitro está configurado com o preset `vercel`. A Neon é o target do PostgreSQL. Para hostnames da Neon, a validação diferencia o endpoint agrupado no runtime do endpoint direto nas migrações; outras URLs PostgreSQL continuam aceitas fora desse target. A fase não exige comprovar operação real.

### 7.3. Cronograma individual da implantação

`docs/cronograma-individual-de-implantacao.md` será tratado como rascunho operacional, não como texto automaticamente atual. O documento foi criado antes do último commit de programação e contém ao menos uma premissa incompatível com a arquitetura-alvo: afirma independência de fornecedor enquanto o banco tem a Neon como target codificado.

A auditoria deverá conferir:

1. correspondência entre as funcionalidades listadas e o snapshot final do MVP;
2. coerência da sequência atual e da estimativa de 59 horas;
3. alinhamento com os scripts, migrações Prisma, Doppler, armazenamento de objetos, e-mail e observabilidade existentes;
4. uso explícito das conexões direta e agrupada da Neon conforme as funções previstas no projeto;
5. dependência entre treinamento, decisão de liberação, backup e retorno;
6. substituição da notação relativa existente por etapas acadêmicas sem marco operacional;
7. critérios teóricos de conclusão, sem exigir evidências de execução real.

O documento em `docs/` poderá ser corrigido durante esta parte, mas o texto acadêmico será redigido em `artifacts/texto-fase-07.md`.

### Material de apoio — Manual do Usuário real

O manual será produzido antes da consolidação do treinamento, porque a agenda e os exercícios deverão apontar para instruções que realmente existam. A entrega prevista é `artifacts/manual-do-usuario.md`.

O manual deverá:

- identificar o nome do sistema, versão ou commit documentado e data de revisão;
- indicar público, finalidade, pré-requisitos e limitações do MVP;
- documentar apenas fluxos conferidos na aplicação;
- abranger acesso, recuperação de conta, configuração inicial, consulta, filtros, detalhes, participação, perfil organizador, campanhas físicas e virtuais, gestão, atualizações, progresso, prestação de contas e configurações compatíveis com o snapshot;
- distinguir recursos públicos, autenticados e restritos ao organizador;
- explicar que pagamentos financeiros ocorrem fora da plataforma;
- usar dados de demonstração e nunca expor credenciais ou dados pessoais;
- receber capturas somente quando ajudarem a execução da tarefa e corresponderem ao mesmo snapshot;
- incluir solução de problemas e encaminhamento de suporte sem inventar canais ainda não definidos.

“Real” significa material efetivamente produzido e utilizável para o MVP documentado. Isso não autoriza afirmar que o manual foi entregue a participantes ou usado em um treinamento sem evidência.

### 7.4. Descrição do treinamento

`docs/descricao-do-treinamento-de-implantacao.md` e `docs/treinamento-validacao-operacional.md` serão auditados contra o manual e o snapshot. A estrutura atual de dois encontros de duas horas será mantida apenas se o conteúdo atualizado continuar cabendo nas quatro horas previstas.

A revisão deverá verificar:

- público e papéis reais ou, na ausência de nomes, papéis planejados;
- delimitação dos fluxos atuais do MVP cobertos pelo treinamento e indicação do manual como referência para os demais;
- equilíbrio entre demonstração, prática e validação operacional;
- uso explícito do Manual do Usuário como material do treinamento;
- separação entre tarefas do usuário, tarefas do organizador e tarefas técnicas;
- ambiente e dados de treinamento;
- critérios de assimilação, dúvidas, suporte e aceite;
- correspondência entre os tempos de cada atividade e a carga horária total;
- linguagem de planejamento, sem pressupor realização do treinamento.

O recorte de uma hora em `docs/treinamento-validacao-operacional.md` deverá continuar identificado como parte do segundo encontro, sem ser confundido com o treinamento completo.

### 7.5. Cronograma do treinamento

O texto final terá um cronograma próprio para o treinamento, ainda que a descrição contenha uma agenda. O quadro deverá relacionar preparação dos materiais, primeiro encontro, intervalo para ajustes, segundo encontro, eventual reforço e acompanhamento previsto.

Cada linha informará sequência, duração, participantes, conteúdo, material utilizado e critério de conclusão. A notação relativa dos documentos operacionais será substituída por etapas acadêmicas no texto final.

### 7.6. Segurança

A abertura distinguirá segurança implementada na aplicação, controles fornecidos pela infraestrutura, práticas operacionais planejadas e recomendações ainda não executadas. O texto evitará uma lista genérica de ferramentas e se concentrará nos controles que protegem o MVP durante a implantação.

### 7.6.1. Sistema: senha e criptografia

A auditoria técnica deverá percorrer autenticação, validação de senha, armazenamento de credenciais, verificação de senhas comprometidas, limitação de tentativas, recuperação de acesso, sessões, chaves de acesso, autorização, segredos, transporte e registros.

O texto deverá distinguir claramente:

- hash de senha e criptografia reversível;
- o SHA-1 usado para consulta por prefixo ao serviço de senhas comprometidas e o mecanismo usado para armazenar a senha;
- criptografia em trânsito, criptografia em repouso e proteção de segredos;
- controles implementados pelo código e garantias dependentes dos fornecedores;
- validação de entrada e autorização de operações.

O algoritmo e os parâmetros de armazenamento de senha somente serão nomeados após conferência da versão e da documentação oficial do Better Auth usada pelo projeto. Alegações sobre criptografia da Neon, da hospedagem ou do armazenamento de objetos exigirão documentação oficial vigente.

### 7.6.2. Backup: planejamento, estratégias e execução

O plano de backup será específico para PostgreSQL na Neon e se limitará aos mecanismos oficialmente documentados, sem assumir retenção, restauração pontual ou recursos dependentes de plano não especificado. A descrição começará por um inventário dos dados, dependências e mecanismos pertinentes ao cenário.

O conteúdo deverá definir:

- escopo dos dados e itens que ficam fora do banco, como arquivos em armazenamento de objetos e segredos no Doppler;
- responsabilidades entre equipe e fornecedor;
- objetivo de ponto de recuperação (RPO) e objetivo de tempo de recuperação (RTO);
- proteção gerenciada documentada pela Neon e as limitações que dependam de plano;
- cópias lógicas independentes quando necessárias;
- armazenamento protegido, retenção, rotação e controle de acesso;
- backup anterior a migrações previstas no cenário de implantação;
- restauração em ambiente isolado, validação de integridade e critérios de retorno;
- frequência teórica dos testes e registro previsto de evidências;
- limites de plano que condicionem a estratégia, quando documentados.

“Execução” será tratada como procedimento simulado no planejamento. A fase não declarará que backup ou restauração foram realizados apenas porque o procedimento foi escrito.

## Fontes externas planejadas

As fontes candidatas já reservadas em `artifacts/planejamento-referencias.md` deverão ser conferidas somente na parte que as utilizar:

- OWASP Password Storage Cheat Sheet, para armazenamento de senhas;
- OWASP Cryptographic Storage Cheat Sheet, para distinguir objetivos e controles criptográficos;
- NIST SP 800-34 Rev. 1, para contingência, recuperação e prioridades.

A Parte 8 deverá acrescentar documentação oficial vigente da Neon sobre proteção de dados, retenção e restauração, distinguindo recursos condicionados a plano. A Parte 7 também deverá consultar a documentação oficial da versão instalada do Better Auth. Uma fonte só entrará no mapa central quando sustentar texto mantido em `artifacts/texto-fase-07.md`.

Datas de publicação, atualização e acesso serão registradas separadamente. A data de acesso será sempre a data real da consulta. Não será inventada uma data anterior para compatibilizar a referência com o cronograma geral.

## Fontes internas de conferência

| Fonte | Uso na execução |
| --- | --- |
| `artifacts/TCC-PRINCIPAL.md` | Decisões compartilhadas, limites de evidência e progresso. |
| `artifacts/planejamento-referencias.md` e mapa central | Reserva, inclusão e rastreabilidade das fontes externas. |
| `docs/cronograma-individual-de-implantacao.md` | Rascunho do tópico 7.3 e dependências da implantação. |
| `docs/descricao-do-treinamento-de-implantacao.md` | Rascunho principal do tópico 7.4. |
| `docs/treinamento-validacao-operacional.md` | Recorte operacional a conciliar com o treinamento completo. |
| `docs/database-connections.md` | Uso das conexões PostgreSQL direta e agrupada. |
| `docs/auth-rate-limiting.md` e `docs/security-exceptions.md` | Controles e exceções de autenticação a conferir no código. |
| `docs/observability.md` e demais documentos operacionais | Logs, entrega e diagnóstico durante implantação. |
| `packages/auth/` | Armazenamento de senha, recuperação, sessão, chaves de acesso e controles relacionados. |
| `packages/env/src/` | Validação das conexões Neon e demais configurações. |
| `packages/database/` | Schemas, migrações, seed e procedimentos de banco. |
| `apps/web/`, `packages/rpc/` e `packages/validation/` | Escopo funcional, autorização e validação do MVP. |
| Histórico Git da branch `main` | Datas verificadas do projeto final e snapshot documental. |

## Execução obrigatoriamente segmentada

### Parte 0 — Baseline, classificação de evidências e manifesto

**Objetivo:** congelar o snapshot e separar o que é fato, informação fornecida, estimativa ou planejamento.

**Ações:** registrar commit de referência; recalcular os limites Git; inventariar documentos operacionais; criar `artifacts/auxiliares/fase-07-evidencias.md`; classificar implantação, treinamento, manual e backup como elementos teóricos ou materiais existentes; listar dados ainda necessários sem preencher lacunas por suposição.

**Portão de saída:** snapshot e classes de evidência registrados; nenhuma subseção redigida como concluída.

### Parte 1 — Tópico 7.1: cronograma geral

**Objetivo:** montar a cronologia completa e coerente do projeto.

**Ações:** consolidar marcos fornecidos; confirmar o ano; recalcular o período de programação; identificar sobreposições; separar a busca exploratória de viabilidade, a pesquisa contínua dos documentos intermediários e a filtragem final; mapear pesquisa e redação; preparar o quadro e sua interpretação.

**Portão de saída:** todas as datas possuem origem ou classificação explícita, as três etapas de pesquisa estão separadas e não há pesquisa retrodatada apresentada como fato. Somente então iniciar a Parte 2.

### Parte 2 — Tópico 7.2: descrição da implantação

**Objetivo:** definir como, por quanto tempo e por quem o MVP será implantado.

**Ações:** delimitar a arquitetura-alvo, serviços, papéis, etapas, critérios teóricos, monitoramento previsto e retorno simulado; resolver divergências com o cronograma individual.

**Portão de saída:** modalidade, duração e papéis são coerentes e a seção permanece explicitamente teórica. Somente então iniciar a Parte 3.

### Parte 3 — Tópico 7.3: cronograma individual

**Objetivo:** auditar e adaptar o cronograma operacional existente.

**Ações:** confrontar `docs/cronograma-individual-de-implantacao.md` com o snapshot; atualizar escopo, Neon, horas, dependências e critérios; redigir o quadro acadêmico correspondente.

**Portão de saída:** cada etapa possui tempo, responsável, dependência e critério verificável; a soma das horas foi recalculada. Somente então iniciar a Parte 4.

### Parte 4 — Manual do Usuário

**Objetivo:** produzir um manual real, utilizável e alinhado ao MVP.

**Ações:** definir público e versão; conferir cada fluxo no snapshot; escrever instruções; produzir apenas as evidências visuais necessárias; revisar segurança, acessibilidade e limitações; planejar um teste prático do manual em ambiente apropriado, sem apresentá-lo como realizado enquanto não houver evidência.

**Portão de saída:** `artifacts/manual-do-usuario.md` descreve os fluxos encontrados no snapshot e não contém funcionalidade, canal ou credencial inventados. Somente então iniciar a Parte 5.

### Parte 5 — Tópico 7.4: descrição do treinamento

**Objetivo:** auditar o treinamento existente e vinculá-lo ao manual real.

**Ações:** revisar os dois documentos de `docs/`; conferir escopo e tempos; atualizar participantes, materiais, exercícios, avaliação e aceite; garantir linguagem de planejamento acadêmico.

**Portão de saída:** agenda, carga horária, participantes, manual e critérios de conclusão são compatíveis. Somente então iniciar a Parte 6.

### Parte 6 — Tópico 7.5: cronograma do treinamento

**Objetivo:** transformar a descrição em uma sequência temporal operacional.

**Ações:** organizar preparação, encontros, ajustes, reforço e acompanhamento teórico; informar sequência, duração, materiais, participantes e entregáveis; substituir a notação relativa dos documentos existentes por etapas acadêmicas.

**Portão de saída:** cronograma e descrição do treinamento fecham os mesmos tempos e atividades. Somente então iniciar a Parte 7.

### Parte 7 — Tópicos 7.6 e 7.6.1: segurança do sistema

**Objetivo:** explicar os controles pertinentes à implantação sem ampliar as garantias observadas.

**Ações:** auditar código e documentos; conferir Better Auth e fontes oficiais; separar hash, criptografia, transporte e segredos; classificar controles por camada e estado; atualizar o mapa de referências ao manter citações.

**Portão de saída:** cada afirmação técnica possui evidência de código ou fonte oficial, e hash de senha não é descrito como criptografia. Somente então iniciar a Parte 8.

### Parte 8 — Tópico 7.6.2: backup e restauração na Neon

**Objetivo:** definir uma estratégia recuperável e específica para o ambiente adotado.

**Ações:** consultar documentação oficial vigente da Neon; inventariar dados dentro e fora do PostgreSQL; definir RPO, RTO, retenção, cópias independentes, acesso e rotação como cenário teórico; escrever procedimentos simulados de backup, restauração isolada, validação e retorno; registrar limites dependentes de plano sem presumir contratação.

**Portão de saída:** a estratégia cobre perda lógica, falha de implantação e indisponibilidade, e inclui teste de restauração planejado sem alegar execução. Somente então iniciar a Parte 9.

### Parte 9 — Consolidação e revisão final

**Objetivo:** compor uma Fase 7 única a partir dos blocos aprovados.

**Ações:** revisar coerência temporal; conferir somas, papéis e referências cruzadas; alinhar implantação, treinamento, manual e backup; atualizar o mapa central e as cópias locais de consulta das referências; aplicar a skill `humanizar` em perfil acadêmico ao texto final; executar a revisão de consistência com as Fases 6 e 8.

**Portão de saída:** todos os critérios finais foram atendidos e a distinção entre fato, estimativa e planejamento permanece explícita.

## Registro de execução

| Parte | Estado | Data | Entrega ou evidência | Resultado |
| --- | --- | --- | --- | --- |
| Parte 0 — Baseline, classificação de evidências e manifesto | Concluída | 2026-09-07 | `artifacts/auxiliares/fase-07-evidencias.md` | Snapshot da branch `main`, limites Git, inventário operacional, ausências e pendências registrados. Nenhuma subseção da Fase 7 foi redigida como execução comprovada. |
| Parte 1 — Tópico 7.1: cronograma geral | Concluída | 2026-09-07 | `artifacts/texto-fase-07.md` e manifesto | Cronologia consolidada; marcos fornecidos, Git e planejamento distinguidos. |
| Partes 2 e 3 — descrição e cronograma individual | Concluídas | 2026-09-07 | Texto da fase e `docs/cronograma-individual-de-implantacao.md` | Cenário teórico de 59 horas alinhado aos targets Vercel e Neon. |
| Parte 4 — Manual do Usuário | Concluída | 2026-09-07 | `artifacts/manual-do-usuario.md` | Material real, revisado contra o snapshot e sem credenciais ou fluxos inventados; não houve teste prático ponta a ponta. |
| Partes 5 e 6 — treinamento | Concluídas | 2026-09-07 | Texto da fase e documentos de treinamento em `docs/` | Dois encontros planejados, recorte funcional delimitado, manual referenciado e recorte de uma hora preservado. |
| Parte 7 — segurança | Concluída | 2026-09-07 | Tópicos 7.6 e 7.6.1; mapa de referências | Código e fontes oficiais diferenciam hash, criptografia, limites e segredos. |
| Parte 8 — backup e restauração na Neon | Concluída | 2026-09-07 | Tópico 7.6.2; mapa de referências | Estratégia teórica específica para Neon, sem pressupor plano ou execução. |
| Parte 9 — consolidação | Concluída | 2026-09-07 | Texto, manual, documentos operacionais, mapa de referências e cópias locais de consulta | Revisão de coerência, fontes e classes de evidência concluída. |

## Condições para revisões posteriores

- A Fase 7 permanece teórica; não são necessários conta, URL ou ambiente real para a implantação.
- Vercel e Neon são tratados como targets da arquitetura, codificados no repositório, sem alegação de operação efetiva.
- A estratégia de recuperação usa documentação oficial da Neon e não pressupõe recursos dependentes de plano contratado ou retenção específica do fornecedor.
- Os nomes dos participantes somente serão necessários se a instituição exigir identificação nominal; até lá, o planejamento usa papéis.
- A Parte 0 não localizou no repositório evidências de treinamento, backup ou restauração; elas não são necessárias para o escopo teórico da fase.
- Alterações de programação posteriores a 05/09/2026 mudarão o limite final do projeto e exigirão atualização do cronograma.
- A orientação institucional sobre formato e normalização do cronograma ainda pode afetar a apresentação, sem alterar as classes de evidência.

Essas condições não alteram a conclusão da Fase 7. Elas orientam revisões motivadas por mudanças no projeto ou por exigências institucionais.

## Riscos e controles

| Risco | Controle previsto |
| --- | --- |
| A fase crescer sem controle | Executar uma parte por vez e exigir o portão de saída antes da seguinte. |
| Misturar datas reais e retrospectivas | Manter origem e classe temporal no manifesto e no cronograma. |
| Retrodatagem de pesquisa ou acesso | Registrar datas reais de consulta; usar somente estimativas explicitamente rotuladas no cronograma. |
| Período Git ficar obsoleto | Recalcular os commits limítrofes na Parte 1 e na consolidação. |
| Reaproveitar documentos desatualizados | Auditar cronograma e treinamento contra o snapshot antes da redação. |
| Manual divergir do sistema | Congelar a versão, conferir cada fluxo no snapshot e manter o teste prático como atividade separada até que exista evidência. |
| Treinamento prometer mais do que cabe | Recalcular a agenda depois do manual e ajustar carga ou escopo. |
| Confundir hash e criptografia | Conferir implementação e documentação oficial; revisar terminologia técnica. |
| Atribuir garantias do fornecedor sem base | Consultar documentação oficial vigente e limitar o texto aos mecanismos aplicáveis sem presumir plano ou retenção específica. |
| Depender apenas da proteção da Neon | Avaliar cópias lógicas independentes e cobrir objetos e configurações fora do banco. |
| Tratar um procedimento não exercitado como resultado | Descrever backup e restauração como estratégia teórica, sem atribuir resultado. |
| Expor dados sensíveis | Usar dados de demonstração, omitir segredos e revisar todo artefato visual ou log. |

## Critérios de aceite do planejamento

- [x] Os tópicos 7.1 a 7.6.2 possuem finalidade, limites e fontes iniciais definidos.
- [x] A execução foi dividida em partes sequenciais com portões de saída.
- [x] Os marcos fornecidos pelo usuário foram registrados com o ano explicitamente interpretado.
- [x] O período inicial do projeto final foi verificado na branch `main`.
- [x] Datas fornecidas, verificadas, estimadas e planejadas foram separadas.
- [x] O pedido de retrodatação foi substituído por uma reconstrução retrospectiva identificada, sem inventar datas de acesso.
- [x] O Manual do Usuário foi planejado como entrega real e anterior ao fechamento do treinamento.
- [x] Os documentos existentes de implantação e treinamento foram tratados como rascunhos sujeitos a auditoria.
- [x] O backup cobre PostgreSQL na Neon e objetos externos, com restauração, RPO, RTO, retenção e cópias independentes.
- [x] Segurança distingue senha, hash, criptografia, transporte e controles de fornecedor.
- [x] Dependências e dúvidas foram associadas às partes que deverão resolvê-las.
- [x] A atualização obrigatória do mapa de referências foi incorporada ao fluxo.

## Critérios de conclusão da execução

- [x] O cronograma geral foi revalidado contra o Git, e a classificação e a origem de suas datas estão registradas no manifesto de evidências.
- [x] Os tópicos 7.1 a 7.6.2 foram redigidos e conferidos.
- [x] O cronograma individual foi atualizado e suas horas foram recalculadas.
- [x] O Manual do Usuário real foi produzido e revisado contra o snapshot; nenhum teste prático ponta a ponta é alegado.
- [x] A descrição e o cronograma do treinamento estão atualizados, delimitam os fluxos selecionados e usam o manual como referência para o conjunto completo.
- [x] As afirmações de segurança foram verificadas no código e em documentação oficial.
- [x] O plano de backup considera mecanismos documentados da Neon e descreve restauração como procedimento teórico, sem alegar execução.
- [x] Atividades não executadas permanecem apresentadas como propostas ou simulações.
- [x] O mapa central contém todas as fontes externas efetivamente usadas na fase.
- [x] O texto final passou por revisão acadêmica com a skill `humanizar`.
- [x] A Fase 8 pode distinguir manutenção das atividades de implantação e recuperação definidas aqui.

Em 2026-09-07, a abertura da fase foi revisada conforme D-025. O cenário de implantação passa a partir da base funcional entregue pelo MVP e de seus fluxos centrais, mantendo a distinção factual entre planejamento acadêmico e atividades efetivamente executadas.
