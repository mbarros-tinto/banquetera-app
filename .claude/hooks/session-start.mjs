#!/usr/bin/env node
/**
 * Hook SessionStart — sync de coordinación entre 2 devs.
 * Corre `git fetch` al iniciar la sesión y avisa si el otro dev avanzó,
 * si tenés commits sin pushear, o cambios de coordinación sin commitear.
 * Solo avisa — nunca modifica el repo. Si todo está sincronizado, calla.
 */
import { execSync } from 'node:child_process';

const PROJECT = 'banquetera-app'; // <-- ÚNICO valor a adaptar por proyecto

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const git = (cmd) =>
  execSync(`git ${cmd}`, { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();

let msg = '';
try {
  git('rev-parse --is-inside-work-tree');
  try { git('fetch --quiet'); } catch {}
  const branch = git('rev-parse --abbrev-ref HEAD');

  let ahead = '0', behind = '0';
  try { [ahead, behind] = git(`rev-list --left-right --count HEAD...origin/${branch}`).split(/\s+/); } catch {}

  let dirty = '';
  try { dirty = git('status --porcelain -- CLAUDE.md .claude BITACORA.md'); } catch {}

  const parts = [];
  if (Number(behind) > 0) {
    let who = '';
    try { who = [...new Set(git(`log --format=%an HEAD..origin/${branch}`).split('\n').filter(Boolean))].join(', '); } catch {}
    parts.push(`⬇️ origin/${branch} tiene ${behind} commit(s)${who ? ' de ' + who : ''} sin bajar. ` +
      `Corre \`git pull --ff-only\` (y bajá el destino de deploy si tu deploy sobrescribe prod) ANTES de editar o deployar.`);
  }
  if (Number(ahead) > 0) parts.push(`⬆️ ${ahead} commit(s) local(es) sin pushear — \`git push\` para que el otro dev los reciba.`);
  if (dirty) parts.push(`📝 Cambios sin commitear en coordinación (CLAUDE.md / .claude / BITACORA.md):\n${dirty}`);

  if (parts.length) {
    msg = `Sync de coordinación — ${PROJECT} (rama ${branch}):\n` + parts.join('\n') +
      `\n⚠️ Trabaja en tu rama (no en la de deploy) y no deployes prod en paralelo con el otro dev. ` +
      `(Aviso automático del hook SessionStart — ver sección "Coordinación 2 devs" del CLAUDE.md.)`;
  }
} catch {}

if (msg) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: msg },
  }));
}
