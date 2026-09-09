# Changelog

Historial de qué se hizo en el proyecto y por qué. Ver [AGENTS.md](AGENTS.md) para las reglas de
cómo mantener este archivo.

## 2026-09-09

- Se creó el proyecto desde cero: bot de Telegram (Telegraf, modo polling) + API Express + MySQL
  en `server/`, Mini App en React (Vite) en `web/`.
- Funcionalidad implementada: captura de fotos+caption desde el grupo de Telegram, feed
  compartido con filtros por usuario/fecha, votación grupal "sana"/"no sana", rachas de días
  consecutivos, % de comidas sanas por semana, y recordatorio diario a quien no haya subido nada.
- Decisiones de arquitectura (detalle y motivos en el readme, sección "Decisiones y por qué"):
  Telegram Mini App en vez de PWA propia, bot+API en un solo proceso Node, polling en vez de
  webhook, MySQL local vía XAMPP, auth con `initData` de Telegram + bypass de desarrollo.
- Código verificado (build de `web` sin errores, sintaxis de `server` verificada con
  `node --check`), pero **todavía no se ha corrido en vivo** — falta que el dueño del proyecto
  cree el bot en @BotFather, prenda MySQL en XAMPP, llene los `.env` y pruebe el flujo real.
- Se inicializó el repo en git y se subió a `github.com/hweg000/vgfit` (rama `main`).
- Se agregaron este `CHANGELOG.md` y `AGENTS.md` para que el historial y las instrucciones de
  continuidad vivan dentro del repo, accesibles a cualquier IA o persona que lo clone — no solo
  a través de la memoria local de la herramienta de IA usada para construirlo.
