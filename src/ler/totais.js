/** "Valor Total da NFS-e" e "Informações Complementares" (NT 008, itens 2.1.11 e 2.1.12). */
const f = require('../formatar');
const { soma } = require('./tributos');

function totais(INF, DPS) {
  const totalIbsCbs = soma(INF('IBSCBS/totCIBS/gIBS/vIBSTot'), INF('IBSCBS/totCIBS/gCBS/vCBS'));
  return {
    valorServico: f.reais(DPS('valores/vServPrest/vServ')),
    descontoIncond: f.reais(DPS('valores/vDescCondIncond/vDescIncond')),
    descontoCond: f.reais(DPS('valores/vDescCondIncond/vDescCond')),
    totalRetencoes: f.reais(INF('valores/vTotalRet')),
    valorLiquido: f.reais(INF('valores/vLiq')),
    totalIbsCbs: f.reais(totalIbsCbs),
    liquidoMaisIbsCbs: f.reais(INF('IBSCBS/totCIBS/vTotNF')),
  };
}

/**
 * Tributos aproximados da Lei 12.741/2012 (nota 10): R$ por esfera, % por esfera, ou o % único do Simples
 * (pTotTribSN). Linha fixa: nunca é cortada pelas reticências.
 */
function tributosAproximados(DPS) {
  const T = c => DPS(`valores/trib/totTrib/${c}`);
  const base = 'Totais Aproximados dos Tributos cfe. Lei nº 12.741/2012: ';
  const esferas = (fmt, fed, est, mun) => `${base}Federais: ${fmt(fed)} ; Estaduais: ${fmt(est)} ; Municipais: ${fmt(mun)}`;
  if (DPS.existe('valores/trib/totTrib/vTotTrib')) return esferas(f.reais, T('vTotTrib/vTotTribFed'), T('vTotTrib/vTotTribEst'), T('vTotTrib/vTotTribMun'));
  if (DPS.existe('valores/trib/totTrib/pTotTrib')) return esferas(f.percentual, T('pTotTrib/pTotTribFed'), T('pTotTrib/pTotTribEst'), T('pTotTrib/pTotTribMun'));
  if (T('pTotTribSN')) return `${base}Simples Nacional: ${f.percentual(T('pTotTribSN'))}`;
  if (T('indTotTrib') === '0') return `${base}Não informado (Decreto nº 8.264/2014)`;
  return `${base}${f.VAZIO}`;
}

/** Ordem da NT: Inf. Cont.; NFS-e Subst.; Doc. Ref.; Cod. Obra; Insc. Imob.; Cod. Evt.; Doc. Tec.; Núm. Ped.; Item Ped.; Inf. A. T. Mun. */
function complementares(INF, DPS) {
  const C = c => DPS(`serv/infoCompl/${c}`);
  const itens = DPS.todos('serv/infoCompl/gItemPed/xItemPed').map(L => L.valor());
  const partes = [
    ['Inf. Cont.', C('xInfComp')],
    ['NFS-e Subst.', DPS('subst/chSubstda')],
    ['Doc. Ref.', C('docRef')],
    ['Cod. Obra', DPS('serv/obra/cObra')],
    ['Insc. Imob.', DPS('IBSCBS/imovel/inscImobFisc')],
    ['Cod. Evt.', DPS('serv/atvEvento/idAtvEvt')],
    ['Doc. Tec.', C('idDocTec')],
    ['Núm. Ped.', C('xPed')],
    ['Item Ped.', itens.filter(f.temValor).join(', ')],
    ['Inf. A. T. Mun.', INF('xOutInf')],
  ].filter(([, v]) => f.temValor(v)).map(([rot, v]) => `${rot}: ${String(v).trim()}`);
  return { texto: partes.join(' | '), tributosAproximados: tributosAproximados(DPS) };
}

module.exports = { totais, complementares };
