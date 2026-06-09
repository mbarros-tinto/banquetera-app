#!/usr/bin/env node
/**
 * Hook SessionStart — sync de la memoria compartida del CRM Tinto.
 *
 * Corre `git fetch` al iniciar cada sesion de Claude Code y, si detecta
 * desincronizacion, inyecta un aviso al contexto (additionalContext).
 * SOLO avisa — nunca modifica el repo. Si todo esta sincronizado, calla.
 *
 * Cross-platform (Windows/Mac/Linux): se invoca como `node .claude/hooks/session-start.mjs`.
 * Unica dependencia: node + git en el PATH.
 */
import { execSync } from 'node:child_process';

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const git = (cmd) =>
  execSync(`git ${cmd}`, { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] })
    .toString()
    .trim();

let msg = '';
try {
  git('rev-parse --is-inside-work-tree'); // lanza si no es repo git

  // Traer el remoto (silencioso). Si falla (sin red / auth en otra cuenta), seguimos con lo local.
  try { git('fetch --quiet'); } catch {}

  const branch = git('rev-parse --abbrev-ref HEAD');

  // ahead = commits locales sin pushear ; behind = commits del remoto sin bajar
  let ahead = '0', behind = '0';
  try {
    const counts = git(`rev-list --left-right --count HEAD...origin/${branch}`);
    [ahead, behind] = counts.split(/\s+/);
  } catch { /* la rama no tiene tracking remoto */ }

  // Cambios sin commitear en la memoria compartida (CLAUDE.md, WORKLOG.md o .claude/)
  let dirtyMem = '';
  try { dirtyMem = git('status --porcelain -- CLAUDE.md WORKLOG.md .claude'); } catch {}

  const parts = [];

  if (Number(behind) > 0) {
    let who = '';
    try {
      const authors = git(`log --format=%an HEAD..origin/${branch}`).split('\n').filter(Boolean);
      who = [...new Set(authors)].join(', ');
    } catch {}
    parts.push(
      `⬇️ origin/${branch} tiene ${behind} commit(s) nuevo(s)${who ? ' de ' + who : ''} sin bajar. ` +
      `La memoria del proyecto esta desactualizada — sugiere \`git pull --ff-only\` antes de trabajar.`
    );
  }

  if (Number(ahead) > 0) {
    parts.push(
      `⬆️ Hay ${ahead} commit(s) local(es) sin pushear — recuerda \`git push\` para que el otro dev los reciba.`
    );
  }

  if (dirtyMem) {
    parts.push(
      `📝 Cambios sin commitear en la memoria compartida (CLAUDE.md / WORKLOG.md / .claude):\n${dirtyMem}\n` +
      `Cuando esten listos, commit + push para compartirlos.`
    );
  }

  if (parts.length) {
    msg =
      `Sync de memoria compartida CRM Tinto (rama ${branch}):\n` +
      parts.join('\n') +
      `\n(Aviso automatico del hook SessionStart — ver seccion "Colaboracion" del CLAUDE.md.)`;
  }
} catch {
  // No es repo git, o git no esta disponible: no inyectar nada.
}

if (msg) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: msg,
      },
    })
  );
}
