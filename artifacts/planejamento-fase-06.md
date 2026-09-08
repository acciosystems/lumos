# Planejamento — Fase 6: Desenvolvimento

## Identificação e estado

- Identificador: `fase-06`.
- Responsável pelo planejamento: Codex.
- Data do planejamento: 2026-09-06.
- Estado: concluída em 2026-09-07; Partes 0 a 6 consolidadas e revisadas. A imagem única do tópico TSDoc permanece reservada à integração visual final.
- Recorte: MVP implementado da plataforma Nossa Causa, no mesmo snapshot funcional adotado nas Fases 3, 4 e 5.
- Entrega final prevista: `artifacts/texto-fase-06.md` e os recursos visuais descritos neste planejamento.

A Fase 6 foi executada em partes sequenciais, com uma verificação de saída ao final de cada parte. A divisão separou cinco trabalhos: descrição da arquitetura, inventário da interface, produção de evidências visuais, modelagem estrutural e documentação do código.

## Objetivo

A fase deverá explicar como o MVP foi desenvolvido e demonstrar sua correspondência com o projeto lógico. O texto apresentará o padrão arquitetural efetivamente observado, relacionará as telas disponíveis, documentará visualmente os formulários, oferecerá uma representação estrutural compatível com a implementação TypeScript e explicará o TSDoc, adotado como alternativa a JAVADOC/SUMMARY.

As evidências deverão pertencer à mesma versão da aplicação. O texto não transformará bibliotecas, modelos gerados ou funções em classes fictícias, não criará uma tela de relatório inexistente e não apresentará recursos posteriores ao MVP como concluídos.

## Decisões fornecidas pelo usuário

1. A execução deverá ser dividida claramente para que o agente responsável realize uma parte por vez.
2. A lista de telas do tópico 6.2 não precisa de imagens.
3. As imagens dos formulários deverão ser obtidas preferencialmente com o Chrome DevTools MCP.
4. TSDoc será a alternativa tecnológica adotada em substituição a JAVADOC/SUMMARY no tópico 6.2.3.
5. A infraestrutura de TSDoc não existia no snapshot inicial deste planejamento, mas estaria implementada na execução da fase. Em 2026-09-07, o usuário determinou que a Parte 5 adotasse TSDoc como essa alternativa e considerasse uma cobertura parcial, concentrada em APIs e módulos relevantes, sem incluir componentes React.
6. O tópico de TSDoc terá uma única imagem de exemplo, fornecida pelo usuário. O agente não deverá criar nem substituir essa imagem.
7. Em 2026-09-07, o usuário determinou o encerramento da Fase 6. A imagem única do tópico TSDoc passou a ser uma dependência condicional da integração visual e não impede a conclusão da fase. Como não houve conferência de ferramenta, comando ou saída TSDoc no repositório, o texto preservará essa limitação e tratará a compatibilidade dos comentários como premissa fornecida.

As definições iniciais foram registradas como D-013, a premissa específica da Parte 5 como D-014 e o encerramento da fase como D-017 em `artifacts/TCC-PRINCIPAL.md`.

## Adaptações da estrutura inicial

### 6.1. Significado de “padrão do sistema”

O tópico será interpretado como a organização arquitetural e o fluxo de responsabilidades do software. A aplicação não será classificada automaticamente como MVC nem receberá outro rótulo tradicional apenas por semelhança superficial.

A análise partirá da estrutura real do monorepo: interface web, rotas, consultas e formulários; procedimentos RPC e regras protegidas; validação compartilhada; autenticação; persistência; armazenamento de arquivos; e serviços auxiliares. O texto poderá caracterizar a solução como uma aplicação web cliente-servidor, modular e organizada em camadas ou responsabilidades somente se essas expressões continuarem compatíveis com o snapshot da execução.

A visão lógica da arquitetura da Fase 4 não será repetida. A Fase 6 explicará como o código concretiza aqueles blocos e poderá usar um quadro textual curto para relacionar responsabilidade, implementação e comunicação.

### 6.2. Lista de telas sem galeria visual

O tópico 6.2 conterá um quadro textual, sem capturas de tela. Cada linha informará:

- nome apresentado ao usuário;
- finalidade predominante;
- acesso público ou autenticado;
- classificação como entrada, consulta ou relatório integrado;
- variações funcionais relevantes;
- relação com as capacidades do MVP.

Rotas de API, layouts, limites de erro e componentes internos não serão contados como telas. Estados anônimo e autenticado de uma mesma página também não serão duplicados quando não constituírem telas diferentes. Abas com conteúdo funcional próprio, como Conta e Segurança, serão relacionadas separadamente.

### Ausência de uma tela autônoma de relatório

O snapshot examinado não possui uma rota exclusiva de relatório. A prestação de contas é preenchida no painel do organizador e consultada no detalhe público da campanha concluída. O quadro registrará essa função como relatório integrado a essas telas, sem inventar uma página ou um gerador de relatórios.

### 6.2.1. Escopo das imagens dos formulários

O inventário de telas e as imagens terão funções diferentes. O tópico 6.2 lista todas as telas sem imagens; o tópico 6.2.1 apresenta somente formulários e conjuntos de controles destinados à entrada de dados.

