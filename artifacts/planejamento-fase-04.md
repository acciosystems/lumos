# Planejamento da Fase 4 — Projeto lógico: sistema proposto

## Estado da atividade

- Responsável: Codex.
- Estado: concluído em 2026-09-05, após planejamento, redação, fontes Mermaid e revisão. A exportação dos diagramas pertence à etapa condicional de diagramação final e foi adiada por orientação do usuário; por isso, não impede a conclusão desta fase.
- Recorte: MVP da plataforma Nossa Causa descrito nas fases anteriores.
- Entregas disponíveis: texto da Fase 4 e fontes editáveis dos diagramas em Mermaid. As exportações serão produzidas somente quando forem necessárias para a diagramação final, sem alterar o estado concluído desta fase.

## Objetivo

A Fase 4 apresentará o projeto lógico da Nossa Causa por meio de três visões complementares. A primeira mostrará o que cada tipo de usuário pode fazer. A segunda explicará os blocos que executam o sistema e a comunicação entre eles. A terceira representará as principais informações armazenadas e as relações entre elas.

O texto deverá permitir que um leitor sem formação técnica compreenda a finalidade de cada representação antes de examiná-la. Os diagramas não funcionarão como inventários exaustivos do código. Eles destacarão somente os elementos necessários para explicar o funcionamento do MVP.

## Decisões fornecidas pelo usuário

1. A decisão anterior de dispensar referências foi revogada. Os fundamentos conceituais dos tópicos 4.1 a 4.4 usarão fontes primárias adequadas à UML, aos casos de uso, à organização lógica da aplicação e ao DER.
2. Cada tópico começará com uma explicação de seu conceito, de sua finalidade e da forma de leitura adotada no trabalho. As citações sustentarão apenas esses conceitos; a descrição da Nossa Causa continuará baseada na conferência técnica interna do MVP.
3. Todos os diagramas serão escritos em Mermaid.
4. O texto destinado ao TCC não citará diretamente nenhum arquivo do repositório. A conferência do código servirá apenas como evidência interna de consistência.

## Adaptações propostas

### Significado de “sistema proposto”

O sistema proposto será modelado conforme o MVP implementado e analisado na Fase 3. A expressão não será usada para incluir recursos futuros. Reputação, denúncias, recompensas, notificações automáticas e processamento de pagamentos permanecerão fora dos diagramas.

### Papel do tópico 4.1

O tópico 4.1 explicará o que é UML e por que diferentes diagramas ajudam a observar o mesmo sistema sob perspectivas distintas. A explicação será suficiente para preparar a leitura das seções seguintes, sem apresentar histórico da linguagem, comparação de ferramentas ou revisão bibliográfica.

Não haverá um diagrama autônomo em 4.1, pois a seção introduz a linguagem de modelagem utilizada em 4.2 e orienta a leitura do projeto lógico. Essa opção evita uma figura sem função específica.

### Diagrama de caso de uso em Mermaid

O Mermaid não possui uma sintaxe própria para diagramas de caso de uso UML. A representação será construída com um fluxograma, mantendo a separação visual entre atores, limite do sistema e ações. Os casos de uso terão formato distinto dos atores e serão nomeados com verbos no infinitivo.

O texto esclarecerá que a figura é uma representação de casos de uso feita em Mermaid. Não será alegada conformidade integral com todos os elementos gráficos da notação UML.

### Diagrama de implementação

A expressão “diagrama de implementação” será interpretada como uma visão lógica dos principais blocos que executam a aplicação. O desenho mostrará a interface web, os serviços responsáveis pelas regras do sistema, a autenticação, o banco de dados, o armazenamento de arquivos e o envio de mensagens necessárias à conta do usuário.

O diagrama usará um fluxograma Mermaid. Os rótulos serão compreensíveis para leitores não especializados e não dependerão de nomes de bibliotecas, pastas ou arquivos. Essa escolha mantém o foco na organização do sistema, e não nos detalhes da programação.

### DER conceitual

O Diagrama Entidade-Relacionamento será conceitual. Ele mostrará entidades do domínio, atributos que ajudam a diferenciá-las e cardinalidades relevantes. Estruturas internas de autenticação, controle temporário de arquivos, repetição segura de operações e outros registros de infraestrutura serão omitidos, pois não contribuem para a compreensão das campanhas.

Uma estrutura de doação financeira individual também não será representada. No MVP, a plataforma apenas divulga PIX ou dados bancários do organizador e não registra nem processa cada transferência.

## Estrutura planejada do texto

### 4.1 UML

A seção deverá:

- definir UML como uma forma padronizada de representar diferentes aspectos de um sistema;
- explicar que um diagrama simplifica a realidade e responde a uma pergunta específica;
- apresentar as três visões utilizadas nesta fase: ações dos usuários, organização da implementação e estrutura dos dados;
- informar que as representações correspondem ao recorte do MVP;
- preparar a leitura dos diagramas com referência à especificação UML.

