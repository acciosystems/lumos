# FASE 4 — PROJETO LÓGICO: SISTEMA PROPOSTO

Esta fase apresenta o projeto lógico da Nossa Causa conforme o recorte do MVP analisado anteriormente. O objetivo é mostrar, de forma complementar, como as pessoas interagem com a plataforma, como as responsabilidades são organizadas e quais informações precisam ser relacionadas. Os diagramas concentram-se nos fluxos centrais já implementados; processamento de pagamentos, notificações automáticas, reputação, denúncias e recompensas são discutidos no tópico 4.6 como possibilidades de evolução.

## 4.1 UML

UML, sigla de *Unified Modeling Language*, é uma linguagem de modelagem usada para representar partes de um sistema por meio de diagramas. Cada diagrama simplifica o sistema para responder a uma pergunta diferente. Um pode mostrar quem realiza determinada ação; outro, como os blocos da aplicação se organizam; um terceiro, quais informações se relacionam (OBJECT MANAGEMENT GROUP, 2017, cláusula 1, p. 1).

Nesta fase, a UML orienta a representação das interações dos usuários e da organização lógica da aplicação. O Diagrama Entidade-Relacionamento complementa essas visões ao tratar das informações registradas. Juntos, os modelos permitem examinar a Nossa Causa sem depender de detalhes de programação ou de telas específicas.

Os diagramas adotam o mesmo escopo funcional do MVP. A modalidade virtual utiliza dados de pagamento fornecidos pelo organizador e preserva a transferência direta entre as partes. A participação registrada pertence às campanhas físicas, e a prestação de contas torna públicos os resultados e as evidências declarados pelo organizador.

## 4.2 Diagrama de caso de uso

Na UML, um caso de uso especifica um conjunto de comportamentos oferecidos pelo sistema que produz resultado observável para seus atores. O ator representa o papel de uma pessoa ou de outro sistema que interage com o sujeito modelado, e não uma pessoa determinada (OBJECT MANAGEMENT GROUP, 2017, seção 18.1). Nesta modelagem, os atores são visitante, usuário autenticado e organizador. Cada ação aparece separadamente para deixar claro quem pode realizá-la.

O visitante pode criar uma conta, entrar no sistema e consultar as informações públicas das campanhas. O usuário autenticado mantém esse acesso público e pode administrar a própria conta, registrar ou cancelar sua participação em campanhas físicas ativas e criar ou atualizar o perfil de organizador. Depois de manter esse perfil, ele passa a atuar também como organizador. Nessa condição, cria e administra campanhas, publica atualizações e apresenta a prestação de contas após a conclusão.

Para representar esses papéis em Mermaid, a figura usa um fluxograma com os atores fora do limite da plataforma e as ações dentro dele. Essa adaptação preserva a leitura central de um diagrama de caso de uso: identificar quem interage com o sistema e para qual finalidade.

Figura 1 — Casos de uso da plataforma Nossa Causa

Fonte: elaboração própria (2026).

A Figura 1 separa as consultas públicas das operações que exigem acesso autenticado e mostra que o organizador preserva as ações disponíveis ao usuário autenticado. O perfil de organizador é mantido pelo usuário autenticado, pois sua criação antecede a atuação como organizador. O registro de progresso de itens aparece somente entre as atividades do organizador, pois se aplica às campanhas físicas. A conclusão e o cancelamento aparecem como ações distintas, e somente a conclusão habilita a prestação de contas. A contribuição em campanha virtual não constitui um caso de uso de pagamento: o sistema apenas apresenta as informações necessárias para que a transferência seja feita diretamente ao organizador.

## 4.3 Diagrama de implementação

Na UML, as construções de implantação descrevem a arquitetura de execução e a atribuição de artefatos de software a elementos do sistema. Elas também representam relações entre elementos lógicos ou físicos e ativos de tecnologia da informação (OBJECT MANAGEMENT GROUP, 2017, seções 19.1 e 19.2). Neste trabalho, a expressão “diagrama de implementação” designa uma visão lógica, elaborada para o TCC, das responsabilidades entre os blocos principais. Ela não pretende reproduzir integralmente a notação de implantação da UML nem descrever cada tecnologia empregada. Seu propósito é tornar visível o caminho percorrido por uma ação: a pessoa usa a aplicação no navegador, a aplicação verifica o acesso e os dados informados, aplica as regras da plataforma e registra ou consulta as informações necessárias.

