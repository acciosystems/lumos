# Parte do Treinamento de Implantação — Retomada e Validação Operacional

Este documento apresenta somente uma parte do treinamento principal descrito em [Descrição do Treinamento de Implantação](descricao-do-treinamento-de-implantacao.md). O recorte corresponde aos três primeiros tópicos do segundo encontro e não substitui o treinamento completo.

## 1. Identificação

- **Sistema:** Nossa Causa (Lumos)
- **Público-alvo:** equipe interna responsável pela operação e validação do sistema
- **Instrutor:** responsável técnico pelo projeto e pela implantação
- **Carga horária:** 1 hora
- **Formato:** encontro único
- **Modalidade:** demonstração ao vivo e roteiro guiado, presencial ou por videoconferência com compartilhamento de tela
- **Momento previsto:** `D-1`, conforme o cronograma de implantação
- **Relação com o treinamento principal:** recorte dos três primeiros tópicos do segundo encontro

## 2. Objetivo

Esta parte do treinamento tem como objetivo retomar as dúvidas identificadas anteriormente, apresentar à equipe uma visão geral dos componentes envolvidos na implantação e executar as verificações operacionais essenciais antes da entrada do sistema em produção.

Ao final do encontro, os participantes deverão compreender a estrutura geral da implantação, reconhecer os principais pontos de validação do sistema e identificar mensagens de erro ou sinais de indisponibilidade que exijam atenção técnica.

## 3. Agenda

| Etapa                 | Conteúdo                                                                                                                                  | Método                |      Tempo |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ---------: |
| Retomada              | Revisão das dúvidas e dos pontos observados no primeiro encontro.                                                                         | Perguntas e respostas |     10 min |
| Visão da implantação  | Ambientes, build, PostgreSQL e migrações Prisma, Doppler, autenticação, e-mail, S3 e logging, sem revelar segredos.                       | Demonstração técnica  |     25 min |
| Validação operacional | Execução do checklist de autenticação, filtros, detalhes e criação de campanhas; reconhecimento de mensagens de erro e indisponibilidade. | Roteiro guiado        |     25 min |
| **Total**             |                                                                                                                                           |                       | **60 min** |

## 4. Conclusão

O encontro será considerado concluído quando:

1. as dúvidas e observações registradas anteriormente tiverem sido revisadas;
2. a equipe conseguir reconhecer os componentes gerais da implantação sem acessar ou expor credenciais, tokens ou outros dados sensíveis;
3. os participantes conseguirem executar o checklist dos fluxos essenciais de autenticação, consulta, filtragem, visualização de detalhes e criação de campanhas;
4. a equipe conseguir distinguir o comportamento esperado de mensagens de erro ou sinais de indisponibilidade que devam ser comunicados ao responsável técnico.

Pendências identificadas durante o encontro deverão ser registradas com responsável e prazo para acompanhamento antes da entrada em produção.
