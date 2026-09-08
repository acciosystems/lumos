# Planejamento — Fase 8: Manutenção do sistema

## Identificação e estado

- Identificador: `fase-08`.
- Responsável pelo planejamento: Codex.
- Data do planejamento: 2026-09-07.
- Estado: concluída em 2026-09-07; redação, conferência e revisão concluídas.
- Recorte: manutenção do MVP da plataforma Nossa Causa no mesmo snapshot funcional adotado ao final das Fases 6 e 7.
- Entrega textual prevista: `artifacts/texto-fase-08.md`.
- Entrega auxiliar prevista: `artifacts/auxiliares/fase-08-evidencias.md`.

A execução será dividida em partes sequenciais. Primeiro será fixado o significado de manutenção de software; depois serão auditadas as práticas encontradas no repositório e, somente então, será formulado o processo proposto para o MVP. Essa ordem evita apresentar controles planejados como atividades já realizadas.

## Objetivo

A fase deverá explicar como o MVP Nossa Causa poderia ser corrigido, adaptado e evoluído depois de uma eventual implantação. O texto relacionará cada necessidade de mudança a um processo rastreável de registro, análise, implementação, verificação, liberação e encerramento.

O resultado combinará duas perspectivas claramente separadas:

1. recursos e práticas já verificados no repositório, como versionamento, rastreamento de trabalho, verificações estáticas, build, migrações, observabilidade e registro de exceções de segurança;
2. atividades propostas para uma futura operação, como triagem e ordenação de solicitações por impacto, validação em ambiente apropriado, acompanhamento após a liberação e revisão periódica do plano.

A fase não afirmará que existe ambiente de produção ativo, equipe de suporte constituída, acordo de nível de serviço, rotina de releases, alerta configurado, backup executado ou histórico real de incidentes. Também não apresentará itens futuros do produto como manutenção de funcionalidades já entregues.

## Delimitação e adaptação da estrutura inicial

A estrutura inicial contém apenas o título “Manutenção do sistema”. Para dar precisão ao conteúdo sem ampliar indevidamente o escopo, o texto final será organizado nas seguintes subseções provisórias:

- **8.1. Escopo e tipos de manutenção**;
- **8.2. Condições atuais de manutenibilidade do MVP**;
- **8.3. Processo proposto de manutenção**;
- **8.4. Plano de manutenção do Nossa Causa**;
- **8.5. Evolução planejada além do MVP**.

A numeração poderá ser ajustada na integração conforme o modelo institucional. A adaptação não cria uma fase operacional: ela organiza o tema único solicitado e preserva a distinção entre evidência, proposta e limitação.

## Fronteira com a Fase 7

A ISO/IEC/IEEE 14764:2022 trata manutenção de software separadamente das funções de operação, entre elas backup, recuperação e administração do sistema. A Fase 7 já contém o cenário teórico de implantação, segurança, backup e restauração. Por isso, a Fase 8 seguirá esta divisão:

| Conteúdo                           | Tratamento na Fase 7                                                       | Tratamento na Fase 8                                                               |
| ---------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Implantação e decisão de liberação | Cenário teórico, papéis, etapas e critérios.                               | Ponto de entrada para o software mantido; não repetir o cronograma de implantação. |
| Monitoramento e registros          | Observação prevista após a liberação e controles de segurança pertinentes. | Fontes para detectar, diagnosticar e acompanhar necessidades de mudança.           |
| Backup e restauração               | Estratégia teórica, RPO, RTO, retenção e procedimento de recuperação.      | Somente impactos de uma mudança sobre o procedimento e sua revisão periódica.      |
| Migração e retorno                 | Preparação e recuperação previstas para implantação.                       | Avaliação exigida quando uma alteração modificar schema, dados ou compatibilidade. |
| Treinamento e Manual do Usuário    | Materiais e atividades planejados para adoção.                             | Atualização documental quando uma mudança alterar comportamento visível.           |
| Incidente operacional              | Registro e recuperação pertencem à operação.                               | Correção de software decorrente da causa identificada pode originar manutenção.    |