A interface web concentra as páginas, os formulários e as consultas. Os serviços da aplicação aplicam permissões e regras das campanhas, dos perfis e das contas. A autenticação identifica os usuários nas ações restritas. A validação confere os dados antes do uso. O banco de dados preserva as informações da plataforma, enquanto o armazenamento de arquivos guarda imagens de campanhas e evidências da prestação de contas. O serviço de e-mail apoia a verificação e a recuperação de acesso à conta.

Figura 2 — Organização lógica da implementação da Nossa Causa

Fonte: elaboração própria (2026).

A Figura 2 mostra que a interface não decide sozinha as regras sensíveis do sistema. Em aplicações web, os controles de autorização não devem depender do cliente e precisam verificar as permissões em cada requisição (OWASP, s.d.b). Na Nossa Causa, a conferência técnica do MVP identificou que as regras e permissões são aplicadas antes da gravação dos dados. Essa separação concentra as condições de autenticação, o vínculo entre campanha e organizador e a distinção entre as duas modalidades de campanha em operações protegidas.

O diagrama também apresenta as integrações escolhidas para o MVP: armazenamento de arquivos e envio de mensagens ligadas à conta. A transferência virtual ocorre diretamente entre doador e organizador. Processadores de pagamento e notificações de campanha permanecem reservados à evolução da arquitetura.

## 4.4 DER

O Diagrama Entidade-Relacionamento, ou DER, descreve as informações relevantes para o sistema e os vínculos entre elas. No modelo entidade-relacionamento, uma entidade é algo que pode ser distinguido, um relacionamento é uma associação entre entidades e os atributos expressam as informações registradas sobre esses elementos (CHEN, 1976, p. 10-12). Assim, uma entidade pode representar algo sobre o qual a plataforma precisa guardar dados, como uma campanha ou um perfil de organizador. Seus atributos descrevem características desse elemento. Os relacionamentos mostram como uma entidade se conecta a outra.

Na Figura 3, as cardinalidades indicam quantas ocorrências de uma entidade podem se associar a outra. A notação de pé-de-galinha adotada pelo Mermaid representa essas quantidades nos marcadores das extremidades das relações (MERMAID, s.d.b). Assim, um perfil de organizador pode estar associado a várias campanhas, enquanto uma campanha pode ter apenas uma prestação de contas. Essa leitura ajuda a compreender quais registros dependem de outros e quais informações permanecem independentes.

Figura 3 — Diagrama Entidade-Relacionamento da Nossa Causa

Fonte: elaboração própria (2026).

A Figura 3 apresenta o usuário como origem de dois vínculos principais: a criação de um perfil de organizador e a participação em campanhas físicas. A entidade campanha reúne seu período, tema, região e estado, além dos dados que distinguem as modalidades. O perfil organiza as campanhas, que podem possuir pontos de coleta, atualizações, arquivos e, após a conclusão, uma prestação de contas. Os arquivos incluem tanto imagens da campanha quanto evidências vinculadas à prestação.

As modalidades física e virtual compartilham a entidade campanha, mas usam informações próprias. A campanha física registra local, meta de itens e pontos de coleta. A virtual divulga PIX ou dados bancários. Na prestação de contas, a campanha física informa o total de itens; a virtual, o total monetário declarado. O modelo não possui uma entidade para transações individuais, porque o MVP não processa ou registra transferências financeiras.

O DER prioriza as entidades ligadas ao domínio das campanhas. Registros técnicos de sessão, mecanismos de segurança e controles temporários de arquivos não aparecem na figura, pois não alteram a compreensão dos relacionamentos apresentados nesta fase.

## 4.5 Dicionário de dados

O dicionário de dados detalha as 17 tabelas persistidas pela aplicação. Diferentemente do DER conceitual, este inventário inclui as estruturas técnicas de autenticação, controle de requisições, idempotência e gerenciamento de arquivos. As propriedades usadas pelo Prisma apenas para representar relacionamentos não aparecem como campos, pois não criam colunas próprias no banco de dados.