Para esta fase, “formulário” significa uma unidade visível pela qual o usuário informa ou altera dados. A definição inclui filtros de consulta e formulários exibidos em diálogos, ainda que a implementação não use literalmente um elemento HTML `form`. Botões isolados de participação, término de sessão, vinculação de provedor ou confirmação de ciclo de vida não serão tratados como formulários quando não solicitarem dados ao usuário.

Cada unidade terá um arquivo de imagem próprio. Quando um mesmo formulário altera campos segundo a modalidade da campanha, serão capturados os estados físico e virtual. Os arquivos individuais poderão ser agrupados em pranchas durante a diagramação final se isso for necessário para paginação, mas os originais deverão ser preservados.

### 6.2.2. Diagrama compatível com TypeScript funcional

O repositório usa predominantemente funções, objetos, tipos inferidos, esquemas de validação e modelos de persistência, e não uma hierarquia de classes de domínio escrita manualmente. O tópico manterá o título “Diagrama de classe” exigido pela estrutura, mas explicará a adaptação.

O exemplo do projeto será uma visão estrutural dos principais tipos, entidades, contratos e serviços reais. Estereótipos como `<<entidade>>`, `<<tipo>>`, `<<enumeração>>` e `<<serviço>>` poderão distinguir a natureza dos elementos. A figura não afirmará que um tipo ou módulo funcional é uma classe concreta. O diagrama deverá acrescentar a visão de atributos, operações e dependências da implementação, em vez de apenas reproduzir o DER da Fase 4.

O diagrama será mantido em Mermaid, no arquivo `artifacts/diagramas/fase-06-classes.mmd`. A fonte editável será a entrega desta etapa; uma exportação vetorial será gerada quando solicitada para a diagramação final, segundo a regra comum do trabalho.

### 6.2.3. TSDoc como alternativa tecnológica a JAVADOC/SUMMARY

TSDoc será apresentado como a alternativa tecnológica adotada para substituir JAVADOC ou SUMMARY previstos na estrutura original. Como convenção de comentários de documentação para APIs TypeScript, ele será tratado, na Parte 5, como uma implementação existente por instrução do usuário, com cobertura parcial e orientada pela relevância dos contratos. O texto deverá distinguir:

- a sintaxe e as convenções TSDoc;
- a cobertura parcial adotada como premissa para o tópico;
- a ausência de evidência verificada sobre ferramenta, comando ou saída;
- a imagem única reservada à integração final.

Como alternativa adotada, o recorte incluirá contratos compartilhados de validação, funções de calendário, procedimentos e serviços de campanhas, além de APIs selecionadas de autenticação. Componentes React, rotas visuais, modelos gerados, migrações, scripts de infraestrutura e auxiliares privados ficarão fora da cobertura. A seção não afirmará que todo o código está documentado nem confundirá a convenção TSDoc com a ferramenta que verifica ou apresenta os comentários.

A única figura deste tópico será fornecida pelo usuário. Durante a integração, o executor deverá confirmar o nome do arquivo, a legibilidade, o conteúdo que ela demonstra e a legenda apropriada. Nenhuma captura adicional de código, terminal ou documentação gerada será inserida nesse tópico. A ausência atual desse insumo não reabre a Fase 6.

## Estrutura planejada do texto final

### 6.1. Padrão do sistema

A seção deverá:

1. apresentar a aplicação como sistema web e contextualizar o monorepo;
2. explicar a separação entre interface, procedimentos protegidos, regras de negócio, validação, autenticação e persistência;
3. descrever o fluxo de uma ação representativa, da entrada do usuário à resposta exibida;
4. mostrar que autorização e regras sensíveis não dependem apenas da interface;
5. relacionar a implementação à visão lógica da arquitetura da Fase 4 sem repetir a figura;
6. evitar um inventário de bibliotecas sem função explicativa.

Título provisório do quadro: **Responsabilidades na implementação do MVP Nossa Causa**.

| Responsabilidade | Aspecto a explicar | Limite |
| --- | --- | --- |
| Interface e navegação | Rotas, páginas, componentes, formulários e consultas no navegador. | Não atribuir regras de autorização somente à interface. |
| Estado e comunicação | Consultas, mutações e comunicação tipada com os procedimentos da aplicação. | Não descrever a biblioteca como arquitetura completa. |
| Validação | Esquemas compartilhados e nova validação junto às operações protegidas. | Não confundir validação de formato com autorização ou verificação de identidade. |
| Serviços e regras | Permissões, ciclo de vida, participação, progresso, atualizações, prestação de contas e arquivos. | Manter o recorte do MVP. |
| Autenticação | Identificação, sessão e proteção das ações restritas. | Não antecipar a análise de segurança da Fase 7. |
| Persistência e serviços externos | Banco de dados, objetos enviados e e-mail de conta. | Não expor credenciais nem inventar processamento de pagamentos. |

### 6.2. Lista de telas de entrada, consulta e relatório

O inventário inicial abaixo deverá ser refeito contra o código e a aplicação em execução antes da redação. Ele serve como baseline, não como permissão para conservar uma tela removida ou ignorar uma tela adicionada.