A fase poderá remeter aos tópicos 7.2, 7.3 e 7.6.2, mas não copiará seus procedimentos. A revisão de um plano de backup após alteração do schema, por exemplo, será uma obrigação associada à mudança; a criação e a execução das cópias continuarão classificadas como operação planejada.

## Classes de evidência

Cada afirmação do texto final receberá uma das classes abaixo no manifesto `artifacts/auxiliares/fase-08-evidencias.md`:

| Classe                    | Significado                                                                          | Exemplos admissíveis                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Implementado e verificado | Recurso presente no snapshot e conferido no código, na configuração ou no histórico. | Scripts declarados, configuração do Turbo, migrações Prisma e emissão de eventos estruturados.            |
| Processo documentado      | Procedimento descrito no repositório, sem prova de execução externa.                 | Contrato de observabilidade, limites de requisição e exceção de segurança com revisão agendada.           |
| Registro versionado       | Histórico Git usado para delimitar o snapshot funcional.                             | Commits de referência e distinção entre mudanças de programação e de documentação.                        |
| Verificação executada     | Resultado de comando ou busca realizada durante a auditoria.                         | Lint, type-check, auditoria de dependências e buscas por testes e integração contínua.                    |
| Ausência verificada       | Recurso procurado e não localizado no snapshot.                                      | Suíte de testes dedicada, workflow de CI ou comprovação de alertas configurados, se continuarem ausentes. |
| Proposto                  | Prática definida para uma futura manutenção, sem execução alegada.                   | Triagem, aprovação, verificação de regressão, acompanhamento e revisão periódica.                         |
| Dependente de fornecedor  | Capacidade cuja existência ou limite depende de configuração externa vigente.        | Recursos contratados ou configurados na Vercel, Neon, Axiom, Doppler, Resend ou armazenamento de objetos. |

Documentos internos, código e histórico Git sustentam a descrição do Nossa Causa, mas não substituem fonte bibliográfica para definir manutenção de software. O rastreador usado durante o desenvolvimento é um recurso interno e não será citado no texto acadêmico nem empregado como prova de atendimento em produção.

## Estrutura planejada do texto final

### 8.1. Escopo e tipos de manutenção

A abertura deverá definir manutenção de software e separá-la de operação, suporte ao usuário, administração da infraestrutura e recuperação de dados. A terminologia detalhada será atribuída à ISO/IEC/IEEE 14764:2022 somente depois da consulta autorizada ao conteúdo correspondente.

O texto trabalhará com seis tipos conferidos na ISO/IEC/IEEE 14764:2022 e no SWEBOK Guide V4.0a:

- manutenção corretiva, associada à correção de defeitos;
- manutenção adaptativa, provocada por mudanças no ambiente técnico ou em dependências;
- manutenção preventiva, destinada a reduzir a probabilidade ou o impacto de falhas futuras.
- manutenção aditiva, voltada à inclusão de funcionalidade ou recurso após a entrega;
- manutenção perfectiva, voltada a melhorias sustentadas por necessidades ou medições;
- manutenção de emergência, como contenção temporária até a correção definitiva.

As categorias serão agrupadas como correções ou melhorias somente quando essa distinção ajudar a análise da solicitação. A classificação não converterá uma funcionalidade futura em entrega já existente nem substituirá a análise de escopo.

A seção também esclarecerá que uma funcionalidade ainda não incorporada ao MVP constitui evolução do produto, e não manutenção de uma entrega existente apenas por ter sido prevista. Uma mudança futura poderá ser tratada dentro do processo de manutenção depois que seu escopo e sua relação com o produto mantido forem analisados.

### 8.2. Condições atuais de manutenibilidade do MVP

Esta subseção descreverá a base técnica que favorece ou limita a manutenção, sem transformar ferramentas em garantia de qualidade. A auditoria abrangerá:

