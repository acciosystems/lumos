# Manifesto de evidências — Fase 6

## Snapshot adotado

| Item | Registro |
| --- | --- |
| Data da conferência | 2026-09-06 |
| Commit | `2bd68da` |
| Estado do repositório no início | `artifacts/TCC-PRINCIPAL.md` modificado e `artifacts/planejamento-fase-06.md` ainda não rastreado, ambos pertencentes ao planejamento da Fase 6. |
| Recorte funcional | MVP da Nossa Causa adotado nas Fases 3, 4 e 5. |
| TSDoc | Não identificado no snapshot inicial. A implementação será conferida novamente antes da Parte 5. |

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
| 4 — Diagrama de classe | Fonte Mermaid e pesquisa conceitual. | Não iniciada. |
| 5 — TSDoc | Implementação verificada e imagem fornecida pelo usuário. | Não iniciada; depende dos insumos previstos. |

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

Este manifesto será atualizado ao fim de cada parte concluída. Caminhos técnicos e detalhes de conferência pertencem a este material auxiliar e não serão reproduzidos no texto do TCC.