Na coluna Campo, `@` identifica a chave primária e `#` indica uma chave estrangeira. Os campos sem esses papéis não recebem prefixo. Os nomes foram convertidos integralmente para maiúsculas, enquanto os tipos preservam a definição física encontrada no SQL do PostgreSQL. O tamanho dos campos `TEXT` é apresentado como variável quando não existe limite específico. Nos campos com restrição explícita, a coluna informa o número máximo de caracteres. Tipos enumerados mantêm o nome definido no banco, e seus valores possíveis aparecem na descrição.

Tabela 1 — Dicionário de dados da tabela USERS

| Campo | Descrição | Tipo | Tamanho |
| --- | --- | --- | --- |
| @ID | Identificador único do usuário. | TEXT | Variável |
| NAME | Nome do usuário. | TEXT | Variável |
| EMAIL | Endereço de e-mail único associado à conta. | TEXT | Variável |
| EMAILVERIFIED | Indica se o endereço de e-mail foi verificado. | BOOLEAN | 1 byte |
| IMAGE | Referência da imagem de perfil, quando cadastrada. | TEXT | Variável |
| CREATEDAT | Data e hora de criação da conta. | TIMESTAMP(3) | 8 bytes |
| UPDATEDAT | Data e hora da última atualização da conta. | TIMESTAMP(3) | 8 bytes |
| USERNAME | Nome de usuário único empregado na identificação da conta. | TEXT | Variável |
| DISPLAYUSERNAME | Forma de exibição do nome de usuário, quando definida. | TEXT | Variável |

Fonte: elaboração própria (2026).

Tabela 2 — Dicionário de dados da tabela SESSIONS

| Campo | Descrição | Tipo | Tamanho |
| --- | --- | --- | --- |
| @ID | Identificador único da sessão. | TEXT | Variável |
| EXPIRESAT | Data e hora de expiração da sessão. | TIMESTAMP(3) | 8 bytes |
| TOKEN | Token único que identifica a sessão. | TEXT | Variável |
| CREATEDAT | Data e hora de criação da sessão. | TIMESTAMP(3) | 8 bytes |
| UPDATEDAT | Data e hora da última atualização da sessão. | TIMESTAMP(3) | 8 bytes |
| IPADDRESS | Endereço IP associado à sessão, quando disponível. | TEXT | Variável |
| USERAGENT | Identificação do navegador ou cliente associado à sessão, quando disponível. | TEXT | Variável |
| #USERID | Identificador do usuário ao qual a sessão pertence. | TEXT | Variável |

Fonte: elaboração própria (2026).

Tabela 3 — Dicionário de dados da tabela ACCOUNTS

| Campo | Descrição | Tipo | Tamanho |
| --- | --- | --- | --- |
| @ID | Identificador único da conta de autenticação. | TEXT | Variável |
| ACCOUNTID | Identificador da conta no provedor de autenticação. | TEXT | Variável |
| PROVIDERID | Identificador do provedor de autenticação. | TEXT | Variável |
| #USERID | Identificador do usuário vinculado à conta de autenticação. | TEXT | Variável |
| ACCESSTOKEN | Token de acesso fornecido pelo provedor, quando aplicável. | TEXT | Variável |
| REFRESHTOKEN | Token usado para renovar o acesso, quando aplicável. | TEXT | Variável |
| IDTOKEN | Token de identidade fornecido pelo provedor, quando aplicável. | TEXT | Variável |
| ACCESSTOKENEXPIRESAT | Data e hora de expiração do token de acesso, quando definida. | TIMESTAMP(3) | 8 bytes |
| REFRESHTOKENEXPIRESAT | Data e hora de expiração do token de renovação, quando definida. | TIMESTAMP(3) | 8 bytes |
| SCOPE | Escopos de acesso concedidos pelo provedor, quando aplicáveis. | TEXT | Variável |
| PASSWORD | Representação protegida da senha, quando a conta usa autenticação por senha. | TEXT | Variável |
| CREATEDAT | Data e hora de criação do vínculo de autenticação. | TIMESTAMP(3) | 8 bytes |
| UPDATEDAT | Data e hora da última atualização do vínculo de autenticação. | TIMESTAMP(3) | 8 bytes |

Fonte: elaboração própria (2026).

