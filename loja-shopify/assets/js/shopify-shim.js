/* Liga o checkout de demonstração (estilo Shopify) aos dados da Aquarela.
   A sacola fica no navegador em 'aquarela-sacola-v1' (a mesma que o app.js usa no modo loja). */
(function () {
  'use strict';
  var D = window.AQUARELA, L = D.loja;
  var CHAVE = 'aquarela-sacola-v1';
  var fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  function brl(v) { return fmt.format(v); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function bruto(id) { return D.produtos.filter(function (p) { return p.id === id; })[0]; }
  // formato que o checkout espera: t (nome), p (preço), img (fotos), opcao
  function produto(id) { var p = bruto(id); return p ? { h: p.id, t: p.nome, p: p.preco, img: p.fotos, opcao: p.categoria === 'calcados' ? 'Número' : '' } : null; }
  function ler() {
    try { return (JSON.parse(localStorage.getItem(CHAVE)) || []).filter(function (i) { return bruto(i.id || i.h); }).map(function (i) { return { h: i.id || i.h, tam: i.tam, q: i.q }; }); } catch (e) { return []; }
  }
  function salvar(c) { try { localStorage.setItem(CHAVE, JSON.stringify(c.map(function (i) { return { id: i.h, tam: i.tam, q: i.q }; }))); } catch (e) { } }
  function precoUnit(i) { return bruto(i.h).preco; }
  function calcular(c) { c = c || ler(); var sub = c.reduce(function (s, i) { return s + precoUnit(i) * i.q; }, 0); return { itens: c, sub: sub, kit: null, kitDesc: 0, presente: 0, total: sub }; }
  var toastT;
  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); t.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#2b2340;color:#fff;padding:12px 22px;border-radius:16px;font-weight:700;z-index:99;opacity:0;transition:opacity .2s'; document.body.appendChild(t); }
    t.textContent = msg; t.style.opacity = 1; clearTimeout(toastT); toastT = setTimeout(function () { t.style.opacity = 0; }, 2800);
  }
  window.LOJA = { nome: L.nome, endereco: L.endereco, whatsapp: L.whatsapp, whatsappLink: L.whatsappLink, freteGratis: 199, descontoPix: 0.05 };
  window.VK = {
    brl: brl, esc: esc, produto: produto, toast: toast,
    foto: function (id) { return 'assets/fotos/' + id + '-p.jpg'; },
    nParcelas: function (v) { return Math.max(1, Math.min(6, Math.floor(v / 30))); },
    carrinho: { ler: ler, salvar: salvar, calcular: calcular, precoUnit: precoUnit }
  };
})();