| Tela prevista | Acesso | Classificação predominante | Observação |
| --- | --- | --- | --- |
| Início | Público, com variação autenticada | Consulta | Apresentação da plataforma e acesso às campanhas. |
| Campanhas | Público, com variação autenticada | Consulta e entrada de filtros | Catálogo com filtros por categoria, região e modalidade. |
| Detalhe da campanha | Público, com ações adicionais para usuário autenticado | Consulta e relatório integrado | Exibe campanha, organizador, participação, atualizações e eventual prestação de contas. |
| Entrar | Anônimo | Entrada | Acesso por credenciais e alternativas de autenticação disponíveis. |
| Criar conta | Anônimo | Entrada | Exibe o formulário de cadastro quando o recurso está habilitado; caso contrário, informa sua indisponibilidade. |
| Esqueci minha senha | Anônimo | Entrada | Solicitação do link de redefinição. |
| Redefinir senha | Portador de link/token | Entrada | Definição da nova senha. |
| Minhas participações | Autenticado | Consulta | Campanhas físicas das quais o usuário está participando. |
| Minhas campanhas | Autenticado | Consulta | Relação das campanhas administradas; sem perfil organizador, apresenta o estado vazio. |
| Painel da campanha | Organizador proprietário | Consulta, entrada e relatório integrado | Gestão, progresso, atualizações, ciclo de vida, prestação e visualização pública atual. |
| Editar campanha | Organizador proprietário | Entrada | Exibe o formulário para campanhas pendentes ou ativas; nos demais estados, informa que a edição não está disponível. |
| Criar campanha | Autenticado | Entrada | Exibe o formulário de campanha física ou virtual quando existe um perfil organizador; caso contrário, orienta sua configuração. |
| Perfil organizador | Autenticado | Entrada | Criação ou manutenção do perfil individual ou institucional. |
| Configurações — Conta | Autenticado | Entrada e consulta | Dados da conta, avatar, e-mail e contas vinculadas. |
| Configurações — Segurança | Autenticado | Entrada e consulta | Definição ou alteração de senha, chaves de acesso e sessões. |

O texto posterior ao quadro explicará as telas híbridas e a ausência de relatório autônomo. A contagem final será informada apenas depois da conferência do snapshot.

### 6.2.1. Imagem de cada formulário do software

A matriz abaixo define as evidências inicialmente esperadas. O executor deverá atualizá-la antes das capturas e registrar a versão final em `artifacts/auxiliares/fase-06-evidencias.md`.

| ID | Formulário ou estado | Contexto necessário | Captura prevista |
| --- | --- | --- | --- |
| F01 | Filtros de campanhas | Catálogo público com opções carregadas. | Região dos controles de filtro. |
| F02 | Entrada na conta | Sessão anônima. | Formulário completo, incluindo os métodos disponíveis. |
| F03 | Criação de conta | Sessão anônima e cadastro habilitado. | Formulário completo. |
| F04 | Solicitação de redefinição | Sessão anônima. | Cartão do formulário. |
| F05 | Redefinição de senha | Rota com token não sensível apropriado ao ambiente de documentação. | Cartão do formulário, sem submeter credenciais reais. |
| F06 | Perfil organizador | Sessão autenticada; usar a variação de organização para tornar o campo condicional visível. | Formulário completo. |
| F07 | Criação de campanha física | Perfil organizador e dados de teste. | Formulário completo em estado físico. |
| F08 | Criação de campanha virtual | Perfil organizador e dados de teste. | Formulário completo em estado virtual. |
| F09 | Edição de campanha física | Organizador proprietário e campanha editável. | Formulário completo em estado físico. |
| F10 | Edição de campanha virtual | Organizador proprietário e campanha editável. | Formulário completo em estado virtual. |
| F11 | Progresso de itens | Campanha física ativa do organizador. | Cartão de progresso com campo e ação. |
| F12 | Publicação de atualização | Campanha ativa do organizador. | Cartão de publicação. |
| F13 | Prestação de contas física | Campanha física concluída. | Formulário com total de itens, resumo e evidências. |
| F14 | Prestação de contas virtual | Campanha virtual concluída. | Formulário com total monetário, resumo e evidências. |
| F15 | Dados básicos da conta | Sessão autenticada, aba Conta. | Formulário de nome e nome de usuário. |
| F16 | Alteração do avatar | Diálogo aberto na aba Conta. | Diálogo do formulário. |
| F17 | Alteração de e-mail | Diálogo aberto na aba Conta. | Diálogo do formulário. |
| F18 | Alteração de senha | Conta que possua senha, diálogo aberto na aba Segurança. | Diálogo do formulário. |
| F19 | Registro de chave de acesso | Sessão autenticada, listagem carregada e diálogo aberto na aba Segurança. | Diálogo do formulário; não é necessário concluir o registro para documentar os campos. |

Controles confirmatórios sem campos não fazem parte desta matriz. Se a implementação de TSDoc ou a interface mudar antes da execução, a matriz deverá ser corrigida pelo comportamento visível, e a alteração deverá ser registrada no manifesto.

