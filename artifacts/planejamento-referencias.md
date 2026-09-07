# Planejamento — Referências bibliográficas

## Identificação e escopo

- Identificador: `referencias`.
- Responsável pelo planejamento: Codex.
- Data do planejamento: 2026-09-07.
- Estado: em planejamento, com inventário inicial preenchido.
- Orientação central: `artifacts/TCC-PRINCIPAL.md`, especialmente D-008, D-009 e D-015.
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
| Especificação UML 2.5.1, da Object Management Group | Fase 6, tópico 6.2.2. | Seções, páginas e URL identificadas. |
| Documentação de diagrama de classes do Mermaid | Fase 6, tópico 6.2.2. | Página e versão consultada identificadas. |
| Documentação oficial do TSDoc | Fase 6, tópico 6.2.3. | Página introdutória, especificação e páginas das tags identificadas; diferenciação das entradas na citação final pendente. |

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

## Fontes internas e elaboração própria

Os documentos `docs/nossa-causa-resumo-pt.md` e `docs/nossa-causa-summary-en.md` sustentam o escopo do produto e precisam continuar diferenciados de pesquisa empírica. O código, as validações, o banco de dados e a aplicação em execução sustentam afirmações sobre implementação. Esses materiais terão rastreabilidade nos planejamentos e manifestos técnicos, mas não serão incluídos automaticamente em `artifacts/referencias.md`.

Quadros, diagramas e capturas com indicação de elaboração própria também não compõem a bibliografia. Suas fontes deverão permanecer nas legendas e nos manifestos de evidência correspondentes.

## Dependências e pendências

- As Fases 7 e 8 e as considerações finais ainda poderão introduzir novas fontes.
- A orientação institucional de normalização ainda precisa ser confirmada antes da bibliografia final.
- As páginas oficiais do TSDoc deverão receber chamadas distintas se todas permanecerem necessárias ao tópico 6.2.3.
- Datas de acesso e metadados ausentes deverão ser conferidos na fonte original durante a integração.
- Liang, Wang e Wang (2022) permanece excluído conforme D-009 e não deverá reaparecer no mapa.

## Critérios de aceite

- [x] Existe um mapa central com identificadores estáveis e os usos atualmente encontrados.
- [x] Cada fonte externa citada nos textos disponíveis possui ao menos uma localização de uso.
- [x] Fontes internas, evidências técnicas e elaboração própria foram separadas da bibliografia.
- [x] Localizadores já conferidos foram preservados sem criação de metadados ausentes.
- [ ] As partes futuras atualizaram o mapa ao incluir ou remover fontes.
- [ ] Todas as chamadas do texto integrado possuem entrada correspondente no mapa.
- [ ] Toda entrada destinada à bibliografia final permanece usada no texto integrado.
- [ ] Autoria, título, publicação, DOI ou URL e data de acesso foram conferidos na fonte original.
- [ ] `artifacts/referencias.md` foi normalizado segundo a orientação institucional e revisado contra o mapa central.

