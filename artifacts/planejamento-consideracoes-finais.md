# Planejamento — Considerações finais

## Identificação e escopo

- Identificador: `consideracoes-finais`.
- Responsável: Codex.
- Data: 2026-09-08.
- Etapa: planejamento, redação e revisão concluídos em 2026-09-08.
- Orientação central: `artifacts/TCC-PRINCIPAL.md`, especialmente D-001, D-010, D-021, D-022, D-023, D-024 e D-025.
- Entrega posterior: `artifacts/texto-consideracoes-finais.md`.

As considerações finais sintetizarão o percurso do trabalho sem repetir a estrutura das oito fases como um resumo capítulo a capítulo. O texto retomará o problema delimitado, explicará como a pesquisa, a modelagem e o desenvolvimento responderam a ele e apresentará os resultados efetivamente sustentados pelo recorte técnico e documental. O MVP será tratado como uma escolha deliberada: uma versão funcional que reúne os fluxos centrais da Nossa Causa e estabelece uma base concreta para continuidade.

A conclusão não introduzirá dados, requisitos, funcionalidades ou referências inéditas. Também não converterá planejamento em execução. Implantação, treinamento, backup, restauração, operação pública e avaliação com usuários permanecerão identificados como atividades não realizadas no escopo documentado. Da mesma forma, não serão atribuídos ao sistema efeitos sobre confiança, volume de doações, eficiência das campanhas, adesão de usuários ou resultado social, pois esses efeitos não foram avaliados.

## Tese de encerramento

A redação deverá sustentar a seguinte conclusão central:

> O trabalho transformou uma necessidade de organização informacional de campanhas de doação em um MVP web tecnicamente documentado, capaz de centralizar os fluxos essenciais das campanhas físicas e virtuais, seu acompanhamento e a publicação das informações declaradas pelos organizadores. Esse resultado constitui uma base funcional para evolução, mas não comprova adoção, impacto social nem operação em ambiente público.

Essa tese orientará o texto, mas não precisa aparecer literalmente. A versão final deverá evitar tanto uma avaliação promocional quanto uma sequência de ressalvas defensivas. Primeiro serão apresentadas as contribuições verificadas; depois, as fronteiras do recorte e as possibilidades de continuidade.

## Síntese sustentada pelas partes concluídas

| Parte       | Resultado que poderá ser retomado                                                                                                                                                                                      | Limite a preservar                                                                                                                                                                                             |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Introdução  | A AccioLabs é a empresa ficcional criada para o TCC, e a Nossa Causa é a plataforma web desenvolvida como objeto do trabalho.                                                                                          | Não atribuir à AccioLabs trajetória, operação comercial, equipe ou experiência real.                                                                                                                           |
| Fases 1 e 2 | A pesquisa bibliográfica e documental ofereceu base para tratar informação, confiança, transparência, prestação de contas e coordenação de doações como dimensões relevantes da proposta.                              | A organização informal por Facebook e WhatsApp é uma definição do problema de projeto, não um resultado empírico demonstrado pelas referências consultadas. Não generalizar os estudos além de seus recortes.  |
| Fase 3      | O MVP executa os fluxos centrais de consulta, campanhas físicas e virtuais, participação em campanhas físicas, gestão pelo organizador, atualizações e prestação de contas.                                            | Não afirmar recomendação automática, controle logístico, confirmação de pagamentos, auditoria externa, sanção automática ou mensuração de impacto.                                                             |
| Fase 4      | Os casos de uso, a visão lógica da arquitetura e os modelos de dados representam o mesmo recorte funcional e oferecem uma estrutura documentada para o sistema.                                                        | Não apresentar os diagramas como prova de uso real nem antecipar estruturas de funcionalidades futuras.                                                                                                        |
| Fase 5      | O acesso ocorre pela web, sem software próprio ou equipamento especializado, conforme os requisitos do usuário final documentados.                                                                                     | Não inventar configuração mínima, compatibilidade universal ou requisito de infraestrutura do usuário.                                                                                                         |
| Fase 6      | A arquitetura separa responsabilidades de interface, validação, autorização, regras de negócio, autenticação e persistência; o inventário de telas e formulários documenta o snapshot do MVP.                          | As capturas usam dados fictícios e não comprovam doações, transferências, prestação de contas real ou teste ponta a ponta. A cobertura de TSDoc é delimitada e não equivale à documentação integral do código. |
| Fase 7      | Foram produzidos um cenário teórico de implantação, um plano de treinamento, procedimentos de segurança e recuperação e um Manual do Usuário real para o snapshot.                                                     | Não declarar implantação, treinamento, backup, restauração ou disponibilização pública como executados. Targets de infraestrutura não comprovam contratação ou configuração externa.                           |
| Fase 8      | O projeto possui uma base rastreável para manutenção, com organização modular, histórico de versões, migrações, documentação e verificações estáticas; também foi proposto um processo para analisar mudanças futuras. | Lint e type-check não substituem testes funcionais ou de regressão. Não há operação, SLA, rotina de releases, suíte dedicada de testes ou CI comprovados no recorte.                                           |