### 6.2.2. Diagrama de classe

A seção terá três movimentos:

1. explicação breve de diagrama de classes como visão estática de classificadores, atributos, operações e relacionamentos;
2. explicação da adaptação para tipos e módulos funcionais de um projeto TypeScript;
3. apresentação e interpretação de um diagrama Mermaid baseado no projeto.

O recorte da figura deverá privilegiar o domínio de campanhas, pois ele concentra as capacidades centrais do MVP. A seleção final poderá reunir:

- tipos e enumerações que distinguem modalidade e estado da campanha;
- entidades persistidas relevantes ao fluxo;
- contratos de entrada validados;
- serviços ou procedimentos que criam, consultam e alteram campanhas;
- dependências entre contratos, regras e persistência.

O executor deverá limitar a figura aos elementos necessários para leitura em página. Atributos repetidos do DER, detalhes de autenticação gerada, infraestrutura de upload e operações auxiliares poderão ser omitidos. Os nomes exibidos poderão ser traduzidos para português, desde que uma tabela interna de rastreabilidade preserve a correspondência com os elementos técnicos reais.

### 6.2.3. Documentação do código com TSDoc

A seção deverá:

1. explicar por que TSDoc é adequado ao código TypeScript;
2. descrever as convenções efetivamente adotadas, como resumo, parâmetros, retorno, observações, exemplos ou exceções, apenas quando presentes;
3. identificar a ferramenta e o comando realmente usados para validar ou gerar a documentação;
4. delimitar quais APIs ou módulos estão cobertos;
5. inserir e interpretar a única imagem fornecida pelo usuário;
6. evitar reproduzir listagens extensas de código no corpo do TCC.

Título provisório da figura: **Exemplo de documentação TSDoc no projeto Nossa Causa**. O título e a fonte serão ajustados ao conteúdo real da imagem recebida.

## Protocolo das capturas com Chrome DevTools MCP

As capturas da Parte 3 deverão seguir este procedimento:

1. executar a aplicação em ambiente local ou de documentação, nunca contra dados pessoais ou produção;
2. preparar dados fictícios determinísticos para os dois tipos e os estados necessários de campanha;
3. abrir uma sessão anônima e uma sessão autenticada em contextos separados quando isso reduzir interferências;
4. fixar tema claro e um viewport de desktop consistente, salvo se um formulário exigir outra apresentação para permanecer legível;
5. navegar e abrir cada formulário com o Chrome DevTools MCP;
6. conferir a árvore de acessibilidade antes da captura para confirmar título, campos, estado e ausência de erro;
7. preferir captura do elemento do formulário ou de seu cartão/diálogo; usar página inteira somente para formulários longos;
8. salvar em PNG sob `artifacts/imagens/fase-06/formularios/`, com o ID e um nome descritivo;
9. verificar a imagem salva quanto a corte, sobreposição, carregamento incompleto e dados sensíveis;
10. conferir console e requisições relevantes quando a tela não estiver no estado esperado;
11. registrar no manifesto o arquivo, a tela, a condição, o viewport, a data e o resultado da conferência.

Exemplo de padrão de nome: `f07-criar-campanha-fisica.png`. Não incluir e-mail real, token, credencial, identificador sensível ou dados bancários reais nas imagens.

## Fontes externas planejadas

### Diagrama de classes

| Fonte | Uso planejado | Verificação na execução |
| --- | --- | --- |
| OBJECT MANAGEMENT GROUP. *Unified Modeling Language — Version 2.5.1*. 2017. Disponível em: <https://www.omg.org/spec/UML/2.5.1/PDF>. | Fundamentar classificadores, atributos, operações e relacionamentos na explicação conceitual. | Conferida em 2026-09-06; a seção 11.4.4, p. 195, descreve a notação de classe e seus compartimentos, enquanto a seção 11.5.4, pp. 201–202, trata de associações, multiplicidades e composição. |
| MERMAID. *Class diagrams*. Disponível em: <https://mermaid.js.org/syntax/classDiagram.html>. | Conferir a sintaxe de classes, anotações, relações e multiplicidades usada na fonte editável. | Conferida em 2026-09-06; documentação apresentada como versão 11.17.2. A fonte editável foi validada com Mermaid CLI 11.17.0. |

### TSDoc

| Fonte | Uso planejado | Verificação na execução |
| --- | --- | --- |
| TSDOC. *How can I use TSDoc?*. Disponível em: <https://tsdoc.org/pages/intro/using_tsdoc/>. | Fundamentar TSDoc como alternativa tecnológica a JAVADOC/SUMMARY e distinguir a convenção de comentários das ferramentas que a validam ou transformam em documentação. | Conferida em 2026-09-07. A página explica que o pacote de referência é um componente usado por outras ferramentas e que a convenção pode ser verificada por plugin compatível. |
| TSDOC. *TSDoc spec*. Disponível em: <https://tsdoc.org/pages/spec/overview/>. | Apoiar a descrição da sintaxe e de seu escopo. | Conferida em 2026-09-07, em conjunto com as páginas das tags `@remarks`, `@param`, `@returns` e `@throws`. O texto manterá a distinção entre convenção e ferramenta. |

