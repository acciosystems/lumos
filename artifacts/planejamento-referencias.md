# Planejamento — Referências bibliográficas

## Identificação e escopo

- Identificador: `referencias`.
- Responsável pelo planejamento: Codex.
- Data do planejamento: 2026-09-07.
- Estado: em planejamento, com inventário inicial preenchido.
- Orientação central: `artifacts/TCC-PRINCIPAL.md`, especialmente D-008, D-009, D-015 e D-019.
- Entregas previstas: `artifacts/auxiliares/referencias-utilizadas.md` e `artifacts/referencias.md`.

Esta etapa deverá consolidar as referências bibliográficas efetivamente usadas no TCC e preservar a rastreabilidade entre cada obra e os trechos que ela sustenta. O mapa central será mantido durante a redação das partes; a lista bibliográfica final será produzida somente na integração, depois da conferência dos metadados e da remoção de fontes que não permanecerem no texto.

O planejamento abrange o RESUMO e o ABSTRACT, a introdução, as oito fases, as considerações finais e outros elementos textuais que venham a empregar fontes externas. Documentos internos do projeto, evidências do repositório e figuras de elaboração própria serão identificados separadamente, pois não devem ser convertidos automaticamente em referências bibliográficas.

## Função de cada arquivo

| Arquivo | Função | Regra de atualização |
| --- | --- | --- |
| `artifacts/auxiliares/referencias-utilizadas.md` | Inventário central e vivo das fontes, locais de uso, localizadores e pendências. | Atualizar sempre que uma citação ou um uso factual for incluído, removido ou deslocado. |
| `artifacts/auxiliares/referencias/` | Acervo de cópias de consulta autorizadas. | Registrar procedência e integridade no `README.md`; não tratar a cópia local como substituta da fonte original. |
| `artifacts/referencias.md` | Lista bibliográfica final destinada ao TCC. | Criar na integração com somente as fontes que permanecerem efetivamente usadas. |
| `docs/references.md` | Lista inicial de pesquisa. | Usar como ponto de partida, sem importar automaticamente sua cadeia lógica ou fontes não citadas. |

## Estrutura do mapa central

Cada fonte receberá um identificador estável no formato `R-001`. O registro deverá informar:

1. referência de trabalho, com os metadados já confirmados;
2. forma de chamada usada no texto;
3. arquivo e seção em que a fonte aparece;
4. afirmação, dado, conceito ou definição sustentada;
5. páginas, seções, DOI, URL ou outro localizador aplicável;
6. cópia local disponível, quando houver;
7. estado da conferência e da normalização final.

O arquivo e a seção são os localizadores estáveis. Números de linha poderão ser mantidos como apoio temporário, mas deverão ser atualizados após alterações estruturais e não substituirão o nome da seção. Quando uma mesma obra for usada em mais de uma parte, todos os usos serão registrados na mesma entrada. Páginas diferentes serão discriminadas por uso.

Páginas web distintas do mesmo autor institucional serão registradas separadamente quando sustentarem afirmações diferentes. Se várias páginas sem data do mesmo autor permanecerem citadas, a integração deverá diferenciar as chamadas e as referências conforme a norma adotada, inclusive com letras após a data quando necessário.

## Inventário inicial

O levantamento realizado em 2026-09-07 identificou os seguintes grupos de fontes externas no texto disponível:

| Grupo | Partes em que aparece | Situação inicial |
| --- | --- | --- |
| Pesquisa Doação Brasil 2024, do IDIS e da Ipsos | Fases 1 e 2. | Uso e páginas identificados; normalização final pendente. |
| Chapman, Hornsey e Gillespie (2021) | Fases 1 e 2. | DOI e cópia local identificados; normalização final pendente. |
| Ghoorah, Mariyani-Squire e Amin (2025) | RESUMO, ABSTRACT e Fases 1 e 2. | DOI, página oficial, cópia local e usos identificados. |
| Rodrigues (2022) | Fases 1 e 2. | Dissertação e páginas usadas identificadas. |
| Varella (2019) | Fases 1 e 2. | Tese, repositório e localizador usado identificados. |
| Especificação UML 2.5.1, da Object Management Group | Fase 4, tópicos 4.1 a 4.3, e Fase 6, tópico 6.2.2. | Seções, páginas, URL e cópia local identificadas. |
| Chen (1976), sobre o modelo entidade-relacionamento | Fase 4, tópico 4.4. | DOI, páginas e cópia de consulta identificados. |
| Documentação de diagramas do Mermaid | Fase 4, tópico 4.4, e Fase 6, tópico 6.2.2. | Páginas de DER e de diagrama de classe, ambas na versão 11.17.2, identificadas. |
| Documentação oficial do TSDoc | Fase 6, tópico 6.2.3. | Página introdutória, especificação e páginas das tags identificadas; chamadas diferenciadas no texto e no mapa. |
| OWASP Cheat Sheet Series | Fase 4, tópico 4.3, e Fase 6, tópico 6.1. | Validação no lado protegido e autorização por requisição; cópias locais e chamadas diferenciadas identificadas. |
| Especificação WebAuthn nível 3, do W3C | Fase 6, tópico 6.2.1. | Cerimônia de registro de chave de acesso e interação com autenticador compatível; recomendação de 25 ago. 2026 e cópia local identificadas. |

