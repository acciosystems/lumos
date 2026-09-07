# Manifesto de evidências — Fase 6

## Snapshot adotado

| Item | Registro |
| --- | --- |
| Data da conferência | 2026-09-06 |
| Commit | `2bd68da` |
| Estado do repositório no início | `artifacts/TCC-PRINCIPAL.md` modificado e `artifacts/planejamento-fase-06.md` ainda não rastreado, ambos pertencentes ao planejamento da Fase 6. |
| Recorte funcional | MVP da Nossa Causa adotado nas Fases 3, 4 e 5. |
| TSDoc | Não identificado no snapshot inicial. Em 2026-09-07, o usuário determinou a adoção de TSDoc como alternativa a JAVADOC/SUMMARY e que a Parte 5 considerasse a implementação existente, com cobertura parcial de módulos relevantes. |

## Conferência da aplicação em execução — Parte 2

| Item | Registro |
| --- | --- |
| Comando | `doppler run -- bun run --filter @lumos/web dev` |
| Ambiente | Aplicação iniciada localmente em 6 de setembro de 2026. A conferência foi repetida após o banco de dados ficar disponível. |
| Páginas públicas e anônimas | Foram verificadas a página inicial, a listagem e o detalhe de campanha, além das telas de entrada, criação de conta, recuperação e redefinição de senha. Nenhum formulário foi submetido. |
| Cadastro | O cadastro estava habilitado no ambiente consultado. O inventário também registra o estado alternativo em que a mesma rota informa sua indisponibilidade. |
| Áreas autenticadas | O acesso anônimo às configurações de segurança foi redirecionado para a entrada, confirmando a barreira compartilhada dessas rotas. As telas e variações internas foram comparadas com o código, sem utilizar uma sessão autenticada. |
| Console | Após a disponibilização do banco de dados, não foram observados erros da aplicação nas páginas verificadas. Durante as capturas, o navegador registrou avisos de desenvolvimento e diagnósticos genéricos de acessibilidade para campos de formulário, sem erro de execução ou impedimento à conferência visual. |
| Resultado | A execução foi coerente com o inventário de quinze telas e suas variações. Não foram produzidas imagens nesta parte. |

## Estado das evidências por parte

| Parte | Evidência ou entrega | Estado |
| --- | --- | --- |
| 1 — Padrão do sistema | Rastreabilidade entre interface, procedimentos, validação, serviços, autenticação e persistência. | Concluída em 2026-09-06. |
| 2 — Lista de telas | Inventário textual de quinze telas, sem imagens. | Concluída em 2026-09-06. |
| 3 — Formulários | Matriz F01–F19 e capturas com dados fictícios. | Concluída em 2026-09-06. |
| 4 — Diagrama de classe | Fonte Mermaid, pesquisa conceitual e rastreabilidade à implementação. | Concluída em 2026-09-06. |
| 5 — TSDoc | Alternativa a JAVADOC/SUMMARY, escopo textual, fontes oficiais e imagem única fornecida pelo usuário. | Redação concluída sob a premissa de implementação existente; aguarda a imagem do usuário e a conferência posterior da ferramenta, do comando e da saída. |

## Capturas de formulários — Parte 3

| Item | Registro |
| --- | --- |
| Método | Chrome DevTools MCP, após conferência da árvore de acessibilidade de cada estado. |
| Ambiente visual | Aplicação local, tema claro, viewport de desktop de 1440 × 1200 pixels, em 2026-09-06. |
| Dados de demonstração | Conta, perfil organizador e campanhas fictícios, criados apenas para as capturas e removidos do banco de desenvolvimento ao final. Nenhuma credencial, token válido, dado pessoal ou dado bancário real foi exibido. |
| Revisão | Os arquivos PNG foram inspecionados quanto a corte, carregamento e legibilidade. Os cartões de progresso, atualização, prestação de contas e dados básicos foram recapturados para preservar título, orientação e campos completos. |

