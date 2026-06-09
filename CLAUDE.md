# Contexto para Claude — banquetera-app

Frontend estático (Cloudflare Pages) del CRM de Tinto (STEVE SpA).
Dominio: **https://links.tintobanqueteria.cl**

## ⚠️ Coordinación 2 devs (Manuel + Sofía) — LEER ANTES DE TOCAR NADA

Este repo lo trabajan dos personas: Manuel y Sofía. Ambos editan los mismos archivos y publican al
mismo sitio en producción. Sin disciplina, dos merges/deploys en paralelo se pisan. Las reglas de
abajo evitan pisarnos.

**Modelo de deploy = B (CI/CD desde git):** Cloudflare Pages publica automáticamente cada push a
`main`. Riesgo principal: merges/deploys en paralelo → **merge serializado** a `main`.

**Las 7 reglas (no son opcionales):**
1. **Nunca trabajes en la rama de deploy (`main`).** Cada dev en su rama `feature/...`. Merge vía PR.
2. **Pull antes de editar:** `git pull --ff-only`. (Modelo B: el deploy sale de git, no hay "destino"
   que bajar aparte; basta el pull. El hook `.claude/SessionStart` avisa del desync.)
3. **Un solo dev mergea/publica a `main` a la vez,** anunciado y anotado en `BITACORA.md`. Cloudflare
   reusa el MISMO proyecto de Pages (no crear otro); no mergear dos cosas a `main` en paralelo.
4. **Probá antes de mergear.** El form escribe al CRM de producción: usá `?test=1` (marca `[TEST]`,
   sin CC) para no ensuciar datos reales. (Ver "Entorno de pruebas" abajo — hoy no hay staging real.)
5. **Minimizá la superficie de diff.** Los toques a los archivos compartidos (`index.html`,
   `nuevocliente.html`) deben ser quirúrgicos y anotados en la bitácora.
6. **Respetá el contrato con el backend:** el form hace POST a `BACKEND_URL` (deployment `AKfycbzs…`
   del repo `nuevocliente-backend`) con el shape de campos que el backend valida (`nombre`, `email`,
   `telefono`, `comercial`, `variante`, …). No cambiar el contrato sin coordinar ambos repos.
7. **Credenciales propias por dev** (cuenta gh + token propio). No compartir ni embeber el token del otro.

**Bitácora:** `BITACORA.md` — leer la última entrada antes de trabajar; agregar una después de cada push/merge.

---

## Archivos
- `index.html` — portal con accesos a webapps internas.
- `nuevocliente.html` — formulario de captura de leads (https://links.tintobanqueteria.cl/nuevocliente).
  Hace POST a `BACKEND_URL`.

## Deploy
- Estático: **NO hay build**. `git push`/merge a `main` → Cloudflare Pages publica en ~1-2 min.
- Cloudflare observa este repo (`mbarros-tinto/banquetera-app`, el fork de Manuel). Es el origin de trabajo.

## Backend
El form lo procesa el repo **`nuevocliente-backend`** (Apps Script). La URL está en `nuevocliente.html`
como `BACKEND_URL`; si el backend cambia de deployment, actualizarla acá. Arquitectura/IDs/workflow del
backend → CLAUDE.md de ese repo.

## Entorno de pruebas (limitación conocida)
No hay staging separado. `?test=1` marca el lead como `[TEST]` y omite el CC, pero **igual escribe una
fila al CRM real** ("Por Cerrar"). Para cambios de UI, abrí el HTML local o `wrangler pages dev`.
Mejora futura: una hoja/deployment de test para no escribir `[TEST]` en producción.