| Área                  | Evidência inicial                                                                 | Verificação necessária antes da redação                                                                        |
| --------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Organização do código | Monorepo Bun/Turborepo com responsabilidades separadas entre aplicação e pacotes. | Conferir manifestos, dependências entre pacotes e limites arquiteturais no snapshot.                           |
| Controle de versão    | Histórico Git e padrão de commits do repositório.                                 | Fixar commit de referência e distinguir mudanças de código, documentação e artefatos gerados.                  |
| Solicitações          | Nenhum processo organizacional de manutenção foi comprovado pelos artefatos.      | Apresentar o registro das solicitações apenas como proposta, sem atribuir sua execução à equipe.               |
| Qualidade estática    | Oxlint, Oxfmt, TypeScript e build declarados nos manifestos.                      | Confirmar os comandos que apenas verificam e os que modificam arquivos; não alegar CI sem workflow.            |
| Testes                | Nenhuma suíte dedicada foi localizada no levantamento inicial.                    | Repetir a busca; delimitar o que foi validado manualmente e não chamar type-check ou build de teste funcional. |
| Dependências          | Lockfile do Bun, versão do gerenciador e auditoria de dependências.               | Conferir versões, comando de auditoria e exceções vigentes sem recomendar atualização automática.              |
| Banco de dados        | Schemas e migrações Prisma, conexões direta e agrupada documentadas.              | Verificar como uma mudança de schema seria preparada, revisada e validada; não executar migração externa.      |
| Observabilidade       | Eventos estruturados, entrega para Axiom e diagnósticos de falha documentados.    | Separar emissão implementada de dataset, monitores e notificadores que dependem do ambiente externo.           |
| Segurança             | Controles de autenticação e arquivo de exceções com prazo de revisão.             | Conferir o estado atual das exceções e não generalizar um controle específico para todo o sistema.             |
| Documentação          | Documentos técnicos, TCC e Manual do Usuário.                                     | Identificar quais materiais precisam mudar quando uma manutenção altera arquitetura, operação ou interface.    |

O texto deverá registrar como limitação a ausência de uma suíte automatizada dedicada, se ela permanecer no snapshot. Essa ausência altera o nível de evidência disponível para regressão e exige que a proposta distinga verificações estáticas, build e validação funcional. Não será criada uma cobertura de testes fictícia para deixar o processo mais convincente.

### 8.3. Processo proposto de manutenção

O processo será descrito como um ciclo aplicável a solicitações de correção, adaptação ou melhoria:

1. **Registro:** criar ou atualizar um registro de manutenção com identificador, descrição, impacto esperado, responsável e estado de acompanhamento.
2. **Triagem:** confirmar que a solicitação pertence ao MVP mantido, classificar sua natureza e identificar solicitações repetidas ou dependentes.
3. **Análise de impacto:** mapear interface, RPC, validação, autenticação, banco de dados, arquivos, e-mail, observabilidade, documentação e integrações afetadas.
4. **Planejamento da mudança:** definir critérios de aceite, estratégia de verificação, riscos, dependências, eventual migração e condições de retorno.
5. **Implementação versionada:** alterar somente o escopo aprovado, preservar compatibilidade quando exigida e documentar decisões relevantes.
6. **Verificação:** executar as verificações estáticas e de build aplicáveis, além de validação funcional proporcional ao risco. Falhas de regressão deverão impedir a liberação planejada.
7. **Preparação da liberação:** revisar migrações, configurações, observabilidade, documentação e efeito sobre o plano de recuperação. A implantação continua sujeita aos critérios da Fase 7.
8. **Acompanhamento:** observar os sinais definidos para a mudança, registrar ocorrências e decidir entre continuidade, correção adicional ou retorno planejado.
9. **Encerramento e aprendizado:** atualizar o registro de manutenção, a documentação, as exceções e as pendências identificadas.

O texto final não fixará tempos de atendimento ou solução sem uma decisão organizacional. A ordenação das solicitações poderá considerar o impacto sobre segurança, integridade de dados, autenticação, disponibilidade e fluxos centrais do MVP, mas essa análise não será convertida em SLA inventado.

### 8.4. Plano de manutenção do Nossa Causa

O plano será apresentado em um quadro que relacione gatilho, atividade, evidência, responsável por papel e fronteira com a operação. A matriz inicial é:

| Gatilho ou momento                              | Atividade proposta                                                                                        | Evidência esperada                                                     | Papel previsto                                   | Limite                                                              |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------- |
| Relato de defeito ou erro observado             | Reproduzir com dados seguros, classificar impacto, localizar causa e definir verificação de regressão.    | Registro da solicitação, diagnóstico seguro e critérios de aceite.     | Responsável técnico.                             | Não afirmar histórico real de suporte ou incidente.                 |
| Mudança em código                               | Executar lint, conferência de formatação, type-check e verificações afetadas.                             | Saídas dos comandos e revisão das mudanças.                            | Pessoa responsável pela alteração.               | Build e tipos não substituem teste funcional.                       |
| Mudança funcional                               | Revisar validação no cliente e no servidor, autorização, interface, documentação e Manual do Usuário.     | Critérios funcionais, evidência de validação e documentos atualizados. | Responsável técnico e representante funcional.   | Usar dados de demonstração; não expor dados reais.                  |
| Mudança de schema ou dados                      | Preparar migração, avaliar compatibilidade, revisar cópia anterior e validar em ambiente isolado.         | Migração versionada, análise de impacto e roteiro de retorno.          | Responsável técnico pelo banco.                  | Backup e restauração permanecem atividades operacionais da Fase 7.  |
| Atualização de dependência ou runtime           | Ler notas oficiais, auditar vulnerabilidades, verificar compatibilidade e executar os portões aplicáveis. | Alteração do manifesto e lockfile, auditoria e justificativa.          | Responsável técnico.                             | Não atualizar automaticamente apenas por existir versão mais nova.  |
| Exceção de segurança próxima do prazo           | Reauditar a cadeia afetada e corrigir, remover ou renovar a exceção com justificativa e nova revisão.     | Auditoria, justificativa e registro de decisão.                        | Responsável pela manutenção de segurança.        | Não omitir achado porque não está no runtime.                       |
| Mudança de fornecedor ou configuração           | Revalidar contratos de conexão, tempo limite, segurança, região, capacidade e observabilidade.            | Documentação oficial vigente e checklist atualizado.                   | Responsável técnico e responsável pela operação. | Garantias externas dependem da configuração contratada.             |
| Sinal de saturação, timeout ou falha de entrega | Correlacionar eventos, identificar tendência e abrir mudança quando a causa pertencer ao software.        | Consulta segura dos eventos, solicitação e análise de causa.           | Responsável técnico.                             | Configuração e atendimento do alerta pertencem à operação.          |
| Antes de uma liberação                          | Reexecutar os portões definidos, revisar migração, documentação, observabilidade e condições de retorno.  | Checklist da versão candidata.                                         | Responsável técnico e representante funcional.   | Não declarar release real sem evidência externa.                    |
| Depois de uma mudança liberada                  | Acompanhar os sinais afetados e comparar com os critérios de aceite.                                      | Registro de acompanhamento e decisão.                                  | Responsável técnico.                             | Sem duração arbitrária enquanto não houver política definida.       |
| Revisão periódica                               | Reavaliar dependências, exceções, documentação, procedimentos e dívida técnica registrada.                | Registros de manutenção atualizados e registro de revisão.             | Mantenedores do sistema.                         | A periodicidade será definida pela equipe; não inventar calendário. |

Registros do rastreador interno de desenvolvimento não serão citados nem usados como evidência acadêmica. O texto descreverá apenas o processo de manutenção proposto e as evidências técnicas verificáveis no repositório.

### 8.5. Evolução planejada além do MVP

A seção aplicará o processo proposto às ideias de reputação, denúncias, recompensas, notificações e processamento opcional de pagamentos. Esses recursos serão tratados como possibilidades de evolução que precisam de delimitação e análise de impacto, não como solicitações aprovadas ou funcionalidades mantidas. No caso das notificações, a análise já concluiu que a implementação era tecnicamente inviável dentro do escopo do MVP; uma retomada posterior exigirá novo recorte. A discussão preservará os sete dias corridos aplicados às duas modalidades no MVP. Também registrará que o cálculo baseado na quantidade de itens atende diretamente às campanhas físicas, não possui equivalente definido para as virtuais e foi concebido junto à classificação do atraso como infração dos termos, sem penalidade automática implementada.

