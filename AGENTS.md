# Instrucciones para IAs (y personas) que trabajen en este repo

Este proyecto lo puede tocar cualquier IA o persona, en cualquier máquina, no solo la sesión
donde se creó. Para no perder contexto entre una sesión y otra:

1. **Antes de tocar código**, lee [CHANGELOG.md](CHANGELOG.md) completo para saber qué se ha
   hecho, qué decisiones ya se tomaron y por qué, y qué está pendiente.
2. **Al terminar tu sesión de trabajo**, agrega una entrada nueva arriba en `CHANGELOG.md` con:
   fecha, qué hiciste, por qué, y qué quedó pendiente. No hace falta ser extenso — lo importante
   es que la siguiente IA/persona pueda retomar sin tener que releer todo el código.

## Nota sobre "memoria" de herramientas de IA

Algunas herramientas de IA (ej. Claude Code) tienen un sistema de memoria propio que guardan
**localmente en la máquina de cada usuario**, fuera de este repositorio. Esa memoria NO viaja
con el repo: si alguien lo clona en otra máquina, o usa otra herramienta, no la va a ver.

Por eso se decidió a propósito que el historial y el contexto de este proyecto vivan **dentro
del repo**, en este archivo y en `CHANGELOG.md` — para que sean accesibles a cualquier IA o
persona que clone el proyecto, sin depender de la memoria local de ninguna herramienta en
particular. No asumas que existe contexto fuera de estos archivos y el propio código.
