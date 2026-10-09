# MakeFlow Studio — Estudio de IA de código abierto

> Genera imágenes y videos con 38 modelos desde una sola barra de prompt.
> Sin suscripción al estudio: usas tu propia llave de la plataforma y pagas
> solo lo que generas.

Basado en [open-higgsfield](https://github.com/wide-trace/open-higgsfield).
Las generaciones corren sobre la API de Higgsfield con la llave de cada
usuario.

Next.js 16 App Router · React 19 · CSS plano · Zustand · pnpm

---

## Qué hace

- **Una sola barra para imagen y video.** El modelo que elijas decide si sale
  imagen o video. `Ctrl/⌘ + Enter` genera.
- **38 modelos** — 8 de imagen y 30 de video: Soul, Seedance 2.5 y 2.0, Kling,
  Wan, Flux, Ideogram, Recraft, LTX, MiniMax, PixVerse, Grok, Qwen y más, con
  buscador.
- **Ajustes propios de cada modelo.** Proporción, resolución, duración,
  formato, audio y cantidad: cada modelo declara lo que acepta y el estudio
  muestra exactamente eso.
- **Archivos de entrada.** Cuadro inicial, cuadro final, referencias, video y
  audio, según lo que admita el modelo.
- **Galería.** Imagen, Video, Recursos y Favoritos. Cada generación se puede
  reusar, descargar, marcar como favorita o eliminar (con deshacer).
- **Tu llave, en tu navegador.** Se escribe en una ventana del estudio y se
  guarda en una cookie httpOnly. El historial vive en este navegador.

---

## Cómo arrancarlo

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

Abre el estudio, presiona **Agregar llave** y pega tu llave con el formato
`id:secret`.

### Variables de entorno

Van en `.env.local` (git lo ignora):

```bash
HF_API_BASE_URL=https://platform.higgsfield.ai   # origen de la API, solo servidor
OPEN_HIGGSFIELD_READ_WRITE_TOKEN=                # token de lectura/escritura de Vercel Blob
```

El token de Vercel Blob solo hace falta para subir archivos de entrada
(imágenes de referencia, cuadros, audio). Generar desde texto funciona sin él.

### Comandos

| Comando | Qué hace |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo en el puerto 3000 |
| `pnpm build` | Compilación de producción |
| `pnpm start` | Sirve la compilación de producción |
| `pnpm brand` | Regenera los íconos y la tarjeta para redes en `public/` |

---

## Estructura

```
src/
  app/             la única página (el estudio) y /api/blob para las subidas
  generation/      peticiones, server actions, mapeo a la API, catálogo, stores
  openhiggsfield/  la interfaz: barra de prompt, galería, visor, selector de
                   modelos, ajustes y selector de archivos
```

Cada generación es un objeto `{ model, prompt, media, settings }`. La interfaz
lo arma y lo entrega a una server action; el navegador nunca habla directo con
la API. Enviar es `POST /{model}` y el estado es
`GET /requests/{id}/status`, con `Authorization: Key <id:secret>`.

Para agregar un modelo basta con declararlo en `src/generation/catalog/`:
aparece en el selector con sus propios ajustes, sin tocar la interfaz.
