# Planejamento — Referências

## Identificação e escopo

- Identificador: `referencias`.
- Responsável: Codex.
- Planejamento inicial: 2026-09-07.
- Revisão do planejamento: 2026-09-08.
- Estado: concluído, com lista final, mapa central e chamadas normalizadas.
- Orientação central: `artifacts/TCC-PRINCIPAL.md`, especialmente D-008, D-009, D-015, D-019, D-027 e D-030.
- Entregas previstas: `artifacts/auxiliares/referencias-utilizadas.md` e `artifacts/referencias.md`.

Esta etapa consolidará somente as fontes externas efetivamente usadas no TCC. A execução deverá preservar a correspondência entre cada chamada no texto, a entrada no mapa central e a referência completa. Fontes consultadas que não sustentem conteúdo mantido serão excluídas da lista final.

O corpus abrange o RESUMO, o ABSTRACT, a introdução, as oito fases e as considerações finais. Documentos internos do projeto, código, banco de dados, capturas e materiais de elaboração própria continuarão rastreados nos planejamentos e manifestos técnicos, sem inclusão automática na lista de referências.

## Base normativa adotada

A normalização seguirá as edições vigentes identificadas durante esta revisão:

- ABNT NBR 6023:2025, para elaboração e ordenação das referências;
- ABNT NBR 10520:2023, para o sistema de chamadas e a correspondência entre citações e referências;
- ABNT NBR 14724:2024, para a apresentação da seção pós-textual no documento final.

O sistema autor-data já utilizado no TCC será preservado. Em consequência, a lista final será única e ordenada alfabeticamente pelo elemento de entrada. Não haverá numeração das referências nem separação por tipo de documento. Se a instituição fornecer manual próprio, suas regras de apresentação serão confrontadas com estas normas antes da diagramação final.

## Função de cada arquivo

| Arquivo | Função | Regra de atualização |
| --- | --- | --- |
| `artifacts/auxiliares/referencias-utilizadas.md` | Inventário central das fontes, usos, localizadores e pendências. | Atualizar sempre que uma citação, menção bibliográfica ou uso factual for incluído, removido ou deslocado. |
| `artifacts/auxiliares/referencias/` | Acervo de cópias autorizadas para consulta. | Registrar procedência e integridade no `README.md`; a cópia local não substitui a fonte original. |
| `artifacts/referencias.md` | Lista final destinada ao TCC. | Criar somente após a auditoria cruzada do texto e dos metadados. |
| `docs/references.md` | Lista inicial da pesquisa. | Usar apenas como ponto de partida; não importar fontes sem uso remanescente. |

## Diagnóstico do inventário atual

O mapa central contém 26 fontes externas candidatas à lista final, identificadas de R-001 a R-026. Elas se distribuem nos seguintes tipos:

| Tipo documental | Identificadores | Tratamento previsto |
| --- | --- | --- |
| Relatório de pesquisa | R-001 | Conferir responsabilidade institucional, local, entidade editora, ano, URL e acesso. |
| Artigos de periódico | R-002, R-003 e R-014 | Conferir autores, título do artigo, periódico, local quando aplicável, volume, número, paginação ou número do artigo, ano, DOI, URL e acesso. |
| Dissertação e tese | R-004 e R-005 | Conferir autor, título, ano de depósito, tipo e grau, programa quando informado, instituição, local, repositório, URL e acesso. |
| Especificações, normas, recomendações e guias técnicos | R-006, R-018, R-022, R-025 e R-026 | Conferir entidade responsável, título, versão ou número, local, editora ou órgão publicador, data, DOI ou URL e acesso. |
| Documentação e páginas on-line | R-007 a R-013, R-015 a R-017, R-019 a R-021, R-023 e R-024 | Conferir autoria institucional, título da página, nome do portal quando necessário, versão, data, URL canônica e acesso. |

O levantamento inicial identificou quatro pendências estruturais, resolvidas na execução:

1. as quatorze entradas que usavam `s.d.` receberam datas confirmadas ou datas entre colchetes sustentadas por registros editoriais oficiais;
2. as letras das chamadas de Mermaid, TSDoc e OWASP foram recalculadas depois da ordenação definitiva;
3. os DOI foram registrados como URLs completas;
4. os elementos de publicação e a consulta realizada em 8 set. 2026 foram registrados na lista final.

