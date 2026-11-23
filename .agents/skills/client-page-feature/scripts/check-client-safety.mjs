#!/usr/bin/env node
// Static safety checks for the ARTMO client. Run from the repository root.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok, detail });
const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : '');
const walk = (dir) =>
  existsSync(dir)
    ? readdirSync(dir).flatMap((f) => {
        const p = join(dir, f);
        return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(p) ? [p] : [];
      })
    : [];

const files = walk('src');
check('src has TypeScript files', files.length > 0);
const find = (re) => files.filter((p) => re.test(read(p)));

check('no dangerouslySetInnerHTML', find(/dangerouslySetInnerHTML/).length === 0, find(/dangerouslySetInnerHTML/).join(', '));
check('no server secrets referenced', find(/GEMINI_API_KEY|SUPABASE_SECRET_KEY|SERVICE_ROLE|NAVER_CLIENT_SECRET/).length === 0);
check('no direct Gemini SDK in client', find(/@google\/genai|generativelanguage\.googleapis/).length === 0);
check('no withCredentials: true', find(/withCredentials:\s*true/).length === 0);
check('VITE_API_BASE_URL used without /api suffix', !/VITE_API_BASE_URL=.*\/api\/?\s*$/m.test(read('.env.example')));
check('mood sentence not stored in localStorage', find(/localStorage\.setItem\([^)]*(sentence|input|mood)/i).length === 0);

const app = read('src/App.tsx');
const callbackIdx = app.indexOf('/auth/callback');
const routerIdx = app.indexOf('<HashRouter');
check('/auth/callback handled before HashRouter', callbackIdx > -1 && routerIdx > -1 && callbackIdx < routerIdx);
check('vercel.json rewrites all paths', /"source":\s*"\/\(\.\*\)"/.test(read('vercel.json')));

const imgs = files.flatMap((p) => (read(p).match(/<img\b[^>]*>/g) ?? []).map((tag) => `${p}: ${tag}`));
const noAlt = imgs.filter((t) => !/\balt=/.test(t));
check('every <img> has alt', noAlt.length === 0, noAlt.join('\n      '));

let failed = 0;
for (const r of results) {
  if (!r.ok) failed += 1;
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.ok || !r.detail ? '' : `\n      ${r.detail}`}`);
}
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
