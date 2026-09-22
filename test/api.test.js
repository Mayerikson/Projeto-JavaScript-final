import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import app from '../src/server.js';
import { randomUUID } from 'node:crypto';

const base = 'http://localhost:3456';
let server;
test.before(async () => { await fs.rm('data', { recursive: true, force: true }); server = app.listen(3456); });
test.after(() => server.close());

async function request(path, options = {}) { return fetch(`${base}${path}`, { headers: { 'content-type': 'application/json' }, ...options }); }

test('health check retorna status ok', async () => { const response = await request('/health'); assert.equal(response.status, 200); assert.equal((await response.json()).status, 'ok'); });

test('cria usuário e impede e-mail duplicado', async () => {
  const body = JSON.stringify({ name: 'Maria Silva', email: `maria-${randomUUID()}@email.com` });
  const first = await request('/users', { method: 'POST', body });
  assert.equal(first.status, 201);
  const duplicate = await request('/users', { method: 'POST', body });
  assert.equal(duplicate.status, 409);
});

test('lista curso inicial e valida busca inexistente', async () => { const response = await request('/courses?search=curso-inexistente'); assert.equal(response.status, 200); assert.deepEqual(await response.json(), []); });

test('retorna 404 para rota desconhecida', async () => { const response = await request('/nao-existe'); assert.equal(response.status, 404); });