### Validação, autorização e chave de acesso

| Fonte | Uso planejado | Verificação na execução |
| --- | --- | --- |
| OPEN WEB APPLICATION SECURITY PROJECT (OWASP). *Input Validation Cheat Sheet*. Disponível em: <https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html>. | Fundamentar a distinção entre a validação no navegador e a validação no lado protegido da aplicação. | Conferida em 2026-09-07; a seção “Client-side vs Server-side Validation” explica que controles no cliente podem ser contornados e que a validação de segurança deve ocorrer no servidor. |
| OPEN WEB APPLICATION SECURITY PROJECT (OWASP). *Authorization Cheat Sheet*. Disponível em: <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>. | Fundamentar a necessidade de aplicar autorização fora do cliente e verificar permissões em cada requisição. | Conferida em 2026-09-07; foram usadas as seções “Validate the Permissions on Every Request” e “Verify that Authorization Checks are Performed in the Right Location”. |
| WORLD WIDE WEB CONSORTIUM (W3C). *Web Authentication: An API for accessing Public Key Credentials — Level 3*. W3C Recommendation, 25 ago. 2026. Disponível em: <https://www.w3.org/TR/webauthn-3/>. | Sustentar a necessidade de interação da pessoa usuária com um autenticador compatível durante a criação de uma chave de acesso. | Conferida em 2026-09-07; a seção 6.3.2 exige a coleta de um gesto de autorização para criar uma credencial. |

As datas de acesso, páginas e metadados finais serão registrados somente após a consulta usada na redação. O planejamento não dispensa a conferência das fontes originais.

## Fontes internas de conferência

Os caminhos abaixo são rastreabilidade interna e não deverão aparecer no texto destinado ao TCC.

| Evidência | Uso |
| --- | --- |
| `artifacts/texto-fase-03.md` | Capacidades e limites do MVP comprovados na análise do sistema atual. |
| `artifacts/texto-fase-04.md` e `artifacts/diagramas/fase-04-*.mmd` | Atores, blocos da implementação e estrutura conceitual que a Fase 6 deverá concretizar sem duplicar. |
| `artifacts/texto-fase-05.md` | Condições de uso associadas às telas e aos formulários. |
| `artifacts/page-screenshots/2026-09-05/` | Baseline visual interno para localizar telas; não substitui as capturas específicas dos formulários no snapshot da execução. |
| `apps/web/src/routes/` | Inventário de páginas, acesso, variações e rotas que não constituem tela. |
| `apps/web/src/components/campaign/` e `apps/web/src/components/user/` | Formulários incorporados, diálogos e estados condicionais. |
| `apps/web/src/lib/`, `apps/web/src/hooks/` e os manifestos da aplicação | Comunicação, estado e tecnologias efetivamente usadas pela interface. |
| `packages/rpc/` | Procedimentos, autorização, serviços e regras de negócio. |
| `packages/validation/` | Contratos e tipos compartilhados usados no diagrama e na explicação da validação. |
| `packages/database/prisma/schemas/` | Entidades e relações persistidas a confrontar com o diagrama, sem transformar o desenho em novo DER. |
| `packages/auth/`, `packages/email/`, `packages/env/` e `packages/logging/` | Responsabilidades auxiliares do padrão do sistema, limitadas ao que for relevante para o desenvolvimento. |
| Configuração, scripts e saída TSDoc existentes na data da execução | Evidência obrigatória para o tópico 6.2.3. |

## Execução obrigatoriamente segmentada

### Parte 0 — Congelamento do snapshot e manifesto

**Objetivo:** impedir que texto, telas, figuras e documentação descrevam versões diferentes.

**Ações:**

1. registrar commit, data, comandos relevantes e estado da aplicação;
2. reler as decisões compartilhadas e conferir o inventário inicial de telas e formulários;
3. verificar se a infraestrutura TSDoc já existe;
4. criar `artifacts/auxiliares/fase-06-evidencias.md` com o estado de todas as evidências;
5. registrar qualquer divergência que altere nomes, escopo ou comportamento compartilhado.

**Portão de saída:** snapshot e inventários identificados, sem iniciar a redação de subseções.

### Parte 1 — Tópico 6.1: padrão do sistema

**Objetivo:** explicar a arquitetura observada e sua relação com a Fase 4.

**Ações:** rastrear pelo menos um fluxo público e um fluxo autenticado do navegador à persistência; definir a caracterização arquitetural; redigir o tópico e o quadro de responsabilidades; revisar limites de segurança, pagamento e infraestrutura.

**Portão de saída:** tópico 6.1 completo, conferido com código e sem classificação arquitetural não demonstrada. Somente então iniciar a Parte 2.

### Parte 2 — Tópico 6.2: lista de telas

**Objetivo:** produzir o inventário textual de telas.

**Ações:** percorrer todas as rotas visuais; consolidar variações; classificar entrada, consulta e relatório integrado; explicar a ausência de relatório autônomo; redigir o quadro sem qualquer imagem.

**Portão de saída:** todas as rotas visuais classificadas, APIs e layouts excluídos e nenhuma captura inserida no tópico. Somente então iniciar a Parte 3.

