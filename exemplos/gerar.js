/**
 * Exemplo: gera os PDFs das notas fictícias de test/fixtures em exemplos/saida/.
 *   node exemplos/gerar.js
 */
const fs = require('node:fs');
const path = require('node:path');
const { gerarDanfse } = require('..');

const FIXTURES = path.join(__dirname, '..', 'test', 'fixtures');
const SAIDA = path.join(__dirname, 'saida');

(async () => {
  fs.mkdirSync(SAIDA, { recursive: true });
  for (const nome of fs.readdirSync(FIXTURES).filter(n => n.endsWith('.xml'))) {
    const pdf = await gerarDanfse(fs.readFileSync(path.join(FIXTURES, nome)), { canhoto: true });
    const destino = path.join(SAIDA, nome.replace(/\.xml$/, '.pdf'));
    fs.writeFileSync(destino, pdf);
    console.log(destino);
  }
})();
