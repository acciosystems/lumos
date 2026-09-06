# Planejamento — Fase 3: Análise do sistema atual

## Identificação e escopo

- Identificador: `fase-03`.
- Responsável: Codex.
- Data de início: 2026-09-05.
- Etapa atual: concluída; planejamento, redação, conferência técnica e revisão finalizados em 2026-09-05.
- Orientação central: `artifacts/TCC-PRINCIPAL.md`, sobretudo D-001, D-010 e D-011.
- Texto produzido: `artifacts/texto-fase-03.md`.

Nesta fase, “sistema atual” significa o MVP implementado da plataforma Nossa Causa. A análise não descreverá um processo anterior observado em uma organização, pois não houve pesquisa de campo, acompanhamento de campanhas reais ou levantamento operacional da AccioLabs. Os controles informais associados a grupos de Facebook e WhatsApp pertencem à delimitação do problema apresentada nas fases anteriores. Eles não serão convertidos em um fluxo organizacional fictício nem comparados a métricas de uso inexistentes.

O usuário confirmou que todas as funcionalidades P0 estão implementadas. A fase tomará essa confirmação como definição de escopo e verificará no repositório como cada capacidade foi concretizada. O texto final descreverá as funcionalidades pelo que permitem fazer, sem citar o documento interno que as classifica por prioridade. As afirmações sobre comportamento do sistema deverão ser sustentadas pela interface, pelas regras de negócio, pelas validações e pelos modelos de dados correspondentes.

A análise ficará restrita ao funcionamento atual do MVP. Não serão apresentados como entregas o sistema de reputação, o sistema de denúncia, o sistema de recompensas, as notificações automáticas nem a integração com processadores de pagamento. Também não serão atribuídos ao sistema resultados de adoção, aumento de doações, elevação de confiança, redução de fraudes ou melhoria operacional, pois esses efeitos não foram avaliados com usuários ou campanhas reais.

## Adaptação da estrutura inicial

A estrutura inicial solicita a descrição de “controles existentes, informatizados ou não”. Como o sistema atual foi esclarecido pelo usuário como o próprio MVP, a Fase 3 será apresentada como uma análise funcional e documental do software existente. O termo “controle” abrangerá os mecanismos pelos quais a plataforma registra, restringe, consulta ou publica informações de campanhas.

Essa adaptação evita duas ambiguidades. A primeira seria tratar o uso informal de redes sociais como um sistema legado observado, embora não exista evidência de uma organização específica, de seus responsáveis ou de seus procedimentos. A segunda seria analisar o MVP como se ainda fosse apenas uma proposta. Nesta fase, a implementação pode ser declarada porque será confrontada com evidências técnicas; sua eficácia social, contudo, continuará fora do que as fontes permitem afirmar.

A redação adotará três níveis de análise:

1. controle de acesso e atribuição de responsabilidades, distinguindo visitante, usuário autenticado e organizador;
2. controles funcionais das campanhas físicas e virtuais, incluindo descoberta, participação e gestão;
3. controles de transparência, ciclo de vida e prestação de contas, com seus limites atuais.

A fase não produzirá diagrama de caso de uso, diagrama de implementação, DER ou diagrama de classes, pois esses elementos pertencem às Fases 4 e 6. Também não repetirá o inventário completo de telas nem usará as capturas existentes como figuras, salvo se a integração final demonstrar que uma imagem é indispensável. A evidência visual já disponível servirá, por enquanto, apenas à conferência interna.

## Objetivos da análise

O texto deverá:

- definir com precisão o recorte do sistema atual;
- identificar os atores que interagem com o MVP e as permissões associadas a cada um;
- descrever os controles implementados para campanhas físicas e virtuais;
- explicar como tema, região e tipo são usados para localizar campanhas;
- registrar como a participação em campanhas físicas é confirmada, cancelada e contabilizada;
- caracterizar o painel do organizador pelos indicadores e ações que ele realmente oferece;
- explicar a publicidade do CNPJ das organizações e o tratamento do estado de verificação;
- descrever a prestação de contas após o encerramento da campanha;
- explicitar que as transferências de campanhas virtuais ocorrem fora da plataforma;
- separar funcionalidades implementadas, controles de apoio, limitações do MVP e capacidades futuras.

