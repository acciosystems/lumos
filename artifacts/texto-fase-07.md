# 7. Implantação

Esta fase apresenta o planejamento acadêmico de implantação do MVP Nossa Causa. Ela não registra contratação de serviços, realização de treinamento, execução de backup, restauração ou disponibilização real do sistema. Vercel e Neon são targets definidos na arquitetura: o adaptador Nitro utiliza o preset da Vercel, e a configuração-alvo da Neon separa o endpoint agrupado, destinado ao runtime, do endpoint direto, destinado às migrações. O cenário a seguir organiza como esses recursos seriam preparados e validados caso o sistema viesse a ser utilizado.

## 7.1 Cronograma do projeto inteiro

O Quadro 6 reúne os marcos do desenvolvimento do grupo. O período do projeto final começa com o início de seu desenvolvimento no repositório e termina na última alteração de programação. As atividades de pesquisa permanecem separadas porque tiveram finalidades diferentes. A busca inicial verificou a viabilidade do tema; a pesquisa contínua apoiou documentos intermediários; e a filtragem final definiu as fontes que permaneceriam no TCC.

Quadro 6 — Cronograma geral do TCC e do sistema

| Período | Atividade |
| --- | --- |
| 10/02/2026 | Criação do grupo de TCC. |
| 17/02/2026 a 09/03/2026 | Definição do tema. |
| 17/02/2026 a 16/03/2026 | Busca exploratória de referências para avaliar a viabilidade do TCC. As obras dessa etapa não correspondem necessariamente às fontes do texto final. |
| 09/03/2026 a 20/06/2026 | Elaboração da versão inicial do sistema. Ela foi abandonada porque decisões estruturais seriam difíceis de modificar sem comprometer sua organização. Conceitos e a maior parte da stack tecnológica foram aproveitados no projeto final. |
| 10/03/2026 a 01/09/2026 | Pesquisa contínua de referências e elaboração de documentos intermediários solicitados pelo orientador. |
| 06/04/2026 a 07/04/2026 | Assinatura da ata de criação da equipe. |
| 05/05/2026 a 15/05/2026 | Protótipo de interface do usuário, separado da versão inicial do sistema. |
| Fim de 06/2026 | Apresentação preparatória do TCC. A data exata não foi registrada. |
| 29/07/2026 | Início do desenvolvimento do projeto final. |
| 06/08/2026 a 01/09/2026 | Filtragem final das referências destinadas ao texto do TCC. |
| 05/09/2026 | Última alteração de programação do projeto final. |
| Após o encerramento da programação | Organização textual da implantação, do manual, do treinamento e da recuperação de dados. |

Fonte: elaboração própria (2026).

O período de desenvolvimento do projeto final, portanto, estende-se de 29 de julho a 5 de setembro de 2026. A coincidência parcial entre a definição do tema, a busca exploratória e a versão inicial é mantida no quadro, pois representa trabalho paralelo e não uma sequência artificial. A mesma regra vale para a pesquisa contínua: ela não atribui uma data de consulta a cada obra nem transforma fontes intermediárias em bibliografia final. As datas de acesso das fontes efetivamente citadas correspondem às consultas realizadas.

## 7.2 Descrição da implantação

Para o TCC, implantação significa a preparação teórica de uma versão candidata do MVP e a definição das verificações que antecederiam seu uso. O recorte não inclui publicação de uma URL, ativação de contas, movimentação de dados reais ou liberação de acesso ao público.

A aplicação tem a Vercel como target de hospedagem por meio do adaptador Nitro. O PostgreSQL tem a Neon como target. Nessa configuração-alvo, `DATABASE_URL` recebe o endpoint agrupado da Neon no runtime, enquanto `DIRECT_DATABASE_URL` recebe o endpoint direto para migrações administrativas. A validação aplica essa distinção aos hostnames da Neon, mas preserva a compatibilidade com outras URLs PostgreSQL em ambientes que não usam esse fornecedor. O endpoint agrupado utiliza PgBouncer e atende melhor a aplicações serverless com muitas conexões breves; tarefas administrativas devem usar a conexão direta (NEON, s.d.a).

O cenário prevê um responsável técnico pelo projeto, representantes da equipe que fariam a validação funcional e um representante de operação ou negócio para avaliar a compreensão dos fluxos. Esses são papéis planejados, não pessoas designadas. O esforço previsto é de 59 horas, distribuído entre preparação, revisão de dados, configuração, validação, treinamento simulado, observação teórica e encerramento documental. A decisão de avançar de uma etapa para a seguinte dependeria de critérios de aceite; qualquer falha que afetasse autenticação, integridade dos dados ou criação e consulta de campanhas exigiria interrupção e retorno à etapa anterior.