| ID | Arquivo | Estado registrado | Resultado da conferência |
| --- | --- | --- | --- |
| F01 | `artifacts/imagens/fase-06/formularios/f01-filtros-campanhas.png` | Filtros do catálogo público. | Controles de tema, região e modalidade visíveis. |
| F02 | `artifacts/imagens/fase-06/formularios/f02-entrar-na-conta.png` | Sessão anônima. | Formulário de entrada e métodos disponíveis visíveis. |
| F03 | `artifacts/imagens/fase-06/formularios/f03-criacao-conta.png` | Sessão anônima com cadastro habilitado. | Campos de cadastro completos e legíveis. |
| F04 | `artifacts/imagens/fase-06/formularios/f04-solicitacao-redefinicao.png` | Sessão anônima. | Solicitação de redefinição visível. |
| F05 | `artifacts/imagens/fase-06/formularios/f05-redefinicao-senha.png` | Rota com identificador fictício. | Campos de nova senha visíveis; fluxo não submetido. |
| F06 | `artifacts/imagens/fase-06/formularios/f06-perfil-organizador.png` | Perfil institucional autenticado. | Campo condicional de organização visível. |
| F07 | `artifacts/imagens/fase-06/formularios/f07-criar-campanha-fisica.png` | Criação de campanha física. | Campos e ponto de coleta visíveis. |
| F08 | `artifacts/imagens/fase-06/formularios/f08-criar-campanha-virtual.png` | Criação de campanha virtual. | Campos próprios da modalidade visíveis. |
| F09 | `artifacts/imagens/fase-06/formularios/f09-editar-campanha-fisica.png` | Edição de campanha física fictícia. | Valores de demonstração e campos físicos visíveis. |
| F10 | `artifacts/imagens/fase-06/formularios/f10-editar-campanha-virtual.png` | Edição de campanha virtual fictícia. | Valores de demonstração e campos virtuais visíveis. |
| F11 | `artifacts/imagens/fase-06/formularios/f11-progresso-de-itens.png` | Campanha física ativa. | Cartão de progresso, valor e ação completos. |
| F12 | `artifacts/imagens/fase-06/formularios/f12-publicacao-de-atualizacao.png` | Campanha ativa. | Campo de mensagem e ação de publicação completos. |
| F13 | `artifacts/imagens/fase-06/formularios/f13-prestacao-contas-fisica.png` | Campanha física concluída. | Total de itens, resumo e evidências visíveis. |
| F14 | `artifacts/imagens/fase-06/formularios/f14-prestacao-contas-virtual.png` | Campanha virtual concluída. | Total arrecadado, resumo e evidências visíveis. |
| F15 | `artifacts/imagens/fase-06/formularios/f15-dados-basicos-conta.png` | Aba Conta autenticada. | Nome e nome de usuário visíveis. |
| F16 | `artifacts/imagens/fase-06/formularios/f16-alteracao-avatar.png` | Diálogo de avatar aberto. | Controle de seleção de imagem visível. |
| F17 | `artifacts/imagens/fase-06/formularios/f17-alteracao-email.png` | Diálogo de e-mail aberto. | Campo de endereço e confirmação visíveis. |
| F18 | `artifacts/imagens/fase-06/formularios/f18-alteracao-senha.png` | Diálogo de senha aberto. | Campos de senha completos e legíveis. |
| F19 | `artifacts/imagens/fase-06/formularios/f19-registro-chave-acesso.png` | Diálogo de chave de acesso aberto. | Campo de nome visível; registro não confirmado. |

## Diagrama de classe — Parte 4

