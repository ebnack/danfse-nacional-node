/** Cabeçalho e "Dados de Identificação da NFS-e" (NT 008, itens 2.1.1, 2.1.2 e 2.4.3). */
const f = require('../formatar');
const D = require('../dados/dominios');
const { municipio } = require('../dados/municipios');

/** chave = Id do infNFSe sem o prefixo "NFS" (50 dígitos). */
function chaveDe(INF) {
  const id = INF.attr('Id') || '';
  return id.replace(/^NFS/, '');
}

function identificacao(INF, DPS) {
  const chave = chaveDe(INF);
  const ufEmissor = INF('emit/enderNac/UF') || (municipio(DPS('cLocEmi')) || {}).uf;
  const dCompet = DPS('dCompet');
  return {
    chave: f.ou(chave),
    numero: f.ou(INF('nNFSe')),
    competencia: f.data(dCompet),
    anoCompetencia: dCompet ? Number(dCompet.slice(0, 4)) : null,
    emissaoNfse: f.dataHora(INF('dhProc')),
    numeroDps: f.ou(DPS('nDPS')),
    serieDps: f.ou(DPS('serie')),
    emissaoDps: f.dataHora(DPS('dhEmi')),
    emitente: f.descricao(D.tpEmit, DPS('tpEmit')),
    situacao: f.descricao(D.cStat, INF('cStat')),
    finalidade: f.descricao(D.finNFSe, DPS('IBSCBS/finNFSe')),
    municipioEmissor: f.juntar([INF('xLocEmi'), ufEmissor]),
    ambienteGerador: f.descricao(D.ambGer, INF('ambGer')),
    tipoAmbiente: f.descricao(D.tpAmb, DPS('tpAmb')),
    homologacao: DPS('tpAmb') === '2',
  };
}

module.exports = { identificacao };