## Estrutura proposta para a redação

A conclusão será redigida como uma seção única, sem subseções internas, quadros ou listas. A estrutura prevista contém seis movimentos argumentativos, distribuídos em aproximadamente cinco ou seis parágrafos.

| Ordem | Finalidade                           | Conteúdo previsto                                                                                                                                                                                                                                 | Controle editorial                                                                                                                                   |
| ----- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Retomar o problema e o objetivo      | Reapresentar, de forma concisa, a dispersão de informações e as dificuldades de acompanhamento definidas pelo projeto; indicar que o trabalho buscou estruturar uma plataforma para campanhas físicas e virtuais.                                 | Não repetir a introdução literalmente nem apresentar o uso de redes sociais como constatação de campo.                                               |
| 2     | Sintetizar o percurso desenvolvido   | Articular pesquisa bibliográfica e documental, levantamento, análise do MVP, projeto lógico e físico, documentação do desenvolvimento e planejamento de implantação e manutenção.                                                                 | Não enumerar cada fase mecanicamente. Destacar como o percurso converteu a necessidade em solução documentada.                                       |
| 3     | Apresentar os resultados sustentados | Explicar que o MVP centraliza consulta, filtros, modalidades física e virtual, gestão, participação física, atualizações, identificação de organizações e prestação de contas; mencionar a coerência entre implementação, modelos e documentação. | Priorizar capacidades centrais, sem transformar o parágrafo em inventário de telas ou tabelas. Não declarar impacto sobre doações ou confiança.      |
| 4     | Delimitar o recorte deliberado       | Registrar que a plataforma coordena informação e acompanhamento, enquanto logística física e transferências financeiras permanecem externas; distinguir a base funcional das atividades operacionais apenas planejadas.                           | Apresentar fronteiras como decisões de escopo do MVP, não como falhas, atrasos ou falta de tempo.                                                    |
| 5     | Projetar a continuidade              | Organizar reputação e denúncias em confiança e governança; recompensas e notificações em participação e engajamento; processamento opcional em ampliação das formas de contribuição financeira.                                                   | Declarar inequivocamente que os cinco recursos não estão implementados, não possuem ordem, prazo ou compromisso de entrega e exigem análise própria. |
| 6     | Encerrar o argumento                 | Reafirmar que o principal resultado é uma base funcional, documentada e passível de manutenção, adequada para orientar avaliações e evoluções posteriores.                                                                                        | Evitar fecho genérico sobre solidariedade, transformação social ou sucesso futuro. Não prometer benefícios ainda não avaliados.                      |

Os movimentos 2 e 3 poderão ocupar mais de um parágrafo caso isso melhore a leitura. A redação final não deverá usar fórmulas como “em suma”, “diante do exposto” ou “pode-se concluir que” para anunciar uma conclusão já evidente pela posição do texto.