## Estrutura proposta para a redação

| Ordem | Subseção proposta | Finalidade | Conteúdo previsto | Limite editorial |
| --- | --- | --- | --- | --- |
| 1 | Delimitação do sistema atual | Explicar por que o objeto analisado é o MVP implementado. | Análise documental e técnica; ausência de pesquisa de campo; distinção entre funcionamento e impacto. | Não citar o documento interno de prioridades nem apresentar a AccioLabs como organização operacional observada. |
| 2 | Atores e controles de acesso | Identificar quem consulta, participa e organiza campanhas. | Visitante; usuário autenticado; organizador com perfil; consultas públicas e operações autorizadas. | Não confundir usuário autenticado com organizador nem criar perfis administrativos não demonstrados. |
| 3 | Campanhas físicas e virtuais | Descrever os dois fluxos de campanha existentes. | Dados comuns; local, meta e pontos de coleta para campanhas físicas; PIX ou dados bancários para campanhas virtuais. | Não atribuir à plataforma estoque, triagem, transporte, processamento, confirmação ou conciliação financeira. |
| 4 | Descoberta e participação | Explicar os controles voltados ao acesso público e ao compromisso do doador. | Listagem pública; filtros por tema e região; filtro adicional por tipo; detalhe da campanha; ingresso e cancelamento em campanhas físicas; contagem pública. | Não declarar participação em campanha virtual nem afirmar que a contagem identifica publicamente os participantes. |
| 5 | Gestão pelo organizador | Caracterizar o painel e as ações disponíveis. | Lista de campanhas próprias; status; contagem agregada de participantes; progresso de itens; edição; atualizações; conclusão, cancelamento e visualização pública. | Não chamar indicadores agregados de análise estatística avançada nem afirmar que existe lista nominal de participantes no painel. |
| 6 | Transparência e prestação de contas | Examinar identificação da organização e publicação dos resultados. | CNPJ público para perfis organizacionais; indicação de verificado ou não verificado; prazo e estado da prestação; total, resumo e evidências públicas. | Não apresentar o CNPJ como verificado apenas por ter formato válido; não afirmar sanção automática ou auditoria externa das informações prestadas. |
| 7 | Limites do controle atual | Fechar a análise com o que o MVP registra e o que permanece externo. | Transferências diretas; valores declarados pelo organizador; ausência de métricas de uso e recursos pós-MVP. | Não transformar limitações em defeitos não demonstrados nem antecipar requisitos definitivos das fases seguintes. |

Os títulos poderão ser ajustados na integração para manter a numeração global do TCC. A redação deverá ser predominantemente analítica, acompanhada por um quadro de síntese. Não se prevê a necessidade de pesquisa bibliográfica adicional para descrever o funcionamento do software; referências conceituais sobre UML e modelagem permanecem reservadas à Fase 4.

## Fluxo funcional a descrever

O fluxo atual será apresentado em prosa, sem notação de processo formal:

1. O visitante consulta campanhas disponíveis, aplica filtros e acessa seus detalhes públicos.
2. O usuário autenticado pode confirmar ou cancelar sua participação em uma campanha física ativa. A plataforma atualiza a contagem agregada exibida ao público.
3. Para criar uma campanha, o usuário autenticado configura um perfil de organizador.
4. O organizador cria uma campanha física ou virtual. A primeira exige informações de coleta e meta de itens; a segunda exige ao menos uma forma de transferência direta.
5. Durante o período permitido, o organizador acompanha o estado da campanha, edita seus dados, publica atualizações e, em campanhas físicas, registra o total corrente de itens.
6. A campanha pode ser concluída, cancelada ou encerrada conforme seu período. Estados terminais não são reabertos pelo fluxo atual.
7. Depois da conclusão, o organizador registra a prestação de contas. O resultado publicado pode conter o total arrecadado, um resumo e arquivos de evidência.

