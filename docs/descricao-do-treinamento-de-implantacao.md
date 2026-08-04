# Descrição do Treinamento de Implantação

## 1. Identificação

- **Sistema:** Nossa Causa (Lumos)
- **Público-alvo:** equipe interna responsável pela operação, validação e suporte do sistema
- **Instrutor:** responsável técnico pelo projeto e pela implantação
- **Carga horária:** 4 horas
- **Formato:** dois encontros de 2 horas
- **Modalidade:** demonstração ao vivo e prática assistida, presencial ou por videoconferência com compartilhamento de tela
- **Momento previsto:** primeiro encontro em `D-2` e segundo encontro em `D-1`, conforme o cronograma de implantação

## 2. Objetivo

O treinamento tem como objetivo preparar a equipe interna para utilizar, validar e prestar o primeiro atendimento relacionado ao Nossa Causa durante a implantação. Ao final, os participantes deverão compreender o propósito do sistema, reconhecer os principais fluxos, executar as verificações operacionais e encaminhar incidentes com informações suficientes para diagnóstico.

O treinamento será restrito às funcionalidades disponíveis na versão implantada. Recursos previstos para fases futuras, como reputação, denúncias, recompensas, notificações e processamento de pagamentos pela plataforma, serão apresentados apenas como itens fora do escopo atual.

## 3. Pessoas envolvidas

| Papel                                | Participação e responsabilidade                                                                                                                                                  |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Responsável técnico pelo projeto     | Preparar o ambiente e os materiais; ministrar os encontros; demonstrar os fluxos; orientar a prática; responder dúvidas; avaliar os exercícios e registrar pendências.           |
| Representantes da equipe interna     | Participar dos dois encontros; executar os exercícios; validar os fluxos; registrar dúvidas; consultar a documentação e confirmar a capacidade de prestar o atendimento inicial. |
| Representante de operação ou negócio | Validar se os fluxos demonstrados atendem ao processo esperado e conceder o aceite do treinamento. Esse papel poderá ser acumulado por um dos representantes da equipe interna.  |

Como a implantação é individual, não haverá divisão das responsabilidades técnicas entre diferentes profissionais. Todos os procedimentos técnicos e a condução do treinamento ficarão sob responsabilidade do responsável pelo projeto.

## 4. Pré-requisitos e recursos

Antes do primeiro encontro, deverão estar disponíveis:

- ambiente de homologação ou versão candidata à produção;
- computador com navegador atualizado e acesso à internet;
- recurso de projeção ou compartilhamento de tela;
- contas de treinamento sem credenciais reais de produção;
- ao menos uma conta com perfil organizador previamente cadastrado;
- campanhas de exemplo físicas e virtuais;
- acesso dos participantes aos materiais de apoio;
- canal definido para dúvidas e comunicação de incidentes.

Credenciais, tokens e valores armazenados no Doppler nunca deverão ser exibidos, copiados para apresentações ou compartilhados com participantes que não necessitem desse acesso.

## 5. Etapas e tempo estimado

### Encontro 1 — Uso funcional e validação básica (2 horas)

| Etapa                       | Conteúdo                                                                                                                                      | Método                             |       Tempo |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ----------: |
| Abertura e contextualização | Objetivo do Nossa Causa, tipos de campanha, papéis dos usuários, escopo da versão e agenda do treinamento.                                    | Exposição dialogada                |      15 min |
| Acesso e conta              | Cadastro habilitado, login, login social quando configurado, recuperação de senha, configuração inicial e ajustes de conta e segurança.       | Demonstração guiada                |      25 min |
| Consulta de campanhas       | Navegação pela listagem, filtros por tipo, tema e região, leitura dos detalhes, dados do organizador e informações de transparência exibidas. | Demonstração seguida de prática    |      25 min |
| Campanha física             | Pré-requisito do perfil organizador; preenchimento de título, descrição, categoria, região, período, local, meta de itens e ponto de coleta.  | Estudo de caso e prática assistida |      25 min |
| Campanha virtual            | Cadastro de campanha com chave PIX e/ou dados bancários e explicação de que o pagamento ocorre fora da plataforma.                            | Estudo de caso e prática assistida |      20 min |
| Revisão                     | Correção dos exercícios, perguntas e registro de dificuldades para o segundo encontro.                                                        | Discussão orientada                |      10 min |
| **Total**                   |                                                                                                                                               |                                    | **120 min** |

### Encontro 2 — Operação da implantação e suporte (2 horas)

