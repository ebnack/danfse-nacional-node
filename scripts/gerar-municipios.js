/**
 * Gera src/dados/municipios.json ({ "4205407": "Florianópolis", ... }) a partir da API oficial do IBGE.
 * A UF não é guardada: sai dos 2 primeiros dígitos do código (ver src/dados/municipios.js).
 *
 * Uso: node scripts/gerar-municipios.js
 */
const fs = require('node:fs');
const path = require('node:path');

const URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios?view=nivelado';

(async () => {
  const resp = await fetch(URL);
  if (!resp.ok) throw new Error(`IBGE respondeu HTTP ${resp.status}`);
  const lista = await resp.json();
  const tabela = {};
  for (const m of lista) tabela[String(m['municipio-id'])] = m['municipio-nome'];
  const destino = path.join(__dirname, '..', 'src', 'dados', 'municipios.json');
  const ordenado = Object.fromEntries(Object.entries(tabela).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(destino, JSON.stringify(ordenado));
  console.log(`${Object.keys(ordenado).length} municípios gravados em ${destino}`);
})().catch(err => { console.error(err.message); process.exit(1); });