## Tratamento da continuidade além do MVP

A visão de continuidade deverá aparecer de forma condensada, mas conservar as decisões de D-024:

- reputação e denúncias serão apresentadas como mecanismos possíveis de confiança e governança;
- a reputação poderá considerar cancelamentos de última hora, cumprimento do prazo de prestação de contas e qualidade da organização;
- o MVP aplica sete dias corridos para a prestação de contas nas duas modalidades e não impõe penalidade automática;
- a alternativa de prazo variável pela quantidade de itens atende diretamente às campanhas físicas, enquanto não há critério variável equivalente definido para campanhas virtuais;
- o tratamento do atraso como infração dos termos e sua relação com a reputação exigem definição posterior;
- recompensas e notificações serão relacionadas à participação e ao engajamento; as notificações serão apresentadas como tecnicamente inviáveis dentro do escopo do MVP, mas preservadas como possibilidade de evolução;
- a integração com processadores como Stripe ou Polar será descrita como alternativa opcional, complementar ao modelo de transferência direta, e não como substituição obrigatória;
- nenhuma dessas possibilidades será apresentada como funcionalidade implementada, compromisso de entrega ou sequência aprovada de desenvolvimento.

Na redação final, esse detalhamento deverá ser reduzido ao necessário para demonstrar que a continuidade decorre da base já construída. Se o parágrafo ficar excessivamente denso, a política de prestação de contas será resumida com remissão conceitual ao problema ainda aberto, sem inventar sua solução.

## Fontes e evidências

| Fonte                                                       | Situação                                    | Uso no planejamento e na redação posterior                                                                                     |
| ----------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `artifacts/TCC-PRINCIPAL.md`                                | Consultado.                                 | Define escopo, decisões compartilhadas, conteúdo obrigatório das considerações finais e limites sobre resultados e evolução.   |
| `docs/nossa-causa-resumo-pt.md`                             | Consultado.                                 | Confere problema, modalidades, capacidades centrais e ideias posteriores ao MVP.                                               |
| `docs/nossa-causa-summary-en.md`                            | Consultado para consistência terminológica. | Serve apenas como conferência dos conceitos comuns; a conclusão será redigida em português brasileiro.                         |
| `artifacts/texto-introducao.md`                             | Consultado.                                 | Fornece a formulação consolidada do problema, do objeto e do recorte do trabalho.                                              |
| `artifacts/texto-fase-01.md` e `artifacts/texto-fase-02.md` | Consultados.                                | Sustentam o percurso bibliográfico e documental e a distinção entre evidência publicada, definição de projeto e inferência.    |
| `artifacts/texto-fase-03.md`                                | Consultado.                                 | Delimita as capacidades funcionais verificadas e os limites do MVP.                                                            |
| `artifacts/texto-fase-04.md`                                | Consultado.                                 | Sustenta a coerência entre modelos, dados, implementação e possibilidades de evolução.                                         |
| `artifacts/texto-fase-05.md`                                | Consultado.                                 | Delimita os requisitos de acesso do usuário final.                                                                             |
| `artifacts/texto-fase-06.md`                                | Consultado.                                 | Sustenta a descrição da arquitetura, das telas, das evidências visuais e da documentação do desenvolvimento.                   |
| `artifacts/texto-fase-07.md`                                | Consultado.                                 | Distingue o Manual do Usuário efetivamente produzido dos cenários de implantação, treinamento e recuperação apenas planejados. |
| `artifacts/texto-fase-08.md`                                | Consultado.                                 | Delimita as condições atuais e o processo proposto de manutenção, além da continuidade posterior ao MVP.                       |
| `artifacts/auxiliares/referencias-utilizadas.md`            | Conferido e atualizado em 2026-09-08.       | Registra o uso indireto de R-001 a R-005 na síntese bibliográfica da abertura das considerações finais.                        |