Tabela 4 — Dicionário de dados da tabela VERIFICATIONS

| Campo | Descrição | Tipo | Tamanho |
| --- | --- | --- | --- |
| @ID | Identificador único da verificação. | TEXT | Variável |
| IDENTIFIER | Identificador do destinatário ou objeto submetido à verificação. | TEXT | Variável |
| VALUE | Valor utilizado no processo de verificação. | TEXT | Variável |
| EXPIRESAT | Data e hora de expiração da verificação. | TIMESTAMP(3) | 8 bytes |
| CREATEDAT | Data e hora de criação da verificação. | TIMESTAMP(3) | 8 bytes |
| UPDATEDAT | Data e hora da última atualização da verificação. | TIMESTAMP(3) | 8 bytes |

Fonte: elaboração própria (2026).

Tabela 5 — Dicionário de dados da tabela RATE_LIMITS

| Campo | Descrição | Tipo | Tamanho |
| --- | --- | --- | --- |
| @ID | Identificador único do controle de requisições. | TEXT | Variável |
| KEY | Chave única usada para agrupar as requisições controladas. | TEXT | Variável |
| COUNT | Quantidade de requisições registrada no período de controle. | INTEGER | 4 bytes |
| LASTREQUEST | Instante da última requisição, representado numericamente. | BIGINT | 8 bytes |

Fonte: elaboração própria (2026).

Tabela 6 — Dicionário de dados da tabela PASSKEYS

| Campo | Descrição | Tipo | Tamanho |
| --- | --- | --- | --- |
| @ID | Identificador único da credencial passkey. | TEXT | Variável |
| NAME | Nome atribuído à credencial, quando informado. | TEXT | Variável |
| PUBLICKEY | Chave pública associada à credencial. | TEXT | Variável |
| #USERID | Identificador do usuário proprietário da credencial. | TEXT | Variável |
| CREDENTIALID | Identificador da credencial no mecanismo de autenticação. | TEXT | Variável |
| COUNTER | Contador de uso da credencial. | INTEGER | 4 bytes |
| DEVICETYPE | Tipo de dispositivo associado à credencial. | TEXT | Variável |
| BACKEDUP | Indica se a credencial possui cópia de segurança. | BOOLEAN | 1 byte |
| TRANSPORTS | Meios de transporte aceitos pela credencial, quando informados. | TEXT | Variável |
| CREATEDAT | Data e hora de criação da credencial, quando registrada. | TIMESTAMP(3) | 8 bytes |
| AAGUID | Identificador do modelo do autenticador, quando informado. | TEXT | Variável |

Fonte: elaboração própria (2026).

Tabela 7 — Dicionário de dados da tabela ORGANIZER_PROFILES

| Campo | Descrição | Tipo | Tamanho |
| --- | --- | --- | --- |
| @ID | Identificador único do perfil de organizador. | TEXT | Variável |
| #USERID | Identificador único do usuário proprietário do perfil. | TEXT | Variável |
| TYPE | Tipo do organizador. Valores possíveis: `INDIVIDUAL` e `ORGANIZATION`. | OrganizerType | 4 bytes |
| DISPLAYNAME | Nome público do organizador. | TEXT | Até 120 caracteres |
| BIO | Apresentação do organizador, quando informada. | TEXT | Até 1.000 caracteres |
| WEBSITEURL | Endereço do site do organizador, quando informado. | TEXT | Até 2.048 caracteres |
| CNPJ | CNPJ único do organizador institucional, quando aplicável. | TEXT | 14 caracteres |
| CNPJVERIFIED | Indica se o CNPJ foi verificado. | BOOLEAN | 1 byte |
| CREATEDAT | Data e hora de criação do perfil. | TIMESTAMP(3) | 8 bytes |
| UPDATEDAT | Data e hora da última atualização do perfil. | TIMESTAMP(3) | 8 bytes |

Fonte: elaboração própria (2026).

Tabela 8 — Dicionário de dados da tabela CAMPAIGNS

