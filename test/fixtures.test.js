/**
 * Guarda de privacidade: todo XML de teste precisa se declarar fictício.
 * Nunca use nota real de cliente aqui — nem "anonimizada à mão".
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const FIXTURES = path.join(__dirname, 'fixtures');

test('todas as notas de teste são declaradas fictícias', () => {
  for (const nome of fs.readdirSync(FIXTURES)) {
    const conteudo = fs.readFileSync(path.join(FIXTURES, nome), 'utf8');
    assert.match(conteudo, /NOTA FICTÍCIA para testes/, `${nome} não traz o aviso de nota fictícia`);
    assert.doesNotMatch(conteudo, /<Signature/, `${nome} tem assinatura digital — parece uma nota real`);
  }
});