No caso de campanhas virtuais, o ato financeiro ocorre diretamente entre doador e organizador. A plataforma divulga os dados informados pelo organizador, mas não inicia a transferência, não recebe o recurso e não conhece automaticamente seu resultado. O total financeiro exibido na prestação de contas é declarado posteriormente pelo organizador.

## Matriz dos controles P0 implementados

| Funcionalidade | Controle existente no MVP | Atores e informações envolvidas | Evidências técnicas prioritárias | Delimitação que deverá aparecer no texto |
| --- | --- | --- | --- | --- |
| Campanhas físicas | Criação com título, descrição, tema, região, período, local principal, meta de itens e ao menos um ponto de coleta; acompanhamento do progresso. | Organizador; visitantes e usuários consultam os dados públicos. | Formulários de criação e edição; validação compartilhada; serviço de criação; modelos `Campaign` e `CampaignCollectionPoint`. | A plataforma organiza informações e o progresso declarado, mas não controla estoque, recebimento físico, triagem ou entrega dos itens. |
| Campanhas virtuais | Criação com ao menos uma chave PIX ou informação bancária; divulgação dos dados enquanto a campanha está ativa. | Organizador fornece os dados; doador realiza a transferência fora do sistema. | Formulário de criação; validações de campanha virtual; serviço de criação; consulta pública. | Não há processamento, confirmação, conciliação, estorno ou registro individual de transferências. Os dados de pagamento deixam de ser expostos depois da conclusão. |
| Filtros | Busca pública por tema e região, com correspondência textual sem diferenciação entre maiúsculas e minúsculas; seleção adicional do tipo de campanha. | Visitante ou usuário autenticado; categoria, região e tipo. | Rota pública de campanhas; entrada de listagem; consulta do roteador de campanhas; índices dos modelos de dados. | Filtro não equivale a recomendação, geolocalização automática ou busca por distância. |
| Ferramentas de gestão | Painel com status, quantidade de participantes, progresso de itens, edição, atualizações, ciclo de vida, prestação de contas e prévia pública; lista de campanhas próprias. | Organizador autenticado e somente campanhas vinculadas ao seu perfil. | Rotas de campanhas próprias; componente do painel; procedimentos autorizados do roteador de campanhas. | Os indicadores são operacionais e agregados. Não há evidência de análises avançadas, previsão, lista nominal de participantes ou métricas de conversão. |
| Transparência | Exibição pública do nome, tipo e CNPJ do organizador quando se trata de uma organização; distinção visual entre CNPJ verificado e não verificado; prestação de contas após a conclusão. | Organizador, organização e público; CNPJ, total final, resumo e evidências. | Perfil do organizador; validação de CNPJ; consulta pública; serviço e formulário de prestação de contas; modelos `OrganizerProfile` e `CampaignAccountability`. | Validação formal do número não equivale à verificação de identidade. A prestação é declaratória e o MVP não demonstra auditoria externa nem sanção automática por atraso. |
| Dados públicos de participação | Confirmação e cancelamento de participação em campanha física ativa; cálculo e exibição da quantidade de participações ativas. | Usuário autenticado, organizador e público; estado agregado de participação. | Componente de participação; operações `join` e `cancelParticipation`; consultas públicas e modelo `CampaignParticipant`. | O dado público é a quantidade agregada. Campanhas virtuais não registram participantes nesse fluxo. |

O quadro do texto final será derivado desta matriz, mas não incluirá caminhos de código nem o documento interno de prioridades. Título provisório: **Controles informatizados do MVP Nossa Causa**. Fonte provisória: **elaboração própria com base na análise funcional do MVP Nossa Causa (2026)**. A numeração será definida na integração para não conflitar com os quadros das demais fases.

## Controles de apoio que poderão ser mencionados

Alguns mecanismos não correspondem, isoladamente, às seis funcionalidades centrais, mas sustentam sua operação e podem ser mencionados de forma proporcional:

- autenticação e sessão para proteger ações de participação e gestão;
- exigência de perfil organizador antes da criação de campanhas;
- autorização por vínculo entre usuário, perfil organizador e campanha;
- validação compartilhada de campos e regras específicas de cada modalidade;
- estados pendente, ativo, concluído e cancelado, com restrições para edição e participação;
- encerramento conforme datas de calendário interpretadas no fuso de São Paulo;
- publicação manual de atualizações pelo organizador;
- imagem de campanha e arquivos de evidência da prestação de contas;
- paginação das listas públicas, próprias e de participações;
- preservação do envio original e do estado do prazo quando uma prestação de contas é corrigida.

Esses mecanismos só entrarão no texto se contribuírem para explicar um controle central. Detalhes de arquitetura, armazenamento de objetos, idempotência, observabilidade e limites de infraestrutura ficarão para as fases técnicas apropriadas.

## Regras funcionais que exigem redação precisa

### Campanhas e ciclo de vida

- O período da campanha usa datas de calendário no fuso `America/Sao_Paulo`.
- Uma campanha futura permanece pendente e não é exibida como campanha disponível para participação.
- A campanha aceita participação e alterações operacionais somente quando está ativa.
- O organizador pode concluir uma campanha ativa ou cancelar uma campanha pendente ou ativa.
- Campanhas concluídas ou canceladas não são reabertas pelo fluxo implementado.
- Campanhas concluídas continuam disponíveis para consulta pública; dados de pagamento deixam de ser exibidos.

### Participação e progresso

- A participação pertence somente ao fluxo de campanhas físicas.
- O usuário pode cancelar e voltar a participar enquanto a campanha permanecer ativa.
- A contagem considera participações que não foram canceladas.
- O progresso de itens é um total acumulado informado pelo organizador e pode superar a meta.
- A interface do organizador apresenta a contagem agregada, não uma relação nominal dos participantes.

### CNPJ e transparência

- O perfil de pessoa física não possui CNPJ.
- O perfil de organização exige um CNPJ formalmente válido e impede a reutilização do mesmo número em outro perfil.
- A consulta pública mostra o CNPJ e informa separadamente se ele foi verificado.
- A alteração do tipo do perfil ou do CNPJ remove o estado de verificação anterior.
- A existência de suporte interno para marcar um CNPJ como verificado não será descrita como um fluxo autônomo disponível ao usuário final.

### Prestação de contas

- A prestação de contas só pode ser enviada após a conclusão da campanha.
- O prazo atual termina às 23h59min59s do sétimo dia de calendário após a data final, no fuso de São Paulo.
- A campanha física registra total de itens; a virtual registra total monetário em reais, armazenado em centavos.
- O resumo do resultado é obrigatório; evidências em imagem ou PDF são opcionais e limitadas pelas regras do sistema.
- A prestação pode ser corrigida, mas a data do primeiro envio e a classificação original de pontualidade são preservadas.
- O público visualiza o resultado e as evidências publicados ou a informação de que a prestação ainda não foi apresentada.
- O controle identifica prestação pendente, atrasada, enviada no prazo ou enviada com atraso para o organizador. Não há evidência de bloqueio, multa, auditoria ou sanção automática.

## Fontes internas de verificação

As fontes abaixo servem à rastreabilidade do planejamento e não serão reproduzidas como citações de arquivo no texto final.

| Evidência interna | Uso na conferência |
| --- | --- |
| `apps/web/src/routes/(public)/campaigns/` | Listagem, filtros e detalhe público das campanhas. |
| `apps/web/src/routes/(app)/campaigns/` | Criação, campanhas próprias, participações, gestão e edição. |
| `apps/web/src/components/campaign/` | Formulários, painel, participação, detalhe público e prestação de contas. |
| `packages/rpc/src/routers/campaign.ts` | Consultas, autorização e regras de negócio das campanhas. |
| `packages/rpc/src/routers/organizer.ts` | Criação e alteração do perfil organizador e tratamento do CNPJ. |
| `packages/rpc/src/services/campaign/` | Criação, atualização, ciclo de vida, ativos e prestação de contas. |
| `packages/rpc/src/services/organizer-verification.ts` | Limite entre validação formal e verificação do CNPJ. |
| `packages/validation/src/campaign.ts` e `packages/validation/src/organizer.ts` | Campos obrigatórios, limites e regras específicas das modalidades. |
| `packages/database/prisma/schemas/campaign.prisma` e `packages/database/prisma/schemas/organizer.prisma` | Persistência de campanhas, participantes, prestação de contas e perfis. |
| `artifacts/page-screenshots/2026-09-05/` | Corroboração visual interna das telas existentes; eventual uso como figura será coordenado com a Fase 6. |

