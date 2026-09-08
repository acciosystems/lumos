# Plano de revisão integrada do TCC

## Finalidade

Este plano organiza a revisão dos textos da Nossa Causa em pacotes independentes. Cada agente deverá assumir um único pacote, concluí-lo e registrar o resultado antes de iniciar outro. A divisão reduz edições concorrentes, preserva a rastreabilidade das decisões e permite revisar o trabalho em etapas verificáveis.

O plano decorre da auditoria editorial realizada em 8 de setembro de 2026. Seu objetivo é corrigir incoerências, fortalecer a sustentação das afirmações, reduzir formulações que prejudiquem a credibilidade do trabalho, simplificar a linguagem quando o detalhe técnico não for necessário, limitar anglicismos e uniformizar a referência aos atores do sistema.

## Decisões do usuário e limites desta revisão

1. A lista final de referências será consolidada e normalizada somente ao término da revisão, conforme D-027.
2. O mapa `artifacts/auxiliares/referencias-utilizadas.md` continuará sendo atualizado imediatamente quando uma citação, menção bibliográfica ou afirmação apoiada em fonte externa for incluída, removida ou deslocada.
3. Os diagramas não serão inseridos nem renderizados nos arquivos Markdown. Seus arquivos-fonte serão preservados para uso no documento final, produzido em outro formato, conforme D-028.
4. A revisão poderá ajustar a descrição, a finalidade e a interpretação dos diagramas, mas não deverá gastar esforço com sua apresentação visual no Markdown.
5. Capa, apresentação, anexos, paginação e normalização no formato institucional permanecem fora destes pacotes.
6. Nenhum agente poderá inventar fonte, resultado, teste, implantação, validação com usuários ou funcionalidade.

## Regras de execução para todos os agentes

- Ler `AGENTS.md`, `artifacts/TCC-PRINCIPAL.md`, este plano e o planejamento das partes sob sua responsabilidade antes de editar.
- Ler `docs/nossa-causa-summary-en.md` antes de qualquer alteração de produto ou campanha, conforme as regras do repositório.
- Registrar nome e estado no quadro deste plano antes da primeira edição.
- Trabalhar apenas nos arquivos atribuídos ao pacote. Alterações necessárias fora do escopo devem ser registradas para o agente de integração.
- O próprio plano é um arquivo de acompanhamento global e pode ser alterado em qualquer pacote, exclusivamente para atualizar o quadro e registrar a execução.
- Não iniciar um segundo pacote antes de concluir o primeiro.
- Preservar números, datas, nomes, citações, localizadores, resultados, modalidade e distinção entre implementação, proposta e planejamento.
- Conferir no código toda afirmação sobre funcionamento do MVP. Documentos de escopo demonstram intenção; não comprovam implementação.
- Usar a skill `humanizar` na revisão dos textos finais, com perfil acadêmico. O Manual do Usuário deve conservar seu registro instrucional.
- Priorizar frases diretas e termos compreensíveis. Manter termos técnicos quando forem necessários à precisão e explicá-los na primeira ocorrência quando o público não puder presumir seu significado.
- Não substituir automaticamente todo estrangeirismo. Identificadores, nomes de tecnologias e termos consagrados podem permanecer; anglicismos dispensáveis devem ser vertidos para português.
- Atualizar o mapa central no mesmo conjunto de alterações sempre que o uso de fontes externas mudar.
- Não produzir `artifacts/referencias.md` antes do pacote final de referências.
- Não inserir imagens dos diagramas nos arquivos Markdown.
- Não alterar `apps/web/src/components/ui/*` nem realizar mudanças funcionais no produto durante uma tarefa de revisão textual.
- Ao concluir, registrar arquivos alterados, verificações realizadas, referências afetadas e pendências remanescentes.

## Ordem de execução

```text
Etapa 1 — revisão dos capítulos por escopo independente
  R-01: Fases 1 e 2
  R-02: Fases 3 e 4
  R-03: Fases 5 e 6
  R-04: Fase 7
  R-05: Fase 8
  R-06: Manual do Usuário

Etapa 2 — integração argumentativa
  R-07: RESUMO, ABSTRACT, Introdução e Considerações finais

Etapa 3 — revisão global
  R-08: consistência, linguagem e conferência cruzada

Etapa 4 — encerramento bibliográfico, somente ao final
  R-09: referências bibliográficas
```

