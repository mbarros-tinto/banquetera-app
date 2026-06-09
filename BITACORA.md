# Bitácora de trabajo — banquetera-app

> Repo trabajado por 2 personas (Manuel + Sofía). Antes de tocar código, **lee la última entrada**
> y seguí la sección "Coordinación 2 devs" del CLAUDE.md. Después de cada push/deploy, **agregá una
> entrada arriba** (más reciente primero).

## Reglas de oro (resumen — detalle en CLAUDE.md)
1. Nunca trabajes en la rama de deploy (`main`). Rama por feature; merge vía PR.
2. Pull antes de empezar (`git pull --ff-only`). (Modelo B: el deploy sale de git, no hay destino que bajar.)
3. Un solo dev mergea/publica a `main` a la vez y lo anota acá. Cloudflare reusa el mismo proyecto de Pages.
4. Probar con `?test=1` / local; nunca ensuciar datos reales del CRM.
5. Solo cambios acotados a `index.html` / `nuevocliente.html`; quirúrgicos y anunciados.
6. Respetar el contrato con el backend (`BACKEND_URL` + shape de campos). Ver CLAUDE.md.

## Formato de cada entrada
## AAAA-MM-DD — <Dev> — <rama>
- Qué toqué: <archivos / funciones>
- Deploy: <commit / "publicado en Pages"> o "sin deploy"
- Notas / pendientes / avisos para el otro dev

---

## 2026-06-09 — Manuel (con Claude) — main
- Montada la metodología de coordinación 2 devs (hook + bitácora + sección CLAUDE.md).
- Creada la rama base para Sofía: `feature/sofia-crm`.
- Deploy: sin deploy funcional (solo infra de repo).