O snapshot técnico inicial corresponde ao commit `a8ccd058a476a3bfb692e1f56e2a0b74ed92085b`, anterior aos artefatos deste planejamento. Antes da redação, o repositório deverá ser conferido novamente. Se o comportamento tiver mudado, a análise adotará um novo recorte explícito e atualizará as partes dependentes.

## Afirmações permitidas e formulações vedadas

| Tema | Formulação segura | Formulação vedada |
| --- | --- | --- |
| Estado do produto | “O MVP implementa controles para criação, consulta, participação, gestão e prestação de contas de campanhas.” | “A plataforma resolveu o problema das campanhas informais.” |
| Campanha física | “O organizador informa meta, local e pontos de coleta, e registra o progresso acumulado.” | “A plataforma controla o estoque e a distribuição dos itens.” |
| Campanha virtual | “O sistema publica PIX ou dados bancários para transferência direta ao organizador.” | “A plataforma recebe, processa ou confirma as doações financeiras.” |
| Filtros | “A listagem permite filtrar campanhas por tema e região.” | “O sistema recomenda automaticamente as campanhas mais adequadas ao usuário.” |
| Gestão | “O painel reúne estado, contagem de participantes, progresso e ações de ciclo de vida.” | “O painel oferece estatísticas completas sobre os doadores.” |
| CNPJ | “O CNPJ de perfis organizacionais é exibido com seu estado de verificação.” | “Todo CNPJ exibido foi verificado pela plataforma.” |
| Prestação de contas | “Após a conclusão, o organizador informa o resultado e pode publicar evidências.” | “A plataforma audita o uso dos recursos e garante a veracidade da prestação.” |
| Participação | “A quantidade de participações ativas em campanhas físicas é pública.” | “Os nomes e dados pessoais dos participantes são públicos.” |
| Resultado | “As funcionalidades foram identificadas na implementação examinada.” | “As funcionalidades aumentaram a confiança, as doações ou a eficiência das campanhas.” |

## Dependências e integração

- **Fase 2:** o texto final descreve diretamente o problema de projeto e as funcionalidades, sem citar o caminho do documento interno de escopo. Os planejamentos preservam esse caminho apenas para rastreabilidade interna.
- **Fase 4:** os atores, entidades e regras identificados aqui deverão orientar os diagramas do sistema proposto, sem ampliar silenciosamente o escopo do MVP.
- **Fase 5:** a análise funcional não definirá requisitos arbitrários de equipamento ou software do usuário final.
- **Fase 6:** a lista de telas, as imagens, o padrão arquitetural e a documentação do código deverão usar o mesmo snapshot funcional. As capturas existentes serão priorizadas nessa fase para evitar duplicação.
- **Fase 7:** o prazo de prestação de contas poderá ser mencionado como regra implementada; cronogramas, treinamento, implantação e backup continuam sujeitos à distinção entre execução e planejamento.
- **Fase 8:** limitações e controles atuais poderão orientar propostas de manutenção, sem apresentar funcionalidades futuras como correções já planejadas.
- **Considerações finais:** a implementação dos controles do MVP poderá ser retomada como resultado técnico, mas não como evidência de impacto social ou adoção.

## Dúvidas e pendências

Não há pendência que impeça a conclusão desta fase. O usuário esclareceu o sentido de “sistema atual”, confirmou a implementação das funcionalidades P0 e determinou que o documento interno usado para enumerá-las não seja citado no texto destinado ao TCC.