| Item | Registro |
| --- | --- |
| Fonte conceitual | OBJECT MANAGEMENT GROUP. *Unified Modeling Language — Version 2.5.1*. 2017, seção 11.4.4, p. 195, e seção 11.5.4, pp. 201–202. Consulta em 2026-09-06. |
| Fonte de notação | MERMAID. *Class diagrams*. Documentação apresentada como versão 11.17.2. Consulta em 2026-09-06. |
| Fonte editável | `artifacts/diagramas/fase-06-classes.mmd`. |
| Validação | Renderização concluída com Mermaid CLI 11.17.0 em 2026-09-06. Após as revisões de coerência, a saída passou de aproximadamente 2397 × 1893 para 784 × 893 pixels e foi novamente inspecionada. A composição entre campanha e prestação de contas foi reposicionada para não atravessar a caixa do contrato. O recorte menor e a proporção próxima à página favorecem a leitura na inserção em largura integral. Não foi mantida exportação, pois a diagramação final permanece adiada. |
| Recorte | Domínio de campanhas: entidades persistidas, enumeração de modalidade, contrato de prestação de contas e módulos funcionais. |
| Rótulos | A figura traduz atributos e operações para português; a tabela de rastreabilidade preserva os identificadores técnicos correspondentes. |
| Limite de interpretação | As caixas `<<tipo validado>>` e `<<módulo funcional>>` representam tipos inferidos e módulos de funções TypeScript; não afirmam a existência de classes concretas. |

| Elemento exibido | Correspondente técnico verificado |
| --- | --- |
| Campanha; Prestação de contas | Modelos `Campaign` e `CampaignAccountability` em `packages/database/prisma/schemas/campaign.prisma`. |
| Modalidade da campanha | Enumeração `CampaignType` no mesmo esquema Prisma, reexportada pela validação compartilhada. |
| Contrato de prestação de contas | Tipo inferido de `campaignAccountabilityInputSchema` em `packages/validation/src/campaign.ts`. Os contratos de criação e edição foram omitidos da figura para preservar a legibilidade, embora as operações correspondentes permaneçam representadas. |
| Procedimentos de campanha | Procedimentos `create`, `updateDetails`, `saveAccountability` e `transitionLifecycle` em `packages/rpc/src/routers/campaign.ts`. |
| Serviços de campanha | Funções `toCampaignCreateData`, `toCampaignUpdateData` e `saveCampaignAccountability` nos serviços de campanhas do pacote RPC. |
| Campanha–prestação | Relação opcional `Campaign.accountability`, representada pela composição `1` para `0..1`. A relação com arquivos foi retirada do recorte para reduzir a densidade visual; ela permanece documentada no DER da Fase 4. |
| Contrato–modalidade; procedimentos–contrato; serviços–campanha | Discriminação por `type` no esquema Valibot, entrada do procedimento e chamadas aos serviços de campanha. |

## TSDoc — Parte 5

| Item | Registro |
| --- | --- |
| Premissa de execução | Por instrução do usuário em 2026-09-07, TSDoc é a alternativa adotada para JAVADOC/SUMMARY; os comentários e sua verificação são considerados existentes nesta parte. |
| Fonte conceitual | TSDOC. *How can I use TSDoc?*; *TSDoc spec*; páginas das tags `@remarks`, `@param`, `@returns` e `@throws`. Consulta em 2026-09-07. |
| Cobertura incluída | Contratos compartilhados de validação, funções de calendário, procedimentos e serviços de campanhas e APIs selecionadas de autenticação. |
| Exclusões | Componentes React, rotas visuais, modelos e clientes gerados, esquemas Prisma, migrações, seeds, scripts de infraestrutura, testes e auxiliares privados. |
| Limite de afirmação | A cobertura é parcial e não mede a totalidade dos comentários do monorepo. TSDoc define a convenção; a ferramenta compatível interpreta ou verifica os comentários. |
| Imagem | A única imagem do tópico continua dependente do arquivo fornecido pelo usuário. Nenhuma imagem alternativa foi criada. |

Este manifesto será atualizado ao fim de cada parte concluída. Caminhos técnicos e detalhes de conferência pertencem a este material auxiliar e não serão reproduzidos no texto do TCC.