| Campo | Descrição | Tipo | Tamanho |
| --- | --- | --- | --- |
| @ID | Identificador único da campanha. | TEXT | Variável |
| #ORGANIZERPROFILEID | Identificador do perfil responsável pela campanha. | TEXT | Variável |
| TITLE | Título da campanha. | TEXT | Até 120 caracteres |
| DESCRIPTION | Descrição da campanha. | TEXT | Até 4.000 caracteres |
| STATUS | Estado da campanha. Valores possíveis: `PENDING`, `ACTIVE`, `COMPLETED` e `CANCELLED`. | CampaignStatus | 4 bytes |
| TYPE | Modalidade da campanha. Valores possíveis: `PHYSICAL` e `VIRTUAL`. | CampaignType | 4 bytes |
| CATEGORY | Categoria usada na classificação da campanha. | TEXT | Até 80 caracteres |
| REGION | Região atendida pela campanha. | TEXT | Até 120 caracteres |
| STARTDATE | Data de início da campanha. | DATE | 4 bytes |
| ENDDATE | Data de término da campanha. | DATE | 4 bytes |
| LOCATION | Local geral da campanha física, quando aplicável. | TEXT | Até 200 caracteres |
| TARGETITEMS | Meta de itens da campanha física, quando aplicável. | INTEGER | 4 bytes |
| CURRENTITEMS | Quantidade atual de itens da campanha física, quando aplicável. | INTEGER | 4 bytes |
| PIXKEY | Chave PIX divulgada pela campanha virtual, quando aplicável. | TEXT | Até 100 caracteres |
| BANKACCOUNTINFO | Dados bancários divulgados pela campanha virtual, quando aplicáveis. | TEXT | Até 1.000 caracteres |
| CREATEDAT | Data e hora de criação da campanha. | TIMESTAMP(3) | 8 bytes |
| UPDATEDAT | Data e hora da última atualização da campanha. | TIMESTAMP(3) | 8 bytes |
| COMPLETEDAT | Data e hora de conclusão da campanha, quando concluída. | TIMESTAMP(3) | 8 bytes |
| CANCELLEDAT | Data e hora de cancelamento da campanha, quando cancelada. | TIMESTAMP(3) | 8 bytes |

Fonte: elaboração própria (2026).

Tabela 9 — Dicionário de dados da tabela CAMPAIGN_COLLECTION_POINTS

| Campo | Descrição | Tipo | Tamanho |
| --- | --- | --- | --- |
| @ID | Identificador único do ponto de coleta. | TEXT | Variável |
| #CAMPAIGNID | Identificador da campanha à qual o ponto de coleta pertence. | TEXT | Variável |
| NAME | Nome do ponto de coleta. | TEXT | Até 120 caracteres |
| ADDRESS | Endereço do ponto de coleta. | TEXT | Até 255 caracteres |
| CITY | Cidade do ponto de coleta. | TEXT | Até 120 caracteres |
| STATE | Estado do ponto de coleta. | TEXT | Até 60 caracteres |
| ZIPCODE | Código postal do ponto de coleta. | TEXT | Até 20 caracteres |
| LAT | Latitude do ponto de coleta, quando disponível. | DOUBLE PRECISION | 8 bytes |
| LON | Longitude do ponto de coleta, quando disponível. | DOUBLE PRECISION | 8 bytes |
| INSTRUCTIONS | Instruções adicionais para a entrega, quando informadas. | TEXT | Até 500 caracteres |
| CREATEDAT | Data e hora de criação do ponto de coleta. | TIMESTAMP(3) | 8 bytes |
| UPDATEDAT | Data e hora da última atualização do ponto de coleta. | TIMESTAMP(3) | 8 bytes |

Fonte: elaboração própria (2026).

Tabela 10 — Dicionário de dados da tabela CAMPAIGN_PARTICIPANTS

| Campo | Descrição | Tipo | Tamanho |
| --- | --- | --- | --- |
| @ID | Identificador único da participação. | TEXT | Variável |
| #CAMPAIGNID | Identificador da campanha associada à participação. | TEXT | Variável |
| #USERID | Identificador do usuário participante. | TEXT | Variável |
| CONFIRMEDAT | Data e hora de confirmação da participação, quando confirmada. | TIMESTAMP(3) | 8 bytes |
| CANCELLEDAT | Data e hora de cancelamento da participação, quando cancelada. | TIMESTAMP(3) | 8 bytes |
| CREATEDAT | Data e hora de criação da participação. | TIMESTAMP(3) | 8 bytes |
| UPDATEDAT | Data e hora da última atualização da participação. | TIMESTAMP(3) | 8 bytes |

