# FASE 3 — ANÁLISE DO SISTEMA ATUAL

## Delimitação do sistema atual

Esta fase analisa o MVP implementado da plataforma Nossa Causa. Esse recorte foi adotado como um produto minimamente viável: uma versão funcional que reúne as capacidades centrais da proposta e oferece uma base concreta para evolução. O objeto de estudo é o software existente, examinado por suas telas, regras de funcionamento e informações registradas. A análise utiliza evidências técnicas e documentais; entrevistas, observação de campanhas reais e procedimentos de uma organização específica não compõem o método adotado. Por isso, o uso informal de redes sociais, apresentado nas fases anteriores como parte do problema do projeto, não é tratado como um sistema anterior observado.

O MVP reúne seis frentes principais: campanhas físicas, campanhas virtuais com transferência direta ao organizador, filtros por tema e região, recursos de gestão para organizadores, identificação pública de organizações e prestação de contas ao final das campanhas, além da divulgação da quantidade de participantes nas campanhas físicas. Em conjunto, esses recursos permitem publicar e localizar campanhas, organizar a participação, acompanhar seu andamento e divulgar os resultados declarados pelo organizador. A análise a seguir descreve como esse fluxo funciona no sistema. Seus resultados são técnicos e funcionais; efeitos sobre confiança, volume de doações, eficiência das campanhas ou adoção por usuários dependeriam de avaliação própria.

## Acesso, consulta e participação

Qualquer pessoa pode consultar as campanhas disponíveis e acessar suas informações públicas. A listagem permite filtrar campanhas por tema e região e também selecionar a modalidade física ou virtual. Assim, a busca concentra dados que antes poderiam estar dispersos, como a descrição da causa, o período, a região e o responsável pela campanha. O filtro não recomenda campanhas nem calcula a distância entre doador e ponto de coleta; ele apenas organiza a consulta pelos dados cadastrados.

As ações que alteram informações exigem autenticação. Um usuário autenticado pode participar de uma campanha física enquanto ela estiver ativa e pode cancelar essa participação no mesmo período. A plataforma mostra ao público a quantidade de participações ativas, sem divulgar nomes ou dados pessoais dos participantes. Campanhas virtuais não usam esse registro de participação, pois a contribuição financeira ocorre diretamente entre doador e organizador.

Para criar campanhas, o usuário precisa manter um perfil de organizador. Esse perfil pode representar uma pessoa física ou uma organização. No caso de organizações, o sistema aceita um CNPJ formalmente válido e o apresenta de forma pública quando a campanha é consultada. A interface também distingue um CNPJ verificado de um CNPJ ainda não verificado. A validade formal do número, porém, não substitui a verificação da identidade da organização.

## Controle das campanhas

As campanhas físicas registram título, descrição, tema, região, período, local principal, meta de itens e pelo menos um ponto de coleta. Os pontos de coleta apresentam endereço e instruções para a entrega dos donativos. Durante a campanha, o organizador pode registrar a quantidade acumulada de itens recebidos. Esse dado permite acompanhar o avanço em relação à meta, inclusive quando a quantidade ultrapassa o valor inicialmente previsto.

Esse controle concentra a Nossa Causa na coordenação digital da campanha. O organizador acompanha o total arrecadado em relação à meta, enquanto estoque, triagem, transporte e distribuição dos donativos permanecem sob responsabilidade da operação de cada campanha.

Nas campanhas virtuais, o organizador informa ao menos uma chave PIX ou dados bancários. O doador usa essas informações para realizar a transferência diretamente ao organizador. A plataforma não recebe valores, não confirma pagamentos, não realiza conciliação bancária e não mantém registros individuais das transferências. Após a conclusão da campanha, os dados de pagamento deixam de ser exibidos na consulta pública.

O período informado também orienta o ciclo de vida da campanha. Antes da data inicial, a campanha permanece pendente. No período definido, ela fica ativa. As campanhas físicas ativas podem receber participações e registros de progresso; nas duas modalidades, o organizador pode publicar atualizações. Depois do encerramento, a campanha é concluída; o organizador também pode cancelá-la antes desse momento. Campanhas concluídas ou canceladas não podem ser reabertas pelo fluxo atual.

O Quadro 2 resume os principais controles informatizados identificados no MVP.

Quadro 2 — Controles informatizados do MVP Nossa Causa

