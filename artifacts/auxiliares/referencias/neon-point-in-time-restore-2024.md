# Cópia parcial de consulta — Neon Point-in-Time Restore

- **Fonte:** NEON. *Announcing Point-in-Time Restore*.
- **Publicação:** 20 fev. 2024.
- **Endereço:** <https://neon.com/blog/announcing-point-in-time-restore>
- **Consulta:** 7 set. 2026.
- **Escopo consultado:** seções “Restore a Branch from History” e “Neon’s Point-in-Time Restore vs. Roll-your-own Restore”.

## Trecho preservado da fonte

> “The downside of pg_dump is that it doesn’t support incremental or point-in-time restore […]”

Localizador: seção “Neon’s Point-in-Time Restore vs. Roll-your-own Restore”.

## Síntese de uso

O recurso descrito permite restaurar uma ramificação para um ponto situado dentro do histórico retido pelo projeto. Uma cópia lógica isolada representa o estado do banco no momento da exportação e não preserva as alterações realizadas posteriormente.

## Limitação

Este arquivo preserva uma cópia parcial do trecho relevante à Fase 7 e separa esse conteúdo da síntese de uso. A disponibilidade e a janela efetiva de recuperação dependem da configuração e das condições oferecidas ao projeto na plataforma.