O conteúdo detalhado, inclusive cada página da documentação do TSDoc, foi registrado em `artifacts/auxiliares/referencias-utilizadas.md`. O inventário deverá crescer apenas quando uma parte do texto usar uma nova fonte. Obras consultadas e descartadas poderão permanecer no planejamento da parte correspondente, mas não entrarão no mapa central nem na bibliografia final.

## Fluxo de atualização

Ao redigir ou revisar uma parte, o responsável deverá:

1. localizar todas as chamadas autor-data, menções bibliográficas em prosa e afirmações factuais baseadas em fonte externa;
2. associar cada uso a um identificador existente ou criar um novo identificador;
3. registrar seção, finalidade e localizador no mapa central;
4. conferir se a modalidade da afirmação permanece compatível com a fonte;
5. retirar do mapa o uso eliminado, sem apagar outros usos da mesma obra;
6. sinalizar metadados incompletos em vez de completá-los por suposição;
7. atualizar a bibliografia final somente durante a integração.

Uma varredura textual deverá complementar a revisão manual. A busca precisa considerar citações entre parênteses, autores mencionados na frase, fontes de quadros e figuras e páginas institucionais sem autor pessoal. A conferência manual continua necessária porque o RESUMO e o ABSTRACT, por exemplo, usam Ghoorah, Mariyani-Squire e Amin (2025) como apoio factual sem apresentar uma chamada autor-data.

## Normalização e deduplicação

A integração deverá escolher e aplicar uma única norma bibliográfica, conforme a orientação institucional ainda pendente. Antes de formatar `artifacts/referencias.md`, será necessário conferir, para cada entrada:

- autoria pessoal ou institucional;
- título e subtítulo;
- edição, periódico, volume, número, artigo, instituição ou tipo acadêmico;
- ano e, quando disponível, data de publicação;
- DOI e URL canônica;
- data de acesso para conteúdo on-line;
- correspondência entre a chamada no texto e a entrada final.

DOI e URL não deverão gerar entradas duplicadas para a mesma obra. Uma cópia local também não cria outra referência. Versões diferentes somente serão mantidas separadas quando o texto depender de conteúdo próprio de cada versão.

## Registro temporal da pesquisa e datas de acesso

Conforme D-019, o cronograma geral registrará três etapas distintas: a busca exploratória de referências para verificar a viabilidade do TCC, de 17/02/2026 a 16/03/2026; a pesquisa contínua de 10/03/2026 a 01/09/2026, que subsidiou documentos intermediários solicitados pelo orientador; e a filtragem final das referências, de 06/08/2026 a 01/09/2026. As obras consultadas nas duas primeiras etapas não correspondem, necessariamente, às fontes que sustentam o texto final. Essa distinção não permite inventar datas de consulta ou acesso para criar a aparência de uma pesquisa executada ao longo do ano.

O controle temporal seguirá estas regras:

1. usar a data real quando houver histórico, arquivo, anotação ou outro registro de consulta;
2. registrar como **período retrospectivo estimado** qualquer distribuição temática que não possua evidência contemporânea;
3. nunca transformar a data de publicação da obra em data de consulta;
4. usar na referência on-line a data real de acesso ou conferência da página;
5. marcar `[DATA REAL DE ACESSO A REGISTRAR]` enquanto a consulta ainda não tiver ocorrido;
6. não preencher lacunas com datas fictícias, mesmo quando elas produziriam um cronograma visualmente mais uniforme.
7. não incluir no mapa central ou na bibliografia final fontes das etapas exploratória ou intermediária que não sustentem conteúdo mantido no texto.

O cronograma poderá agrupar a pesquisa contínua por tema, por exemplo, problema de doações, requisitos, modelagem, segurança e implantação. Sem evidência temporal, esses agrupamentos permanecerão identificados como reconstrução estimada e não comprovarão que cada obra foi consultada naquele intervalo.

## Fontes internas e elaboração própria

Os documentos `docs/nossa-causa-resumo-pt.md` e `docs/nossa-causa-summary-en.md` sustentam o escopo do produto e precisam continuar diferenciados de pesquisa empírica. O código, as validações, o banco de dados e a aplicação em execução sustentam afirmações sobre implementação. Esses materiais terão rastreabilidade nos planejamentos e manifestos técnicos, mas não serão incluídos automaticamente em `artifacts/referencias.md`.

