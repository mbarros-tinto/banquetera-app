# Contexto para Claude — banquetera-app

Frontend estático (Cloudflare Pages) del CRM de Tinto (STEVE SpA).
Dominio: **https://links.tintobanqueteria.cl**

## Archivos
- `index.html` — portal con accesos a webapps internas.
- `nuevocliente.html` — formulario de captura de leads
  (https://links.tintobanqueteria.cl/nuevocliente). Hace POST a `BACKEND_URL`.

## Deploy
- Es estático: **NO hay build**. `git push` a `main` → Cloudflare Pages publica en ~1-2 min.
- Cloudflare observa **este** repo (`mbarros-tinto/banquetera-app`, el fork de Manuel). Es el
  origin de trabajo (no la org). Pushear acá para que se publique.

## Backend
El formulario lo procesa el repo **`nuevocliente-backend`** (Apps Script). La URL del backend
está en `nuevocliente.html` como `BACKEND_URL`; si el backend cambia de deployment hay que
actualizarla acá. Arquitectura, IDs y workflow del backend → CLAUDE.md de ese repo.

## Colaboración (Manuel + Sofía) — NO pisarse
- ANTES de tocar: `git fetch && git pull` + leer `WORKLOG.md` (el hook SessionStart avisa si
  estás atrasado/adelantado/con cambios sin commitear).
- DESPUÉS de cada cambio: anotar en `WORKLOG.md` + `git commit` + `git push` enseguida.
- Cada push a `main` **publica a producción** → coordinar/avisar antes de cambios visibles.