Os pacotes R-01 a R-06 não dependem uns dos outros e podem ser distribuídos entre agentes, desde que cada arquivo tenha apenas um responsável por vez. R-07 começa somente depois da conclusão de R-01 a R-06. R-08 começa depois de R-07. R-09 é a última etapa.

## Quadro de acompanhamento

Estados permitidos: **Não iniciado**, **Em revisão**, **Aguardando esclarecimento** e **Concluído**.

| Pacote | Responsável | Estado | Arquivos principais | Dependência |
| --- | --- | --- | --- | --- |
| R-01 — Fundamentação do problema | Codex | Concluído | `texto-fase-01.md`, `texto-fase-02.md` | Nenhuma |
| R-02 — Sistema atual e projeto lógico | — | Não iniciado | `texto-fase-03.md`, `texto-fase-04.md` | Nenhuma |
| R-03 — Projeto físico e desenvolvimento | — | Não iniciado | `texto-fase-05.md`, `texto-fase-06.md` | Nenhuma |
| R-04 — Implantação | — | Não iniciado | `texto-fase-07.md` | Nenhuma |
| R-05 — Manutenção | — | Não iniciado | `texto-fase-08.md` | Nenhuma |
| R-06 — Manual do Usuário | — | Não iniciado | `manual-do-usuario.md` | Nenhuma |
| R-07 — Abertura e encerramento | — | Não iniciado | `texto-sumario.md`, `texto-introducao.md`, `texto-consideracoes-finais.md` | R-01 a R-06 |
| R-08 — Integração textual | — | Não iniciado | Todos os textos finais e `TCC-PRINCIPAL.md` | R-07 |
| R-09 — Referências finais | — | Não iniciado | `referencias.md`, mapa central | R-08 |

## R-01 — Fundamentação do problema

### Objetivo único

Revisar a relação entre o problema definido pelo projeto e as evidências bibliográficas apresentadas nas Fases 1 e 2.

### Arquivos permitidos

- `artifacts/texto-fase-01.md`
- `artifacts/texto-fase-02.md`
- planejamentos correspondentes, apenas para registrar a revisão;
- `artifacts/auxiliares/referencias-utilizadas.md`, se o uso de fontes mudar.

### Trabalho previsto

1. Reduzir a repetição dos mesmos métodos, números e conclusões entre as duas fases. A Fase 1 deve caracterizar a necessidade; a Fase 2 deve concentrar o levantamento e a organização dos dados.
2. Manter a organização informal de campanhas em Facebook e WhatsApp como problema definido pelo projeto enquanto não houver fonte direta que o demonstre.
3. Não usar pesquisas sobre organizações sem fins lucrativos como prova automática do comportamento de campanhas informais. Explicitar o alcance dessa aproximação somente onde ele for necessário.
4. Apresentar Varella (2019) como contribuição parcial proveniente da logística humanitária, sem generalizar o contexto de desastres para toda campanha comunitária.
5. Examinar se existe fonte direta e verificável sobre campanhas de doação organizadas em redes sociais, confiança em plataformas digitais de doação ou prestação de contas em campanhas informais. Se uma fonte adequada não for localizada, preservar o reenquadramento como premissa do projeto.
6. Remover formulações que transformem associação entre confiança e doação em causalidade ou em prova de eficácia da Nossa Causa.

### Critérios de conclusão

- As Fases 1 e 2 possuem funções distintas e não repetem blocos extensos.
- Evidência publicada, documento interno e inferência do projeto permanecem separados.
- Nenhuma fonte é generalizada além de sua amostra ou contexto.
- Toda alteração bibliográfica está refletida no mapa central.
- O texto foi revisado com a skill `humanizar` em perfil acadêmico.

## R-02 — Sistema atual e projeto lógico

### Objetivo único

Resolver a relação metodológica entre a análise do MVP como sistema atual e sua formalização como sistema proposto, conferindo a descrição funcional e o modelo de dados.

### Arquivos permitidos

