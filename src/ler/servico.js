/** "Serviço Prestado" (NT 008, item 2.1.7). */
const f = require('../formatar');
const { municipio } = require('../dados/municipios');

function servico(INF, DPS) {
  const cLoc = DPS('serv/locPrest/cLocPrestacao');
  const m = municipio(cLoc);
  const pais = DPS('serv/locPrest/cPaisPrestacao') || (cLoc ? 'BR' : null);
  return {
    codigoTributacao: f.juntar([DPS('serv/cServ/cTribNac') && f.codTribNac(DPS('serv/cServ/cTribNac')), DPS('serv/cServ/cTribMun')]),
    nbs: f.nbs(DPS('serv/cServ/cNBS')),
    localPrestacao: f.juntar([INF('xLocPrestacao') || (m && m.nome), m && m.uf, pais]),
    // SE xTribMun <> "" ENTÃO descrição municipal SENÃO nacional (NT 008, 2.4.5)
    descricaoCodigo: f.ou(INF('xTribMun') || INF('xTribNac')),
    descricao: f.ou(DPS('serv/cServ/xDescServ')),
  };
}

module.exports = { servico };