| Controle | Funcionamento atual | Limite do escopo |
| --- | --- | --- |
| Consulta de campanhas | Exibe campanhas por tema, região e modalidade, com informações públicas sobre a causa e o organizador. | Não oferece recomendação automática nem busca por proximidade. |
| Campanha física | Registra meta, local, pontos de coleta, progresso de itens e participações ativas. | Não controla estoque, triagem, transporte ou distribuição de itens. |
| Campanha virtual | Divulga PIX ou dados bancários para transferência direta ao organizador. | Não processa, confirma ou concilia pagamentos. |
| Gestão do organizador | Reúne estado da campanha, contagem agregada de participantes, progresso, edição, atualizações e ações de conclusão ou cancelamento. | Não apresenta lista nominal de participantes nem análises avançadas sobre doadores. |
| Transparência | Mostra o CNPJ de organizações, seu estado de verificação e a prestação de contas publicada após o encerramento. | Não realiza auditoria externa nem aplica sanção automática sobre as informações declaradas. |

Fonte: elaboração própria com base na análise funcional do MVP Nossa Causa (2026).

## Gestão pelo organizador

O organizador acompanha suas próprias campanhas em um painel de controle. Nele, pode consultar o estado atual, a quantidade de participantes em campanhas físicas e, quando aplicável, o progresso dos itens recebidos. Também pode editar os dados da campanha enquanto o estado permitir, publicar atualizações e concluir ou cancelar a campanha.

As atualizações são publicadas pelo próprio organizador e ficam visíveis na página pública da campanha. Esse recurso permite comunicar alterações de local, horário ou outras informações relevantes. No MVP, a página pública concentra essa comunicação; as notificações automáticas constituem uma possibilidade de evolução para ampliar o alcance dos avisos.

O painel apresenta indicadores operacionais, não um sistema de análise estatística completo. A quantidade de participantes e o total de itens são dados agregados que auxiliam o acompanhamento da campanha. Eles não permitem identificar publicamente os doadores nem demonstram, por si sós, o resultado social alcançado pela causa.

## Transparência e prestação de contas

Depois que uma campanha é concluída, o painel apresenta a prestação de contas como uma etapa pendente do organizador. Em campanhas físicas, ela informa o total de itens arrecadados. Em campanhas virtuais, informa o valor total declarado pelo organizador. Nos dois casos, é necessário registrar um resumo do resultado, que será exibido ao público. O organizador também pode acrescentar imagens ou documentos como evidências.

O sistema acompanha o prazo dessa prestação de contas até o final do sétimo dia de calendário após a data final da campanha, conforme o calendário de São Paulo. Para o organizador, o controle indica se a prestação está pendente, atrasada ou enviada dentro ou fora do prazo. Caso seja corrigida posteriormente, o registro preserva a data do primeiro envio e a situação originalmente calculada para o prazo.

Quando a prestação é publicada, o público pode consultar o total informado, o resumo e as evidências disponibilizadas. Quando ela ainda não foi enviada, a página da campanha informa essa situação. O MVP prioriza a publicidade das informações declaradas pelo organizador. Auditoria externa, verificação da destinação dos recursos e consequências automáticas por atraso representam responsabilidades adicionais, distintas desse mecanismo de transparência.

## Possibilidades de evolução do sistema

O sistema atual centraliza dados de campanhas, participação, acompanhamento e transparência e, com isso, concretiza o recorte minimamente viável da Nossa Causa. A gestão logística continua com os responsáveis por cada campanha, enquanto os recursos reservados para etapas posteriores ampliam capacidades já estabelecidas pelo MVP.

Na frente de confiança e governança, a proposta de reputação considera cancelamentos de última hora, cumprimento do prazo de prestação de contas e qualidade da organização da campanha. O MVP já registra os estados de cancelamento e de prestação de contas e aplica sete dias corridos às duas modalidades, mas ainda não calcula reputação nem atribui pontuação a esses dados. A concepção inicial também previa a possibilidade de calcular o prazo pela quantidade de itens doados, alternativa diretamente aplicável às campanhas físicas, sem critério variável equivalente definido para as virtuais. Ela classificava o atraso como infração dos termos da plataforma. Uma evolução deverá decidir se conserva o prazo único ou adota regras por modalidade e como a infração participará do cálculo de reputação. O canal de denúncias, igualmente não implementado, permitiria reportar campanhas ou organizadores problemáticos.

As ideias voltadas à participação incluem um identificador por usuário, destinado a permitir rankings e premiações definidas pelos organizadores. As notificações automáticas complementariam as atualizações públicas já existentes, que hoje dependem da consulta à página da campanha. A viabilidade técnica dessa funcionalidade permanece em avaliação.

Para as contribuições financeiras, a continuidade prevista inclui integração opcional com processadores de pagamento, como Stripe ou Polar. O MVP adota a transferência direta por PIX ou conta bancária entre doador e organizador, escolha que viabiliza a modalidade virtual sem intermediar a transação. Reputação, denúncias, recompensas, notificações e integração de pagamentos ampliam essa base funcional e permanecem como ideias para a evolução do produto.