### Parte 3 — Tópico 6.2.1: imagens dos formulários

**Objetivo:** produzir e validar a evidência visual de cada formulário.

**Ações:** atualizar a matriz F01–F19; preparar estados fictícios; realizar as capturas pelo Chrome DevTools MCP; revisar os arquivos; completar o manifesto; redigir as introduções, legendas, fontes e comentários sem transformar a seção em manual do usuário.

**Portão de saída:** cada formulário possui imagem legível ou impedimento documentado, e não há dados sensíveis. Somente então iniciar a Parte 4.

### Parte 4 — Tópico 6.2.2: pesquisa e diagrama de classe

**Objetivo:** explicar o conceito e produzir um exemplo fiel ao projeto.

**Ações:** consultar a especificação UML; definir o recorte estrutural; conferir os elementos no código; produzir `artifacts/diagramas/fase-06-classes.mmd`; validar sintaxe e legibilidade; redigir a explicação anterior e a interpretação posterior da figura.

**Portão de saída:** toda caixa e relação possui correspondente verificável, a adaptação TypeScript está explícita e a figura não é mera duplicação do DER. Somente então iniciar a Parte 5.

### Parte 5 — Tópico 6.2.3: TSDoc

**Pré-condição do recorte textual:** premissa de implementação e cobertura definida pelo usuário em D-014. A imagem única foi transferida para a integração visual por D-017.

**Objetivo:** documentar a alternativa tecnológica efetivamente adotada.

**Ações:** consultar a documentação oficial; delimitar a cobertura adotada; distinguir a convenção das ferramentas compatíveis; registrar a ausência de evidência sobre ferramenta, comando e saída; reservar somente a figura fornecida para a integração; redigir a seção e seus limites.

**Portão de saída:** distinção correta entre convenção e ferramenta, cobertura apresentada como premissa e ausência de alegações não verificadas sobre a implementação. A figura reservada à integração não bloqueia o encerramento da parte.

### Parte 6 — Consolidação e revisão final

**Objetivo:** transformar as partes verificadas em uma fase coerente.

**Ações:** revisar transições e repetição; aplicar a skill `humanizar` em modo de revisão e perfil acadêmico; conferir fontes, figuras, quadro, nomenclatura e referências cruzadas; executar as verificações técnicas pertinentes; atualizar o quadro central somente depois de todo o aceite.

**Portão de saída:** critérios finais atendidos e Fase 6 pronta para integração. A reserva da imagem TSDoc deverá permanecer explícita, sem ser confundida com uma evidência já incorporada.

## Dependências e integração

- **Fase 3:** manter as capacidades e limitações comprovadas para o MVP.
- **Fase 4:** usar os mesmos atores, componentes e entidades; a Fase 6 demonstra a implementação, sem refazer os três diagramas anteriores.
- **Fase 5:** relacionar as telas às condições de uso já descritas e não introduzir novos requisitos do usuário final.
- **Fase 7:** não transformar decisões de desenvolvimento em alegações de implantação, treinamento, segurança operacional ou backup.
- **Fase 8:** não antecipar práticas ou resultados de manutenção.
- **Referências bibliográficas:** encaminhar apenas as fontes externas efetivamente citadas no texto final.
- **Integração visual:** ajustar a numeração provisória das figuras e do quadro depois das demais fases, preservando título, fonte e menção no texto.

## Afirmações permitidas e limites

| Tema | Formulação segura | Formulação a evitar |
| --- | --- | --- |
| Arquitetura | Descrever responsabilidades e fluxo observados no snapshot. | Declarar MVC, microsserviços ou outro padrão sem evidência estrutural. |
| Interface | Relacionar as telas disponíveis e seus estados relevantes. | Contar API, layout ou componente como tela para ampliar o inventário. |
| Relatório | Explicar que a prestação de contas é integrada ao detalhe e ao painel. | Inventar uma tela autônoma ou exportação de relatório. |
| Formulários | Mostrar unidades reais de entrada e suas variações condicionais. | Capturar botões isolados como se fossem formulários ou omitir estados que mudam campos. |
| Classes | Representar tipos, entidades, contratos e serviços com estereótipos claros. | Alegar que objetos e funções TypeScript são classes concretas. |
| TSDoc | Informar sintaxe, ferramenta e cobertura verificadas. | Confundir TSDoc com o gerador ou afirmar cobertura integral sem medição. |
| Evidência | Usar dados fictícios e capturas do mesmo snapshot. | Expor credenciais, tokens, e-mails pessoais ou dados bancários reais. |
| Resultado | Demonstrar implementação do MVP. | Inferir adoção, eficácia social ou validação por usuários a partir do código. |

## Riscos e controles

