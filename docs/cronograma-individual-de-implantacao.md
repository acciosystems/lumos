# Cronograma Individual de Implantação

## 1. Identificação

- **Sistema:** Nossa Causa (Lumos)
- **Modalidade:** implantação individual
- **Responsável:** responsável técnico pelo projeto
- **Referência temporal:** `D0` representa o dia da entrada do sistema em produção
- **Período previsto:** de `D-10` a `D+7`
- **Esforço estimado:** 59 horas

## 2. Objetivo

Este cronograma organiza as atividades necessárias para implantar o Nossa Causa em ambiente de produção. Como o projeto necessita de um único responsável técnico, todas as etapas de planejamento, preparação, execução, validação, liberação e acompanhamento serão realizadas por essa mesma pessoa.

A implantação deverá disponibilizar, de forma segura e estável, os recursos atualmente implementados: autenticação e recuperação de acesso, configuração inicial do usuário, consulta e filtragem de campanhas, visualização dos detalhes de uma campanha e criação de campanhas físicas ou virtuais por usuários que já possuam perfil organizador.

## 3. Premissas da implantação

- O ambiente de produção, o banco PostgreSQL e o armazenamento compatível com S3 deverão estar disponíveis antes de `D-7`.
- As credenciais e variáveis de ambiente serão mantidas no Doppler e não serão registradas no código-fonte ou na documentação.
- A publicação utilizará os scripts e as configurações existentes no workspace Bun/Turborepo.
- As migrações Prisma serão aplicadas antes da liberação da aplicação.
- O seed é determinístico e idempotente, mas somente será executado em produção quando os dados de demonstração forem expressamente necessários.
- A implantação não dependerá de um fornecedor específico de nuvem ou hospedagem.
- Alterações que não sejam indispensáveis à liberação deverão ser adiadas para reduzir o risco no `D0`.

## 4. Cronograma

| Período        | Etapa                             | Atividades                                                                                                                                                                                                                                     | Tempo estimado | Entregável ou critério de conclusão                                                                                                  | Responsável                      |
| -------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------: | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| `D-10` a `D-8` | Planejamento                      | Revisar o escopo da versão; conferir requisitos; identificar dependências; inventariar banco, autenticação, e-mail, S3 e observabilidade; definir critérios de liberação e retorno.                                                            |            6 h | Checklist de implantação preenchido e escopo da versão congelado.                                                                    | Responsável técnico pelo projeto |
| `D-7`          | Preparação do ambiente            | Confirmar acesso ao ambiente de produção; verificar versões de Bun e PostgreSQL; configurar domínio, HTTPS e acesso restrito à infraestrutura; validar capacidade e persistência dos serviços.                                                 |            6 h | Ambiente acessível, protegido e compatível com a aplicação.                                                                          | Responsável técnico pelo projeto |
| `D-6`          | Banco de dados                    | Validar a conexão PostgreSQL; realizar backup quando houver uma base anterior; revisar e aplicar migrações Prisma; conferir tabelas, índices e integridade; registrar o procedimento de restauração.                                           |            5 h | Banco atualizado, íntegro e com restauração definida.                                                                                | Responsável técnico pelo projeto |
| `D-5`          | Configuração e integrações        | Cadastrar no Doppler as variáveis de banco, Better Auth, Google, e-mail, S3, logging e aplicação web; testar conectividade sem expor credenciais; revisar URLs públicas e permissões mínimas.                                                  |            6 h | Variáveis validadas e integrações respondendo no ambiente de produção.                                                               | Responsável técnico pelo projeto |
| `D-4`          | Geração da versão                 | Instalar dependências com o lockfile do projeto; executar lint, verificação de tipos, build e auditoria das dependências de produção; corrigir falhas impeditivas; identificar a versão candidata à produção.                                  |            5 h | Build reproduzível, auditoria de produção sem vulnerabilidades não aceitas e verificações técnicas concluídas sem erros impeditivos. | Responsável técnico pelo projeto |
| `D-3`          | Homologação                       | Validar autenticação, recuperação de senha, onboarding, configurações de conta, filtros e detalhes de campanhas; testar criação física e virtual com perfil organizador previamente cadastrado; verificar e-mail, imagens e registros de erro. |            6 h | Roteiro de homologação aprovado e evidências registradas.                                                                            | Responsável técnico pelo projeto |
| `D-2`          | Treinamento e ajustes             | Ministrar o primeiro encontro do treinamento; registrar dúvidas; corrigir apenas problemas críticos encontrados durante a prática; repetir os testes afetados.                                                                                 |            5 h | Primeiro encontro concluído e pendências críticas resolvidas ou documentadas.                                                        | Responsável técnico pelo projeto |
| `D-1`          | Preparação da liberação           | Ministrar o segundo encontro; revisar backup, retorno, contatos e comunicação; executar a verificação final; tomar a decisão de liberar ou adiar a versão.                                                                                     |            4 h | Checklist final aprovado e decisão de entrada em produção registrada.                                                                | Responsável técnico pelo projeto |
| `D0`           | Entrada em produção               | Criar backup final quando aplicável; ativar modo de manutenção se necessário; aplicar migrações pendentes; publicar a versão; executar testes rápidos; liberar o acesso e comunicar a conclusão.                                               |            6 h | Aplicação disponível, banco atualizado e testes rápidos aprovados.                                                                   | Responsável técnico pelo projeto |
| `D+1`          | Monitoramento intensivo           | Acompanhar disponibilidade, autenticação, consultas, criação de campanhas, e-mails, armazenamento e logs; classificar incidentes; aplicar correções urgentes conforme o plano de contingência.                                                 |            4 h | Primeiro ciclo operacional concluído sem falhas críticas abertas.                                                                    | Responsável técnico pelo projeto |
| `D+2` a `D+7`  | Operação assistida e encerramento | Monitorar indicadores diariamente; atender a equipe interna; consolidar ocorrências e soluções; atualizar a documentação; registrar aceite e lições aprendidas.                                                                                |            6 h | Implantação formalmente encerrada e operação transferida para a rotina normal.                                                       | Responsável técnico pelo projeto |