### 4.2 Diagrama de caso de uso

Antes da figura, o texto explicará que um caso de uso representa um objetivo alcançado por um ator ao interagir com o sistema. Também apresentará a diferença entre ator e usuário individual: o ator corresponde a um papel, não a uma pessoa específica.

O diagrama terá três atores:

- visitante, que acessa informações públicas;
- usuário autenticado, que pode participar de campanhas físicas e administrar a própria conta;
- organizador, papel assumido pelo usuário que mantém um perfil próprio e gerencia campanhas.

Os casos de uso serão agrupados para evitar uma figura excessivamente larga:

| Grupo | Casos de uso previstos |
| --- | --- |
| Consulta pública | Consultar campanhas, aplicar filtros, visualizar detalhes, consultar identificação do organizador, acompanhar participantes e consultar prestação de contas. |
| Conta e participação | Criar conta, entrar no sistema, administrar conta, participar de campanha física e cancelar participação. |
| Perfil e campanhas | Manter perfil de organizador, criar campanha, editar campanha, publicar atualização, registrar progresso de itens, concluir campanha e cancelar campanha. |
| Transparência | Enviar prestação de contas e acrescentar evidências. |

As relações entre os papéis serão representadas sem duplicar ações. O organizador será tratado como uma especialização prática do usuário autenticado. As ações públicas continuarão acessíveis aos demais papéis.

Depois da figura, um parágrafo destacará os limites do fluxo: a contribuição virtual ocorre fora da plataforma, a participação registrada pertence às campanhas físicas e a prestação de contas é declarada pelo organizador.

### 4.3 Diagrama de implementação

A seção começará explicando que esse diagrama mostra como as responsabilidades do sistema são distribuídas entre seus blocos. O objetivo não será descrever cada tecnologia, mas indicar o caminho seguido por uma ação desde a tela até o armazenamento da informação.

O diagrama deverá conter:

| Bloco | Responsabilidade apresentada ao leitor |
| --- | --- |
| Navegador do usuário | Exibir as páginas e receber as ações do visitante, usuário ou organizador. |
| Aplicação web | Organizar as telas, os formulários e as consultas. |
| Serviços da aplicação | Aplicar permissões e regras de campanhas, perfis e contas. |
| Autenticação | Identificar o usuário e proteger as operações restritas. |
| Validação | Conferir os dados antes de sua utilização e gravação. |
| Banco de dados | Manter usuários, perfis, campanhas, participações, atualizações e prestações de contas. |
| Armazenamento de arquivos | Guardar imagens das campanhas e evidências da prestação de contas. |
| Serviço de e-mail | Apoiar confirmações e recuperação de acesso à conta. |

As setas mostrarão o fluxo principal de solicitações. Integrações externas aparecerão somente quando fizerem parte do comportamento existente. Não haverá processador de pagamento ou serviço de notificações de campanha.

Depois do diagrama, o texto explicará que a separação de responsabilidades ajuda a manter regras sensíveis no lado protegido da aplicação, enquanto a interface se concentra na interação com o usuário.

### 4.4 DER

A seção definirá entidade como algo relevante sobre o qual o sistema mantém informações, atributo como uma característica registrada e relacionamento como a ligação entre duas entidades. A cardinalidade será explicada em linguagem simples antes da figura.

O diagrama será escrito com `erDiagram` e deverá representar:

| Entidade | Conteúdo essencial |
| --- | --- |
| Usuário | Identificação e dados básicos da conta. |
| Perfil de organizador | Tipo de perfil, nome público e, quando aplicável, CNPJ e estado de verificação. |
| Campanha | Modalidade, estado, período, tema, região e dados próprios das campanhas físicas ou virtuais. |
| Ponto de coleta | Endereço e instruções de entrega de uma campanha física. |
| Participação | Vínculo do usuário com uma campanha física e situação da participação. |
| Atualização | Comunicado publicado pelo organizador em uma campanha. |
| Prestação de contas | Resultado declarado após a conclusão da campanha. |
| Arquivo da campanha | Imagem da campanha ou evidência vinculada à prestação de contas. |

As relações principais serão:

- um usuário pode possuir um perfil de organizador;
- um perfil de organizador pode criar várias campanhas;
- uma campanha física possui um ou mais pontos de coleta;
- usuários podem participar de várias campanhas físicas, e cada campanha pode receber várias participações;
- uma campanha pode receber várias atualizações;
- uma campanha concluída pode possuir uma prestação de contas;
- uma campanha pode possuir arquivos, e a prestação de contas pode reunir evidências.

