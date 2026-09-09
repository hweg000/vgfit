# Changelog

Historial de qué se hizo en el proyecto y por qué. Ver [AGENTS.md](AGENTS.md) para las reglas de
cómo mantener este archivo.

## 2026-09-09 (segunda sesión) — Probado en vivo

- Se montó y corrió el proyecto por primera vez en una máquina real (XAMPP en Windows):
  bot creado en @BotFather (`@fitVG_bot`, privacidad en Disable), grupo de Telegram "VG DIET"
  (`GROUP_CHAT_ID` negativo), base `tel_dieta` creada con `server/schema.sql` sobre MariaDB 10.4
  de XAMPP (root sin contraseña), `server/.env` y `web/.env` llenados.
- Flujo completo verificado end-to-end: al mandar una foto con caption al grupo, el bot la
  descarga a `../uploads`, crea el usuario y registra la comida en `meals`; el feed de la Mini App
  (`http://localhost:5173`, backend en `:3001`) la muestra y la votación "sana"/"no sana" se
  guarda en `votes` usando el bypass `ALLOW_DEV_AUTH=true`.
- Nota Telegraf v4: la promesa de `bot.launch()` no resuelve hasta que el bot se detiene, por eso
  el log "Bot de Telegram corriendo (polling)" nunca aparece aunque el bot sí esté activo.
- Pendiente: probarlo como Mini App real dentro de Telegram (exponer `web/` con HTTPS vía ngrok y
  registrar la URL como Menu Button en BotFather).

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
