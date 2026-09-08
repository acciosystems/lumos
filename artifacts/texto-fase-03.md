# FASE 3 — ANÁLISE DO SISTEMA ATUAL

## Delimitação do sistema atual

Esta fase toma como sistema atual o MVP implementado da plataforma Nossa Causa. O objeto de estudo é o software existente, examinado por suas telas, regras de funcionamento e informações registradas. A análise utiliza evidências técnicas e documentais, mas não inclui testes com usuários, observação de campanhas reais ou procedimentos de uma organização específica. Por isso, o uso informal de redes sociais, apresentado nas fases anteriores como parte do problema do projeto, não é tratado como um sistema anterior observado. A denominação MVP delimita o conjunto de capacidades examinado; não comprova, por si só, a eficácia do sistema em condições reais de uso.

O MVP reúne seis frentes principais: campanhas físicas, campanhas virtuais com transferência direta ao organizador, filtros por tema e região, recursos de gestão para organizadores, identificação pública de organizações e prestação de contas ao final das campanhas, além da divulgação da quantidade de participantes nas campanhas físicas. Em conjunto, esses recursos permitem publicar e localizar campanhas, organizar a participação, acompanhar seu andamento e divulgar os resultados declarados pelo organizador. A análise a seguir descreve como esse fluxo funciona no sistema. Seus resultados são técnicos e funcionais; efeitos sobre confiança, volume de doações, eficiência das campanhas ou adoção por usuários dependeriam de avaliação própria.

## Acesso, consulta e participação

Qualquer pessoa pode consultar as campanhas disponíveis e acessar suas informações públicas. A listagem permite filtrar campanhas por tema e região e também selecionar a modalidade física ou virtual. Assim, a busca concentra dados que antes poderiam estar dispersos, como a descrição da causa, o período, a região e o responsável pela campanha. O filtro não recomenda campanhas nem calcula a distância entre doador e ponto de coleta; ele apenas organiza a consulta pelos dados cadastrados.

As ações que alteram informações exigem autenticação. Um usuário autenticado pode participar de uma campanha física enquanto ela estiver ativa e pode cancelar essa participação no mesmo período. A plataforma mostra ao público a quantidade de participações ativas, sem divulgar nomes ou dados pessoais dos participantes. Campanhas virtuais não usam esse registro de participação, pois a contribuição financeira ocorre diretamente entre doador e organizador.

Para criar campanhas, o usuário precisa manter um perfil de organizador. Esse perfil pode representar uma pessoa física ou uma organização. No caso de organizações, o sistema aceita um CNPJ formalmente válido e o apresenta de forma pública quando a campanha é consultada. A interface também distingue um CNPJ marcado como verificado de outro ainda não verificado. No recorte examinado, porém, não há um procedimento operacional documentado que estabeleça critérios, responsáveis e evidências para essa verificação. O marcador não deve ser interpretado como garantia institucional, e a validade formal do número não comprova a identidade da organização.

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
| Transparência | Mostra o CNPJ de organizações, seu marcador de verificação e a prestação de contas publicada após o encerramento. | Não documenta o procedimento operacional de verificação do CNPJ, não realiza auditoria externa nem aplica sanção automática sobre as informações declaradas. |

Fonte: elaboração própria com base na análise funcional do MVP Nossa Causa (2026).

## Gestão pelo organizador

O organizador acompanha suas próprias campanhas em um painel de controle. Nele, pode consultar o estado atual, a quantidade de participantes em campanhas físicas e, quando aplicável, o progresso dos itens recebidos. Também pode editar os dados da campanha enquanto o estado permitir, publicar atualizações e concluir ou cancelar a campanha.

As atualizações são publicadas pelo próprio organizador e ficam visíveis na página pública da campanha. Esse recurso permite comunicar alterações de local, horário ou outras informações relevantes. No MVP, a página pública concentra essa comunicação. As notificações automáticas foram consideradas tecnicamente inviáveis dentro do escopo definido para essa versão e, por isso, não integram a solução entregue. O recurso permanece como possibilidade de evolução posterior.

O painel apresenta indicadores operacionais, não um sistema de análise estatística completo. A quantidade de participantes e o total de itens são dados agregados que auxiliam o acompanhamento da campanha. Eles não permitem identificar publicamente os doadores nem demonstram, por si sós, o resultado social alcançado pela causa.

## Transparência e prestação de contas

Depois que uma campanha é concluída, o painel apresenta a prestação de contas como uma etapa pendente do organizador. Em campanhas físicas, ela informa o total de itens arrecadados. Em campanhas virtuais, informa o valor total declarado pelo organizador. Nos dois casos, é necessário registrar um resumo do resultado, que será exibido ao público. O organizador também pode acrescentar imagens ou documentos como evidências.

O sistema acompanha o prazo dessa prestação de contas até o final do sétimo dia de calendário após a data final da campanha, conforme o calendário de São Paulo. Para o organizador, o controle indica se a prestação está pendente, atrasada ou enviada dentro ou fora do prazo. Caso seja corrigida posteriormente, o registro preserva a data do primeiro envio e a situação originalmente calculada para o prazo.

Quando a prestação é publicada, o público pode consultar o total informado, o resumo e as evidências disponibilizadas. Quando ela ainda não foi enviada, a página da campanha informa essa situação. O MVP prioriza a publicidade das informações declaradas pelo organizador. Auditoria externa, verificação da destinação dos recursos e consequências automáticas por atraso representam responsabilidades adicionais, distintas desse mecanismo de transparência.

## Relação com o projeto lógico

Esta análise trata o MVP implementado como sistema atual porque descreve o software disponível no recorte técnico adotado. A Fase 4 não introduz outro sistema: ela formaliza a mesma solução como sistema proposto, por meio de casos de uso, uma visão lógica da arquitetura, um modelo de entidades e um dicionário de dados. A mudança entre as fases é metodológica, da observação funcional para a representação lógica.

Reputação, denúncias, recompensas, notificações automáticas e integração opcional com processadores de pagamento permanecem fora do MVP. Essas possibilidades são detalhadas na Fase 4 apenas para indicar impactos futuros sobre o projeto lógico, sem apresentá-las como capacidades disponíveis ou compromissos de implementação. No caso das notificações, a decisão desta entrega está encerrada: o recurso foi considerado tecnicamente inviável dentro do escopo do MVP, embora possa ser reavaliado em uma evolução posterior.