O texto posterior ao diagrama explicará as diferenças condicionais entre campanhas físicas e virtuais. Campos de local, meta de itens e pontos de coleta pertencem à modalidade física. PIX e dados bancários pertencem à modalidade virtual. A prestação registra total de itens ou total monetário conforme a modalidade, sem representar transações individuais.

## Convenções para os diagramas

- Usar português brasileiro em todos os rótulos.
- Preferir orientação vertical quando isso melhorar a leitura em página de documento.
- Evitar cores como única forma de transmitir significado.
- Manter nomes curtos e explicar detalhes no texto ao redor da figura.
- Identificar cada figura com número provisório, título e fonte.
- Usar “Fonte: elaboração própria (2026)” abaixo de cada figura.
- Mencionar cada figura no parágrafo anterior e interpretar seus pontos principais no parágrafo seguinte.
- Manter o código Mermaid como fonte editável e gerar uma exportação vetorial, preferencialmente SVG, quando ela for necessária para a diagramação final.
- Validar a sintaxe e a legibilidade das exportações no momento em que forem produzidas.

## Referências conceituais

- **Object Management Group (2017):** fundamentará a definição de UML no tópico 4.1, a noção de casos de uso e atores no tópico 4.2 e a distinção entre a visão lógica elaborada para o TCC e as construções de implantação da UML no tópico 4.3. Serão usados, respectivamente, a cláusula 1, p. 1; a seção 18.1, pp. 639–642; e as seções 19.1 e 19.2, pp. 653–654.
- **Chen (1976):** fundamentará, no tópico 4.4, as noções de entidade, relacionamento e atributo do modelo entidade-relacionamento. A consulta cobrirá as páginas 10 a 12 do artigo.
- **Mermaid, documentação de DER (s.d.b):** apoiará a leitura da notação de pé-de-galinha e dos marcadores de cardinalidade usados no tópico 4.4. A consulta cobrirá a documentação oficial de *Entity Relationship Diagrams*, apresentada como versão 11.17.2.
- **OWASP, *Authorization Cheat Sheet* (s.d.b):** fundamentará, no tópico 4.3, o princípio geral de que a autorização não deve depender do cliente e precisa ser verificada em cada requisição. A fonte não será usada como evidência da organização interna do MVP.

As citações bibliográficas serão registradas no mapa central de referências. Elas não converterão as características do MVP em resultados da literatura nem substituirão a conferência técnica do sistema.

## Fontes internas de conferência

A redação usará as referências conceituais acima e não citará arquivos do repositório. Para preservar a fidelidade ao sistema, a descrição do MVP será conferida internamente com:

- os fluxos públicos e autenticados disponíveis na interface;
- as permissões e regras aplicadas a campanhas, perfis, participação e prestação de contas;
- as validações dos dados informados pelos usuários;
- a estrutura persistida das entidades e de seus relacionamentos;
- os serviços externos realmente utilizados para arquivos e mensagens de conta;
- as conclusões funcionais registradas na Fase 3.

Esses materiais comprovam internamente o recorte modelado, mas seus caminhos e nomes de arquivo não aparecerão no conteúdo destinado ao TCC.

## Dependências e integração

- **Fase 2:** manter o problema e o escopo já estabelecidos, sem transformar inferências do projeto em resultados de pesquisa.
- **Fase 3:** reproduzir os mesmos atores, controles, modalidades, estados e limites do MVP.
- **Fase 5:** não antecipar requisitos mínimos de equipamento ou software do usuário final.
- **Fase 6:** usar a mesma organização geral ao explicar o desenvolvimento e selecionar as telas da aplicação.
- **Fase 7:** não antecipar decisões de implantação, treinamento, segurança ou backup que ainda não foram descritas.
- **Integração final:** revisar a numeração das figuras e confirmar que nenhum caminho interno permaneceu no texto.

## Sequência prevista de execução

1. Conferir novamente os fluxos, as regras, os componentes e os relacionamentos da versão adotada como recorte.
2. Fixar a terminologia comum dos atores, ações, blocos da aplicação e entidades.
3. Redigir a explicação introdutória de UML e a orientação geral de leitura.
4. Produzir e revisar o diagrama de caso de uso em Mermaid.
5. Produzir e revisar o diagrama de implementação em Mermaid.
6. Produzir e revisar o DER com a sintaxe própria do Mermaid.
7. Quando solicitada para a diagramação final, renderizar os três diagramas e corrigir problemas de sintaxe, sobreposição ou legibilidade.
8. Redigir as explicações que antecedem e interpretam cada figura, com as citações conceituais pertinentes.
9. Atualizar o mapa central de referências e conferir os localizadores das fontes utilizadas.
10. Aplicar a skill `humanizar` ao texto final, com perfil acadêmico, preservando nomes e regras do domínio.
11. Conferir coerência com as Fases 2, 3 e 6 e remover qualquer referência direta a arquivos internos.
12. Atualizar o quadro de progresso somente após a revisão completa.

