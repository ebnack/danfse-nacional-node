const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { gerarDanfse } = require('../src');

const FIXTURES = path.join(__dirname, 'fixtures');
const xml = nome => fs.readFileSync(path.join(FIXTURES, nome), 'utf8');
const paginas = pdf => (pdf.toString('latin1').match(/\/Type \/Page\b/g) || []).length;

for (const nome of fs.readdirSync(FIXTURES).filter(n => n.endsWith('.xml'))) {
  test(`${nome}: gera PDF de UMA página (NT 008, 2.2)`, async () => {
    const pdf = await gerarDanfse(xml(nome));
    assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
    assert.equal(paginas(pdf), 1);
  });
}

test('texto enorme continua em uma página (corta com reticências)', async () => {
  const longo = 'Texto muito longo de exemplo. '.repeat(400);
  const base = xml('municipal-com-tomador.xml')
    .replace(/<xDescServ>[^<]*<\/xDescServ>/, `<xDescServ>${longo.slice(0, 2000)}</xDescServ>`)
    .replace(/<xInfComp>[^<]*<\/xInfComp>/, `<xInfComp>${longo.slice(0, 2000)}</xInfComp>`);
  const pdf = await gerarDanfse(base, { canhoto: true, situacao: 'substituida' });
  assert.equal(paginas(pdf), 1);
});

test('opções: canhoto e marca d\'água de cancelada', async () => {
  const pdf = await gerarDanfse(xml('simples-sem-tomador.xml'), { situacao: 'cancelada', canhoto: true });
  assert.equal(paginas(pdf), 1);
});

test('situação inválida é recusada', async () => {
  await assert.rejects(gerarDanfse(xml('simples-sem-tomador.xml'), { situacao: 'apagada' }), /situacao inválida/);
});

test('logomarca oficial sai por padrão; logo: false escreve o nome', async () => {
  const comLogo = await gerarDanfse(xml('simples-sem-tomador.xml'));
  assert.match(comLogo.toString('latin1'), /\/Subtype \/Image/);
  const semLogo = await gerarDanfse(xml('simples-sem-tomador.xml'), { logo: false });
  assert.doesNotMatch(semLogo.toString('latin1'), /\/Subtype \/Image/);
});

test('logomarca própria (PNG) entra no cabeçalho', async () => {
  // PNG 1x1 transparente
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
  const pdf = await gerarDanfse(xml('simples-sem-tomador.xml'), { logo: png });
  assert.match(pdf.toString('latin1'), /\/Subtype \/Image/);
});
