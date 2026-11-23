/* Checkout de demonstração: calcula frete, descontos e parcelas no navegador. Nada é enviado. */
(function () {
  'use strict';
  var L = window.LOJA, VK = window.VK;
  function $(s) { return document.querySelector(s); }
  function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
  var brl = VK.brl, esc = VK.esc;

  var estado = { cupom: 0, frete: null, fretes: [] };

  function itens() { return VK.carrinho.ler(); }
  function pagamento() { return ($('input[name=pg]:checked') || {}).value; }
  function tipo() { return ($('input[name=tipo]:checked') || {}).value; }

  // ordem: subtotal das peças - kit (3+ peças) - cupom + embalagem; Pix 5% sobre o valor das peças com descontos
  function contas() {
    var r = VK.carrinho.calcular(itens());
    var aposKit = r.sub - r.kitDesc, cupom = aposKit * estado.cupom, base = aposKit - cupom;
    var pix = pagamento() === 'pix' ? base * L.descontoPix : 0;
    var frete = tipo() === 'retirar' ? 0 : (estado.frete ? estado.frete.v : null);
    return { sub: r.sub, kit: r.kit, kitDesc: r.kitDesc, cupom: cupom, pix: pix, presente: r.presente, base: base, frete: frete, total: base - pix + r.presente + (frete || 0) };
  }
  function baseFrete() { return contas().base; }

  function desenharItens() {
    var c = itens();
    if (!c.length) {
      $('#itens').innerHTML = '<li>Sua sacola está vazia. <a href="colecao.html?c=novidades">Escolher produtos</a></li>';
      $('#finalizar').disabled = true;
      return;
    }
    $('#itens').innerHTML = c.map(function (i) {
      var p = VK.produto(i.h);
      return '<li class="ck-item"><span class="ck-item__img"><img src="' + VK.foto(p.img[0], 140, 140) + '" alt=""><span class="ck-item__qtd">' + i.q + '</span></span>' +
        '<span class="ck-item__nome">' + esc(p.t) + '<small>' + esc(p.opcao || 'Tamanho') + ': ' + esc(i.tam) + (i.bord ? ' · Bordado: "' + esc(i.bord.nome) + '" (' + esc(i.bord.cor) + ')' : '') + '</small></span><span>' + brl(VK.carrinho.precoUnit(i) * i.q) + '</span></li>';
    }).join('');
  }

  function linha(rotulo, valor, cls) { return '<div' + (cls ? ' class="' + cls + '"' : '') + '><dt>' + rotulo + '</dt><dd>' + valor + '</dd></div>'; }
  function desenharTotais() {
    var t = contas();
    $('#subtotal').textContent = brl(t.sub);
    var extra = '';
    if (t.kitDesc) extra += linha('Leve mais, pague menos (' + Math.round(t.kit.d * 100) + '%)', '<span class="desconto">− ' + brl(t.kitDesc) + '</span>');
    if (t.cupom) extra += linha('Cupom BEMVINDO10', '<span class="desconto">− ' + brl(t.cupom) + '</span>');
    if (t.pix) extra += linha('Pix (5% off)', '<span class="desconto">− ' + brl(t.pix) + '</span>');
    if (t.presente) extra += linha('Embalagem de presente', brl(t.presente));
    $('#linhas-extra').innerHTML = extra;
    $('#frete-valor').textContent = t.frete === null ? 'Digite o CEP' : (t.frete === 0 ? 'Grátis' : brl(t.frete));
    $('#total').textContent = brl(t.total);
    $('#total-topo').textContent = brl(t.total);
    var sel = $('#parcelas'), atual = sel.value, n = VK.nParcelas(t.total);
    var ops = '';
    for (var k = 1; k <= n; k++) ops += '<option value="' + k + '">' + k + 'x de ' + brl(t.total / k) + ' sem juros</option>';
    sel.innerHTML = ops;
    if (atual && +atual <= n) sel.value = atual;
    $('#finalizar').textContent = pagamento() === 'pix' ? 'Finalizar pedido e gerar Pix' : (pagamento() === 'boleto' ? 'Finalizar pedido e gerar boleto' : 'Pagar ' + brl(t.total));
  }

  function desenharFretes() {
    var cep = $('#cep').value.replace(/\D/g, ''), box = $('#fretes');
    if (cep.length !== 8) { estado.frete = null; estado.fretes = []; box.innerHTML = '<div class="caixa-cinza">Digite o CEP para ver os métodos de frete disponíveis.</div>'; desenharTotais(); return; }
    var rj = /^2[0-8]/.test(cep), base = baseFrete(), gratis = rj && base >= L.freteGratis;
    estado.fretes = [
      { id: 'pac', n: 'PAC', p: rj ? '3 a 5 dias úteis' : '6 a 10 dias úteis', v: gratis ? 0 : (rj ? 14.9 : 24.9) },
      { id: 'sedex', n: 'SEDEX', p: rj ? '1 a 2 dias úteis' : '2 a 4 dias úteis', v: rj ? 22.9 : 39.9 }
    ];
    if (rj) estado.fretes.push({ id: 'moto', n: 'Entrega expressa por motoboy', p: 'Hoje, para pedidos até 15h', v: 19.9 });
    var escolhido = estado.frete && estado.fretes.filter(function (f) { return f.id === estado.frete.id; })[0];
    estado.frete = escolhido || estado.fretes[0];
    box.innerHTML = estado.fretes.map(function (f) {
      var on = f.id === estado.frete.id;
      return '<label class="frete' + (on ? ' ativo' : '') + '"><input type="radio" name="frete" value="' + f.id + '"' + (on ? ' checked' : '') + '><span>' + f.n + '<small>' + f.p + '</small></span><strong>' + (f.v ? brl(f.v) : 'Grátis') + '</strong></label>';
    }).join('');
    $$('input[name=frete]').forEach(function (r) { r.addEventListener('change', function () { estado.frete = estado.fretes.filter(function (f) { return f.id === r.value; })[0]; desenharFretes(); }); });
    desenharTotais();
  }

  // máscaras simples
  function mascara(el, fn) { el.addEventListener('input', function () { el.value = fn(el.value.replace(/\D/g, '')); }); }
  mascara($('#cep'), function (d) { d = d.slice(0, 8); return d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d; });
  mascara($('#cpf'), function (d) { d = d.slice(0, 11); return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2'); });
  mascara($('#telefone'), function (d) { d = d.slice(0, 11); return d.length > 6 ? '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7) : (d.length > 2 ? '(' + d.slice(0, 2) + ') ' + d.slice(2) : d); });

  $('#cep').addEventListener('input', function () {
    var d = $('#cep').value.replace(/\D/g, '');
    if (d.length === 8 && /^2[0-8]/.test(d)) {
      if (!$('#cidade').value) $('#cidade').value = 'Rio de Janeiro';
      if (!$('#uf').value) $('#uf').value = 'RJ';
    }
    desenharFretes();
  });

  $$('input[name=tipo]').forEach(function (r) {
    r.addEventListener('change', function () {
      $$('#tipo-entrega .opcao').forEach(function (o) { o.classList.toggle('ativa', o.querySelector('input').checked); });
      var ret = tipo() === 'retirar';
      $('#bloco-endereco').hidden = ret; $('#bloco-retirada').hidden = !ret; $('#secao-frete').hidden = ret;
      desenharTotais();
    });
  });
  $$('input[name=pg]').forEach(function (r) {
    r.addEventListener('change', function () { $$('.pg').forEach(function (o) { o.classList.toggle('ativo', o.querySelector('input[name=pg]').checked); }); desenharTotais(); });
  });

  $('#cupom-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var c = $('#cupom').value.trim().toUpperCase(), msg = $('#cupom-msg');
    if (c === 'BEMVINDO10') { estado.cupom = 0.10; msg.className = 'cupom-msg ok'; msg.textContent = 'Cupom BEMVINDO10 aplicado: 10% de desconto.'; }
    else { estado.cupom = 0; msg.className = 'cupom-msg ruim'; msg.textContent = 'Insira um código de desconto válido.'; }
    desenharFretes();
  });

  $('#resumo-toggle').addEventListener('click', function () {
    var r = $('#resumo'), aberto = r.classList.toggle('aberto');
    this.setAttribute('aria-expanded', aberto);
  });
  $('[data-aviso]').addEventListener('click', function (e) { e.preventDefault(); VK.toast('Na Shopify o cliente entra com e-mail e código, sem senha.'); });

  $('#form').addEventListener('submit', function (e) {
    e.preventDefault();
    $$('.campo.invalido').forEach(function (c) { c.classList.remove('invalido'); });
    var obrig = ['#email'];
    if (tipo() === 'retirar') obrig.push('#nome-r', '#tel-r');
    else obrig.push('#nome', '#sobrenome', '#cep', '#rua', '#numero', '#bairro', '#cidade', '#uf');
    var faltando = obrig.filter(function (s) { return !$(s).value.trim(); });
    if (!/^\S+@\S+\.\S+$/.test($('#email').value.trim()) && faltando.indexOf('#email') < 0) faltando.unshift('#email');
    if (tipo() !== 'retirar' && !estado.frete) faltando.push('#cep');
    if (faltando.length) {
      faltando.forEach(function (s) { $(s).closest('.campo').classList.add('invalido'); });
      $('#erro').textContent = 'Preencha os campos destacados para continuar.';
      $(faltando[0]).focus();
      return;
    }
    $('#erro').textContent = '';
    var t = contas(), btn = $('#finalizar');
    btn.disabled = true; btn.textContent = 'Processando…';
    var pedido = {
      numero: 1000 + Math.floor(Math.random() * 900) + 1,
      email: $('#email').value.trim(),
      nome: tipo() === 'retirar' ? $('#nome-r').value.trim() : $('#nome').value.trim(),
      sobrenome: tipo() === 'retirar' ? '' : $('#sobrenome').value.trim(),
      endereco: tipo() === 'retirar' ? null : [$('#rua').value + ', ' + $('#numero').value + ($('#complemento').value ? ' – ' + $('#complemento').value : ''), $('#bairro').value, $('#cidade').value + '/' + $('#uf').value, 'CEP ' + $('#cep').value].join('\n'),
      retirada: tipo() === 'retirar',
      frete: tipo() === 'retirar' ? { n: 'Retirar na loja', p: 'Pronto em até 2 horas', v: 0 } : estado.frete,
      pagamento: pagamento(),
      parcelas: pagamento() === 'cartao' ? +$('#parcelas').value : 1,
      final4: '',
      itens: itens(),
      totais: t
    };
    try { localStorage.setItem('aquarela-loja-pedido', JSON.stringify(pedido)); } catch (err) { window.name = JSON.stringify(pedido); }
    setTimeout(function () { VK.carrinho.salvar([]); location.href = 'obrigado.html'; }, 1200);
  });

  document.addEventListener('input', function (e) { var c = e.target.closest && e.target.closest('.campo'); if (c) c.classList.remove('invalido'); });
  document.addEventListener('change', function (e) { var c = e.target.closest && e.target.closest('.campo'); if (c) c.classList.remove('invalido'); });

  // checkout.html?demo=1 com carrinho vazio: coloca 2 produtos de exemplo
  if (!itens().length && /[?&]demo=1/.test(location.search)) VK.carrinho.salvar([{ h: 'vestido-tule-estrelas', tam: '6', q: 1 }, { h: 'tenis-cano-alto', tam: '28', q: 1 }, { h: 'camiseta-positive', tam: '8', q: 1 }]);

  desenharItens();
  desenharFretes();
})();