A redação foi confrontada com as rotas, os componentes, as validações, as regras de negócio e os modelos de dados do MVP. As capturas de tela existentes foram usadas como conferência visual interna, sem serem duplicadas como figuras nesta fase. A verificação de tipos do monorepo foi executada com sucesso em 2026-09-05. Esse resultado confirma a consistência estática do código examinado, mas não prova adoção, impacto social ou eficácia do sistema.

## Sequência de execução realizada

1. Foram retomadas D-001, D-010 e D-011 e conferido o recorte do MVP implementado.
2. Foi fixado o snapshot técnico inicial e preservado o trabalho já existente no repositório.
3. Cada linha da matriz de controles foi confrontada com interface, validação, regra de negócio e persistência.
4. Foram consultadas as rotas e os componentes dos fluxos públicos e autenticados, além das capturas disponíveis, para conferir os comportamentos descritos.
5. A verificação de tipos foi executada com sucesso para os nove pacotes do monorepo.
6. Foi produzido o Quadro 2 sem caminhos internos ou referência ao documento de prioridades.
7. Foram redigidas as subseções em português brasileiro, distinguindo implementação, declaração do organizador e efeito comprovado.
8. A skill `humanizar` foi aplicada em modo de criação e perfil acadêmico; a revisão preservou as regras funcionais e reduziu detalhes técnicos que não contribuem para a análise.
9. Foram mantidas as dependências com as Fases 2, 4 e 6 e a decisão compartilhada sobre a não citação do documento interno.
10. O conteúdo destinado ao TCC foi salvo em `artifacts/texto-fase-03.md`, e o quadro de progresso foi atualizado.

## Critérios de aceite atendidos

- [x] O sistema atual é definido como o MVP implementado da Nossa Causa.
- [x] A fase não inventa um sistema legado, uma organização observada ou uma pesquisa de campo.
- [x] As seis funcionalidades P0 aparecem descritas por suas capacidades, sem citação ao documento interno de prioridades.
- [x] Cada afirmação de implementação foi confrontada com evidências de interface, regra de negócio, validação ou persistência.
- [x] Visitante, usuário autenticado e organizador possuem papéis e permissões coerentes com a aplicação.
- [x] Campanhas físicas e virtuais são distinguidas sem atribuir processamento financeiro ou controle logístico à plataforma.
- [x] Os filtros por tema e região, a contagem pública de participação e os controles do painel são descritos sem ampliação de escopo.
- [x] O CNPJ é apresentado com seu estado de verificação, sem confundir validação formal e verificação de identidade.
- [x] A prestação de contas é descrita como declaratória, com prazo e publicidade, sem alegação de auditoria ou sanção automática.
- [x] Funcionalidades posteriores ao MVP não aparecem como entregas atuais.
- [x] Implementação não é confundida com adoção, eficácia, impacto social ou validação por usuários.
- [x] O quadro possui título, fonte e menção no texto, com numeração preparada para integração.
- [x] Capturas, diagramas e inventário de telas não são duplicados indevidamente entre as Fases 3, 4 e 6.
- [x] A redação final usa português brasileiro, registro acadêmico claro e a skill `humanizar`.
- [x] Planejamento, texto final e pendências permanecem separados nos arquivos correspondentes.

## Registro da execução e revisão

Em 2026-09-05, foram conferidas as rotas, os componentes, as validações, as regras de negócio e os modelos de dados relacionados a campanhas, perfis organizadores, participação e prestação de contas. A análise restringiu as afirmações de implementação aos comportamentos identificados nesses materiais. A execução de `bunx turbo run type-check` foi concluída com êxito para os nove pacotes do monorepo.

O texto final foi redigido e revisado com a skill `humanizar`, em modo de criação e perfil acadêmico. A revisão retirou detalhes de implementação que não contribuíam para a análise funcional e preservou as limitações do MVP: não há processamento de pagamentos, controle logístico dos itens, auditoria externa das prestações de contas, notificações automáticas ou demonstração de impacto social. O documento interno de prioridades não foi citado; as funcionalidades foram descritas diretamente no texto e no Quadro 2.