## 7.3 Cronograma individual da implantação

O Quadro 7 adapta o cronograma operacional existente ao escopo acadêmico. Cada etapa representa uma atividade que seria necessária antes de uma eventual disponibilização do sistema, sem afirmar que ela foi realizada.

Quadro 7 — Cronograma individual teórico de implantação

| Etapa | Atividade planejada | Tempo | Dependência e critério de conclusão |
| --- | --- | ---: | --- |
| 1 | Delimitar o snapshot do MVP, os fluxos a validar e os critérios de adiamento. | 6 h | Início do cenário; checklist e escopo documentados. |
| 2 | Conferir os targets Vercel e Neon, as versões declaradas e os acessos mínimos à infraestrutura. | 6 h | Etapa 1; parâmetros sem segredos e responsabilidades registrados. |
| 3 | Revisar a conexão agrupada para o runtime, a conexão direta para migrações, o estado do schema e a estratégia de recuperação. | 5 h | Etapa 2; procedimento teórico de banco revisado. |
| 4 | Conferir variáveis e integrações de autenticação, e-mail, armazenamento de objetos, logging e aplicação, sem expor credenciais. | 6 h | Etapa 2; inventário de configurações concluído. |
| 5 | Gerar a versão candidata com o lockfile, executar as verificações de qualidade previstas e auditar as dependências. | 5 h | Etapas 3 e 4; versão identificada, auditoria concluída e impedimentos registrados. |
| 6 | Validar, com dados de demonstração, acesso, recuperação de conta, configuração inicial, consulta, filtros, detalhes, participação e cancelamento de participação, perfil organizador e campanhas física e virtual. | 6 h | Etapa 5; roteiro de validação preenchido. |
| 7 | Preparar o primeiro encontro (3 h), realizá-lo conforme o plano de treinamento (2 h) e registrar dúvidas para revisão do material. | 5 h | Manual disponível e Etapa 6 concluída. |
| 8 | Realizar o segundo encontro conforme o plano de treinamento (2 h) e, depois dele, revisar o procedimento de recuperação e consolidar o resultado da simulação de adiamento realizada no encontro (2 h). | 4 h | Etapa 7; critérios de assimilação e registro técnico da simulação consolidados. |
| 9 | Executar uma verificação final teórica do checklist e das condições de retorno. | 6 h | Etapas 6 a 8; nenhuma pendência crítica sem tratamento planejado. |
| 10 | Observar o cenário de forma intensiva, classificar ocorrências hipotéticas e revisar o material de suporte. | 4 h | Etapa 9; roteiro de acompanhamento definido. |
| 11 | Consolidar documentação, pendências e lições para uma futura operação. | 6 h | Etapa 10; registro de encerramento preparado. |

Fonte: elaboração própria (2026).

As etapas totalizam 59 horas. Migrações Prisma seriam avaliadas exclusivamente com a URL direta da Neon. A URL agrupada, identificada pelo hostname com `-pooler`, permaneceria reservada ao runtime. O ambiente de variáveis previsto é o Doppler; segredos, tokens, URLs de conexão e dados de contas não devem aparecer em checklist, manual ou apresentação.

Se a validação identificasse uma falha crítica, o procedimento previsto seria suspender a transição para a próxima etapa, registrar o impacto, preservar as evidências seguras e restaurar a versão ou a base de dados somente por procedimento previamente revisado. A etapa seguinte só seria retomada após repetir os testes afetados. Como se trata de planejamento, não há ocorrência, registro de incidente ou retorno executado a relatar.

## 7.4 Descrição do treinamento

O treinamento foi planejado para representantes da equipe interna, com condução do responsável técnico e participação de um representante de operação ou negócio. A carga horária é de quatro horas, organizada em dois encontros de duas horas. O material principal é o Manual do Usuário, que descreve os fluxos disponíveis no snapshot do MVP. A existência do manual não comprova que ele tenha sido entregue ou utilizado em encontro real.

No primeiro encontro, o conteúdo previsto abrange o propósito da plataforma, o acesso e a manutenção da conta, a consulta e os filtros de campanhas, além da criação de campanhas física e virtual. No segundo, o grupo revisaria dúvidas, executaria um roteiro de validação funcional, identificaria informações úteis para relatar um incidente e analisaria um cenário de adiamento. O treinamento cobre esses fluxos selecionados; participação, administração de campanhas e prestação de contas permanecem documentadas no manual para consulta. Não há processamento de pagamento dentro da plataforma: em campanhas virtuais, a pessoa organizadora informa seus próprios dados de recebimento e a transação ocorre fora do sistema.