- `artifacts/texto-fase-03.md`
- `artifacts/texto-fase-04.md`
- planejamentos correspondentes;
- fontes Mermaid apenas para conferência, sem inserção ou renderização;
- mapa central, se o uso bibliográfico mudar.

### Trabalho previsto

1. Explicar por que a Fase 3 analisa o MVP implementado como sistema atual e a Fase 4 formaliza o projeto lógico da mesma solução. A transição deve impedir a impressão de que dois sistemas diferentes estão sendo confundidos.
2. Conferir no código as capacidades atribuídas ao MVP e moderar expressões como “versão funcional” quando não houver teste funcional que sustente alcance mais amplo.
3. Explicar a situação da tabela `DONATIONS`. A estrutura existe no schema e nas migrações, mas não foi localizado fluxo da aplicação que a utilize no recorte auditado. O dicionário deve registrar essa condição sem apresentá-la como funcionalidade disponível.
4. Delimitar o significado de CNPJ verificado. O texto não deve sugerir uma garantia institucional enquanto o processo operacional de verificação não estiver documentado no MVP.
5. Rever o nome e a descrição do “diagrama de implementação” para deixar claro que se trata de uma visão lógica da arquitetura, e não de uma reprodução completa do diagrama de implantação da UML.
6. Rever a apresentação do diagrama de classe, distinguindo classes concretas, entidades persistidas, contratos e módulos funcionais. Não apresentar tipos e módulos como classes da linguagem.
7. Reduzir a repetição das cinco possibilidades posteriores ao MVP. Nesta fase, manter apenas o detalhamento necessário ao projeto lógico e seus impactos futuros.
8. Preservar os arquivos dos diagramas e suas referências textuais, sem inseri-los no Markdown.

### Critérios de conclusão

- A passagem da Fase 3 para a Fase 4 é metodologicamente explícita.
- `DONATIONS` e a verificação de CNPJ não sugerem capacidades inexistentes.
- Os nomes e limites dos diagramas correspondem ao conteúdo representado.
- As descrições funcionais conferem com código, schema e migrações.
- Nenhum diagrama foi inserido ou renderizado no Markdown.

## R-03 — Projeto físico e desenvolvimento

### Objetivo único

Simplificar a apresentação dos requisitos e da implementação sem retirar o conteúdo técnico necessário.

### Arquivos permitidos

- `artifacts/texto-fase-05.md`
- `artifacts/texto-fase-06.md`
- planejamentos correspondentes;
- mapa central, se o uso bibliográfico mudar.

### Trabalho previsto

1. Explicitar que a Fase 5 adapta “projeto físico” aos requisitos de acesso do usuário final, conforme D-003.
2. Evitar sugerir compatibilidade universal com navegadores ou dispositivos. Manter apenas requisitos comprovados ou apresentados como capacidades necessárias.
3. Avaliar a necessidade de apoio bibliográfico para acessibilidade, compatibilidade e usabilidade. Não acrescentar normas ou recomendações sem fonte efetivamente consultada.
4. Simplificar a descrição da arquitetura sempre que nomes internos de pacotes ou mecanismos não forem necessários para compreender a separação de responsabilidades.
5. Substituir “pessoa portadora de link com token” por uma formulação direta e adequada ao papel do usuário.
6. Remover do texto acadêmico detalhes de bastidor como o nome do conector usado para obter capturas. Preservar a informação relevante: execução local, resolução utilizada e dados fictícios.
7. Manter o tópico TSDoc tecnicamente preciso, mas reduzir ressalvas repetidas. A ausência da imagem reservada para o documento final não deve aparecer como pendência do Markdown.
8. Não inserir o diagrama de classe nem a imagem de TSDoc no Markdown.

### Critérios de conclusão

- A adaptação da Fase 5 está justificada sem parecer fuga do tema solicitado.
- A Fase 6 pode ser compreendida por leitor não especializado sem perder precisão.
- Termos técnicos protegidos e citações permanecem corretos.
- Não há comentários sobre ferramentas internas de captura ou integração futura que pertençam apenas ao processo de produção.

## R-04 — Implantação

### Objetivo único

