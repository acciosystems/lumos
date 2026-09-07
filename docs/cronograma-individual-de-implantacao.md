# Cronograma Individual de Implantação

## 1. Identificação

- **Sistema:** Nossa Causa (Lumos)
- **Modalidade:** planejamento individual e acadêmico
- **Responsável:** responsável técnico pelo projeto
- **Referência temporal:** etapas sequenciais, sem data de disponibilização pública
- **Esforço estimado:** 59 horas

## 2. Objetivo

Este cronograma organiza o cenário teórico de implantação do MVP Nossa Causa. Ele descreve a preparação e a validação que seriam necessárias antes de um uso futuro, sem afirmar publicação, treinamento realizado ou operação assistida.

O recorte contempla autenticação e recuperação de acesso, configuração inicial da conta, consulta e filtragem de campanhas, detalhes públicos, participação em campanhas físicas e criação de campanhas físicas ou virtuais por pessoas com perfil organizador.

## 3. Premissas

- A aplicação tem a Vercel como target codificado no adaptador Nitro.
- O PostgreSQL tem a Neon como target. Nessa configuração, `DATABASE_URL` usa o endpoint agrupado no runtime e `DIRECT_DATABASE_URL` o endpoint direto para migrações e tarefas administrativas. A validação diferencia essas modalidades nos hostnames da Neon e aceita outras URLs PostgreSQL fora desse target.
- Variáveis e segredos seriam mantidos no Doppler, sem registro de valores no código, documentação, capturas ou treinamento.
- Migrações Prisma seriam revisadas e aplicadas apenas pela conexão direta da Neon.
- O seed é determinístico e idempotente, mas dados de demonstração só seriam usados quando necessários ao roteiro acadêmico.
- Armazenamento de objetos, e-mail e logging permanecem integrações a conferir no cenário, sem alegação de configuração efetiva.

## 4. Cronograma

| Etapa | Atividade | Tempo estimado | Critério de conclusão previsto |
| --- | --- | ---: | --- |
| 1 | Revisar o escopo, os fluxos do MVP, as dependências e os critérios de adiamento. | 6 h | Checklist e snapshot documentados. |
| 2 | Conferir os targets Vercel e Neon, as versões declaradas e os acessos mínimos à infraestrutura. | 6 h | Parâmetros e responsabilidades registrados sem expor segredos. |
| 3 | Revisar schema, migrações, conexão agrupada de runtime, conexão direta administrativa e estratégia de recuperação. | 5 h | Procedimento teórico de banco revisado. |
| 4 | Conferir variáveis e integrações de autenticação, e-mail, armazenamento de objetos, logging e aplicação. | 6 h | Inventário de configurações concluído. |
| 5 | Gerar a versão candidata com o lockfile, executar as verificações técnicas previstas e auditar as dependências. | 5 h | Versão identificada, auditoria concluída e impedimentos registrados. |
| 6 | Validar acesso, recuperação de conta, configuração inicial, filtros, detalhes, participação e cancelamento de participação, perfil organizador e campanhas com dados de demonstração. | 6 h | Roteiro de validação preenchido. |
| 7 | Preparar o primeiro encontro (3 h), conduzi-lo conforme o plano de treinamento (2 h) e registrar dúvidas. | 5 h | Dúvidas classificadas e materiais revisados. |
| 8 | Conduzir o segundo encontro conforme o plano de treinamento (2 h) e, depois dele, revisar a recuperação e consolidar o resultado da simulação realizada no encontro (2 h). | 4 h | Critérios de assimilação e registro técnico da simulação consolidados. |
| 9 | Executar a verificação final teórica do checklist, do backup e do retorno. | 6 h | Nenhuma pendência crítica sem tratamento planejado. |
| 10 | Definir o acompanhamento do cenário e a classificação de ocorrências hipotéticas. | 4 h | Roteiro de acompanhamento definido. |
| 11 | Consolidar documentação, pendências e lições para eventual operação futura. | 6 h | Registro de encerramento preparado. |

## 5. Critérios de avanço entre etapas

O cenário só avançaria quando:

1. build, lint e verificação de tipos não apresentassem erro impeditivo;
2. a auditoria de dependências prevista não apresentasse vulnerabilidade sem tratamento ou exceção documentada;
3. as conexões Neon estivessem corretamente separadas por finalidade;
4. as variáveis obrigatórias fossem disponibilizadas sem exposição de valores;
5. autenticação, recuperação de acesso, configuração inicial da conta, consulta, filtros, detalhes, participação, cancelamento de participação e criação de campanhas fossem validados com dados de demonstração;
6. o procedimento de backup e retorno estivesse revisado;
7. o manual e o roteiro de treinamento fossem compatíveis com o snapshot;
8. não houvesse falha crítica sem encaminhamento.

## 6. Tratamento de falhas e retorno

Se uma falha comprometesse autenticação, integridade de dados, segurança ou operações centrais de campanha, o responsável técnico planejaria a interrupção da etapa, o registro do impacto e a repetição da validação afetada. Um retorno de versão ou de dados só seria considerado com procedimento previamente revisado, cópia compatível e restauração inicialmente isolada. O documento não registra a ocorrência de falha, restauração ou retorno executado.

## 7. Encerramento

O cronograma é concluído, no recorte acadêmico, com a documentação das condições necessárias a uma futura operação. Ele não constitui evidência de implantação efetiva.