## Fontes externas usadas na execução

### ISO/IEC/IEEE 14764:2022 e SWEBOK Guide V4.0a

Referência incorporada ao mapa central em `artifacts/auxiliares/referencias-utilizadas.md`:

> INTERNATIONAL ORGANIZATION FOR STANDARDIZATION (ISO); INTERNATIONAL ELECTROTECHNICAL COMMISSION (IEC); INSTITUTE OF ELECTRICAL AND ELECTRONICS ENGINEERS (IEEE). _ISO/IEC/IEEE 14764:2022: Software engineering — Software life cycle processes — Maintenance_. 2022. Disponível em: <https://www.iso.org/standard/80710.html>.

A página oficial e uma prévia pública de consulta da edição de 2022 foram conferidas em 2026-09-07. Elas sustentam o escopo, os tipos de manutenção, a solicitação de modificação e a separação entre manutenção e funções operacionais. O SWEBOK Guide V4.0a, disponibilizado pela IEEE Computer Society para uso acadêmico, foi conferido como fonte complementar e sua cópia local autorizada foi registrada em `artifacts/auxiliares/referencias/`.

Na execução, o responsável:

1. registrou os localizadores usados para definições e processo;
2. não armazenou nem reproduziu uma cópia não autorizada da norma;
3. usou o SWEBOK como fonte complementar, sem duplicar a atribuição da ISO;
4. inseriu as fontes R-025 e R-026 no mapa central para as afirmações mantidas em `artifacts/texto-fase-08.md`.

A identificação IEEE “14764-2021”, referente à aprovação da mesma edição e publicada em janeiro de 2022, poderá ser usada apenas para conferência cruzada. A referência bibliográfica principal seguirá o identificador ISO/IEC/IEEE 14764:2022 adotado no planejamento central.

Documentação vigente dos fornecedores será consultada apenas quando o texto mantiver uma afirmação sobre comportamento externo. As fontes já usadas na Fase 7 poderão ser reutilizadas, com atualização imediata dos locais de uso no mapa central.

## Fontes internas de conferência

| Fonte                                                                   | Uso planejado                                                                 |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `artifacts/TCC-PRINCIPAL.md`                                            | Decisões compartilhadas, estado, limites de evidência e integração.           |
| `docs/nossa-causa-resumo-pt.md`                                         | Ideias posteriores ao MVP e questões originalmente abertas.                   |
| `artifacts/planejamento-fase-06.md` e `artifacts/texto-fase-06.md`      | Arquitetura, telas, documentação e snapshot do desenvolvimento.               |
| `artifacts/planejamento-fase-07.md` e `artifacts/texto-fase-07.md`      | Fronteira com implantação, segurança, backup, restauração e acompanhamento.   |
| `artifacts/manual-do-usuario.md`                                        | Material que deverá ser revisado quando a manutenção alterar fluxos visíveis. |
| `artifacts/planejamento-referencias.md` e mapa central                  | Reserva e rastreabilidade das fontes externas.                                |
| `AGENTS.md`                                                             | Regras de commits, migrações, validação e documentação.                       |
| `package.json`, manifestos e `bun.lock`                                 | Scripts, versões, dependências e lockfile.                                    |
| `turbo.json`                                                            | Dependências entre tarefas e tarefas sem cache.                               |
| `docs/observability.md` e `docs/request-deadlines.md`                   | Eventos, entrega, falhas, limites e verificações planejadas.                  |
| `docs/database-connections.md`                                          | Contrato de conexão, saturação e revisão de configuração.                     |
| `docs/security-exceptions.md` e `docs/auth-rate-limiting.md`            | Exceções, prazos, auditoria e controles específicos.                          |
| `docs/campaign-lifecycle.md` e `docs/campaign-idempotency.md`           | Regras de domínio que mudanças em campanhas deverão preservar.                |
| `packages/database/` e schemas Prisma                                   | Persistência, telemetria, migrações e impacto de alterações de dados.         |
| `apps/web/`, `packages/rpc/`, `packages/validation/` e `packages/auth/` | Fluxos funcionais, fronteiras de validação e autorização.                     |
| Histórico Git da branch `main`                                          | Snapshot, mudanças e rastreabilidade local.                                   |