A atividade prática empregaria contas e campanhas de demonstração. Credenciais reais, tokens, chaves de conexão, dados pessoais e dados bancários não poderiam ser usados. O treinamento seria considerado apto ao encerramento quando os participantes conseguissem localizar uma campanha, distinguir os papéis de visitante, participante e organizador, criar campanhas de demonstração nas duas modalidades e registrar uma ocorrência com fluxo, impacto e evidência. O representante de operação ou negócio também deveria registrar o aceite planejado. A realização desses critérios é futura e não é afirmada nesta fase.

## 7.5 Cronograma do treinamento

Quadro 8 — Cronograma teórico do treinamento

| Sequência | Atividade | Duração | Participantes e material | Critério previsto |
| --- | --- | ---: | --- | --- |
| Preparação | Revisar o manual, criar dados de demonstração e separar o roteiro de exercícios. | Antes dos encontros | Responsável técnico; manual e roteiro. | Materiais compatíveis com o snapshot. |
| Encontro 1 | Acesso, conta, consulta, filtros e criação das campanhas física e virtual. | 2 h | Responsável técnico e equipe interna; manual. | Exercícios executados com dados de demonstração. |
| Intervalo de revisão | Consolidar dúvidas e ajustar apenas materiais ou defeitos críticos identificados no roteiro. | Entre encontros | Responsável técnico. | Pendências classificadas. |
| Encontro 2 | Retomada, visão dos componentes, validação operacional, atendimento inicial e simulação de adiamento. | 2 h | Responsável técnico, equipe interna e representante de operação; manual e checklist. | Critérios de assimilação revisados. |
| Reforço e acompanhamento | Retomar itens não assimilados e registrar melhorias do material, se necessário. | Condicional | Papéis do treinamento; manual e registro de dúvidas. | Pendências encaminhadas. |

Fonte: elaboração própria (2026).

As quatro horas referem-se aos dois encontros. A preparação, o intervalo de revisão e o reforço são etapas de organização, sem execução comprovada nesta fase. O recorte de uma hora de retomada e validação operacional permanece como parte do segundo encontro, e não como um terceiro treinamento independente.

## 7.6 Segurança

Os controles do MVP combinam recursos implementados no código, targets de infraestrutura e práticas que permanecem planejadas. A separação evita apresentar uma configuração de fornecedor ou um procedimento de operação como se fosse funcionalidade já verificada na aplicação.

| Camada | Controle identificado | Estado no recorte |
| --- | --- | --- |
| Aplicação | Validação compartilhada, autorização no servidor, tratamento de sessões, chaves de acesso, verificação de e-mail e limitação de tentativas de autenticação. | Implementado e conferido no repositório. |
| Credenciais | Senhas por e-mail e senha, recuperação de acesso e consulta de senhas comprometidas por prefixo. | Implementado e conferido no repositório. |
| Configuração | Variáveis validadas para secret de autenticação, URL pública, conexões Neon e integrações. | Implementado; o preenchimento de valores em ambiente externo é planejado. |
| Dados e operação | Menor privilégio, controle de acesso a segredos, cópias lógicas, restauração isolada e revisão de incidentes. | Planejado para o cenário acadêmico. |

O código valida dados nas fronteiras de entrada e realiza as operações de campanhas por procedimentos autorizados no servidor. Essa divisão é relevante porque controles presentes apenas na interface não substituem a validação no lado protegido (OWASP, s.d.a; OWASP, s.d.b). O documento de limitação de tentativas também registra regras específicas para entrada, cadastro, recuperação, verificação de e-mail e chaves de acesso.

### 7.6.1 Sistema: senha e criptografia

O pacote de autenticação usa Better Auth com adaptador Prisma para PostgreSQL. Não há função de hash de senha customizada configurada no projeto. Nesse contexto, aplica-se o comportamento padrão documentado pelo Better Auth: o algoritmo `scrypt` produz o hash de senha armazenado na conta de credencial (BETTER AUTH, s.d.). Hash não é criptografia reversível: o primeiro serve à verificação de senha sem recuperar o valor original, enquanto a segunda permite recuperar o dado com a chave adequada (OWASP, s.d.c; OWASP, s.d.d).

O código também calcula SHA-1 apenas para consultar o serviço de senhas comprometidas pelo modelo de prefixo. Ele envia os cinco primeiros caracteres do hash à API e compara localmente o sufixo retornado. Esse SHA-1 não é o mecanismo de armazenamento da senha e não deve ser descrito como tal. Quando o serviço responde que a senha foi exposta, o cadastro, a alteração ou a redefinição é interrompida. Se a consulta externa ficar indisponível, a falha é registrada sem substituir o mecanismo principal de hash.