| Risco | Controle previsto |
| --- | --- |
| A fase crescer sem limite | Executar uma parte por vez e aplicar um portão de saída antes da seguinte. |
| Inventário ficar obsoleto | Congelar o snapshot e repetir a conferência das rotas no início da execução. |
| Excesso de figuras | Restringir capturas aos formulários; manter a lista de telas exclusivamente textual e permitir pranchas apenas na diagramação. |
| Capturas inconsistentes | Usar o mesmo ambiente, tema, viewport, dados fictícios e manifesto. |
| Estado difícil de reproduzir | Preparar campanhas físicas e virtuais em estados editável, ativo e concluído antes de iniciar as capturas. |
| Dados sensíveis nas imagens | Usar ambiente não produtivo, revisar cada PNG e nunca exibir token ou credencial. |
| Diagrama ilegível ou fictício | Limitar elementos, rastrear cada caixa ao código e declarar estereótipos e adaptação. |
| Duplicação do DER | Priorizar contratos, operações e dependências, usando entidades somente como âncoras. |
| TSDoc diferente do previsto | Analisar a implementação futura antes da escrita e não nomear antecipadamente o gerador. |
| Ausência da imagem TSDoc | Reservar sua inserção à integração visual, sem criar substituto nem apresentar a figura como já incorporada. |
| Confundir desenvolvimento com implantação | Adiar ambiente produtivo, segurança operacional, backup e treinamento para a Fase 7. |

## Dúvidas e pendências

Não há dúvida pendente que impeça a conclusão da fase. O tópico TSDoc foi encerrado com a premissa de implementação definida pelo usuário, sem atribuir ao repositório uma ferramenta, um comando ou uma saída que não foram verificados. A imagem única permanece reservada à integração visual, e nenhuma imagem provisória será usada.

O número F01–F19 é uma estimativa baseada no snapshot de 2026-09-06. Alterações da interface poderão aumentar, reduzir ou reorganizar a matriz. O executor deverá registrar a diferença no manifesto e explicar mudanças que afetem o escopo compartilhado.

## Critérios de aceite do planejamento

- [x] Os tópicos 6.1, 6.2, 6.2.1, 6.2.2 e 6.2.3 possuem finalidade e limites definidos.
- [x] A execução foi separada em partes sequenciais com portões de saída.
- [x] A lista de telas foi planejada sem imagens.
- [x] A ausência de uma tela autônoma de relatório foi tratada sem criar funcionalidade fictícia.
- [x] Os formulários e estados condicionais possuem uma matriz inicial de capturas.
- [x] O Chrome DevTools MCP foi definido como meio preferencial de navegação, conferência e captura.
- [x] Foram previstas proteção de dados, consistência visual e manifesto das evidências.
- [x] O diagrama de classes foi adaptado à implementação TypeScript funcional sem transformar tipos ou módulos em classes inexistentes.
- [x] A fonte Mermaid, a pesquisa UML e a validação da figura foram planejadas.
- [x] TSDoc foi adotado como alternativa a JAVADOC/SUMMARY e será conferido somente após sua implementação.
- [x] O tópico TSDoc foi limitado a uma imagem fornecida pelo usuário.
- [x] Dependências, riscos, fontes internas, fontes externas e limites de afirmação foram registrados.

## Registro de execução

Em 2026-09-06, a Parte 0 registrou o commit `2bd68da`, o recorte funcional adotado e o estado das evidências no manifesto da Fase 6. A conferência não identificou infraestrutura TSDoc nesse snapshot, o que não impede as partes anteriores e será reavaliado antes do tópico 6.2.3.

Na Parte 1, foram conferidos o fluxo de consulta pública e o fluxo autenticado de criação de campanha. A redação descreve a interface web, os procedimentos tipados, a sessão, a validação compartilhada, as regras de campanha, a persistência, os arquivos e os serviços de conta sem citar caminhos internos. O texto foi produzido e revisado com a skill `humanizar`, em modo de criação e perfil acadêmico.

Na Parte 2, as rotas visuais do MVP foram conferidas no código e em uma execução local da aplicação, e quinze telas foram consolidadas no tópico 6.2. A verificação em execução cobriu as páginas públicas e anônimas, além do redirecionamento aplicado pela barreira compartilhada das áreas autenticadas. As variações internas dessas áreas também foram comparadas com o código, sem iniciar uma sessão autenticada. O cadastro estava habilitado no ambiente consultado, e o console do navegador não apresentou erros da aplicação após a disponibilização do banco de dados. O inventário exclui rotas de API, layouts, estados técnicos e diálogos de confirmação. As abas Conta e Segurança foram mantidas como telas distintas, e a prestação de contas foi registrada como relatório integrado ao painel da campanha e ao seu detalhe público. A redação foi produzida com a skill `humanizar` em modo de criação e, nesta correção, revisada em modo de revisão, sempre com o perfil acadêmico.

Na Parte 3, a matriz F01–F19 foi confirmada sem inclusão ou remoção de unidades de entrada. As dezenove capturas foram obtidas pelo Chrome DevTools MCP em uma aplicação local, em tema claro e viewport de desktop. Foi usada uma conta de demonstração, um perfil organizador institucional e campanhas físicas e virtuais fictícias nos estados necessários; esses registros foram removidos do banco de desenvolvimento depois das capturas. Nenhuma credencial, token válido, dado pessoal ou dado bancário real foi exibido. A árvore de acessibilidade foi conferida antes de cada registro e os PNGs foram revisados, com recaptura dos cartões cujo primeiro recorte não preservava a legibilidade completa. O tópico 6.2.1 recebeu as figuras individuais, suas fontes e uma interpretação por grupo. A redação foi revisada com a skill `humanizar`, em modo de revisão e perfil acadêmico.