## Riscos e controles

| Risco | Controle previsto |
| --- | --- |
| Tratar o desenho Mermaid como UML formal completa | Explicar a adaptação visual e usar somente os elementos necessários ao projeto. |
| Sobrecarregar os diagramas | Limitar cada figura a uma pergunta e deslocar detalhes para o texto. |
| Incluir funcionalidades futuras | Conferir todos os elementos com o recorte do MVP e com a Fase 3. |
| Confundir contribuição virtual com pagamento processado | Mostrar apenas a divulgação dos dados bancários e manter o pagamento fora da plataforma. |
| Expor detalhes internos no texto final | Revisar nomes, legendas, fontes e parágrafos em busca de caminhos e nomes de arquivo. |
| Transformar o DER conceitual em cópia completa do banco | Manter apenas entidades e atributos relevantes para explicar o domínio. |
| Produzir figuras ilegíveis no documento | Quando a exportação for solicitada, preferir SVG, testar orientação e reduzir cruzamentos entre linhas. |

## Dúvidas e pendências

Não há dúvida que impeça a redação. A interpretação adotada para o diagrama de implementação será uma visão dos blocos da aplicação e de suas comunicações. Caso o modelo institucional use “implementação” como sinônimo de “implantação”, a figura poderá ser ajustada na integração sem alterar os demais diagramas.

A numeração definitiva das figuras dependerá da integração com as outras fases. As exportações serão geradas e testadas no editor usado para montar a versão final do TCC somente quando essa etapa for necessária. Essa atividade condicional pertence à diagramação final e não reabre a Fase 4, que permanece concluída com suas fontes Mermaid editáveis.

## Registro da execução e revisão

Em 2026-09-05, os fluxos, as permissões, as regras de campanha e os relacionamentos de dados do MVP foram confrontados com os três modelos produzidos. Foram elaborados um diagrama de caso de uso, um diagrama de implementação e um DER em Mermaid. As fontes editáveis permanecem disponíveis; a geração de exportações foi adiada por orientação do usuário para a etapa condicional de diagramação final, sem pendência para a conclusão da Fase 4.

O texto final foi redigido e revisado com a skill `humanizar`, em modo de criação e perfil acadêmico. A revisão preservou as regras de participação, modalidades de campanha e prestação de contas, retirou uma formulação que poderia associar a prestação de contas a campanhas canceladas e confirmou a ausência de citações diretas a arquivos internos.

Uma revisão posterior de coerência detalhou os casos de uso, incluiu criação e acesso à conta, separou as consultas públicas das ações de criação e entrada e atribuiu a manutenção do perfil ao usuário autenticado. O DER passou a apresentar o período e os dados próprios das modalidades física e virtual. As exportações permanecerão adiadas até uma solicitação de diagramação, sem alterar a conclusão da fase.

Em 2026-09-07, a orientação que dispensava referências foi revogada. A redação passou a citar a especificação UML da OMG nos tópicos 4.1 a 4.3, Chen (1976) e a documentação de DER do Mermaid no tópico 4.4, além da OWASP no princípio geral de autorização apresentado no tópico 4.3. A descrição da organização interna da Nossa Causa permaneceu vinculada à conferência técnica do MVP. Os conceitos, os localizadores, as cópias de consulta e os locais de uso foram registrados no mapa central.

## Critérios de aceite do planejamento

- [x] Os tópicos 4.1 a 4.4 possuem finalidade e conteúdo delimitados.
- [x] Os fundamentos conceituais dos tópicos 4.1 a 4.4 usam referências primárias adequadas, sem atribuir à literatura características específicas do MVP.
- [x] Os três diagramas previstos usam Mermaid.
- [x] A adaptação do caso de uso às capacidades do Mermaid está registrada.
- [x] O significado de diagrama de implementação foi definido.
- [x] Atores, ações, componentes e entidades correspondem ao MVP.
- [x] Funcionalidades futuras e processamento de pagamentos ficaram fora do modelo.
- [x] O DER foi limitado às entidades conceituais relevantes.
- [x] O texto final não citará arquivos do repositório.
- [x] Foram previstas fonte editável, exportação e validação visual dos diagramas.
- [x] As dependências com as Fases 2, 3, 5, 6 e 7 foram registradas.
- [x] O texto final foi redigido e revisado em português brasileiro, com citações conceituais e sem referências a arquivos internos.
- [x] As três fontes Mermaid foram mantidas como os artefatos de diagrama disponíveis nesta etapa.
- [x] A exportação vetorial e sua validação ficaram condicionadas à solicitação de diagramação final; essa atividade não é pendência da Fase 4 concluída.
- [x] A redação foi conferida com os limites funcionais da Fase 3, inclusive a prestação de contas após a conclusão da campanha.
