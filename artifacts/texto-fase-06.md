# FASE 6 — DESENVOLVIMENTO

## 6.1 Padrão do sistema

Nesta seção, o padrão do sistema é entendido como a distribuição das responsabilidades necessárias para executar a plataforma. A Nossa Causa foi desenvolvida como uma aplicação web em um monorepo TypeScript. A interface web ocupa um módulo próprio e compartilha com os módulos de autenticação, procedimentos remotos, validação e persistência os contratos necessários à comunicação. Essa divisão organiza o código por responsabilidade e permite que a interface apresente ações adequadas a cada pessoa usuária sem assumir sozinha decisões relacionadas a permissões ou ao estado das campanhas.

O sistema adota uma organização cliente-servidor com responsabilidades separadas. No navegador, as páginas exibem campanhas, perfis, configurações e painéis de gestão. Os formulários relacionados às campanhas e ao perfil de organizador comunicam-se com procedimentos tipados, enquanto os fluxos de autenticação e parte da manutenção da conta utilizam a interface própria do serviço de autenticação. Nos dois caminhos, os dados são verificados durante a interação de acordo com as regras de cada formulário. Nas ações restritas, a sessão também é conferida antes da execução e o usuário é identificado para que as regras sejam avaliadas no lado protegido da aplicação.

Quadro 4 — Responsabilidades na implementação do MVP Nossa Causa

| Responsabilidade | Implementação no MVP | Limite da responsabilidade |
| --- | --- | --- |
| Interface web | Organiza rotas, páginas, componentes, formulários, mensagens de retorno e consultas apresentadas no navegador. | Não define isoladamente quem pode alterar uma campanha ou quais dados podem ser gravados. |
| Comunicação e estado da interface | Realiza consultas e mutações por procedimentos tipados e atualiza os dados exibidos depois de operações que modificam campanhas, perfis ou participações. | A atualização visual não substitui a conferência das regras no servidor. |
| Autenticação e autorização | Mantém a sessão e protege as rotas e operações que dependem de acesso autenticado. | A autenticação identifica o usuário, mas cada operação ainda verifica se ele pode agir sobre o recurso solicitado. |
| Validação e regras de negócio | Confere formatos, campos obrigatórios, modalidade, período e condições de cada operação. Também aplica regras de propriedade, participação, ciclo de vida e prestação de contas. | A validação de dados não equivale à auditoria das declarações feitas por organizadores. |
| Persistência e arquivos | Registra usuários, perfis, campanhas, participações, atualizações e prestações de contas no banco de dados. Imagens de campanhas e evidências são tratadas por serviços próprios de envio e publicação. | Não processa pagamentos nem controla a entrega, o estoque ou a distribuição de donativos. |
| Serviços de conta | Apoiam verificação de endereço de e-mail, recuperação de acesso e métodos de autenticação disponíveis. | Não correspondem a um sistema de notificações de campanhas. |

Fonte: elaboração própria com base na implementação do MVP Nossa Causa (2026).

As consultas públicas seguem um fluxo separado das ações de gestão. Ao pesquisar campanhas, por exemplo, a interface envia os filtros de tema, região e modalidade para uma operação pública. A aplicação valida esses critérios, consulta as campanhas disponíveis no período e devolve apenas as informações necessárias à listagem. No detalhe de uma campanha, o mesmo princípio preserva as informações públicas do organizador, das atualizações, dos pontos de coleta e, quando houver, da prestação de contas. Assim, a página apresenta dados preparados para a consulta sem expor dados de sessão ou operações de administração.

O fluxo de criação de uma campanha mostra como as responsabilidades se complementam nas ações autenticadas. O organizador informa os dados no formulário e seleciona a modalidade física ou virtual. A interface ajusta os campos conforme essa escolha e confere os dados antes do envio. No lado protegido, a aplicação confirma a sessão, verifica a existência do perfil de organizador e valida novamente a solicitação. Depois disso, aplica as regras do período e da modalidade. Uma campanha física registra meta e pontos de coleta; uma campanha virtual registra a chave PIX ou os dados bancários informados pelo organizador. A operação grava esses dados de forma consistente e, quando houver imagem, coordena o envio do arquivo antes de associá-lo à campanha.

A repetição de validações em pontos diferentes tem funções distintas. Na interface, ela orienta o preenchimento e apresenta erros ao usuário. Nos procedimentos da aplicação, ela impede que uma solicitação recebida fora da tela ou alterada durante o envio seja aceita sem atender às regras. A autorização segue a mesma lógica. Uma tela pode mostrar a opção de edição para o organizador, mas a operação de alteração também confere o vínculo entre o usuário e a campanha. Dessa forma, a proteção não depende apenas de quais botões estão visíveis no navegador.

As regras de negócio permanecem próximas às operações que alteram o domínio. Esse conjunto inclui a criação e a edição de campanhas, a participação em campanhas físicas, o registro de progresso, a publicação de atualizações, as transições de estado e a prestação de contas. As operações que modificam informações persistentes são executadas com controle de consistência. A atualização do estado exibido pela interface ocorre depois da conclusão dessas operações, para que as listas, os detalhes da campanha e o painel do organizador voltem a consultar os dados atuais.

