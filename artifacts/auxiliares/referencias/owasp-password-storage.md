# Cópia parcial de consulta — OWASP Password Storage Cheat Sheet

- **Fonte:** OPEN WEB APPLICATION SECURITY PROJECT (OWASP). *Password Storage Cheat Sheet*.
- **Endereço:** <https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html>
- **Consulta:** 7 set. 2026.
- **Escopo consultado:** seções “Hashing vs Encryption” e “Password Hashing Algorithms”.

## Trecho preservado da fonte

> “Because hashing is a one-way function […] it is the most appropriate approach for password validation.”

Localizador: seção “Hashing vs Encryption”.

## Síntese de uso

A orientação distingue o hash, operação unidirecional indicada para senhas, da criptografia reversível. Também apresenta o `scrypt` entre as alternativas aplicáveis quando o Argon2id não está disponível.

## Limitação

Este arquivo preserva uma cópia parcial do trecho relevante à Fase 7 e separa esse conteúdo da síntese de uso. Ele não substitui a publicação original nem preserva seu conteúdo integral.