## 5. Critérios para entrada em produção

A liberação em `D0` somente ocorrerá quando todos os critérios abaixo forem atendidos:

1. build, lint e verificação de tipos sem erros impeditivos;
2. auditoria das dependências de produção (`bun audit --production`) sem vulnerabilidades não aceitas;
3. conexão segura com o PostgreSQL e migrações aplicadas com sucesso;
4. variáveis obrigatórias disponíveis por meio do Doppler;
5. autenticação, recuperação de acesso e configuração inicial funcionando;
6. listagem, filtros e detalhes das campanhas funcionando;
7. criação de campanhas físicas e virtuais validada com perfil organizador elegível;
8. envio de e-mail, armazenamento S3 e logging validados;
9. backup e procedimento de retorno conferidos;
10. inexistência de incidente crítico ou de alta prioridade sem tratamento;
11. treinamento da equipe interna concluído.

## 6. Plano de contingência e retorno

Se uma falha crítica comprometer autenticação, integridade dos dados, segurança ou as principais operações de campanha, o responsável técnico deverá interromper a liberação e:

1. restringir temporariamente o acesso, quando necessário;
2. registrar o horário, o impacto e as evidências do incidente;
3. restaurar a versão anterior da aplicação;
4. reverter a migração somente quando houver um procedimento seguro e previamente validado; caso contrário, restaurar o backup compatível;
5. repetir os testes rápidos na versão restaurada;
6. comunicar o adiamento e definir uma nova janela de implantação.

Problemas sem impacto crítico poderão ser documentados para correção posterior, desde que não comprometam a segurança, os dados ou os critérios de aceite.

## 7. Encerramento

A implantação será considerada concluída ao final de `D+7`, desde que o sistema permaneça estável, não existam incidentes críticos em aberto, a documentação esteja atualizada e a equipe interna confirme que consegue executar as rotinas apresentadas no treinamento.
