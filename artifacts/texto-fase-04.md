# FASE 4 — PROJETO LÓGICO: SISTEMA PROPOSTO

Esta fase apresenta o projeto lógico da Nossa Causa conforme o recorte do MVP analisado anteriormente. O objetivo é mostrar, de forma complementar, como as pessoas interagem com a plataforma, como as responsabilidades são organizadas e quais informações precisam ser relacionadas. Os diagramas não incluem recursos previstos para versões futuras, como processamento de pagamentos, notificações automáticas, reputação, denúncias ou recompensas.

## 4.1 UML

UML, sigla de *Unified Modeling Language*, é uma linguagem usada para representar partes de um sistema por meio de diagramas. Cada diagrama simplifica o sistema para responder a uma pergunta diferente. Um pode mostrar quem realiza determinada ação; outro, como os blocos da aplicação se organizam; um terceiro, quais informações se relacionam.

Nesta fase, a UML orienta a representação das interações dos usuários e da organização lógica da aplicação. O Diagrama Entidade-Relacionamento complementa essas visões ao tratar das informações registradas. Juntos, os modelos permitem examinar a Nossa Causa sem depender de detalhes de programação ou de telas específicas.

Os diagramas adotam os mesmos limites do MVP. A plataforma divulga dados para transferência virtual, mas não recebe nem confirma pagamentos. A participação registrada é exclusiva das campanhas físicas. A prestação de contas é preenchida pelo organizador e publicada para consulta, sem auditoria automática das informações declaradas.

## 4.2 Diagrama de caso de uso

Um diagrama de caso de uso apresenta os objetivos que cada papel pode atingir ao utilizar o sistema. O papel, chamado de ator, não representa uma pessoa determinada. Ele reúne pessoas que usam a plataforma com as mesmas permissões. Nesta modelagem, os atores são visitante, usuário autenticado e organizador. Cada ação aparece separadamente para deixar claro quem pode realizá-la.

O visitante pode criar uma conta, entrar no sistema e consultar as informações públicas das campanhas. O usuário autenticado mantém esse acesso público e pode administrar a própria conta, registrar ou cancelar sua participação em campanhas físicas ativas e criar ou atualizar o perfil de organizador. Depois de manter esse perfil, ele passa a atuar também como organizador. Nessa condição, cria e administra campanhas, publica atualizações e apresenta a prestação de contas após a conclusão.

Para representar esses papéis em Mermaid, a figura usa um fluxograma com os atores fora do limite da plataforma e as ações dentro dele. Essa adaptação preserva a leitura central de um diagrama de caso de uso: identificar quem interage com o sistema e para qual finalidade.

Figura 1 — Casos de uso da plataforma Nossa Causa

Fonte: elaboração própria (2026).

A Figura 1 separa as consultas públicas das operações que exigem acesso autenticado e mostra que o organizador preserva as ações disponíveis ao usuário autenticado. O perfil de organizador é mantido pelo usuário autenticado, pois sua criação antecede a atuação como organizador. O registro de progresso de itens aparece somente entre as atividades do organizador, pois se aplica às campanhas físicas. A conclusão e o cancelamento aparecem como ações distintas, e somente a conclusão habilita a prestação de contas. A contribuição em campanha virtual não constitui um caso de uso de pagamento: o sistema apenas apresenta as informações necessárias para que a transferência seja feita diretamente ao organizador.

## 4.3 Diagrama de implementação

O diagrama de implementação mostra como as responsabilidades do sistema são distribuídas entre seus blocos principais. Ele não descreve cada tecnologia empregada. Seu propósito é tornar visível o caminho percorrido por uma ação: a pessoa usa a aplicação no navegador, a aplicação verifica o acesso e os dados informados, aplica as regras da plataforma e registra ou consulta as informações necessárias.

A interface web concentra as páginas, os formulários e as consultas. Os serviços da aplicação aplicam permissões e regras das campanhas, dos perfis e das contas. A autenticação identifica os usuários nas ações restritas. A validação confere os dados antes do uso. O banco de dados preserva as informações da plataforma, enquanto o armazenamento de arquivos guarda imagens de campanhas e evidências da prestação de contas. O serviço de e-mail apoia a verificação e a recuperação de acesso à conta.

Figura 2 — Organização lógica da implementação da Nossa Causa

Fonte: elaboração própria (2026).

A Figura 2 mostra que a interface não decide sozinha as regras sensíveis do sistema. As regras e permissões são aplicadas antes da gravação dos dados. Essa separação ajuda a manter, em um mesmo ponto de controle, condições como a exigência de autenticação, o vínculo entre campanha e organizador e a distinção entre as duas modalidades de campanha.

O diagrama também deixa explícito o limite das integrações externas do MVP. Há armazenamento de arquivos e envio de mensagens ligadas à conta, mas não há processador de pagamentos nem serviço de notificações de campanha. A transferência virtual permanece fora da plataforma e ocorre entre doador e organizador.

## 4.4 DER

O Diagrama Entidade-Relacionamento, ou DER, descreve as informações relevantes para o sistema e os vínculos entre elas. Uma entidade representa algo sobre o qual a plataforma precisa guardar dados, como uma campanha ou um perfil de organizador. Seus atributos descrevem características desse elemento. Os relacionamentos mostram como uma entidade se conecta a outra.

As cardinalidades indicam quantas ocorrências podem participar de cada relação. Por exemplo, um perfil de organizador pode estar associado a várias campanhas, enquanto uma campanha pode ter apenas uma prestação de contas. Essa leitura ajuda a compreender quais registros dependem de outros e quais informações permanecem separadas.

Figura 3 — Diagrama Entidade-Relacionamento da Nossa Causa

Fonte: elaboração própria (2026).

A Figura 3 apresenta o usuário como origem de dois vínculos principais: a criação de um perfil de organizador e a participação em campanhas físicas. A entidade campanha reúne seu período, tema, região e estado, além dos dados que distinguem as modalidades. O perfil organiza as campanhas, que podem possuir pontos de coleta, atualizações, arquivos e, após a conclusão, uma prestação de contas. Os arquivos incluem tanto imagens da campanha quanto evidências vinculadas à prestação.

As modalidades física e virtual compartilham a entidade campanha, mas usam informações próprias. A campanha física registra local, meta de itens e pontos de coleta. A virtual divulga PIX ou dados bancários. Na prestação de contas, a campanha física informa o total de itens; a virtual, o total monetário declarado. O modelo não possui uma entidade para transações individuais, porque o MVP não processa ou registra transferências financeiras.

O DER prioriza as entidades ligadas ao domínio das campanhas. Registros técnicos de sessão, mecanismos de segurança e controles temporários de arquivos não aparecem na figura, pois não alteram a compreensão dos relacionamentos apresentados nesta fase.
