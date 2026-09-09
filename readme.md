# Comidas del grupo

App para llevar el registro de lo que come el grupo en la dieta: se sube foto + texto corto
directo a un grupo de Telegram, y una Mini App muestra el feed compartido para ver quién comió
qué y votar en grupo si algo fue "sano" o no.

## Arquitectura

- `server/` — Node.js + Express + Telegraf (bot y API en un solo proceso) + MySQL.
- `web/` — React (Vite), la Mini App que se abre dentro de Telegram (o en el navegador para
  pruebas locales).

Ver el detalle completo en el plan de diseño original si hace falta contexto.

## 1. Crear el bot en Telegram

### Conseguir el `BOT_TOKEN`

1. En Telegram, busca el usuario `@BotFather` (tiene palomita azul de verificado) y ábrele chat.
2. Escríbele `/newbot`.
3. Te pide un **nombre** para el bot (puede tener espacios, ej. "Dieta Amigos").
4. Te pide un **username** único que termine en `bot` (ej. `dieta_amigos_bot`) — si ya existe,
   te pide que pruebes otro.
5. Te responde con un mensaje que incluye una línea como:
   ```
   Use this token to access the HTTP API:
   7123456789:AAExampleTokenNoEsReal1234567890
   ```
   Esa línea larga es tu `BOT_TOKEN`. Cópiala completa.
6. Muy importante: mándale también `/setprivacy`, selecciona tu bot, y pon **Disable**. Por
   defecto los bots no reciben mensajes normales del grupo (solo comandos); hay que desactivar
   esto para que el bot vea las fotos con caption que suban tus amigos.

### Conseguir el `GROUP_CHAT_ID`

1. Crea (o usa) el grupo de Telegram con tus amigos, y agrega el bot como miembro (se busca por
   su username y se agrega como a cualquier persona).
2. Manda cualquier mensaje al grupo (ej. "hola").
3. En el navegador, abre esta URL reemplazando `<TOKEN>` por tu `BOT_TOKEN`:
   ```
   https://api.telegram.org/bot<TOKEN>/getUpdates
   ```
4. En el JSON que devuelve, busca `"chat":{"id":-1001234567890,"title":"..."` — ese número
   (normalmente negativo si es un grupo) es tu `GROUP_CHAT_ID`.
5. Si la URL devuelve vacío (`{"ok":true,"result":[]}`), manda otro mensaje al grupo y recarga
   la página.

## 2. Base de datos (MySQL vía XAMPP)

1. Enciende el módulo MySQL desde el panel de XAMPP.
2. Corre el script de creación de tablas:
   ```
   mysql -u root -p < server/schema.sql
   ```
   (ajusta usuario/contraseña según tu instalación de XAMPP)

## 3. Backend

```
cd server
cp .env.example .env
# edita .env: BOT_TOKEN, GROUP_CHAT_ID, credenciales de MySQL
npm install
npm run dev
```

Esto levanta la API en `http://localhost:3001` y el bot en modo polling (no necesita URL pública).

## 4. Frontend

```
cd web
cp .env.example .env
npm install
npm run dev
```

Abre `http://localhost:5173` en el navegador para probar el feed y las stats con el bypass de
desarrollo (`ALLOW_DEV_AUTH=true` en el backend). Para probarlo como Mini App real dentro de
Telegram vas a necesitar exponer `web` con una URL HTTPS pública (ej. ngrok) y registrarla como
Menu Button del bot en BotFather — eso es un paso posterior, no hace falta para probar todo el
flujo en local primero.

## Funcionalidad incluida

- Captura automática de fotos + texto desde el grupo de Telegram.
- Feed compartido de todas las comidas, con filtros por persona y fecha (`/api/meals?user_id=&from=&to=`).
- Votación grupal "sana" / "no sana" por comida.
- Rachas de días consecutivos subiendo comida (`/api/stats/streaks`).
- % de comidas "sana" por persona en la semana (`/api/stats/weekly`).
- Recordatorio automático al grupo si alguien no subió nada en el día.