Tornar a Fase 7 compreensível e defensável, distinguindo planejamento acadêmico, estimativas e configuração técnica.

### Arquivos permitidos

- `artifacts/texto-fase-07.md`
- `artifacts/planejamento-fase-07.md`
- `artifacts/auxiliares/fase-07-evidencias.md`
- mapa central, se o uso bibliográfico mudar.

### Trabalho previsto

1. Reescrever a passagem sobre a versão inicial abandonada sem esconder o fato, mas apresentando a substituição como resultado de revisão arquitetural. Preservar as datas e o aproveitamento dos conceitos e tecnologias.
2. Substituir anglicismos dispensáveis, especialmente `target`, `runtime`, `hostname`, `stack`, `snapshot`, `checklist`, `logging`, `secret`, `pooling`, `checksum` e `namespace`. Identificadores e nomes técnicos devem permanecer intactos.
3. Explicar termos técnicos na primeira ocorrência quando sua manutenção for necessária.
4. Verificar a origem das 59 horas de implantação, das quatro horas de treinamento, do RPO de 24 horas, do RTO de quatro horas e da retenção de 30 dias. Apresentá-los como estimativas ou objetivos propostos e registrar o critério usado; não tratá-los como valores validados.
5. Reduzir a repetição de avisos de que implantação, treinamento, backup e restauração não foram executados. Uma delimitação clara no início e retomadas apenas quando necessárias são suficientes.
6. Manter Vercel, Neon, Doppler, Prisma e PgBouncer apenas onde influenciam uma decisão de implantação ou recuperação.
7. Preservar integralmente as orientações de segurança e a distinção entre hash e criptografia.

### Critérios de conclusão

- O leitor distingue fatos históricos, estimativas, objetivos e atividades futuras.
- Os números propostos têm origem ou critério declarado.
- A linguagem técnica está limitada às decisões que dependem dela.
- A honestidade sobre a ausência de implantação real permanece sem dominar toda a seção.

## R-05 — Manutenção

### Objetivo único

Concentrar a Fase 8 no processo de manutenção do software e contextualizar adequadamente os riscos técnicos identificados.

### Arquivos permitidos

- `artifacts/texto-fase-08.md`
- `artifacts/planejamento-fase-08.md`
- `artifacts/auxiliares/fase-08-evidencias.md`
- mapa central, se o uso bibliográfico mudar.

### Trabalho previsto

1. Preservar a classificação de manutenção sustentada pela ISO/IEC/IEEE 14764:2022 e pelo SWEBOK.
2. Reduzir termos desnecessários como `snapshot`, `runtime`, `logging`, `workflow`, `build`, `dataset`, `timeout` e `release`, mantendo comandos e identificadores quando forem objeto direto da explicação.
3. Contextualizar os nove alertas transitivos da auditoria de dependências. Sempre que a evidência permitir, indicar gravidade, dependências afetadas, mitigação e estado da exceção; se a evidência não permitir, limitar a conclusão.
4. Atualizar ou retirar qualquer prazo de exceção que esteja vencido no momento da revisão.
5. Manter a ausência de suíte dedicada de testes e integração contínua como limitação relevante, mas evitar repeti-la em vários parágrafos.
6. Substituir declarações amplas de manutenibilidade ou rastreabilidade por descrições das evidências concretas: organização dos pacotes, histórico de versões, migrações, documentação e verificações estáticas.
7. Reduzir a repetição das funcionalidades futuras, concentrando esta fase no processo pelo qual seriam avaliadas.

### Critérios de conclusão

- A classificação normativa permanece correta e bem localizada.
- Os alertas de segurança aparecem com contexto proporcional às evidências.
- Verificações estáticas não são apresentadas como testes funcionais.
- A seção descreve um plano acadêmico aplicável sem simular uma operação inexistente.

## R-06 — Manual do Usuário

### Objetivo único

Uniformizar os atores, corrigir ambiguidades e preservar o caráter instrucional do manual.

### Arquivos permitidos

- `artifacts/manual-do-usuario.md`
- `artifacts/planejamento-fase-07.md`, somente para registrar a revisão.

### Trabalho previsto