Essa organização corresponde ao diagrama de implementação apresentado na Fase 4: a interface trata a interação, os procedimentos e serviços concentram regras e permissões, a autenticação identifica o usuário, a validação confere os dados e a persistência preserva os registros. A separação observada é de responsabilidades; por isso, o sistema não é caracterizado como MVC apenas pela presença de páginas e dados. Também permanecem os limites do MVP. A Nossa Causa divulga informações para transferências virtuais, mas não recebe, confirma ou concilia pagamentos. Da mesma forma, a plataforma registra informações e evidências das campanhas, sem executar a logística dos itens ou auditar externamente as prestações de contas declaradas.

## 6.2 Lista de telas de entrada, consulta e relatório

O levantamento do MVP identificou quinze telas visuais. Foram consideradas as páginas acessadas pelas pessoas usuárias e as duas abas de configurações, pois cada uma reúne funções próprias. Rotas de API, estruturas de layout, telas de carregamento, mensagens de erro e diálogos de confirmação não foram contabilizados como telas autônomas. Páginas parametrizadas, como o detalhe, o painel e a edição de uma campanha, representam uma tela por finalidade, ainda que atendam campanhas diferentes.

Quadro 5 — Telas de entrada, consulta e relatório do MVP Nossa Causa

| Tela | Acesso | Classificação predominante | Finalidade e variações relevantes |
| --- | --- | --- | --- |
| Início | Público, com apresentação adaptada à sessão autenticada | Consulta | Apresenta a proposta da plataforma, as modalidades de campanha e os caminhos para explorar campanhas, criar conta ou iniciar uma campanha. |
| Campanhas | Público, com ações adicionais na sessão autenticada | Consulta e entrada de filtros | Lista campanhas disponíveis e permite filtrar por tema, região e modalidade. |
| Detalhe da campanha | Público, com participação disponível a usuários autenticados em campanhas físicas ativas | Consulta e relatório integrado | Exibe dados da campanha, do organizador, dos pontos de coleta ou dados de transferência, atualizações e, quando publicada, a prestação de contas. |
| Entrar | Anônimo | Entrada | Permite acesso por credenciais, conta vinculada ou chave de acesso quando esses métodos estão disponíveis. |
| Criar conta | Anônimo | Entrada | Exibe o formulário de cadastro por nome, e-mail e senha quando o cadastro está habilitado; caso contrário, informa sua indisponibilidade. |
| Esqueci minha senha | Anônimo | Entrada | Solicita o envio de um link para redefinição de senha. |
| Redefinir senha | Pessoa portadora de link com token | Entrada | Exibe o formulário para definir uma nova senha; a validade do token é conferida no envio. |
| Minhas participações | Autenticado | Consulta | Reúne as campanhas físicas ativas das quais a pessoa usuária está participando. |
| Minhas campanhas | Autenticado | Consulta | Lista as campanhas administradas pela pessoa usuária; sem perfil organizador, apresenta um estado vazio. |
| Painel da campanha | Organizador proprietário | Consulta, entrada e relatório integrado | Permite acompanhar status, participantes e progresso, publicar atualizações, encerrar ou cancelar a campanha e registrar a prestação de contas após a conclusão. Também mostra a visualização pública atual. |
| Editar campanha | Organizador proprietário | Entrada | Exibe o formulário para campanhas pendentes ou ativas; nos demais estados, informa que a edição não está disponível. |
| Criar campanha | Autenticado | Entrada | Exibe o formulário de campanha física ou virtual quando a pessoa usuária possui perfil organizador; caso contrário, orienta sua configuração. |
| Perfil organizador | Autenticado | Entrada | Cria ou atualiza o perfil individual ou institucional que identifica quem organiza campanhas. |
| Configurações — Conta | Autenticado | Entrada e consulta | Reúne dados de perfil, imagem, e-mail, nome de usuário e contas vinculadas. |
| Configurações — Segurança | Autenticado | Entrada e consulta | Reúne definição ou alteração de senha, chaves de acesso e sessões ativas. |

Fonte: elaboração própria com base na implementação do MVP Nossa Causa (2026).

As telas de consulta podem conter controles de entrada sem perder sua finalidade principal. O catálogo, por exemplo, recebe filtros para refinar a listagem, enquanto o detalhe da campanha apresenta informações já registradas e oferece participação apenas na situação aplicável. As abas de configurações foram relacionadas separadamente porque os dados de conta e os mecanismos de segurança são administrados em conjuntos distintos.

Não há uma tela exclusiva de relatório no MVP. A prestação de contas é preenchida no painel da campanha concluída e aparece no detalhe público quando foi publicada. Por esse motivo, ela foi classificada como relatório integrado a essas duas telas, sem atribuir ao sistema uma página ou um gerador de relatórios inexistente.
