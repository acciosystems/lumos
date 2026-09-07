# Evidências de manutenção — Fase 8

## Finalidade e recorte

Este manifesto registra as fontes técnicas, os comandos e as ausências verificados para redigir a Fase 8. Ele não é parte do texto final do TCC e não comprova operação externa, implantação, backup, restauração, monitoramento configurado ou atendimento de incidentes.

- Data da conferência: 2026-09-07.
- Commit de referência no início da conferência: `71caac2eb3c7f6b9169babb33f5895c25e572d39` (`docs(tcc): complete phase 7 implantation planning`).
- Último commit que alterou programação: `aefaf85b52072a591d30635b5764ce011a972f3c`, em 2026-09-05T15:08:29−03:00 (`chore: enable web request logs and redact avatars`).
- Alterações posteriores avaliadas neste manifesto: artefatos de planejamento e redação do TCC; não alteram o snapshot funcional do MVP.

## Classes de evidência

| Classe                    | Uso neste manifesto                                          |
| ------------------------- | ------------------------------------------------------------ |
| Implementado e verificado | Código, configuração ou manifesto presente no snapshot.      |
| Processo documentado      | Procedimento interno escrito, sem prova de execução externa. |
| Registro versionado       | Histórico Git usado para delimitar o snapshot.               |
| Verificação executada     | Resultado de comando ou busca realizada durante a auditoria. |
| Ausência verificada       | Item procurado e não localizado no snapshot.                 |
| Proposto                  | Prática redigida para operação futura.                       |
| Dependente de fornecedor  | Capacidade que requer configuração externa atual.            |

## Verificações executadas

| Verificação               | Comando ou método                                                                       | Resultado                                                                                            | Classe e limite                                                                      |
| ------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Snapshot Git              | `git rev-parse HEAD` e inspeção do histórico posterior ao último commit de programação. | Commit de referência e limite funcional registrados nas linhas 8–10.                                 | Registro versionado; representa o histórico local na data da conferência.            |
| Lint                      | `bun run lint`                                                                          | Êxito; `oxlint` não reportou problemas.                                                              | Verificação executada; não é teste funcional.                                        |
| Type-check                | `bunx turbo type-check`                                                                 | Êxito em nove pacotes, com logs de cache do Turbo.                                                   | Verificação executada; não executa fluxos de usuário.                                |
| Auditoria de dependências | `bun audit`                                                                             | Saída com nove vulnerabilidades transitivas: seis altas e três moderadas; comando retornou código 1. | Verificação executada; não determina alcance em produção sem análise de cada cadeia. |
| Busca por testes          | `rg --files -g '*test*' -g '*spec*'`, excluindo dependências e cópias bibliográficas.   | Nenhuma suíte dedicada rastreada foi localizada.                                                     | Ausência verificada; revalidar após novas alterações.                                |
| Busca por CI              | Busca por workflows em `.github/`, `.gitlab-ci.yml` e `Jenkinsfile`.                    | Nenhum workflow de CI rastreado foi localizado.                                                      | Ausência verificada; não concluir que não exista automação fora do repositório.      |

## Inventário técnico utilizado

| Tema                      | Evidência                                                                                           | Classe                                                                  | Uso na Fase 8                                                                  |
| ------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Estrutura do projeto      | `package.json`, `turbo.json`, manifestos de `apps/web` e `packages/`.                               | Implementado e verificado.                                              | Organização modular, scripts, lockfile e limites das verificações.             |
| Banco e migrações         | `packages/database/prisma.config.ts`, schemas e migrações Prisma.                                   | Implementado e verificado.                                              | Migração versionada e conexão administrativa direta.                           |
| Observabilidade           | `packages/logging/src/delivery.ts`, `packages/database/src/telemetry.ts` e `docs/observability.md`. | Implementado e verificado; parte do procedimento depende de fornecedor. | Eventos estruturados, entrega direta ao Axiom e diagnóstico seguro de falha.   |
| Conexões e limites        | `docs/database-connections.md` e `docs/request-deadlines.md`.                                       | Processo documentado e implementação parcial verificada.                | Revisão de alterações que afetam pool, timeout, Neon ou Vercel.                |
| Segurança                 | `docs/security-exceptions.md`, `docs/auth-rate-limiting.md` e resultado de `bun audit`.             | Processo documentado e verificação executada.                           | Auditoria, exceção de `deepmerge-ts` e revisão prevista até 2026-09-25.        |
| Regras de domínio         | `docs/campaign-lifecycle.md` e `docs/campaign-idempotency.md`.                                      | Processo documentado.                                                   | Comportamentos de campanhas que a manutenção deve preservar.                   |
| Documentação              | `artifacts/manual-do-usuario.md` e textos das Fases 6 e 7.                                          | Processo documentado.                                                   | Atualização documental após mudança funcional; cobertura TSDoc não comprovada. |
| Implantação e recuperação | `artifacts/texto-fase-07.md`.                                                                       | Proposto.                                                               | Fronteira entre mudança de software e operação, backup, restauração e retorno. |

## Delimitação de afirmações externas

| Afirmação                                                                                               | Tratamento no texto final                                               |
| ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Axiom, Neon, Vercel, Doppler, Resend e armazenamento de objetos possuem configuração operacional ativa. | Não afirmada; serviços são targets ou dependem de configuração externa. |
| Alertas, dataset e notificadores foram configurados ou atendidos.                                       | Não afirmada; documentação define procedimentos e verificações futuras. |
| Backup, restauração ou migração foram executados.                                                       | Não afirmada; a Fase 7 os descreve como planejamento teórico.           |
| O resultado de `bun audit` prova vulnerabilidade explorável em produção.                                | Não afirmada; o resultado é insumo de avaliação preventiva.             |
| O lint e o type-check comprovam ausência de defeitos.                                                   | Não afirmada; são verificações estáticas.                               |
| Há suporte, SLA, rotina de release ou equipe operacional designada.                                     | Não afirmada; o texto usa papéis propostos.                             |

## Rastreabilidade com o texto final

| Seção da Fase 8       | Evidências usadas                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| 8.1 Escopo e tipos    | ISO/IEC/IEEE 14764:2022 e SWEBOK Guide V4.0a, registrados no mapa central como R-025 e R-026.             |
| 8.2 Condições atuais  | Snapshot Git, manifestos, busca de testes e CI, comandos executados e documentos técnicos e operacionais. |
| 8.3 Processo proposto | Regras do repositório, documentos técnicos, Fase 7 e fontes conceituais R-025 e R-026.                    |
| 8.4 Plano do MVP      | Síntese proposta a partir das condições verificadas; não é evidência de execução.                         |
