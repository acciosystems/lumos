# Planejamento — Fase 5: Projeto físico

## Identificação e escopo

- Responsável: Codex.
- Estado: planejamento, redação, conferência e revisão concluídos em 2026-09-06.
- Entrega: `artifacts/texto-fase-05.md`.
- Recorte: requisitos de hardware, software e equipamento necessários ao usuário final do MVP da Nossa Causa.

Esta fase não descreverá servidores, banco de dados, serviços de armazenamento, ferramentas de desenvolvimento ou recursos usados pela equipe técnica. Esses elementos pertencem à infraestrutura da solução, enquanto a decisão D-003 limita a Fase 5 às condições de acesso e uso percebidas pelo usuário final.

## Objetivo

A redação deverá explicar, em linguagem direta, o que uma pessoa precisa para consultar campanhas e o que passa a ser necessário quando ela cria uma conta, participa de uma campanha ou atua como organizadora. O texto também distinguirá os requisitos indispensáveis das condições aplicáveis somente a uma tarefa, como o envio de arquivos ou a realização de uma transferência bancária fora da plataforma.

Não serão definidos modelo de aparelho, sistema operacional, processador, memória, armazenamento, velocidade de conexão, resolução de tela ou versão específica de navegador sem evidência de uma restrição real. Os requisitos serão descritos pelo comportamento necessário para usar a aplicação.

## Adaptação da estrutura inicial

A estrutura inicial chama a Fase 5 de “projeto físico” e solicita requisitos de hardware, software e equipamento. Neste trabalho, essa expressão será interpretada como o conjunto de recursos do lado do usuário, porque a orientação comum determina que a fase não apresente requisitos de hospedagem.

O tópico 5.1 será mantido, mas sua organização interna separará quatro situações:

1. acesso público à plataforma;
2. criação e uso de uma conta;
3. gestão de campanhas e envio de arquivos;
4. ações realizadas fora da plataforma para concretizar uma doação.

Essa divisão evita transformar recursos opcionais em exigências universais. Também impede que uma atividade externa, como usar o aplicativo de uma instituição financeira, seja apresentada como integração ou processamento realizado pela Nossa Causa.

## Usuários considerados

| Papel | Uso relevante para esta fase | Limite da descrição |
| --- | --- | --- |
| Visitante | Consultar, filtrar e visualizar campanhas e suas informações públicas. | Não precisa criar conta nem possuir aplicativo bancário para navegar. |
| Usuário autenticado | Administrar a conta e participar de campanhas físicas ativas. | Precisa manter uma sessão válida no navegador. O acesso à caixa de e-mail é necessário nos fluxos de cadastro, verificação e recuperação por e-mail e senha. |
| Organizador | Manter o perfil, criar e administrar campanhas, publicar atualizações e prestar contas. | Pode precisar selecionar arquivos no próprio dispositivo, conforme a ação realizada. |
| Doador de campanha virtual | Consultar os dados PIX ou bancários divulgados pelo organizador. | A transferência ocorre em serviço financeiro externo e não é processada pela plataforma. |

O organizador também é um usuário autenticado. A redação não o tratará como alguém sujeito a um conjunto técnico inteiramente separado.

## Estrutura planejada do texto

### 5.1 Requisitos de hardware, software e equipamento

A seção começará esclarecendo que a Nossa Causa é acessada pela web e não exige a instalação de um programa próprio. Em seguida, apresentará um quadro curto com os requisitos do usuário final, sua aplicação e os limites de cada item.

Título provisório do quadro: **Requisitos do usuário final para acesso ao MVP Nossa Causa**.