1. Escolher uma convenção para visitante, usuário, participante e organizador e aplicá-la em todo o manual.
2. Corrigir a afirmação de que os dados públicos do perfil “identificam a causa”; esses dados identificam o organizador.
3. Revisar antecedentes de `ele`, `ela`, `eles`, `seu` e `sua`, substituindo o pronome pelo substantivo quando houver ambiguidade.
4. Preservar o imperativo e a referência direta ao leitor, adequados a um manual.
5. Simplificar instruções sem remover alertas sobre senhas, dados bancários, arquivos sensíveis e prestação de contas.
6. Conferir novamente cada ação contra as telas e regras do MVP.

### Critérios de conclusão

- Cada papel tem denominação estável.
- Não há pronome com antecedente ambíguo.
- As instruções correspondem às ações disponíveis no MVP.
- O manual permanece direto, seguro e compreensível.

## R-07 — RESUMO, ABSTRACT, Introdução e Considerações finais

### Objetivo único

Recompor a abertura e o encerramento depois das revisões dos capítulos, alinhando problema, objetivo, método, resultado e limites.

### Arquivos permitidos

- `artifacts/texto-sumario.md`
- `artifacts/texto-introducao.md`
- `artifacts/texto-consideracoes-finais.md`
- planejamentos correspondentes;
- mapa central, se o uso bibliográfico mudar.

### Dependência

R-01 a R-06 concluídos.

### Trabalho previsto

1. Corrigir a diferença temporal entre “propõe-se o desenvolvimento” e a existência do MVP construído, sem violar a estrutura curta definida em D-006.
2. Manter RESUMO e ABSTRACT equivalentes depois de qualquer alteração.
3. Inserir na introdução um objetivo geral explícito e uma descrição breve do método, usando apenas informações já sustentadas no trabalho.
4. Substituir “estatísticas” por termo compatível com os indicadores realmente disponíveis, se a revisão funcional confirmar essa limitação.
5. Apresentar a AccioLabs como empresa ficcional uma única vez, com clareza e sem prolongar comentários de bastidor sobre a ausência de histórico empresarial.
6. Ajustar a descrição da sequência dos capítulos para refletir a distinção definida entre Fases 3 e 4.
7. Reduzir a repetição detalhada de reputação, denúncias, recompensas, notificações e processamento de pagamentos. A abertura deve apenas situar a continuidade; a conclusão deve sintetizá-la.
8. Substituir “cumpre a função”, “fluxo coerente” e outras avaliações amplas por resultados técnicos efetivamente demonstrados.
9. Distinguir resultado técnico construído de eficácia social, adoção, confiança e experiência de uso ainda não avaliadas.
10. Normalizar “Palavras-chave” e `Keywords` conforme o modelo institucional quando ele estiver disponível. Não presumir conformidade antes disso.

### Critérios de conclusão

- Problema, objetivo, método e resultado usam o mesmo tempo verbal e o mesmo grau de certeza.
- O resumo não promete apenas uma solução que o restante do trabalho apresenta como construída.
- A introdução orienta o leitor sem antecipar detalhes de todas as fases.
- A conclusão afirma resultados técnicos sem declarar impacto ou validação inexistentes.
- RESUMO e ABSTRACT permanecem semanticamente equivalentes.

## R-08 — Integração textual e conferência cruzada

### Objetivo único

Executar a última revisão de consistência entre todos os textos, sem reabrir decisões já resolvidas nos pacotes anteriores.

### Arquivos permitidos

- todos os arquivos `artifacts/texto-*.md`;
- `artifacts/manual-do-usuario.md`;
- `artifacts/TCC-PRINCIPAL.md`;
- planejamentos apenas para registrar a revisão;
- mapa central, se o uso bibliográfico mudar.

### Dependência

R-07 concluído.

### Trabalho previsto