As limitações por endereço IP e rota reduzem tentativas repetidas de autenticação. O projeto usa armazenamento no banco para esses contadores e configura faixas mais restritivas para cadastro, redefinição de senha, verificação de e-mail e operações de chave de acesso. A confirmação de e-mail é exigida para o fluxo de e-mail e senha; sessões, chaves de acesso e contas vinculadas são persistidas nas tabelas de autenticação.

O `BETTER_AUTH_SECRET` é obrigatório e validado com comprimento mínimo de 32 caracteres antes de a aplicação ser inicializada. No cenário planejado, esse e os demais segredos ficariam no Doppler, sob acesso mínimo necessário, e nunca em commits, capturas ou materiais de treinamento. Não se declara nesta fase criptografia em repouso oferecida por Vercel, Neon ou armazenamento de objetos, pois sua garantia depende da configuração e da documentação vigente dos fornecedores.

### 7.6.2 Backup: planejamento, estratégias e execução

O planejamento de recuperação considera a Neon como fornecedora alvo do PostgreSQL. Ele não pressupõe plano contratado, janela de retenção, snapshot automático ou restauração pontual disponível. A documentação da Neon informa que o pooling utiliza PgBouncer e que o histórico de alterações pode viabilizar recuperação pontual dentro da janela configurada; esse recurso só poderia ser adotado após a conferência da configuração efetivamente disponível (NEON, s.d.a; NEON, 2024). O planejamento de contingência também requer identificar prioridades, estratégias de recuperação, testes e manutenção do procedimento (NIST, 2010).

O escopo de recuperação é separado em três grupos: dados PostgreSQL, arquivos em armazenamento de objetos e configurações. O banco contém contas, sessões, perfis, campanhas, participações, atualizações, prestações de contas e metadados de arquivos. Imagens, avatares e evidências armazenados fora do PostgreSQL exigem cópia independente. Essa cópia seria acompanhada por um manifesto com a chave do objeto, a relação com o registro do banco, o tamanho e o checksum do arquivo. Configurações não sensíveis seriam mantidas em inventário versionado. Segredos do Doppler não seriam copiados para o backup do banco nem para esse inventário: em caso de perda, o responsável precisaria revogar ou rotacionar as credenciais afetadas, emitir novos valores nos serviços de origem e preencher novamente as variáveis antes da validação da aplicação.

Para o cenário acadêmico, propõem-se RPO de até 24 horas para as cópias independentes do banco e dos objetos e RTO de até 4 horas após a disponibilidade dos recursos e das credenciais administrativas. Esses objetivos não abrangem segredos perdidos, que dependem de revogação e nova emissão pelos serviços responsáveis. As metas pertencem ao plano e não representam medições obtidas no projeto. O procedimento prevê cópias diárias com retenção mínima de 30 dias. Antes de migrações, o responsável técnico também prepararia uma cópia lógica com a conexão direta da Neon e uma cópia dos objetos relacionados, mantidas até o fim da retenção. As cópias ficariam fora dos serviços de origem, sob acesso restrito. Essa separação reduz a dependência exclusiva de mecanismos gerenciados por um único fornecedor.

O procedimento de restauração previsto é o seguinte:

1. suspender a alteração que causou o problema e registrar horário, impacto e versão envolvida;
2. identificar se o evento afeta dados do PostgreSQL, objetos armazenados, configurações ou uma combinação desses grupos;
3. selecionar a cópia lógica e, quando houver objetos afetados, a cópia correspondente pelo manifesto; se estiver disponível e confirmado, um ponto de recuperação da Neon poderá substituir a cópia lógica dentro da janela configurada;
4. restaurar primeiro em ambiente isolado, usando conexão administrativa direta e um namespace isolado para os objetos; reaplicar configurações não sensíveis do inventário e recriar os segredos necessários antes de iniciar a aplicação;
5. conferir schema, contagens, relações essenciais, autenticação e fluxos de campanha com dados de demonstração; para os objetos, comparar chaves, relações e checksums com o manifesto; para as configurações, conferir a presença das variáveis sem registrar seus valores;
6. somente após a validação, planejar o retorno do ambiente alvo e repetir o roteiro funcional afetado;
7. registrar a causa, o ponto recuperado, as limitações observadas e as ações de prevenção.

O plano prevê um teste periódico de restauração isolada e revisão após alterações de schema, mas nenhum backup, restauração ou teste é declarado como executado. Em uma adoção futura, a equipe deverá confirmar a política vigente da Neon, a retenção disponível, os custos de cópias externas e a compatibilidade do backup lógico com a versão PostgreSQL escolhida.