| Grupo | Requisito planejado | Aplicação | Forma de apresentação |
| --- | --- | --- | --- |
| Equipamento de acesso | Dispositivo com tela e meio de entrada capaz de executar um navegador gráfico, como computador, tablet ou smartphone. | Todos os usuários. | Os aparelhos serão citados como exemplos, sem escolher marca, modelo ou configuração mínima. |
| Conectividade | Acesso à internet durante consultas, envio de formulários e carregamento de arquivos. | Todos os usuários; maior relevância nas ações de envio. | Não será fixada velocidade mínima. Uma conexão estável será apresentada como condição prática para concluir envios, não como garantia de desempenho. |
| Navegador | Navegador gráfico capaz de executar JavaScript. Para o acesso autenticado, precisa também aceitar os cookies usados para manter a sessão. | JavaScript na consulta pública e nas operações autenticadas; cookies apenas nas operações autenticadas. | Não serão prometidos funcionamento em todo navegador nem suporte a versões específicas que não tenham sido validadas. |
| Correio eletrônico | Endereço de e-mail válido e acesso à respectiva caixa de entrada. | Cadastro, verificação e recuperação por e-mail e senha. | O e-mail não será tratado como requisito para a consulta pública nem como exigência universal das alternativas de autenticação. |
| Arquivos locais | Capacidade de selecionar e enviar imagens ou documentos nos formatos aceitos pela interface. | Imagem de campanha, imagem de perfil e evidências opcionais da prestação de contas. | Formatos, quantidade e tamanho serão informados apenas quando corresponderem às regras atuais da aplicação. Câmera, scanner e impressora não serão exigidos. |
| Serviço financeiro externo | Acesso a um serviço bancário que permita realizar PIX ou transferência para os dados publicados. | Somente para quem decidir contribuir financeiramente com uma campanha virtual. | Será descrito como recurso externo do doador, dispensável para navegar e sem integração de pagamento com a Nossa Causa. |
| Deslocamento físico | Possibilidade de entregar itens no ponto de coleta indicado. | Somente para quem participar de uma campanha física. | Será registrado como condição prática da doação, não como requisito de hardware ou software. |

Depois do quadro, o texto deverá explicar que os requisitos variam conforme a ação. Consultar campanhas demanda apenas acesso web. O cadastro com e-mail e senha acrescenta a necessidade de acesso à caixa de entrada, enquanto a sessão autenticada depende dos cookies do navegador. Enviar arquivos depende de o dispositivo permitir sua seleção, e doar para uma campanha virtual exige acesso independente ao serviço financeiro escolhido pelo doador.

## Regras de arquivos a conferir antes da redação

As restrições abaixo serão verificadas novamente no momento da escrita. Elas poderão aparecer de forma resumida no texto final se ajudarem o leitor a preparar os arquivos necessários:

- a imagem de campanha aceita JPEG, PNG ou WebP e é preparada pelo sistema antes do envio;
- a imagem de perfil é opcional e possui limite próprio;
- as evidências da prestação de contas aceitam JPEG, PNG, WebP ou PDF;
- cada evidência pode ter até 10 MB, com limite total de dez arquivos por prestação de contas;
- o envio de imagem ou evidência é opcional nos fluxos atuais.

Detalhes internos de conversão, armazenamento e transmissão não entrarão no texto. Caso as regras mudem antes da redação, serão usados os limites visíveis ao usuário na versão adotada como recorte.

## Fontes internas de conferência

Os materiais abaixo servirão apenas para verificar o planejamento. Seus caminhos não serão reproduzidos no texto destinado ao TCC.

| Evidência interna | Uso na conferência |
| --- | --- |
| `docs/nossa-causa-summary-en.md` e o resumo equivalente em português | Recorte do produto, modalidades de campanha e limites do MVP. |
| `artifacts/texto-fase-03.md` | Atores, operações atuais e distinção entre a plataforma e as atividades externas. |
| `artifacts/texto-fase-04.md` | Coerência com os atores e com o acesso da aplicação pelo navegador. |
| `apps/web/src/routes/` | Separação entre consulta pública, cadastro, autenticação e operações do organizador. |
| `packages/auth/src/auth.ts` | Uso de e-mail, verificação de endereço, recuperação de acesso e sessão. |
| `apps/web/src/components/campaign/` | Seleção de imagens e evidências nas ações do organizador. |
| `packages/validation/src/user.ts` e `packages/validation/src/campaign.ts` | Formatos, quantidades e limites dos arquivos aceitos. |
| Configuração e manifesto da aplicação web | Confirmação de que o produto é executado no navegador e não exige instalação própria. |