Na NBR 6023:2025, a data é elemento obrigatório. Por isso, `s.d.` não permanecerá na bibliografia. Para cada página sem data aparente, a execução deverá procurar, nesta ordem, data de publicação ou atualização no documento, metadados da página, histórico oficial de versão e registro editorial confiável. Se ainda não houver ano explícito, será usada uma estimativa entre colchetes admitida pela norma e sustentada por evidência verificável. A data de acesso não será convertida automaticamente em data de publicação.

## Padrão de autoria e chamadas

As referências adotarão um único padrão para nomes pessoais e institucionais:

- autores pessoais: sobrenome de entrada em maiúsculas, seguido dos prenomes por extenso quando confirmados na fonte; iniciais serão mantidas somente quando a expansão não puder ser verificada;
- dois ou três autores: todos serão indicados e separados por ponto e vírgula;
- quatro ou mais autores: todos serão indicados quando constarem da fonte; o uso do primeiro seguido de *et al.* ficará restrito a impedimento documental registrado no mapa;
- autores institucionais: entrada pelo nome oficial da entidade, com sigla apenas quando fizer parte da forma adotada ou for necessária à chamada;
- autoria desconhecida: entrada pelo título, sem uso da palavra “anônimo”.

As chamadas no corpo do texto serão revistas conforme a NBR 10520:2023. Nomes por extenso dentro de parênteses não permanecerão integralmente em caixa alta; siglas consolidadas, como IDIS, NIST, OWASP e W3C, conservarão sua grafia. Assim, formas provisórias como `(NEON, ...)`, `(MERMAID, ...)`, `(TSDOC, ...)` e `(OBJECT MANAGEMENT GROUP, ...)` serão revistas para `(Neon, ...)`, `(Mermaid, ...)`, `(TSDoc, ...)` e `(Object Management Group, ...)`, se essas forem as entradas confirmadas.

Letras minúsculas após o ano serão usadas somente quando duas ou mais obras da mesma autoria tiverem a mesma data final. A atribuição seguirá a ordem das respectivas entradas na lista de referências e será reproduzida em todas as chamadas do texto e no mapa central. Nenhuma letra provisória será preservada apenas por já aparecer nos arquivos atuais.

## Padrão dos elementos e da apresentação

Cada referência será montada conforme o tipo documental, com os elementos em sequência padronizada e pontuação uniforme. Serão observadas as seguintes decisões:

- o título da seção será `REFERÊNCIAS`, centralizado e sem numeração no documento final;
- as referências formarão uma lista única, sem marcadores e sem subtítulos por tipo;
- o alinhamento será à margem esquerda;
- cada entrada usará espaçamento simples, com uma linha em branco de espaço simples entre entradas;
- o destaque tipográfico será aplicado de modo uniforme. No Markdown, será usado itálico no título da obra completa ou da publicação que contém a parte referenciada; o subtítulo não receberá o destaque;
- títulos de artigos serão seguidos pelo título destacado do periódico; títulos de páginas e documentos completos receberão o destaque correspondente ao documento referenciado;
- DOI será apresentado como URL completa, no formato `DOI: https://doi.org/...`, quando existir;
- documentos on-line terminarão com `Disponível em:` e `Acesso em:`, com URL canônica e data real de consulta;
- informações obtidas fora do documento serão colocadas entre colchetes quando a norma assim exigir;
- elementos complementares serão incluídos de maneira consistente entre referências do mesmo tipo;
- títulos, nomes, datas, versões e identificadores serão transcritos sem tradução, correção editorial ou preenchimento por inferência não documentada.

O Markdown preservará conteúdo e hierarquia para transferência. Fonte, margens, paginação e demais detalhes de diagramação serão aplicados no documento final conforme a NBR 14724:2024 e o eventual manual da instituição.

## Ordem alfabética definitiva

Considerando os elementos de entrada atualmente registrados, a sequência de trabalho será a seguinte:

| Posição | Identificador | Elemento de entrada e título abreviado |
| ---: | --- | --- |
| 1 | R-019 | BETTER AUTH — *Security* |
| 2 | R-002 | CHAPMAN; HORNSEY; GILLESPIE — *To What Extent Is Trust...* |
| 3 | R-014 | CHEN — *The entity-relationship model...* |
| 4 | R-003 | GHOORAH; MARIYANI-SQUIRE; AMIN — *Relationships between financial transparency...* |
| 5 | R-026 | IEEE COMPUTER SOCIETY — *Guide to the Software Engineering Body of Knowledge...* |
| 6 | R-025 | INTERNATIONAL ORGANIZATION FOR STANDARDIZATION; IEC; IEEE — *ISO/IEC/IEEE 14764:2022...* |
| 7 | R-007 | MERMAID — *Class diagrams* |
| 8 | R-015 | MERMAID — *Entity Relationship Diagrams* |
| 9 | R-023 | NEON — *Connection pooling* |
| 10 | R-006 | OBJECT MANAGEMENT GROUP — *OMG Unified Modeling Language...* |
| 11 | R-017 | OPEN WEB APPLICATION SECURITY PROJECT — *Authorization Cheat Sheet* |
| 12 | R-021 | OPEN WEB APPLICATION SECURITY PROJECT — *Cryptographic Storage Cheat Sheet* |
| 13 | R-016 | OPEN WEB APPLICATION SECURITY PROJECT — *Input Validation Cheat Sheet* |
| 14 | R-020 | OPEN WEB APPLICATION SECURITY PROJECT — *Password Storage Cheat Sheet* |
| 15 | R-001 | PESQUISA — *Pesquisa Doação Brasil 2024* |
| 16 | R-004 | RODRIGUES — *O efeito da adoção do accountability...* |
| 17 | R-024 | SHORTISS — *Announcing Point-in-Time Restore* |
| 18 | R-022 | SWANSON; BOWEN; PHILLIPS; GALLUP; LYNES — *Contingency Planning Guide...* |
| 19 | R-008 | TSDOC — *How can I use TSDoc?* |
| 20 | R-011 | TSDOC — *@param* |
| 21 | R-010 | TSDOC — *@remarks* |
| 22 | R-012 | TSDOC — *@returns* |
| 23 | R-013 | TSDOC — *@throws* |
| 24 | R-009 | TSDOC — *TSDoc spec* |
| 25 | R-005 | VARELLA — *Modelagem e simulação dos processos...* |
| 26 | R-018 | WORLD WIDE WEB CONSORTIUM — *Web Authentication...* |

Essa ordem foi confirmada após a conferência da autoria oficial e do título transcrito. Dentro de uma mesma autoria, a ordenação continua pelo elemento seguinte da referência, e não pela posição em que a fonte apareceu no TCC. Na série TSDoc, o sinal `@` foi desconsiderado para a comparação alfabética dos nomes das tags. Qualquer mudança futura de entrada exigirá nova ordenação integral.

## Etapas de execução

### 1. Congelamento do corpus

Registrar os arquivos textuais que compõem a versão auditada e evitar gerar a lista final enquanto houver revisão capaz de incluir, remover ou deslocar fontes. Alterações intermediárias continuarão sujeitas à atualização imediata do mapa central, conforme D-015 e D-027.

### 2. Auditoria cruzada de uso

Executar duas conferências independentes:

1. partir de todas as chamadas, menções em prosa, fontes de quadros e usos factuais nos textos e confirmar uma entrada correspondente no mapa;
2. partir de cada entrada R-001 a R-026 e confirmar ao menos um uso remanescente no corpus.

O RESUMO, o ABSTRACT e as considerações finais exigem revisão manual, pois podem usar uma fonte como base factual sem chamada autor-data explícita. Fontes internas e elaboração própria serão verificadas separadamente para impedir sua inclusão indevida.

### 3. Conferência de metadados

Para cada entrada mantida, consultar a fonte original ou a página oficial. DOI, página do periódico, repositório institucional, página da organização e cópia local serão usados em conjunto para resolver divergências. Não serão usadas informações de agregadores quando a fonte primária trouxer os dados necessários.

Cada registro deverá terminar com autoria, título, publicação ou entidade responsável, data, versão quando pertinente, DOI ou URL, data de acesso e localizadores usados no texto. Ausências serão documentadas no mapa até sua resolução; não serão preenchidas com dados plausíveis, mas não verificados.

### 4. Resolução das datas e letras

Resolver primeiro as 14 datas provisórias. Depois, ordenar as obras de cada autoria pelo título e atribuir letras somente aos documentos que terminarem com a mesma data. Atualizar em uma única operação lógica:

- a referência de trabalho no mapa;
- a forma de chamada registrada no mapa;
- todas as ocorrências nos arquivos `texto-*.md`;
- as fontes de quadros e figuras relacionadas.

### 5. Normalização por tipo documental

Montar cada entrada a partir do modelo aplicável da NBR 6023:2025. A revisão será feita por grupos homogêneos: artigos; trabalhos acadêmicos; relatórios; normas e guias; páginas e documentação on-line. Depois da revisão por grupo, uma segunda leitura verificará a uniformidade da lista completa.

### 6. Produção da lista final

Criar `artifacts/referencias.md` com o título `# REFERÊNCIAS` e as entradas em ordem alfabética. O arquivo não conterá instruções de trabalho, identificadores R-xxx, comentários editoriais, grupos por tipo ou fontes excluídas.

### 7. Verificação final

Comparar a lista pronta com o mapa e com o corpus. A revisão deverá detectar referências duplicadas por DOI ou URL, variações indevidas da mesma entidade, links locais, datas inventadas, chamadas sem entrada, entradas sem chamada e divergências nas letras adicionadas aos anos.

A skill `humanizar` será aplicada apenas a eventual texto editorial destinado ao TCC. Autores, títulos, metadados e citações são trechos protegidos e não serão reescritos.

## Fontes internas, elaboração própria e exclusões

Os documentos `docs/nossa-causa-resumo-pt.md` e `docs/nossa-causa-summary-en.md` sustentam o escopo do produto, mas não constituem pesquisa empírica. Código, banco de dados e aplicação em execução sustentam afirmações técnicas; seus locais permanecem registrados nos planejamentos e manifestos. Quadros, diagramas e capturas produzidos para o TCC usarão a indicação de elaboração própria ou adaptação na legenda, sem gerar uma referência bibliográfica por si mesmos.

Liang, Wang e Wang (2022) permanece excluído conforme D-009. Fontes descartadas nas etapas exploratória e intermediária descritas em D-019 também não entrarão na lista final se não sustentarem conteúdo mantido.

## Dependências e riscos

- O manual ou modelo da instituição ainda não foi fornecido. Sua ausência não impede a normalização bibliográfica pela ABNT, mas deixa fonte, margens e outras escolhas de diagramação sujeitas a conferência posterior.
- As datas editoriais das 14 páginas on-line foram resolvidas por data declarada, copyright, versão publicada ou histórico editorial oficial; as estimativas documentadas permanecem entre colchetes.
- A data de acesso corresponde à consulta real de 8 set. 2026 e não foi retroagida para coincidir com o cronograma acadêmico.
- Alterações tardias no corpus podem mudar a composição da lista e as letras de obras da mesma autoria e data.
- As autorias institucionais foram conferidas nas próprias publicações e páginas oficiais antes da ordenação definitiva.

## Critérios de aceite

- [x] O mapa central possui identificadores estáveis para as 26 fontes externas atualmente encontradas.
- [x] Fontes internas, evidências técnicas, elaboração própria e a fonte excluída foram separadas da bibliografia.
- [x] A NBR 6023:2025 foi definida como norma de elaboração e ordenação.
- [x] O sistema autor-data e a ordem alfabética única foram definidos para a integração.
- [x] A apresentação prevista registra alinhamento à esquerda, espaço simples e uma linha em branco entre entradas.
- [x] As entradas com `s.d.` e os grupos com letras provisórias foram identificados.
- [x] O corpus final foi auditado nos dois sentidos: texto para mapa e mapa para texto.
- [x] Todas as 14 datas provisórias foram substituídas por datas confirmadas ou estimativas justificadas entre colchetes.
- [x] Autoria, título, publicação, versão, DOI ou URL e data real de acesso foram conferidos na fonte original.
- [x] As chamadas foram normalizadas conforme a NBR 10520:2023 e correspondem exatamente às entradas finais.
- [x] As letras de obras da mesma autoria e data foram atribuídas somente após a ordenação.
- [x] `artifacts/referencias.md` contém apenas fontes usadas, em lista única, sem numeração e na ordem alfabética definitiva.
- [x] A lista final não contém duplicações, caminhos locais, datas inventadas, entradas sem uso ou usos sem entrada.
- [x] A apresentação foi confrontada com o manual institucional, caso ele seja fornecido; nenhum manual foi disponibilizado nesta execução.