| Etapa                    | Conteúdo                                                                                                                                  | Método                       |       Tempo |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ----------: |
| Retomada                 | Revisão das dúvidas e dos pontos observados no primeiro encontro.                                                                         | Perguntas e respostas        |      10 min |
| Visão da implantação     | Ambientes, build, PostgreSQL e migrações Prisma, Doppler, autenticação, e-mail, S3 e logging, sem revelar segredos.                       | Demonstração técnica         |      25 min |
| Validação operacional    | Execução do checklist de autenticação, filtros, detalhes e criação de campanhas; reconhecimento de mensagens de erro e indisponibilidade. | Roteiro guiado               |      25 min |
| Atendimento inicial      | Coleta de horário, usuário afetado, fluxo, mensagem, evidência e impacto; classificação e encaminhamento de incidentes.                   | Estudo de caso               |      20 min |
| Simulação de implantação | Aplicação da lista de verificação, decisão de liberar ou adiar e simulação de resposta a uma falha crítica.                               | Exercício prático em grupo   |      25 min |
| Avaliação e encerramento | Avaliação prática, correção, entrega dos materiais, definição do canal de suporte e aceite do treinamento.                                | Prática assistida e feedback |      15 min |
| **Total**                |                                                                                                                                           |                              | **120 min** |

## 6. Métodos de execução

O treinamento combinará os seguintes métodos:

1. **Exposição dialogada:** apresentação breve dos conceitos, permitindo perguntas durante a explicação.
2. **Demonstração guiada:** execução dos fluxos pelo instrutor, com explicação das decisões e dos resultados esperados.
3. **Prática assistida:** repetição dos fluxos pelos participantes com orientação imediata.
4. **Estudo de caso:** criação e análise de cenários próximos à operação real, incluindo campanhas físicas e virtuais.
5. **Checklist operacional:** uso de uma sequência padronizada para validar a versão antes e depois da publicação.
6. **Simulação de incidente:** exercício de coleta de evidências, classificação do impacto, comunicação e decisão de retorno.
7. **Perguntas e respostas:** espaço reservado para esclarecer dúvidas e registrar necessidades de documentação.

O instrutor deverá evitar uma apresentação exclusivamente teórica. Cada fluxo funcional demonstrado deverá ser repetido por pelo menos um participante.

## 7. Documentação oferecida

Os seguintes materiais serão disponibilizados à equipe interna:

- **Manual do Usuário do Nossa Causa:** documento de referência para acesso, configuração inicial, consulta e filtragem de campanhas, visualização de detalhes e criação de campanhas físicas e virtuais;
- **Guia rápido de operação:** resumo dos fluxos utilizados com maior frequência;
- **Checklist de implantação:** sequência de preparação, validação, entrada em produção e acompanhamento;
- **Roteiro de testes rápidos:** verificações essenciais a serem executadas após cada publicação;
- **Guia de atendimento e incidentes:** informações mínimas que devem ser coletadas, níveis de impacto e canal de encaminhamento;
- **Perguntas frequentes:** respostas para dúvidas recorrentes observadas durante os encontros.

Os materiais deverão ser entregues em formato digital e permanecer acessíveis em local conhecido pela equipe. O Manual do Usuário deverá indicar claramente as limitações da versão atual e não deverá incluir credenciais ou dados sensíveis.

## 8. Avaliação e critérios de conclusão

A assimilação será verificada por observação direta durante os exercícios e por uma avaliação prática ao final do segundo encontro. O treinamento será considerado concluído quando:

1. todos os participantes tiverem acompanhado os dois encontros ou uma reposição equivalente;
2. a equipe conseguir acessar o sistema e localizar uma campanha utilizando os filtros;
3. pelo menos um participante conseguir criar uma campanha física e uma virtual com dados de teste e perfil organizador elegível;
4. a equipe conseguir executar o roteiro de testes rápidos;
5. os participantes conseguirem registrar e encaminhar um incidente com contexto, impacto e evidências;
6. dúvidas pendentes, responsáveis e prazos estiverem documentados;
7. o representante de operação ou negócio registrar o aceite do treinamento.

Caso algum critério não seja atendido, o responsável técnico deverá oferecer reforço direcionado e repetir a atividade correspondente antes do encerramento da operação assistida em `D+7`.

## 9. Acompanhamento após o treinamento

Durante o período de `D0` a `D+7`, o responsável técnico manterá um canal para dúvidas e acompanhará a execução dos fluxos pela equipe interna. As ocorrências desse período serão usadas para corrigir lacunas dos materiais, atualizar as perguntas frequentes e orientar treinamentos futuros.