## Execução obrigatoriamente segmentada

### Parte 0 — Baseline e manifesto de evidências

**Objetivo:** fixar o snapshot e separar recursos existentes, documentos, ausências e propostas.

**Ações:** registrar commit de referência; identificar o último commit que alterou programação; inventariar scripts, testes, workflows, migrações, observabilidade, exceções e documentação; criar `artifacts/auxiliares/fase-08-evidencias.md` sem segredos ou dados externos sensíveis.

**Portão de saída:** cada afirmação técnica planejada possui fonte interna e classe de evidência; nenhuma prática externa é tratada como executada.

### Parte 1 — Conceito, tipos e fronteira com operação

**Objetivo:** estabelecer a base conceitual da fase.

**Ações:** consultar a fonte ISO disponível de forma autorizada; confirmar terminologia, escopo e localizadores; separar manutenção, operação, suporte e evolução; ajustar a estrutura provisória se a fonte exigir maior precisão.

**Portão de saída:** definições e limites possuem fonte verificável; backup, recuperação e administração do sistema não são repetidos como manutenção de software.

### Parte 2 — Auditoria da manutenibilidade atual

**Objetivo:** descrever os recursos reais do snapshot e suas limitações.

**Ações:** conferir organização modular, Git, scripts, build, tipos, testes, dependências, migrações, observabilidade, segurança e documentação; validar os comandos sem modificar código ou serviços externos; registrar ausências com o mesmo rigor usado para presenças.

**Portão de saída:** o inventário distingue ferramenta declarada, comportamento implementado, processo documentado e capacidade externa não comprovada.

### Parte 3 — Processo de manutenção

**Objetivo:** adaptar um ciclo de manutenção ao Nossa Causa.

**Ações:** definir registro, triagem, impacto, planejamento, implementação, verificação, liberação, acompanhamento e encerramento; relacionar cada etapa às regras do repositório; evitar SLA, equipe ou canal de suporte sem evidência.

**Portão de saída:** o processo tem entradas, decisões, evidências e saídas claras e se integra aos critérios da Fase 7.

### Parte 4 — Plano aplicado ao MVP

**Objetivo:** transformar o processo em atividades concretas por gatilho.

**Ações:** revisar a matriz inicial; associar mudanças funcionais, schema, dependências, segurança, fornecedores, telemetria e documentação aos controles pertinentes; identificar responsabilidades por papel.

**Portão de saída:** cada atividade proposta informa gatilho, evidência, papel e limite, sem frequência ou resultado inventado.

### Parte 5 — Redação e integração

**Objetivo:** produzir o texto acadêmico da Fase 8.

**Ações:** redigir `artifacts/texto-fase-08.md`; atualizar imediatamente `artifacts/auxiliares/referencias-utilizadas.md` para toda fonte mantida; revisar coerência com as Fases 6 e 7; aplicar a skill `humanizar` em perfil acadêmico; conferir hierarquia, quadros, chamadas e limitações.

**Portão de saída:** o texto diferencia práticas existentes e propostas, todas as referências estão rastreadas e nenhuma atividade operacional não executada é apresentada como fato.

## Riscos e controles