Fonte: elaboração própria (2026).

Tabela 11 — Dicionário de dados da tabela CAMPAIGN_UPDATES

| Campo | Descrição | Tipo | Tamanho |
| --- | --- | --- | --- |
| @ID | Identificador único da atualização. | TEXT | Variável |
| #CAMPAIGNID | Identificador da campanha atualizada. | TEXT | Variável |
| #AUTHORID | Identificador do usuário que publicou a atualização. | TEXT | Variável |
| MESSAGE | Conteúdo da atualização publicada. | TEXT | Até 2.000 caracteres |
| PUBLISHEDAT | Data e hora de publicação da atualização. | TIMESTAMP(3) | 8 bytes |

Fonte: elaboração própria (2026).

Tabela 12 — Dicionário de dados da tabela CAMPAIGN_IDEMPOTENCY_RECORDS

| Campo | Descrição | Tipo | Tamanho |
| --- | --- | --- | --- |
| @ID | Identificador único do registro de idempotência. | TEXT | Variável |
| OPERATIONKEY | Chave única enviada para identificar uma operação. | TEXT | Variável |
| REQUESTFINGERPRINT | Impressão digital usada para conferir o conteúdo da requisição. | TEXT | Variável |
| KIND | Operação protegida pelo registro. Valores possíveis: `CREATE` e `PUBLISH_UPDATE`. | CampaignOperationKind | 4 bytes |
| #ACTORID | Identificador do usuário que iniciou a operação. | TEXT | Variável |
| RESOURCEID | Identificador reservado para o recurso produzido pela operação. | TEXT | Variável |
| EXPIRESAT | Data e hora de expiração do registro. | TIMESTAMP(3) | 8 bytes |
| CREATEDAT | Data e hora de criação do registro. | TIMESTAMP(3) | 8 bytes |

Fonte: elaboração própria (2026).

Tabela 13 — Dicionário de dados da tabela CAMPAIGN_ACCOUNTABILITIES

| Campo | Descrição | Tipo | Tamanho |
| --- | --- | --- | --- |
| @ID | Identificador único da prestação de contas. | TEXT | Variável |
| #CAMPAIGNID | Identificador único da campanha à qual a prestação se refere. | TEXT | Variável |
| TOTALITEMS | Total de itens declarado para uma campanha física. | INTEGER | 4 bytes |
| TOTALAMOUNTCENTS | Total monetário declarado, em centavos, para uma campanha virtual. | INTEGER | 4 bytes |
| OUTCOMESUMMARY | Resumo público do resultado da campanha. | TEXT | Até 4.000 caracteres |
| SUBMITTEDAT | Data e hora de envio da prestação de contas. | TIMESTAMP(3) | 8 bytes |
| SUBMITTEDONTIME | Indica se a prestação de contas foi enviada dentro do prazo. | BOOLEAN | 1 byte |
| CREATEDAT | Data e hora de criação da prestação de contas. | TIMESTAMP(3) | 8 bytes |
| UPDATEDAT | Data e hora da última atualização da prestação de contas. | TIMESTAMP(3) | 8 bytes |

Fonte: elaboração própria (2026).

Tabela 14 — Dicionário de dados da tabela CAMPAIGN_ASSETS

| Campo | Descrição | Tipo | Tamanho |
| --- | --- | --- | --- |
| @ID | Identificador único do arquivo da campanha. | TEXT | Variável |
| #CAMPAIGNID | Identificador da campanha à qual o arquivo pertence. | TEXT | Variável |
| #ACCOUNTABILITYID | Identificador da prestação de contas, quando o arquivo é uma evidência. | TEXT | Variável |
| #UPLOADERID | Identificador do usuário que enviou o arquivo. | TEXT | Variável |
| KIND | Finalidade do arquivo. Valores possíveis: `IMAGE` e `ACCOUNTABILITY_EVIDENCE`. | CampaignAssetKind | 4 bytes |
| OBJECTKEY | Chave única do objeto no serviço de armazenamento. | TEXT | Variável |
| ORIGINALFILENAME | Nome original do arquivo enviado. | TEXT | Até 255 caracteres |
| CONTENTTYPE | Tipo de conteúdo do arquivo. | TEXT | Variável |
| CONTENTLENGTH | Tamanho do arquivo em bytes. | INTEGER | 4 bytes |
| POSITION | Posição do arquivo na ordenação de exibição. | INTEGER | 4 bytes |
| REMOVEDAT | Data e hora da remoção lógica do arquivo, quando removido. | TIMESTAMP(3) | 8 bytes |
| CREATEDAT | Data e hora de criação do registro do arquivo. | TIMESTAMP(3) | 8 bytes |
| UPDATEDAT | Data e hora da última atualização do registro do arquivo. | TIMESTAMP(3) | 8 bytes |