A implementação comprova dependências funcionais da versão examinada. Ela não comprova compatibilidade universal, desempenho em qualquer conexão ou suporte irrestrito a dispositivos e tecnologias assistivas.

## Afirmações planejadas e limites

| Tema | Formulação segura | Formulação que deverá ser evitada |
| --- | --- | --- |
| Equipamento | “O acesso pode ser feito por um dispositivo capaz de executar um navegador compatível com a aplicação.” | “Qualquer aparelho acessa a plataforma sem limitações.” |
| Configuração mínima | “Não foi identificada uma configuração mínima específica para processador, memória ou armazenamento.” | “O usuário precisa de determinada quantidade de memória ou de um modelo específico de aparelho.” |
| Navegador | “O navegador precisa executar os recursos usados pela interface e manter a sessão do usuário.” | “A plataforma funciona em todas as versões de todos os navegadores.” |
| Conta | “O acesso à caixa de e-mail é necessário para verificar o cadastro e recuperar a conta.” | “O e-mail é obrigatório para consultar campanhas públicas.” |
| Arquivos | “O envio opcional depende dos formatos e limites aceitos pela interface.” | “O usuário precisa possuir câmera, scanner ou impressora.” |
| Campanha virtual | “O doador usa um serviço financeiro externo para transferir o valor diretamente ao organizador.” | “A Nossa Causa exige ou oferece um aplicativo de pagamento integrado.” |
| Campanha física | “A entrega ocorre no ponto de coleta informado na campanha.” | “A plataforma fornece ou controla equipamento e transporte para a entrega.” |
| Compatibilidade | “Os requisitos descrevem as condições observadas no recorte do MVP.” | “A aplicação possui compatibilidade certificada com todos os dispositivos e recursos de acessibilidade.” |

## Verificações previstas

Antes da redação final, deverão ser realizadas as seguintes conferências:

1. retomar o recorte funcional usado nas Fases 3 e 4;
2. confirmar que a consulta pública não depende de conta ou e-mail;
3. conferir os recursos do navegador necessários à autenticação e à manutenção da sessão;
4. revisar os formatos, quantidades e tamanhos exibidos nas ações de envio de arquivos;
5. verificar a apresentação das páginas em larguras representativas de celular e computador, sem converter esses valores em resolução mínima;
6. distinguir em cada requisito o público ao qual ele se aplica;
7. retirar detalhes de infraestrutura e desenvolvimento que não pertencem ao usuário final;
8. conferir que a contribuição virtual continua descrita como transferência externa;
9. redigir o tópico 5.1 e aplicar a skill `humanizar` em modo de criação, com perfil acadêmico;
10. revisar o texto em busca de caminhos internos, promessas universais e requisitos sem evidência.

## Dependências e integração

- **Fase 3:** manter os mesmos atores, operações e limites do MVP analisado.
- **Fase 4:** conservar a distinção entre visitante, usuário autenticado e organizador e o acesso por navegador apresentado no projeto lógico.
- **Fase 6:** as telas selecionadas deverão ser compatíveis com as ações e condições de uso descritas nesta fase.
- **Fase 7:** requisitos de implantação, servidor, segurança, backup e treinamento não serão antecipados como requisitos do usuário final.
- **Fase 8:** propostas futuras de manutenção ou ampliação de compatibilidade não serão apresentadas como características atuais.
- **Integração final:** conferir a numeração do quadro e eliminar nomes de arquivos ou detalhes técnicos usados apenas como rastreabilidade.

## Riscos e controles