Quadros, diagramas e capturas com indicação de elaboração própria também não compõem a bibliografia. Suas fontes deverão permanecer nas legendas e nos manifestos de evidência correspondentes.

## Dependências e pendências

- A Fase 8 e as considerações finais ainda poderão introduzir novas fontes.
- As fontes de segurança, contingência e Neon usadas na Fase 7 tiveram o acesso registrado em 2026-09-07.
- A orientação institucional de normalização ainda precisa ser confirmada antes da bibliografia final.
- As chamadas do TSDoc foram diferenciadas; a integração ainda deverá aplicar a norma institucional escolhida de modo uniforme.
- Datas de acesso e metadados ausentes deverão ser conferidos na fonte original durante a integração.
- Liang, Wang e Wang (2022) permanece excluído conforme D-009 e não deverá reaparecer no mapa.

## Novas referências incorporadas na Fase 7

As novas fontes abaixo foram incorporadas à redação da Fase 7 e registradas no mapa central. As fontes R-016 e R-017, já empregadas em fases anteriores, também foram reutilizadas. A inclusão em `artifacts/referencias.md` ocorrerá na integração da bibliografia final.

| Fase e tópico | Fonte utilizada | Uso na redação | Registro no mapa central |
| --- | --- | --- | --- |
| Fase 7, 7.6.1 Segurança — senhas | OWASP, *Password Storage Cheat Sheet*, e Better Auth, *Security*. | Distinguir hash de senha, criptografia reversível e o algoritmo padrão do serviço de autenticação. | R-019 e R-020. |
| Fase 7, 7.6.1 Segurança — dados criptografados | OWASP, *Cryptographic Storage Cheat Sheet*. | Delimitar proteção de dados em repouso e gestão de segredos, sem alegar garantias não verificadas. | R-021. |
| Fase 7, 7.6.2 Backup | NIST, *Contingency Planning Guide for Federal Information Systems*. | Delimitar planejamento de contingência, recuperação e prioridades de backup. | R-022; o escopo federal foi adaptado ao contexto acadêmico. |
| Fase 7, 7.6.2 Backup na Neon | Neon, *Connection pooling* e *Announcing Point-in-Time Restore*. | Fundamentar a separação de conexões e condicionar a recuperação pontual à configuração disponível. | R-023 e R-024; nenhum recurso dependente de plano foi presumido. |

## Referências reservadas para fases futuras

A fonte abaixo foi selecionada para orientar a Fase 8, mas ainda não sustenta nenhum trecho do TCC. Por isso, não entra no mapa central nem na bibliografia final até que uma afirmação correspondente seja mantida no texto.

| Fase e tópico | Fonte candidata | Uso permitido na redação futura | Cuidados antes de citar |
| --- | --- | --- | --- |
| Fase 8, Manutenção do sistema | INTERNATIONAL ORGANIZATION FOR STANDARDIZATION (ISO); INTERNATIONAL ELECTROTECHNICAL COMMISSION (IEC); INSTITUTE OF ELECTRICAL AND ELECTRONICS ENGINEERS (IEEE). *ISO/IEC/IEEE 14764:2022: Software engineering — Software life cycle processes — Maintenance*. 2022. Disponível em: <https://www.iso.org/standard/80710.html>. | Definir manutenção de software e distinguir atividades de manutenção de operação, backup e recuperação. | Conferir a norma e a disponibilidade institucional antes da citação final; não apresentar atividades propostas como práticas já realizadas. |

Ao usar essa fonte, o agente responsável deverá baixar ou conferir uma cópia de consulta autorizada, criar a entrada correspondente no mapa central e registrar seção, finalidade e localizador conforme D-015.

## Critérios de aceite

- [x] Existe um mapa central com identificadores estáveis e os usos atualmente encontrados.
- [x] Cada fonte externa citada nos textos disponíveis possui ao menos uma localização de uso.
- [x] Fontes internas, evidências técnicas e elaboração própria foram separadas da bibliografia.
- [x] Localizadores já conferidos foram preservados sem criação de metadados ausentes.
- [x] Datas reais, retrospectivamente estimadas e planejadas foram separadas; datas de acesso fictícias foram vedadas.
- [ ] As partes futuras atualizaram o mapa ao incluir ou remover fontes.
- [ ] Todas as chamadas do texto integrado possuem entrada correspondente no mapa.
- [ ] Toda entrada destinada à bibliografia final permanece usada no texto integrado.
- [ ] Autoria, título, publicação, DOI ou URL e data de acesso foram conferidos na fonte original.
- [ ] `artifacts/referencias.md` foi normalizado segundo a orientação institucional e revisado contra o mapa central.
