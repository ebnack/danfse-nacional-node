#!/usr/bin/env node
/**
 * Linha de comando:
 *   danfse-nacional nota.xml                → grava nota.pdf ao lado
 *   danfse-nacional nota.xml saida.pdf --cancelada --canhoto
 *   danfse-nacional pasta/                  → um PDF para cada .xml da pasta
 */
const fs = require('node:fs');
const path = require('node:path');
const { gerarDanfse } = require('../src');

const AJUDA = `Uso: danfse-nacional <nota.xml | pasta> [saida.pdf] [--cancelada | --substituida] [--canhoto] [--logo arquivo.png]`;

function opcoes(args) {
  const op = { situacao: 'normal', canhoto: args.includes('--canhoto') };
  if (args.includes('--cancelada')) op.situacao = 'cancelada';
  if (args.includes('--substituida')) op.situacao = 'substituida';
  const i = args.indexOf('--logo');
  if (i >= 0) op.logo = args[i + 1];
  return op;
}

async function converter(entrada, saida, op) {
  const pdf = await gerarDanfse(fs.readFileSync(entrada), op);
  fs.writeFileSync(saida, pdf);
  console.log(`${entrada} → ${saida}`);
}

(async () => {
  const args = process.argv.slice(2);
  const soltos = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--logo');
  const [entrada, saida] = soltos;
  if (!entrada || args.includes('--help')) { console.log(AJUDA); process.exit(entrada ? 0 : 1); }
  const op = opcoes(args);
  if (fs.statSync(entrada).isDirectory()) {
    const xmls = fs.readdirSync(entrada).filter(n => n.toLowerCase().endsWith('.xml'));
    for (const n of xmls) await converter(path.join(entrada, n), path.join(entrada, n.replace(/\.xml$/i, '.pdf')), op);
    return;
  }
  await converter(entrada, saida || entrada.replace(/\.xml$/i, '') + '.pdf', op);
})().catch(err => { console.error(`Erro: ${err.message}`); process.exit(1); });
