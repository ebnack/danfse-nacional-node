const test = require('node:test');
const assert = require('node:assert/strict');
const PDFDocument = require('pdfkit');
const { umaLinha, caixa } = require('../src/pdf/desenho');

const doc = () => new PDFDocument({ size: 'A4', margin: 0 }).font('Helvetica').fontSize(7);

test('umaLinha corta com reticências só quando não cabe', () => {
  const d = doc();
  assert.equal(umaLinha(d, 'curto', 200), 'curto');
  const cortado = umaLinha(d, 'palavra '.repeat(50), 100);
  assert.match(cortado, /\.\.\.$/);
  assert.ok(d.widthOfString(cortado) <= 100);
});

test('caixa corta texto de várias linhas na altura dada', () => {
  const d = doc();
  const texto = 'Linha de texto de exemplo. '.repeat(200);
  const cortado = caixa(d, texto, 300, 30);
  assert.match(cortado, /\.\.\.$/);
  assert.ok(d.heightOfString(cortado, { width: 300 }) <= 30);
  assert.equal(caixa(d, 'cabe', 300, 30), 'cabe');
});