Fonte: elaboração própria (2026).

Tabela 15 — Dicionário de dados da tabela DONATIONS

| Campo | Descrição | Tipo | Tamanho |
| --- | --- | --- | --- |
| @ID | Identificador único do registro de doação física. | TEXT | Variável |
| #CAMPAIGNID | Identificador da campanha física beneficiada. | TEXT | Variável |
| #DONORID | Identificador do usuário que registrou a doação. | TEXT | Variável |
| ITEMCOUNT | Quantidade de itens informada, quando aplicável. | INTEGER | 4 bytes |
| ITEMDESCRIPTION | Descrição dos itens doados, quando informada. | TEXT | Variável |
| STATUS | Estado do registro de doação. Valores possíveis: `PENDING`, `COMPLETED` e `CANCELLED`. | DonationStatus | 4 bytes |
| CONFIRMEDAT | Data e hora de confirmação da doação, quando confirmada. | TIMESTAMP(3) | 8 bytes |
| CANCELLEDAT | Data e hora de cancelamento da doação, quando cancelada. | TIMESTAMP(3) | 8 bytes |
| NOTES | Observações sobre a doação, quando informadas. | TEXT | Variável |
| CREATEDAT | Data e hora de criação do registro de doação. | TIMESTAMP(3) | 8 bytes |
| UPDATEDAT | Data e hora da última atualização do registro de doação. | TIMESTAMP(3) | 8 bytes |

Fonte: elaboração própria (2026).

Tabela 16 — Dicionário de dados da tabela UPLOAD_INTENTS

| Campo | Descrição | Tipo | Tamanho |
| --- | --- | --- | --- |
| @ID | Identificador único da intenção de envio. | TEXT | Variável |
| #USERID | Identificador do usuário que iniciou o envio. | TEXT | Variável |
| PURPOSE | Finalidade do envio. Valores possíveis: `USER_AVATAR`, `CAMPAIGN_IMAGE` e `ACCOUNTABILITY_EVIDENCE`. | UploadIntentPurpose | 4 bytes |
| STATUS | Estado do envio. Valores possíveis: `PENDING`, `PROCESSING`, `CONFIRMED`, `REJECTED` e `EXPIRED`. | UploadIntentStatus | 4 bytes |
| ACTIVESLOT | Posição reservada para limitar envios simultâneos, quando aplicável. | INTEGER | 4 bytes |
| PROCESSINGTOKEN | Token de posse do processamento, quando a intenção está em processamento. | TEXT | Variável |
| PROCESSINGSTARTEDAT | Data e hora de início do processamento, quando iniciado. | TIMESTAMP(3) | 8 bytes |
| CLEANUPTOKEN | Token de posse da limpeza do arquivo, quando a limpeza está em andamento. | TEXT | Variável |
| CLEANUPSTARTEDAT | Data e hora de início da limpeza, quando iniciada. | TIMESTAMP(3) | 8 bytes |
| STAGINGKEY | Chave única do objeto na área temporária de armazenamento. | TEXT | Variável |
| PUBLISHEDKEY | Chave única do objeto publicado, quando a publicação foi concluída. | TEXT | Variável |
| PREVIOUSKEY | Chave do objeto anterior que deverá ser substituído, quando aplicável. | TEXT | Variável |
| ORIGINALFILENAME | Nome original do arquivo, quando informado. | TEXT | Variável |
| #TARGETCAMPAIGNID | Identificador da campanha à qual o envio se destina, quando aplicável. | TEXT | Variável |
| CONTENTTYPE | Tipo de conteúdo declarado para o arquivo. | TEXT | Variável |
| CONTENTLENGTH | Tamanho declarado do arquivo em bytes. | INTEGER | 4 bytes |
| MAXSIZE | Tamanho máximo permitido para o arquivo, em bytes. | INTEGER | 4 bytes |
| EXPIRESAT | Data e hora de expiração da intenção de envio. | TIMESTAMP(3) | 8 bytes |
| CONFIRMEDAT | Data e hora de confirmação do envio, quando confirmado. | TIMESTAMP(3) | 8 bytes |
| FAILUREREASON | Motivo da rejeição ou falha, quando registrado. | TEXT | Variável |
| CLEANUPPENDING | Indica se existe uma limpeza de armazenamento pendente. | BOOLEAN | 1 byte |
| CREATEDAT | Data e hora de criação da intenção de envio. | TIMESTAMP(3) | 8 bytes |
| UPDATEDAT | Data e hora da última atualização da intenção de envio. | TIMESTAMP(3) | 8 bytes |

