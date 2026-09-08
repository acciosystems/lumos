# Nossa Causa — Síntese do Projeto (TCC)

**Empresa fictícia:** AccioLabs

## O que é

Nossa Causa é uma plataforma web para centralizar e gerenciar campanhas de doação, substituindo a organização informal por grupos de Facebook/WhatsApp por um ambiente com ferramentas de gestão, filtros e transparência para organizadores e doadores.

## Problema que resolve

Hoje, campanhas de doação de itens físicos dependem de grupos informais em redes sociais, dificultando a organização, o acompanhamento e a prestação de contas. A plataforma centraliza esse processo, oferecendo indicadores de participação, atualizações publicadas pelo organizador e dados públicos de participação. Para doações em dinheiro, o organizador informa seus próprios dados de pagamento (chave PIX, número de conta), evitando as taxas de plataformas de processamento — dependendo apenas das taxas do próprio banco.

## Modelo de doação

- **Física**: organizador cria campanha para arrecadar itens em um local definido.
- **Virtual**: organizador disponibiliza chave PIX/conta bancária para receber doações diretamente.

## Prioridade das funcionalidades

| Prioridade                | Funcionalidade                           | Descrição                                                                                                               |
| ------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **P0 — Essencial (MVP)**  | Campanhas físicas                        | Criação de campanha com local e itens necessários                                                                       |
|                           | Campanhas virtuais                       | Doação via PIX/conta bancária informada pelo organizador                                                                |
|                           | Filtros                                  | Busca por tópico e região                                                                                               |
|                           | Ferramentas de gestão                    | Painel para organizadores acompanharem participantes e estatísticas                                                     |
|                           | Transparência                            | CNPJ público das organizações + prestação de contas obrigatória ao fim da campanha                                      |
|                           | Dados públicos de participação           | Número de participantes visível ao público em campanhas físicas                                                         |
| **P1 — Importante**       | Sistema de reputação                     | Pontua cancelamentos de última hora, cumprimento do prazo de prestação de contas e qualidade da organização da campanha |
|                           | Sistema de denúncia                      | Permite reportar campanhas ou organizadores problemáticos                                                               |
| **P2 — Desejável**        | Sistema de recompensas                   | ID de participação por usuário, permitindo ranking e premiação definida pelos organizadores                             |
|                           | Sistema de notificações                  | Possibilidade de evolução considerada tecnicamente inviável dentro do escopo do MVP                                     |
| **P3 — Futuro (pós-MVP)** | Integração com processador de pagamentos | Stripe, Polar, etc., como alternativa opcional ao PIX/conta direta                                                      |

## Questões em aberto

- **Prazo de prestação de contas**: definir o período de respaldo (ex.: prazo fixo de uma semana vs. cálculo baseado na quantidade de itens doados). Violação do prazo configura infração dos termos da plataforma.