Não se prevê a inclusão de referência bibliográfica nova nas considerações finais. A preferência editorial é sintetizar os resultados já desenvolvidos sem repetir estatísticas, autores ou definições técnicas. Se uma afirmação bibliográfica específica for indispensável, ela deverá usar uma fonte já conferida nas fases anteriores, conservar seu alcance e receber registro próprio no mapa central de referências.

## Adaptações em relação à orientação inicial

A orientação de `artifacts/TCC-PRINCIPAL.md` será preservada, com duas adaptações de composição:

1. O “trabalho desenvolvido” não será apresentado como uma lista das fases. A conclusão organizará pesquisa, modelagem, implementação, documentação e planejamento operacional como partes de um mesmo percurso argumentativo.
2. As possibilidades futuras serão agrupadas nas três frentes analíticas já definidas: confiança e governança; participação e engajamento; ampliação das formas de contribuição financeira. Esse agrupamento reduz repetição sem sugerir prioridade ou cronograma.

Não serão criadas subseções internas. A seção única é suficiente para encerrar o trabalho e evita que as considerações finais repitam a fragmentação dos capítulos anteriores.

## Riscos e controles

| Risco                                                          | Controle previsto                                                                                                                                       |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repetir a introdução ou resumir capítulos em sequência         | Organizar o texto pela relação problema, resposta, resultado, fronteira e continuidade.                                                                 |
| Confundir problema de projeto com evidência empírica           | Identificar a organização informal em redes sociais como delimitação adotada pelo projeto e reservar às fontes apenas as conclusões que elas sustentam. |
| Atribuir impacto social ou comportamento de usuários ao MVP    | Limitar os resultados à implementação, à documentação e às verificações técnicas realizadas.                                                            |
| Tratar implantação e treinamento planejados como executados    | Empregar modalidade futura ou propositiva e declarar que não houve disponibilização pública nem validação operacional comprovada.                       |
| Apresentar o recorte como deficiência                          | Explicar as fronteiras como decisões deliberadas do produto minimamente viável, depois de expor sua contribuição funcional.                             |
| Omitir limites relevantes                                      | Registrar a ausência de avaliação com usuários e de operação real sem transformar a conclusão em inventário de ressalvas.                               |
| Prometer funcionalidades posteriores                           | Usar “possibilidade”, “continuidade” ou “evolução” e excluir ordem, prazo, prioridade interna ou compromisso de entrega.                                |
| Confundir transferência direta com processamento da plataforma | Declarar que PIX e dados bancários pertencem ao organizador e que o MVP não processa, confirma nem concilia pagamentos.                                 |
| Confundir transparência declarada com auditoria                | Informar que a prestação de contas publica dados e evidências fornecidos pelo organizador, sem auditoria externa ou sanção automática.                  |
| Introduzir fontes ou resultados novos no encerramento          | Conferir cada afirmação contra os textos concluídos e não incluir bibliografia inédita.                                                                 |
| Desatualizar o mapa de referências                             | Atualizar `artifacts/auxiliares/referencias-utilizadas.md` no mesmo momento de qualquer uso bibliográfico mantido na redação.                           |
| Produzir um fecho promocional ou genérico                      | Encerrar com o resultado técnico e acadêmico efetivamente alcançado e com as condições para avaliações posteriores.                                     |

## Dependências e dúvidas

Todas as fases de 1 a 8 e a introdução estão concluídas, o que fornece base suficiente para redigir as considerações finais. A bibliografia consolidada ainda está em planejamento, mas isso não bloqueia a conclusão porque não se prevê fonte nova nem repetição de citação específica. A redação deverá ser revalidada quando `artifacts/referencias.md` e a versão integrada do TCC forem produzidos.

Não há dúvida de conteúdo que impeça a próxima etapa. Uma exigência institucional de extensão, formatação ou estrutura poderá demandar ajuste durante a normalização final, mas não altera o argumento planejado.

## Sequência de execução posterior