1. Conferir nomes, atores, modalidades, estados de campanha, prazo da prestação de contas, tratamento do CNPJ e fronteiras do processamento financeiro.
2. Uniformizar a nomenclatura de MVP, versão analisada, implementação, proposta, planejamento e continuidade.
3. Reduzir repetições globais de “MVP”, “recorte”, “base funcional”, “permanece”, “Nossa Causa” e construções negativas, sem apagar ressalvas necessárias.
4. Verificar pronomes e demonstrativos com antecedente distante ou ambíguo.
5. Uniformizar títulos, numeração de fases, nomes de quadros, tabelas e figuras. A conferência não inclui a inserção dos diagramas.
6. Remover comentários de bastidor, reservas de integração e instruções aos redatores que tenham permanecido nos textos finais.
7. Conferir todas as chamadas autor-data contra o mapa central.
8. Aplicar a skill `humanizar` por blocos semânticos e fazer uma leitura global depois da recomposição.
9. Atualizar o quadro de progresso do arquivo principal somente conforme o estado efetivo das partes.

### Critérios de conclusão

- Não há contradição entre capítulos sobre capacidade implementada, proposta futura ou atividade planejada.
- O vocabulário técnico e os atores estão uniformes.
- Ressalvas aparecem onde são necessárias, sem repetição defensiva.
- Não existem instruções internas no texto destinado ao TCC.
- O mapa central corresponde ao uso bibliográfico da versão integrada.

## R-09 — Referências bibliográficas finais

### Objetivo único

Consolidar e normalizar a bibliografia somente depois que nenhum outro pacote puder alterar o uso das fontes.

### Arquivos permitidos

- `artifacts/auxiliares/referencias-utilizadas.md`
- `artifacts/planejamento-referencias.md`
- `artifacts/referencias.md`
- textos finais apenas para conferência, sem reescrita de conteúdo.

### Dependência

R-08 concluído e autorização para iniciar a etapa final.

### Trabalho previsto

1. Conferir se toda chamada no texto possui entrada correspondente e se nenhuma obra sem uso permanece na bibliografia.
2. Completar metadados somente a partir das fontes originais ou de registros bibliográficos confiáveis.
3. Normalizar autoria, título, edição, publicação, data, DOI, URL e acesso conforme o modelo institucional e as normas aplicáveis.
4. Eliminar duplicações e uniformizar chamadas de instituições, organizações e documentos sem data.
5. Produzir `artifacts/referencias.md` como saída final da etapa.

### Critérios de conclusão

- Toda fonte citada aparece na bibliografia e toda entrada bibliográfica é usada no texto.
- Os metadados foram conferidos, não inferidos.
- DOI, URL e datas de acesso estão consistentes.
- O mapa central e a bibliografia final representam a mesma versão do TCC.

## Registro obrigatório ao concluir um pacote

O agente deverá acrescentar ao final desta seção uma entrada no formato abaixo:

```text
### R-XX — AAAA-MM-DD

- Responsável:
- Arquivos alterados:
- Verificações realizadas:
- Referências incluídas, removidas ou deslocadas:
- Mapa central atualizado: sim, não ou não aplicável.
- Pendências encaminhadas ao R-08:
- Estado final: Concluído ou Aguardando esclarecimento.
```

Nenhum pacote será considerado concluído apenas porque o texto foi reescrito. A conclusão exige conferência factual, revisão editorial, atualização do mapa quando aplicável e registro do resultado.

## Registros de execução

### R-01 — 2026-09-08

- Responsável: Codex.
- Arquivos alterados: `artifacts/texto-fase-01.md`, `artifacts/texto-fase-02.md`, planejamentos das duas fases, mapa central de referências, plano integrado e arquivo principal de coordenação.
- Verificações realizadas: distinção entre evidência publicada, definição de escopo e inferência; conferência dos localizadores mantidos; comparação entre as duas fases; avaliação de uma fonte candidata sobre financiamento coletivo digital; revisão de anglicismos, causalidade, modalidade e repetição; validação estrutural do Quadro 1.
- Referências incluídas, removidas ou deslocadas: nenhuma obra incluída ou removida; usos existentes foram condensados e deslocados. A fonte candidata de Salido-Andres et al. (2022) foi examinada e excluída por não demonstrar o problema específico adotado pela Nossa Causa.
- Mapa central atualizado: sim.
- Pendências encaminhadas ao R-08: conferir a transição textual da Fase 2 para a definição de sistema atual na Fase 3 depois da execução de R-02.
- Estado final: Concluído.
