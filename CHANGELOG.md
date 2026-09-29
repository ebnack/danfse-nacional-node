# Changelog

## 0.2.0 — 2026-09-29

Alinhado ao DANFSe gerado pelo portal nacional (conferido contra PDFs oficiais: texto idêntico).

- Corte de textos longos pelo limite de caracteres da NT (37, 77, 167, 1297, 1997) + `...`.
- Cabeçalho com `Município - UF` e códigos de ambiente; código IBGE `nn.nnnnn`.
- Campos compostos mantêm traço por parte (`17.19.01 / -`, `- / -`); país só quando informado.
- Linha do regime especial some com "0 - Nenhum"; blocos resumidos centralizados, sem negrito.
- Sem IBS/CBS: exclusões e totais em `R$ 0,00`; tributos aproximados no formato do portal.
- Regime do Simples por extenso ("pelo Simples Nacional"); rótulos com "NFS-e".
- Canhoto passa a sair por padrão.

## 0.1.0 — 2026-09-29

Primeira versão.

- `gerarDanfse(xml, opcoes)`: DANFSe v2.0 em PDF (NT 008/2026 v1.02), uma página A4.
- `lerNota(xml)`: dados do DANFSe já formatados, sem desenhar.
- Blocos resumidos (tomador, destinatário, intermediário, ISSQN), IBS/CBS, marca d'água de cancelada ou
  substituída, canhoto opcional, "NFS-e SEM VALIDADE JURÍDICA" em homologação.
- Logomarca oficial da NFS-e incluída (opção `logo` troca ou desliga).
- Linha de comando `danfse-nacional`.