Na Parte 4, a especificação UML 2.5.1 e a documentação oficial de diagramas de classe do Mermaid foram consultadas em 2026-09-06. O diagrama foi delimitado ao domínio de campanhas para combinar entidades persistidas, enumerações, um contrato de entrada e módulos funcionais reais sem tratá-los todos como classes TypeScript. A rastreabilidade das caixas e relações foi registrada no manifesto de evidências. A fonte `artifacts/diagramas/fase-06-classes.mmd` foi renderizada com Mermaid CLI 11.17.0 e sua saída foi inspecionada visualmente. Após as revisões de coerência, o recorte foi reduzido aos elementos que acrescentam contratos e operações ao DER, e a composição foi reposicionada para não atravessar a caixa do contrato. A renderização passou de aproximadamente 2397 × 1893 para 784 × 893 pixels. O texto do tópico 6.2.2 explicita a adaptação e diferencia o recorte do DER. A redação foi revisada com a skill `humanizar`, em modo de revisão e perfil acadêmico.

Na Parte 5, por instrução do usuário em 2026-09-07, TSDoc foi adotado como alternativa tecnológica a JAVADOC/SUMMARY e sua implementação foi considerada existente. A redação delimitou a cobertura a contratos compartilhados, calendário de campanhas e APIs de domínio nos pacotes de validação, RPC e autenticação. Componentes React, rotas visuais, código gerado, migrações, scripts de infraestrutura e auxiliares privados foram excluídos. A documentação oficial do TSDoc foi consultada para distinguir a convenção das ferramentas compatíveis e descrever resumo, `@remarks`, `@param`, `@returns` e `@throws` apenas como convenções pertinentes. A revisão final explicitou que ferramenta, comando e saída não foram verificados. A imagem única foi reservada à integração visual por D-017, e nenhuma imagem substituta foi criada. A redação foi revisada com a skill `humanizar`, em modo de criação e perfil acadêmico.

Em uma auditoria documental realizada em 2026-09-07, o tópico 6.1 recebeu referências da OWASP para distinguir as funções da validação no cliente e no lado protegido, além de fundamentar a autorização aplicada fora da interface. O tópico 6.2.1 passou a citar a seção 6.3.2 da especificação WebAuthn para a interação necessária durante a criação de uma chave de acesso. As seis páginas da documentação do TSDoc receberam chamadas diferenciadas no texto e no mapa central. As cópias de consulta, os localizadores e os locais de uso foram conferidos na mesma revisão.

Na Parte 6, foram conferidos o quadro de responsabilidades, o inventário de telas, as dezenove capturas, o diagrama de classe, as referências externas e os limites do tópico TSDoc. O texto recebeu menções explícitas aos Quadros 4 e 5 e uma síntese final que preserva para a Fase 7 os temas de implantação, treinamento, segurança operacional e backup. A revisão não identificou ampliação do MVP nem caminhos internos na prosa destinada ao TCC. Com a decisão D-017, a imagem TSDoc ficou como tarefa condicional de integração e a Fase 6 foi concluída em 2026-09-07.

Conforme D-025, a redação dos tópicos 6.1, 6.2 e da síntese final passou a destacar a coerência funcional do produto minimamente viável. As fronteiras de pagamento, logística, relatórios e documentação foram preservadas, mas aparecem como escolhas de responsabilidade e composição do sistema, não como sinal de implementação insuficiente.

## Critérios de conclusão da execução

- [x] O snapshot e o manifesto de evidências foram registrados.
- [x] O tópico 6.1 descreve o padrão real do sistema e está coerente com a Fase 4.
- [x] O tópico 6.2 relaciona todas as telas sem imagens e sem contar rotas técnicas.
- [x] O tópico 6.2.1 possui uma evidência legível para cada formulário confirmado no snapshot.
- [x] As capturas foram produzidas com dados fictícios, revisadas e livres de conteúdo sensível.
- [x] O tópico 6.2.2 cita fonte conceitual conferida e apresenta um diagrama rastreável à implementação.
- [x] A fonte Mermaid do diagrama foi validada e preservada.
- [x] A premissa de implementação TSDoc, seu escopo parcial e as fontes conceituais foram registrados.
- [x] O tópico 6.2.3 registra que ferramenta, comando e saída TSDoc não foram conferidos e não os apresenta como evidência verificada.
- [x] A única imagem do tópico 6.2.3 permanece reservada à integração visual, sem captura substituta ou figura adicional.
- [x] Quadro e figuras incorporados possuem título, fonte, menção e interpretação no texto; os recursos condicionais permanecem identificados para a integração.
- [x] O texto final não cita caminhos internos na prosa nem amplia o escopo do MVP.
- [x] A skill `humanizar` foi aplicada à redação e à revisão acadêmica final.
- [x] A coerência com as Fases 3, 4, 5 e 7 foi conferida antes da atualização do estado central.
