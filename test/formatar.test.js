const test = require('node:test');
const assert = require('node:assert/strict');
const f = require('../src/formatar');

test('máscaras de documento, CEP e telefone', () => {
  assert.equal(f.cnpj('11222333000181'), '11.222.333/0001-81');
  assert.equal(f.cpf('12345678909'), '123.456.789-09');
  assert.equal(f.cep('01001000'), '01.001-000');
  assert.equal(f.telefone('1133334444'), '(11) 3333-4444');
  assert.equal(f.telefone('19988887777'), '(19) 98888-7777');
  assert.equal(f.telefone('+351210000000'), '+351210000000');
});

test('valores, percentuais e traço para o que não veio no XML (nota 12)', () => {
  assert.equal(f.reais('1234.5'), 'R$ 1.234,50');
  assert.equal(f.reais('0.00'), 'R$ 0,00');
  assert.equal(f.reais(null), '-');
  assert.equal(f.percentual('2.01'), '2,01%');
  assert.equal(f.ou(''), '-');
});

test('datas mantêm a hora local do XML (sem converter fuso)', () => {
  assert.equal(f.data('2026-09-09'), '09/09/2026');
  assert.equal(f.dataHora('2026-09-09T14:46:31-03:00'), '09/09/2026 14:46:31');
  assert.equal(f.dataHora('2026-09-09T23:30:00Z'), '09/09/2026 23:30:00');
});

test('códigos de tributação, NBS e IBGE', () => {
  assert.equal(f.codTribNac('171901'), '17.19.01');
  assert.equal(f.ibge('3550308'), '35.50308');
  assert.equal(f.nbs('113022100'), '1.1302.21.00');
});

test('descrição por tabela e junção', () => {
  assert.equal(f.descricao({ 1: 'Um' }, '1'), 'Um');
  assert.equal(f.descricao({ 1: 'Um' }, '7'), '7');
  assert.equal(f.descricao({ 1: 'Um' }, null), '-');
  assert.equal(f.juntar(['A', null, '', 'B']), 'A / B');
  assert.equal(f.juntar([null]), '-');
  assert.equal(f.compor(['17.19.01', null]), '17.19.01 / -');
  assert.equal(f.limitar('Optante - Microempresa ou Empresa de Pequeno Porte (ME/EPP)', 37), 'Optante - Microempresa ou Empresa de ...');
  assert.equal(f.limitar('curto', 37), 'curto');
  assert.equal(f.limitar('-', 1), '-');
});
