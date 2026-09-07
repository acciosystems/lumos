# FASE 4 — PROJETO LÓGICO: SISTEMA PROPOSTO

Esta fase apresenta o projeto lógico da Nossa Causa conforme o recorte do MVP analisado anteriormente. O objetivo é mostrar, de forma complementar, como as pessoas interagem com a plataforma, como as responsabilidades são organizadas e quais informações precisam ser relacionadas. Os diagramas concentram-se nos fluxos centrais já implementados; processamento de pagamentos, notificações automáticas, reputação, denúncias e recompensas são discutidos no tópico 4.5 como possibilidades de evolução.

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

## 4.5 Possibilidades de evolução do sistema

Os diagramas anteriores representam um produto minimamente viável com os fluxos centrais da Nossa Causa. A concepção da plataforma também inclui recursos para etapas posteriores, discutidos separadamente para preservar a fidelidade dos modelos e mostrar como essa base poderá evoluir.

Uma primeira frente reúne reputação e denúncias. O sistema de reputação foi concebido para considerar cancelamentos de última hora, cumprimento do prazo de prestação de contas e qualidade da organização da campanha. A versão analisada já registra cancelamentos e classifica a prestação como enviada dentro ou fora do prazo de sete dias corridos nas duas modalidades, mas não converte essas informações em pontuação. A definição inicial do produto também considerava um cálculo baseado na quantidade de itens doados. Essa alternativa atende diretamente às campanhas físicas, e não foi estabelecido um critério variável equivalente para as virtuais. Como o atraso seria uma infração dos termos da plataforma, a evolução desse recurso precisará definir uma política coerente entre as modalidades antes de relacioná-la à reputação. No MVP, porém, o atraso não gera penalidade automática. O canal de denúncias acrescentaria a possibilidade de reportar campanhas ou organizadores problemáticos; ele também não está representado nos casos de uso ou no modelo de dados atuais.

Outra frente procura ampliar a participação. A proposta de recompensas associa um identificador de participação a cada usuário para permitir rankings e premiações definidas pelos organizadores. As notificações automáticas poderiam emitir avisos sobre as campanhas e complementar as atualizações que hoje ficam disponíveis na página pública. A viabilidade técnica ainda está em avaliação; por isso, o recurso não foi incorporado ao diagrama de implementação.

A terceira frente trata das doações financeiras. Uma versão posterior poderá integrar, de forma opcional, processadores como Stripe ou Polar. A proposta oferece uma alternativa ao envio direto por PIX ou conta bancária, sem exigir a substituição desse modelo. Como o MVP não registra transações individuais, uma eventual integração demandará nova análise lógica antes de modificar os casos de uso, os componentes externos e o modelo de dados.

Essas possibilidades descrevem caminhos de continuidade do produto. Elas não possuem prazo de execução nem compõem as funcionalidades verificadas neste trabalho; por isso, sua apresentação textual não altera os diagramas elaborados para o MVP.