| Risco | Controle previsto |
| --- | --- |
| Confundir projeto físico com infraestrutura de hospedagem | Restringir a fase aos recursos necessários no lado do usuário, conforme D-003. |
| Inventar uma configuração mínima tradicional | Descrever capacidades necessárias e omitir números que não tenham validação. |
| Tratar recurso opcional como requisito geral | Informar o ator e a ação associados a cada item. |
| Apresentar o aplicativo bancário como parte da plataforma | Identificá-lo como serviço externo usado somente para a transferência direta. |
| Exigir periféricos desnecessários | Explicar que arquivos existentes no dispositivo podem ser selecionados, sem impor câmera, scanner ou impressora. |
| Prometer compatibilidade universal | Limitar as afirmações à versão examinada e registrar o que ainda precisa de validação. |
| Repetir a análise funcional da Fase 3 | Mencionar funcionalidades somente para justificar uma condição de uso. |
| Levar caminhos internos ao texto final | Manter as fontes técnicas apenas neste planejamento. |

## Dúvidas e pendências

Não há dúvida que impeça a redação. O projeto não mantém uma matriz validada de versões mínimas de navegador, sistemas operacionais ou configurações de hardware. Em cumprimento à orientação de não criar mínimos arbitrários, o texto usará requisitos baseados em capacidades e não apresentará números sem comprovação.

Se a instituição exigir uma tabela com marcas, versões ou configurações mínimas, esse formato dependerá de validação específica e deverá ser alinhado com o usuário antes da redação definitiva. A ausência dessa solicitação não impede o desenvolvimento do texto previsto neste planejamento.

## Critérios de aceite do planejamento

- [x] O recorte da Fase 5 foi limitado aos requisitos do usuário final.
- [x] Infraestrutura de hospedagem e ferramentas de desenvolvimento ficaram fora da seção.
- [x] Os requisitos foram organizados por ação e tipo de usuário.
- [x] Necessidades gerais, condições opcionais e recursos externos foram distinguidos.
- [x] Não foram inventados mínimos de hardware, sistema operacional, navegador, resolução ou velocidade de conexão.
- [x] As restrições de arquivos foram registradas para nova conferência antes da redação.
- [x] A transferência financeira permaneceu fora da plataforma.
- [x] As dependências com as Fases 3, 4, 6, 7 e 8 foram identificadas.
- [x] As fontes internas e seus limites de uso foram registrados.
- [x] Os riscos, as verificações e a condição que exigiria novo esclarecimento foram definidos.

## Registro da execução e revisão

Em 2026-09-06, foram conferidos os fluxos de consulta pública, autenticação, manutenção de sessão e envio de arquivos do MVP. A redação restringiu os requisitos às capacidades percebidas pelo usuário final e não atribuiu à plataforma recursos de hospedagem, processamento de pagamentos ou logística de doações.

O texto final foi produzido com a skill `humanizar`, em modo de criação e perfil acadêmico. A revisão manteve as diferenças entre consulta pública, uso autenticado, gestão pelo organizador e transferência financeira externa. Também separou os requisitos do navegador usados na consulta pública daqueles necessários à sessão autenticada e qualificou o uso de e-mail para o cadastro por senha. Foram retiradas especificações de aparelho, navegador, conexão e periféricos que não possuem validação como requisitos mínimos.

Em 2026-09-07, D-025 orientou uma revisão de enquadramento do parágrafo final. Os requisitos permanecem vinculados ao escopo técnico verificado, mas o MVP é apresentado pelas capacidades de acesso digital que viabilizam seus fluxos, com a logística e as transferências diretas distribuídas entre os responsáveis apropriados.

## Critérios para concluir a redação

- [x] O texto final mantém o tópico 5.1 e explica a interpretação adotada para o projeto físico.
- [x] O quadro de requisitos possui título, fonte, menção no texto e numeração preparada para integração.
- [x] Cada requisito informa a quem e a qual ação se aplica.
- [x] O texto diferencia requisitos indispensáveis, condições opcionais e atividades externas.
- [x] Nenhuma configuração mínima sem evidência foi acrescentada.
- [x] O conteúdo foi conferido com a versão do MVP adotada pelas fases anteriores.
- [x] A redação usa português brasileiro, registro acadêmico claro e a skill `humanizar`.
- [x] O texto final não cita arquivos do repositório nem expõe detalhes internos sem utilidade para o usuário.