Fonte: elaboração própria (2026).

Tabela 17 — Dicionário de dados da tabela AVATAR_OBJECT_CLEANUPS

| Campo | Descrição | Tipo | Tamanho |
| --- | --- | --- | --- |
| @ID | Identificador único da tarefa de limpeza. | TEXT | Variável |
| OBJECTKEY | Chave única do objeto de avatar que deverá ser removido. | TEXT | Variável |
| ATTEMPTCOUNT | Quantidade de tentativas de limpeza realizadas. | INTEGER | 4 bytes |
| CREATEDAT | Data e hora de criação da tarefa de limpeza. | TIMESTAMP(3) | 8 bytes |
| UPDATEDAT | Data e hora da última atualização da tarefa de limpeza. | TIMESTAMP(3) | 8 bytes |

Fonte: elaboração própria (2026).

## 4.6 Possibilidades de evolução do sistema

Os diagramas anteriores representam um produto minimamente viável com os fluxos centrais da Nossa Causa. A concepção da plataforma também inclui recursos para etapas posteriores, discutidos separadamente para preservar a fidelidade dos modelos e mostrar como essa base poderá evoluir.

Uma primeira frente reúne reputação e denúncias. O sistema de reputação foi concebido para considerar cancelamentos de última hora, cumprimento do prazo de prestação de contas e qualidade da organização da campanha. A versão analisada já registra cancelamentos e classifica a prestação como enviada dentro ou fora do prazo de sete dias corridos nas duas modalidades, mas não converte essas informações em pontuação. A definição inicial do produto também considerava um cálculo baseado na quantidade de itens doados. Essa alternativa atende diretamente às campanhas físicas, e não foi estabelecido um critério variável equivalente para as virtuais. Como o atraso seria uma infração dos termos da plataforma, a evolução desse recurso precisará definir uma política coerente entre as modalidades antes de relacioná-la à reputação. No MVP, porém, o atraso não gera penalidade automática. O canal de denúncias acrescentaria a possibilidade de reportar campanhas ou organizadores problemáticos; ele também não está representado nos casos de uso ou no modelo de dados atuais.

Outra frente procura ampliar a participação. A proposta de recompensas associa um identificador de participação a cada usuário para permitir rankings e premiações definidas pelos organizadores. As notificações automáticas poderiam emitir avisos sobre as campanhas e complementar as atualizações que hoje ficam disponíveis na página pública. A viabilidade técnica ainda está em avaliação; por isso, o recurso não foi incorporado ao diagrama de implementação.

A terceira frente trata das doações financeiras. Uma versão posterior poderá integrar, de forma opcional, processadores como Stripe ou Polar. A proposta oferece uma alternativa ao envio direto por PIX ou conta bancária, sem exigir a substituição desse modelo. Como o MVP não registra transações individuais, uma eventual integração demandará nova análise lógica antes de modificar os casos de uso, os componentes externos e o modelo de dados.

Essas possibilidades descrevem caminhos de continuidade do produto. Elas não possuem prazo de execução nem compõem as funcionalidades verificadas neste trabalho; por isso, sua apresentação textual não altera os diagramas elaborados para o MVP.
