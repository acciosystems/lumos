# Manifesto de evidências — Fase 6

## Snapshot adotado

| Item | Registro |
| --- | --- |
| Data da conferência | 2026-09-06 |
| Commit | `2bd68da` |
| Estado do repositório no início | `artifacts/TCC-PRINCIPAL.md` modificado e `artifacts/planejamento-fase-06.md` ainda não rastreado, ambos pertencentes ao planejamento da Fase 6. |
| Recorte funcional | MVP da Nossa Causa adotado nas Fases 3, 4 e 5. |
| TSDoc | Não identificado no snapshot inicial. A implementação será conferida novamente antes da Parte 5. |

## Conferência da aplicação em execução

| Item | Registro |
| --- | --- |
| Comando | `doppler run -- bun run --filter @lumos/web dev` |
| Ambiente | Aplicação iniciada localmente em 6 de setembro de 2026. A conferência foi repetida após o banco de dados ficar disponível. |
| Páginas públicas e anônimas | Foram verificadas a página inicial, a listagem e o detalhe de campanha, além das telas de entrada, criação de conta, recuperação e redefinição de senha. Nenhum formulário foi submetido. |
| Cadastro | O cadastro estava habilitado no ambiente consultado. O inventário também registra o estado alternativo em que a mesma rota informa sua indisponibilidade. |
| Áreas autenticadas | O acesso anônimo às configurações de segurança foi redirecionado para a entrada, confirmando a barreira compartilhada dessas rotas. As telas e variações internas foram comparadas com o código, sem utilizar uma sessão autenticada. |
| Console | Após a disponibilização do banco de dados, não foram observados erros da aplicação nas páginas verificadas. |
| Resultado | A execução foi coerente com o inventário de quinze telas e suas variações. Não foram produzidas imagens nesta parte. |

## Estado das evidências por parte

| Parte | Evidência ou entrega | Estado |
| --- | --- | --- |
| 1 — Padrão do sistema | Rastreabilidade entre interface, procedimentos, validação, serviços, autenticação e persistência. | Concluída em 2026-09-06. |
| 2 — Lista de telas | Inventário textual de quinze telas, sem imagens. | Concluída em 2026-09-06. |
| 3 — Formulários | Matriz F01–F19 e capturas com dados fictícios. | Não iniciada. |
| 4 — Diagrama de classe | Fonte Mermaid e pesquisa conceitual. | Não iniciada. |
| 5 — TSDoc | Implementação verificada e imagem fornecida pelo usuário. | Não iniciada; depende dos insumos previstos. |

Este manifesto será atualizado ao fim de cada parte concluída. Caminhos técnicos e detalhes de conferência pertencem a este material auxiliar e não serão reproduzidos no texto do TCC.