| Risco                                            | Controle previsto                                                                                         |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Repetir a Fase 7                                 | Usar a fronteira definida neste plano e remeter aos tópicos anteriores sem copiar os procedimentos.       |
| Descrever operação como manutenção               | Classificar cada atividade antes da redação e seguir o escopo público da ISO/IEC/IEEE 14764:2022.         |
| Atribuir definições ao texto integral sem acesso | Limitar a citação ao resumo público ou obter acesso autorizado com localizadores.                         |
| Tratar ferramenta como processo executado        | Separar manifestos, código, documentação, ambiente externo e evidência de execução.                       |
| Confundir verificação estática com testes        | Nomear lint, formatação, type-check, build e validação funcional conforme sua função real.                |
| Inventar maturidade operacional                  | Não criar SLA, escala de plantão, canal, periodicidade, release ou incidente sem dados.                   |
| Citar o rastreador interno no texto acadêmico    | Usar registros neutros no processo proposto e restringir a evidência aos artefatos técnicos verificáveis. |
| Atualizar dependências sem análise               | Exigir notas oficiais, auditoria, compatibilidade, lockfile e verificação proporcional ao risco.          |
| Omitir impacto de migração                       | Incluir análise de schema, dados, compatibilidade, cópia anterior e retorno em toda mudança pertinente.   |
| Expor dados ou segredos em evidências            | Usar dados de demonstração e registrar somente metadados seguros.                                         |
| Deixar documentação divergente                   | Associar Manual do Usuário, documentos técnicos e TCC aos critérios de conclusão da mudança.              |
| Tratar a visão posterior ao MVP como trabalho aprovado | Apresentar cada ideia de D-024 sem ordem, prazo ou compromisso de entrega e exigir análise antes da incorporação. |
| Desatualizar o mapa de referências               | Aplicar D-015 no mesmo momento em que uma citação for incluída, removida ou deslocada.                    |

## Critérios de aceite do planejamento

- [x] O recorte da Fase 8 foi delimitado ao MVP e ao snapshot das fases anteriores.
- [x] A fronteira entre manutenção de software e operação foi definida.
- [x] A estrutura inicial recebeu subseções justificadas e provisórias.
- [x] Práticas existentes, processos documentados, ausências e propostas foram separados.
- [x] A ausência inicial de suíte dedicada e CI foi tratada como item a revalidar, sem inferência de cobertura.
- [x] O processo de manutenção possui etapas, entradas, evidências e portões.
- [x] O plano aplicado cobre código, dependências, banco, segurança, observabilidade e documentação.
- [x] As fontes ISO/IEC/IEEE 14764:2022 e SWEBOK Guide V4.0a foram registradas com localizadores e limites de acesso explícitos.
- [x] A integração com a Fase 7 e o mapa central de referências foi incorporada ao fluxo.
- [x] A visão de evolução definida em D-024 foi relacionada ao processo sem ser apresentada como manutenção já aprovada.
- [x] A execução foi dividida em partes sequenciais.

## Critérios de conclusão da execução futura

- [x] O manifesto registra o snapshot e a classe de cada evidência usada.
- [x] A base conceitual possui fonte conferida e localizadores suficientes.
- [x] O texto descreve apenas recursos presentes ou os identifica como propostas.
- [x] A ausência ou existência de testes e CI foi revalidada no snapshot.
- [x] O processo proposto mantém rastreabilidade do registro ao encerramento.
- [x] Os comandos e verificações citados correspondem aos manifestos vigentes.
- [x] Mudanças de schema, dependências, segurança e fornecedores possuem controles específicos.
- [x] Backup, restauração, administração e alertas externos não foram apresentados como manutenção já executada.
- [x] O Manual do Usuário e os documentos técnicos aparecem como itens de atualização quando afetados.
- [x] O mapa central contém todas as fontes externas efetivamente usadas.
- [x] O texto final passou por revisão acadêmica com a skill `humanizar`.
- [x] A Fase 8 está coerente com o desenvolvimento da Fase 6 e a implantação teórica da Fase 7.

Em 2026-09-07, o tópico 8.5 foi acrescentado conforme D-024. A revisão relaciona as ideias posteriores ao MVP ao processo de análise de mudanças, preserva sua condição de propostas sem ordem ou prazo e não acrescenta fontes externas ao texto.

Na revisão de D-025, o MVP foi caracterizado como base funcional para manutenção e evolução. O texto continua registrando as verificações disponíveis e as condições operacionais não executadas, mas deixou de apresentar essas fronteiras como insuficiência inerente ao produto minimamente viável.
