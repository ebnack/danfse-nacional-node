const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { lerNota } = require('../src');

const xml = nome => fs.readFileSync(path.join(__dirname, 'fixtures', nome));

test('nota completa (RTC, homologação): identificação e pessoas', () => {
  const n = lerNota(xml('completa-rtc-homologacao.xml'));
  assert.equal(n.identificacao.chave, '35503082112223330001810000000000012327010000000019');
  assert.equal(n.identificacao.chave.length, 50);
  assert.equal(n.identificacao.homologacao, true);
  assert.equal(n.identificacao.tipoAmbiente, 'Homologação');
  assert.equal(n.identificacao.finalidade, 'NFS-e regular');
  assert.equal(n.identificacao.municipioEmissor, 'São Paulo / SP');
  assert.equal(n.prestador.nome, 'EMPRESA EXEMPLO PRESTADORA DE SERVIÇOS LTDA');   // veio do grupo emit
  assert.equal(n.tomador.documento, '123.456.789-09');
  assert.equal(n.tomador.municipio, 'Campinas / SP');
  assert.equal(n.destinatario.municipio, 'Curitiba / PR');
  assert.equal(n.intermediario.codigoCep, 'PT / 1000-001');
});

test('nota completa: regras de soma da NT 008 v1.02', () => {
  const n = lerNota(xml('completa-rtc-homologacao.xml'));
  // tpRetPisCofins = 1 → CSLL + PIS + COFINS em "Contribuições Sociais - Retidas"; PIS e COFINS próprios zerados.
  assert.equal(n.federal.sociaisRetidas, 'R$ 465,00');
  assert.equal(n.federal.pis, 'R$ 0,00');
  assert.equal(n.federal.cofins, 'R$ 0,00');
  // Exclusões IBS/CBS = desc. incond. 100 + reemb. 0 + ISSQN 195 + PIS 65 + COFINS 300.
  assert.equal(n.ibscbs.exclusoes, 'R$ 660,00');
  assert.equal(n.totais.totalIbsCbs, 'R$ 92,56');
  assert.equal(n.totais.liquidoMaisIbsCbs, 'R$ 8.835,05');
  assert.equal(n.issqn.deducoes, 'R$ 100,00');
});

test('nota completa: informações complementares na ordem da NT, separadas por pipe', () => {
  const { texto, tributosAproximados } = lerNota(xml('completa-rtc-homologacao.xml')).complementares;
  const ordem = ['Inf. Cont.', 'NFS-e Subst.', 'Doc. Ref.', 'Cod. Obra', 'Núm. Ped.', 'Item Ped.', 'Inf. A. T. Mun.'].map(r => texto.indexOf(r));
  assert.ok(ordem.every(i => i >= 0), texto);
  assert.deepEqual([...ordem].sort((a, b) => a - b), ordem);
  assert.match(texto, / \| /);
  assert.equal(tributosAproximados, 'Totais Aproximados dos Tributos cfe. Lei nº 12.741/2012: Federais: 13,45% ; Estaduais: 0,00% ; Municipais: 2,00%');
});

test('Simples sem tomador: blocos resumidos e % do Simples', () => {
  const n = lerNota(xml('simples-sem-tomador.xml'));
  assert.equal(n.tomador, null);
  assert.equal(n.intermediario, null);
  assert.equal(n.destinatarioEhTomador, false);
  assert.equal(n.prestador.nome, 'POUSADA EXEMPLO LTDA');
  assert.equal(n.prestador.telefone, '(48) 99999-0000');           // o do DPS prevalece sobre o do emit
  assert.equal(n.ibscbs.presente, false);
  assert.equal(n.ibscbs.totalIBS, '-');
  assert.match(n.complementares.tributosAproximados, /Simples Nacional: 6,00%$/);
});

test('nota do sistema municipal: tributos em R$ e ambiente gerador Prefeitura', () => {
  const n = lerNota(xml('municipal-com-tomador.xml'));
  assert.equal(n.identificacao.ambienteGerador, 'Prefeitura');
  assert.equal(n.tomador.nome, 'CLIENTE EXEMPLO COMÉRCIO LTDA');
  assert.match(n.complementares.tributosAproximados, /Federais: R\$ 67,25 ; Estaduais: R\$ 0,00 ; Municipais: R\$ 12,15$/);
  assert.match(n.complementares.texto, /^Inf\. Cont\.: Vencimento/);
});

test('XML que não é NFS-e é recusado com mensagem clara', () => {
  assert.throws(() => lerNota(''), /XML vazio/);
  assert.throws(() => lerNota('<DPS versao="1.01"/>'), /Esperado o elemento <NFSe>/);
  assert.throws(() => lerNota('<NFSe><x></NFSe>'), /XML inválido/);
});