1. Reler este planejamento, as decisões D-023, D-024 e D-025 e as versões vigentes da introdução e das Fases 1 a 8.
2. Extrair apenas as afirmações necessárias aos seis movimentos argumentativos e conferir cada uma em sua parte de origem.
3. Redigir `artifacts/texto-consideracoes-finais.md` em português brasileiro, com perfil acadêmico e sem subseções internas.
4. Aplicar a skill `humanizar` em modo de criação, preservando precisão, modalidade e registro acadêmico.
5. Verificar que não foram incluídos impactos, validações, atividades operacionais ou funcionalidades sem evidência.
6. Conferir o tratamento das cinco ideias posteriores ao MVP e das três frentes de evolução, sem prioridade, prazo ou compromisso.
7. Atualizar imediatamente `artifacts/auxiliares/referencias-utilizadas.md` se qualquer fonte externa for mencionada ou utilizada factualmente na conclusão.
8. Revisar a coerência terminológica entre AccioLabs, Nossa Causa, MVP, campanha física, campanha virtual, prestação de contas e transferência direta.
9. Atualizar o quadro de progresso conforme a etapa efetivamente alcançada, sem declarar a parte concluída antes da revisão final.

## Critérios de aceite da redação

- [x] O problema e o objetivo são retomados sem copiar a introdução nem ampliar a evidência disponível.
- [x] O percurso desenvolvido articula pesquisa, modelagem, implementação, documentação, implantação planejada e manutenção sem enumerar mecanicamente as fases.
- [x] Os resultados descritos correspondem às capacidades efetivamente verificadas no MVP.
- [x] O MVP é apresentado primeiro por sua contribuição funcional e depois por suas fronteiras deliberadas.
- [x] Não há alegação de adoção, impacto social, aumento de confiança, crescimento de doações, eficiência, implantação ou validação com usuários.
- [x] Logística física, processamento financeiro, auditoria externa e penalidades automáticas permanecem fora das capacidades atribuídas ao MVP.
- [x] Implantação, treinamento, backup, restauração e operação pública são mantidos como planejamento, sem execução presumida.
- [x] Reputação, denúncias, recompensas, notificações e processamento opcional de pagamentos aparecem como continuidade não implementada.
- [x] A política futura de prestação de contas preserva as questões abertas de D-024 sem inventar solução.
- [x] O fechamento é específico ao trabalho e não contém promessa genérica de transformação social.
- [x] Toda citação ou utilização factual de fonte externa está registrada no mapa central para consolidação na bibliografia final.
- [x] A redação foi revisada com a skill `humanizar` em perfil acadêmico, sem alterar fatos ou grau de certeza.
- [x] O arquivo final contém somente texto destinado ao TCC, sem instruções, pendências ou comentários de bastidores.

## Registro da execução e revisão

Em 2026-09-08, `artifacts/texto-consideracoes-finais.md` foi redigido a partir da introdução e das Fases 1 a 8. A redação apresenta o MVP como decisão deliberada de produto e concentra as delimitações em sua função arquitetural: a Nossa Causa organiza informações, participação e transparência, enquanto logística e transferências diretas permanecem com os responsáveis por cada campanha. A ausência de uso público e de avaliação com usuários foi preservada em uma única passagem, sem deslocar o foco das capacidades desenvolvidas.

A continuidade foi organizada nas três frentes definidas em D-024. O texto identifica reputação, denúncias, recompensas, notificações e processamento opcional de pagamentos como possibilidades não implementadas, conserva as questões abertas sobre prazo e reputação e não atribui ordem, cronograma ou compromisso de entrega a esses recursos.

Não foram incluídas chamadas autor-data, menções bibliográficas em prosa ou fontes externas novas. A abertura sintetiza a contribuição factual das fontes já usadas nas Fases 1 e 2; por isso, o uso indireto de R-001 a R-005 foi registrado em `artifacts/auxiliares/referencias-utilizadas.md` em 2026-09-08. A redação foi produzida e revisada com a skill `humanizar`, em modo de criação e perfil acadêmico, com conferência de precisão, modalidade, transições e fechamento.
