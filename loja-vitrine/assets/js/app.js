/* Aquarela · vitrine autoral. Site estático: sem login, sem carrinho, sem pagamento.
   A compra acontece fora: WhatsApp (Minha lista), Shopee, Mercado Livre ou loja física.
   Segurança: tudo que vem dos dados entra como texto (textContent); só os ícones fixos usam innerHTML. */
(function () {
  'use strict';
  const D = window.AQUARELA, L = D.loja;
  const $ = (s, r) => (r || document).querySelector(s);
  const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const foto = (id, grande) => 'assets/fotos/' + id + (grande ? '' : '-p') + '.jpg';
  const params = new URLSearchParams(location.search);
  const cat = (slug) => D.categorias.find((c) => c.slug === slug);
  const produto = (id) => D.produtos.find((p) => p.id === id);

  // cria elemento: h('a', { class: 'x', href: '...' }, 'texto' | [filhos])
  function h(tag, attrs, filhos) {
    const el = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (v === null || v === undefined || v === false) return;
      if (k === 'html') el.innerHTML = v;            // só ícones fixos deste arquivo
      else if (k === 'on') Object.entries(v).forEach(([ev, fn]) => el.addEventListener(ev, fn));
      else el.setAttribute(k, v === true ? '' : v);
    });
    [].concat(filhos === undefined ? [] : filhos).forEach((f) => { if (f !== null && f !== undefined && f !== false) el.append(f instanceof Node ? f : document.createTextNode(String(f))); });
    return el;
  }

  const ICONE = {
    zap: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3Zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.2-3.8 1.2 1.2-3.7-.3-.4a10.5 10.5 0 0 1-1.7-5.8C5.1 9.9 10 5.2 16 5.2s10.9 4.7 10.9 10.6S22 26.4 16 26.4Zm6-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6.3-.5c.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.8 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4Z"/></svg>',
    shopee: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 8h15l-1 12.2a1.5 1.5 0 0 1-1.5 1.3H7a1.5 1.5 0 0 1-1.5-1.3z"/><path d="M8.5 8a3.5 3.5 0 0 1 7 0"/><path d="M14 12.3c-.5-.6-1.2-.9-2-.9-1 0-1.8.6-1.8 1.4 0 1.9 4 1.1 4 3.1 0 .9-.9 1.5-2 1.5-.9 0-1.7-.4-2.2-1"/></svg>',
    ml: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>',
    loja: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9.5 4.5 4h15L21 9.5"/><path d="M3 9.5h18v1.2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z"/><path d="M5 13.5V20h14v-6.5"/><path d="M10 20v-4h4v4"/></svg>',
    insta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    busca: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    paleta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 0 0 0 18c1.4 0 2-1 2-2 0-1.5-1.3-1.6-1.3-3 0-1.1.9-2 2-2H17a4 4 0 0 0 4-4c0-4-4-7-9-7Z"/><circle cx="7.5" cy="11" r="1.3" fill="currentColor"/><circle cx="10" cy="7" r="1.3" fill="currentColor"/><circle cx="15" cy="7.5" r="1.3" fill="currentColor"/></svg>',
    lixo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
    fechar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    pino: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg>',
    relogio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    estrela: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c.6 4.6 2.4 7.4 10 10-7.6 2.6-9.4 5.4-10 10-.6-4.6-2.4-7.4-10-10 7.6-2.6 9.4-5.4 10-10Z"/></svg>'
  };

  const PINGOS = '<svg viewBox="0 0 1200 34" preserveAspectRatio="none"><path d="M0 0h1200v8c-30 0-34 22-52 22s-16-18-40-18-26 14-60 14-30-16-70-16-26 24-50 24-20-20-48-20-40 12-74 12-28-18-62-18-30 22-56 22-24-14-60-14-40 16-80 16-30-20-66-20-22 26-48 26-28-22-60-22-34 14-70 14-30-18-62-18-24 20-54 20-30-16-62-16-20 14-54 14V0Z" fill="#2b2340"/></svg>';

  // ---------------------------------------------------------------- canais de compra
  const linkZap = (texto) => L.whatsapp ? 'https://wa.me/' + L.whatsapp + '?text=' + encodeURIComponent(texto) : L.whatsappLink;
  // regra nº 1 do manual: link exato do anúncio. Sem ele, a loja no marketplace; na prévia, a busca.
  const linkShopee = (p) => (p && p.shopee) || L.shopee || 'https://shopee.com.br/search?keyword=' + encodeURIComponent(p ? p.nome : 'Aquarela moda infantil');
  const linkML = (p) => (p && p.ml) || L.mercadoLivre || 'https://lista.mercadolivre.com.br/' + encodeURIComponent((p ? p.nome : 'Aquarela moda infantil').toLowerCase().replace(/\s+/g, '-'));

  function abrirZap(texto) {
    if (L.whatsapp) { window.open(linkZap(texto), '_blank', 'noopener'); return; }
    // sem o número: o link curto do WhatsApp Business não aceita texto pronto → copia e abre
    try { navigator.clipboard.writeText(texto).catch(() => {}); } catch (e) { }
    toast('Mensagem copiada! É só colar na conversa que vai abrir.');
    setTimeout(() => window.open(L.whatsappLink, '_blank', 'noopener'), 700);
  }

  // ---------------------------------------------------------------- minha lista
  const CHAVE = 'aquarela-lista-v1', CHAVE_NOME = 'aquarela-nome-v1', CHAVE_CEP = 'aquarela-cep-v1';
  const MAX_PRODUTOS = 15, MAX_UNIDADES = 10;
  const ler = (k, padrao) => { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? padrao : v; } catch (e) { return padrao; } };
  const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } };
  // ao ler, confere de novo (produto existe, tamanho existe, limites)
  const lista = () => ler(CHAVE, []).filter((i) => produto(i.id) && produto(i.id).tamanhos.includes(i.tam)).slice(0, MAX_PRODUTOS).map((i) => ({ id: i.id, tam: i.tam, q: Math.min(MAX_UNIDADES, Math.max(1, i.q | 0)) }));

  function porNaLista(id, tam) {
    const l = lista(), item = l.find((i) => i.id === id && i.tam === tam);
    if (item) { if (item.q >= MAX_UNIDADES) { toast('No máximo ' + MAX_UNIDADES + ' unidades de cada peça.'); return false; } item.q++; }
    else { if (l.length >= MAX_PRODUTOS) { toast('A lista aceita até ' + MAX_PRODUTOS + ' peças diferentes.'); return false; } l.push({ id, tam, q: 1 }); }
    gravar(CHAVE, l); desenharLista(); toast('Pus na sua lista! 🎨'); return true;
  }
  function mensagemLista() {
    const l = lista(), nome = ler(CHAVE_NOME, ''), cep = ler(CHAVE_CEP, '');
    const linhas = l.map((i) => { const p = produto(i.id); return '• ' + i.q + 'x ' + p.nome + ' (tam. ' + i.tam + ') ' + brl(p.preco * i.q); });
    const total = l.reduce((s, i) => s + produto(i.id).preco * i.q, 0);
    return 'Olá, Aquarela! Montei esta lista no site:\n\n' + linhas.join('\n') + '\n\nTotal de referência: ' + brl(total) + '\nNome: ' + nome + '\nCEP: ' + cep + '\n\nPode confirmar os tamanhos e a entrega?';
  }

  function desenharLista() {
    const l = lista(), n = l.reduce((s, i) => s + i.q, 0);
    document.querySelectorAll('[data-lista-n]').forEach((el) => { el.textContent = n; el.hidden = !n; });
    const corpo = $('#lista-corpo'), rod = $('#lista-rodape');
    if (!corpo) return;
    corpo.replaceChildren(); rod.replaceChildren();
    if (!l.length) {
      corpo.append(h('div', { class: 'lista-vazia' }, [h('span', { class: 'mao' }, 'Sua lista está em branco'), h('p', {}, 'Escolha um look, o tamanho e toque em "Pôr na lista".'), h('a', { class: 'bt', href: 'index.html#looks', on: { click: fecharLista } }, 'Ver os looks')]));
      rod.hidden = true; return;
    }
    rod.hidden = false;
    l.forEach((i) => {
      const p = produto(i.id);
      const mudar = (d) => { const nl = lista(); const it = nl.find((x) => x.id === i.id && x.tam === i.tam); it.q = Math.min(MAX_UNIDADES, it.q + d); if (it.q < 1) nl.splice(nl.indexOf(it), 1); gravar(CHAVE, nl); desenharLista(); };
      corpo.append(h('div', { class: 'item' }, [
        h('img', { src: foto(p.fotos[0]), alt: '' }),
        h('div', {}, [h('div', { class: 'item__nome' }, p.nome), h('div', { class: 'item__det' }, 'Tamanho ' + i.tam + ' · ' + brl(p.preco)),
          h('div', { class: 'qtd' }, [h('button', { type: 'button', 'aria-label': 'Menos uma', on: { click: () => mudar(-1) } }, '−'), h('span', {}, i.q), h('button', { type: 'button', 'aria-label': 'Mais uma', on: { click: () => mudar(1) } }, '+')])]),
        h('button', { class: 'item__lixo', type: 'button', 'aria-label': 'Tirar da lista', html: ICONE.lixo, on: { click: () => mudar(-99) } })
      ]));
    });
    const total = l.reduce((s, i) => s + produto(i.id).preco * i.q, 0);
    const nome = h('input', { id: 'lista-nome', autocomplete: 'name', maxlength: '60', value: ler(CHAVE_NOME, '') });
    const cep = h('input', { id: 'lista-cep', inputmode: 'numeric', autocomplete: 'postal-code', maxlength: '9', value: ler(CHAVE_CEP, '') });
    nome.addEventListener('input', () => gravar(CHAVE_NOME, nome.value.trim()));
    cep.addEventListener('input', () => { const d = cep.value.replace(/\D/g, '').slice(0, 8); cep.value = d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d; gravar(CHAVE_CEP, cep.value); });
    const erro = h('p', { class: 'erro', hidden: true });
    rod.append(
      h('div', { class: 'total' }, [h('span', {}, 'Total de referência'), h('span', {}, brl(total))]),
      h('div', { class: 'campos' }, [h('label', { for: 'lista-nome' }, ['Seu nome', nome]), h('label', { for: 'lista-cep' }, ['CEP', cep])]),
      erro,
      h('button', { class: 'bt bt--zap bt--cheio', type: 'button', html: ICONE.zap + ' Enviar lista no WhatsApp', on: { click: () => {
        if (nome.value.trim().length < 2 || cep.value.replace(/\D/g, '').length !== 8) { erro.textContent = 'Preencha o seu nome e o CEP para a loja calcular a entrega.'; erro.hidden = false; return; }
        erro.hidden = true; abrirZap(mensagemLista());
      } } }),
      h('p', { class: 'letra-miuda' }, ['A lista, o nome e o CEP ficam só no seu celular até você enviar. ', h('a', { href: 'privacidade.html' }, 'Saiba mais')]),
      h('button', { class: 'bt bt--papel bt--pequeno', type: 'button', on: { click: () => { if (confirm('Limpar a lista, o nome e o CEP?')) { gravar(CHAVE, []); gravar(CHAVE_NOME, ''); gravar(CHAVE_CEP, ''); desenharLista(); } } } }, 'Limpar lista')
    );
  }
  function abrirLista() { $('#gaveta').classList.add('aberta'); $('#veu').classList.add('aberto'); }
  function fecharLista() { $('#gaveta').classList.remove('aberta'); $('#veu').classList.remove('aberto'); }

  let toastT;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('ver'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('ver'), 2800); }

  // ---------------------------------------------------------------- cabeçalho e rodapé
  function montarTopo() {
    const topo = $('#topo');
    const menu = h('nav', { class: 'menu', 'aria-label': 'Categorias' }, D.categorias.map((c) => h('a', { href: 'index.html?c=' + c.slug + '#looks', 'data-tinta': c.tinta }, c.nome)));
    const busca = h('div', { class: 'wrap busca-barra', id: 'busca-barra', hidden: true }, h('form', { action: 'index.html', role: 'search' }, [
      h('label', { class: 'vh', for: 'busca' }, 'Buscar'), h('input', { id: 'busca', name: 'q', type: 'search', placeholder: 'Vestido, conjunto, tênis...', maxlength: '60' }), h('button', { class: 'bt', type: 'submit' }, 'Buscar')]));
    const menuCel = h('nav', { class: 'wrap menu-cel', id: 'menu-cel', 'aria-label': 'Categorias' }, D.categorias.map((c) => h('a', { href: 'index.html?c=' + c.slug + '#looks' }, c.nome)).concat([h('a', { href: 'index.html#onde-comprar' }, 'Onde comprar'), h('a', { href: 'index.html#loja' }, 'Loja física')]));
    topo.append(
      h('div', { class: 'wrap topo__linha' }, [
        h('button', { class: 'icone topo__menu-cel', type: 'button', 'aria-label': 'Abrir menu', html: ICONE.menu, on: { click: () => $('#menu-cel').classList.toggle('aberto') } }),
        h('a', { class: 'topo__logo', href: 'index.html' }, h('img', { src: 'assets/img/logo.png', alt: 'Aquarela Moda Infantil e Juvenil', width: '108', height: '75' })),
        menu,
        h('div', { class: 'topo__acoes' }, [
          h('button', { class: 'icone', type: 'button', 'aria-label': 'Buscar', html: ICONE.busca, on: { click: () => { const b = $('#busca-barra'); b.hidden = !b.hidden; if (!b.hidden) $('#busca').focus(); } } }),
          h('a', { class: 'icone icone--zap', href: linkZap('Olá, Aquarela! Vim pelo site.'), target: '_blank', rel: 'noopener noreferrer', 'aria-label': 'WhatsApp', html: ICONE.zap }),
          h('button', { class: 'lista-bt', type: 'button', on: { click: abrirLista } }, [h('span', { html: ICONE.paleta }), h('span', { class: 'lista-bt__txt' }, 'Minha lista'), h('span', { class: 'lista-bt__n', 'data-lista-n': true, hidden: true }, '0')])
        ])
      ]),
      busca, menuCel);

    $('#rodape').append(
      h('div', { class: 'rodape__pingos', 'aria-hidden': 'true', html: PINGOS }),
      h('div', { class: 'wrap rodape__grade' }, [
        h('div', {}, [h('a', { class: 'rodape__logo', href: 'index.html' }, h('img', { src: 'assets/img/logo.png', alt: 'Aquarela Moda Infantil', width: '120', height: '84' })), h('p', {}, 'Looks para brincar, correr e sorrir. Moda infantil e juvenil ' + L.idades + '.')]),
        h('div', {}, [h('h3', {}, 'Onde comprar'), h('p', {}, h('a', { href: linkZap('Olá, Aquarela!'), target: '_blank', rel: 'noopener noreferrer' }, 'WhatsApp')), h('p', {}, h('a', { href: linkShopee(), target: '_blank', rel: 'noopener noreferrer' }, 'Shopee')), h('p', {}, h('a', { href: linkML(), target: '_blank', rel: 'noopener noreferrer' }, 'Mercado Livre')), h('p', {}, h('a', { href: 'index.html#loja' }, 'Loja física'))]),
        h('div', {}, [h('h3', {}, 'A loja'), h('p', {}, L.endereco), h('p', {}, h('a', { href: L.instagram, target: '_blank', rel: 'noopener noreferrer' }, L.arroba)), h('p', {}, ['Sem cadastro e sem cookies. ', h('a', { href: 'privacidade.html' }, 'Aviso de privacidade')])])
      ]),
      h('div', { class: 'wrap rodape__base' }, ['© 2026 ' + L.nome + ' · Prévia de site criada pela DigitalWorks para apresentação. ', h('a', { href: '../index.html' }, '← Ver as duas opções')])
    );

    const z = h('a', { class: 'zap-flutuante', href: linkZap('Olá, Aquarela! Vim pelo site.'), target: '_blank', rel: 'noopener noreferrer', 'aria-label': 'Falar com a Aquarela no WhatsApp', html: ICONE.zap });
    const gaveta = h('aside', { class: 'gaveta', id: 'gaveta', 'aria-label': 'Minha lista' }, [
      h('div', { class: 'gaveta__topo' }, [h('h2', {}, [h('span', { class: 'mao' }, 'Minha lista')]), h('button', { class: 'icone', type: 'button', 'aria-label': 'Fechar', html: ICONE.fechar, on: { click: fecharLista } })]),
      h('div', { class: 'gaveta__corpo', id: 'lista-corpo' }), h('div', { class: 'gaveta__rodape', id: 'lista-rodape' })]);
    document.body.append(z, h('div', { class: 'veu', id: 'veu', on: { click: fecharLista } }), gaveta, h('div', { class: 'toast', id: 'toast', role: 'status' }));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharLista(); });
    desenharLista();
  }

  // ---------------------------------------------------------------- card de peça
  function card(p, opts) {
    const c = cat(p.categoria) || {};
    const selo = h('span', { class: 'preco-selo' + (p.de ? ' preco-selo--promo' : '') }, [p.de ? h('s', {}, brl(p.de)) : null, brl(p.preco)]);
    const cores = h('span', { class: 'cores', 'aria-label': 'Cores' }, p.cores.map((cor) => { const i = h('i'); i.style.background = cor; return i; }));
    return h('article', { class: 'peca', 'data-tinta': c.tinta }, [
      h('a', { class: 'peca__foto', href: 'produto.html?p=' + p.id, 'aria-label': p.nome }, [h('img', { src: foto(p.fotos[0]), alt: p.nome, loading: 'lazy', width: '400', height: '500' }), selo, p.novidade ? h('span', { class: 'etiqueta' }, 'novidade!') : null]),
      h('div', { class: 'peca__info' }, [
        h('a', { class: 'peca__nome', href: 'produto.html?p=' + p.id }, p.nome),
        h('div', { class: 'peca__linha' }, [h('span', {}, 'Tam. ' + p.tamanhos.join(' · ')), cores]),
        h('div', { class: 'peca__acoes' }, [
          h('a', { class: 'bt bt--pequeno', href: 'produto.html?p=' + p.id }, 'Escolher tamanho'),
          h('a', { class: 'mini-canal mini-canal--shopee', href: linkShopee(p), target: '_blank', rel: 'noopener noreferrer', 'aria-label': 'Ver na Shopee', title: 'Shopee', html: ICONE.shopee }),
          h('a', { class: 'mini-canal mini-canal--ml', href: linkML(p), target: '_blank', rel: 'noopener noreferrer', 'aria-label': 'Ver no Mercado Livre', title: 'Mercado Livre', html: ICONE.ml })
        ])
      ])
    ]);
  }

  // ---------------------------------------------------------------- página inicial
  function inicio() {
    // colagem do hero com 3 peças
    const col = $('#colagem');
    const destaques = D.produtos.filter((p) => p.destaque);
    [destaques[0], destaques[1], D.produtos.find((p) => p.novidade)].forEach((p, i) => col.append(h('div', { class: 'colagem__foto colagem__foto--' + (i + 1) }, h('img', { src: foto(p.fotos[0], i === 0), alt: '' }))));
    ['1', '2', '3'].forEach((n) => col.append(h('span', { class: 'estrela estrela--' + n, html: ICONE.estrela })));

    // onde comprar
    $('#canais').append(
      h('a', { class: 'canal canal--zap', href: '#looks' }, [h('span', { class: 'canal__icone', html: ICONE.zap }), h('strong', {}, 'WhatsApp'), h('span', {}, 'Monte a sua lista aqui no site e mande pronta. A gente confirma tamanho e entrega.')]),
      h('a', { class: 'canal canal--shopee', href: linkShopee(), target: '_blank', rel: 'noopener noreferrer' }, [h('span', { class: 'canal__icone', html: ICONE.shopee }), h('strong', {}, 'Shopee'), h('span', {}, 'Prefere pagar no app? Cada peça leva direto ao anúncio dela na Shopee.')]),
      h('a', { class: 'canal canal--ml', href: linkML(), target: '_blank', rel: 'noopener noreferrer' }, [h('span', { class: 'canal__icone', html: ICONE.ml }), h('strong', {}, 'Mercado Livre'), h('span', {}, 'Compra protegida e entrega pelo Mercado Livre, também anúncio por anúncio.')]),
      h('a', { class: 'canal canal--loja', href: '#loja' }, [h('span', { class: 'canal__icone', html: ICONE.loja }), h('strong', {}, 'Loja física'), h('span', {}, 'Rua Velha, 348, em Rio das Pedras. Venha provar e escolher com calma.')])
    );

    // potes de tinta
    $('#potes').append(...D.categorias.map((c) => h('li', { class: 'pote', 'data-tinta': c.tinta }, h('a', { href: 'index.html?c=' + c.slug + '#looks' }, [h('span', { class: 'pote__circulo' }, h('img', { src: foto(c.foto), alt: '', loading: 'lazy' })), h('span', { class: 'pote__nome' }, c.nome)]))));

    $('#novidades').append(...D.produtos.filter((p) => p.novidade).map((p) => card(p)));
    $('#queridinhas').append(...destaques.map((p) => card(p)));

    // look pronto
    const look = [produto('conjunto-camisa-sarja'), produto('jaqueta-sarja'), produto('tenis-verde-agua')].filter(Boolean);
    $('#look').append(...look.map((p) => h('a', { href: 'produto.html?p=' + p.id }, [h('img', { src: foto(p.fotos[0]), alt: p.nome, loading: 'lazy' }), h('span', {}, p.nome.split(' ').slice(0, 2).join(' '))])));
    const zl = $('#look-zap'); zl.innerHTML = ICONE.zap; zl.append(' Quero esse look');
    zl.addEventListener('click', () => abrirZap('Olá, Aquarela! Quero este look do site:\n\n' + look.map((p) => '• ' + p.nome + ' ' + brl(p.preco)).join('\n') + '\n\nTem no tamanho ___?'));

    // todos os looks com filtros
    const estado = { c: cat(params.get('c')) ? params.get('c') : '', t: params.get('t') || '', q: (params.get('q') || '').slice(0, 60), novidade: false };
    const tamanhos = ['4', '6', '8', '10'];
    const busca = h('input', { type: 'search', placeholder: 'Buscar peça...', 'aria-label': 'Buscar peça', value: estado.q, maxlength: '60' });
    const f = $('#filtros');
    function chips() {
      f.replaceChildren(
        h('span', { class: 'filtros__rotulo' }, 'Peças:'),
        h('button', { class: 'chip' + (!estado.c ? ' ativo' : ''), type: 'button', on: { click: () => { estado.c = ''; desenhar(); } } }, 'Todas'),
        ...D.categorias.map((c) => h('button', { class: 'chip' + (estado.c === c.slug ? ' ativo' : ''), type: 'button', on: { click: () => { estado.c = c.slug; desenhar(); } } }, c.nome)),
        h('span', { class: 'filtros__rotulo' }, 'Idade:'),
        ...tamanhos.map((t) => h('button', { class: 'chip' + (estado.t === t ? ' ativo' : ''), type: 'button', on: { click: () => { estado.t = estado.t === t ? '' : t; desenhar(); } } }, t + ' anos')),
        busca);
    }
    const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    function desenhar() {
      chips();
      const q = norm(estado.q);
      const r = D.produtos.filter((p) => (!estado.c || p.categoria === estado.c) && (!estado.t || p.tamanhos.includes(estado.t)) && (!q || norm(p.nome + ' ' + (cat(p.categoria) || {}).nome).includes(q)) && (!estado.novidade || p.novidade));
      const g = $('#grade');
      g.replaceChildren(...(r.length ? r.map((p) => card(p)) : [h('p', {}, ['Nada por aqui com esse filtro. ', h('a', { href: linkZap('Olá, Aquarela! Estou procurando uma peça.'), target: '_blank', rel: 'noopener noreferrer' }, 'Pergunte no WhatsApp')])]));
    }
    busca.addEventListener('input', () => { estado.q = busca.value; const pos = busca.selectionStart; desenhar(); busca.focus(); busca.setSelectionRange(pos, pos); });
    document.querySelector('[data-filtro="novidade"]').addEventListener('click', () => { estado.novidade = true; estado.c = ''; desenhar(); });
    desenhar();
    if (D.produtos.some((p) => p.exemplo)) $('#nota-exemplo').textContent = 'Prévia: as fotos são de exemplo e serão trocadas pelas peças reais da Aquarela. Shopee e Mercado Livre abrem a busca; no site final, abrem o anúncio exato de cada peça.';

    // loja física
    $('#loja-lista').append(
      h('li', {}, [h('span', { html: ICONE.pino }), h('span', {}, L.endereco)]),
      h('li', {}, [h('span', { html: ICONE.relogio }), h('span', {}, L.horario)]),
      h('li', {}, [h('span', { html: ICONE.zap }), h('span', {}, 'Atendimento pelo WhatsApp')]));
    $('#loja-bts').append(
      h('a', { class: 'bt', href: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(L.mapa), target: '_blank', rel: 'noopener noreferrer', html: ICONE.pino + ' Como chegar' }),
      h('a', { class: 'bt bt--zap', href: linkZap('Olá, Aquarela! Quero passar na loja.'), target: '_blank', rel: 'noopener noreferrer', html: ICONE.zap + ' Chamar no Zap' }));
    // mapa do Google só no clique (velocidade e LGPD)
    $('#ver-mapa').addEventListener('click', () => {
      const fr = h('iframe', { title: 'Mapa da loja Aquarela', loading: 'lazy', referrerpolicy: 'no-referrer-when-downgrade', src: 'https://www.google.com/maps?q=' + encodeURIComponent(L.mapa) + '&output=embed' });
      $('#fachada').replaceChildren(fr);
    });
  }

  // ---------------------------------------------------------------- página de produto
  function paginaProduto() {
    const p = produto(params.get('p')) || D.produtos[0];
    const c = cat(p.categoria) || {};
    document.title = p.nome + ' · Aquarela Moda Infantil';
    let tam = p.tamanhos.length === 1 ? p.tamanhos[0] : '';
    const principal = h('img', { src: foto(p.fotos[0], true), alt: p.nome });
    const mini = p.fotos.length > 1 ? h('div', { class: 'galeria__mini' }, p.fotos.map((id, i) => h('button', { type: 'button', class: i ? '' : 'ativo', 'aria-label': 'Foto ' + (i + 1), on: { click: (e) => { principal.src = foto(id, true); e.currentTarget.parentNode.querySelectorAll('button').forEach((b) => b.classList.remove('ativo')); e.currentTarget.classList.add('ativo'); } } }, h('img', { src: foto(id), alt: '' })))) : null;
    const aviso = h('p', { class: 'erro', hidden: true });
    const tamanhos = h('div', { class: 'tamanhos' }, p.tamanhos.map((t) => h('button', { class: 'tam' + (t === tam ? ' ativo' : ''), type: 'button', on: { click: (e) => { tam = t; tamanhos.querySelectorAll('.tam').forEach((b) => b.classList.remove('ativo')); e.currentTarget.classList.add('ativo'); aviso.hidden = true; } } }, t)));
    const precisaTam = () => { if (!tam) { aviso.textContent = 'Escolha o tamanho primeiro.'; aviso.hidden = false; return false; } return true; };
    const ehCalcado = p.categoria === 'calcados';
    const combina = D.produtos.filter((x) => x.id !== p.id && (x.categoria !== p.categoria)).sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0)).slice(0, 4);

    $('#produto').append(
      h('nav', { class: 'migalha' }, [h('a', { href: 'index.html' }, 'Início'), ' / ', h('a', { href: 'index.html?c=' + c.slug + '#looks' }, c.nome || ''), ' / ', p.nome]),
      h('div', { class: 'produto' }, [
        h('div', { class: 'galeria', 'data-tinta': c.tinta }, [h('div', { class: 'galeria__principal' }, principal), mini]),
        h('div', {}, [
          h('span', { class: 'produto__cat' }, c.nome),
          h('h1', {}, p.nome),
          h('div', { class: 'produto__preco' }, [brl(p.preco), p.de ? h('s', {}, brl(p.de)) : null, p.de ? h('span', { class: 'promo' }, '-' + Math.round((1 - p.preco / p.de) * 100) + '%') : null]),
          h('p', { class: 'produto__ref' }, 'Preço de referência. O valor final é confirmado no WhatsApp ou no marketplace que você escolher.'),
          h('div', { class: 'produto__rotulo' }, [h('span', {}, ehCalcado ? 'Número' : 'Tamanho'), ehCalcado ? null : h('a', { class: 'link-mao', href: '#medidas' }, 'qual tamanho?')]),
          tamanhos, aviso,
          h('div', { class: 'produto__bts' }, [
            h('button', { class: 'bt bt--cheio', type: 'button', html: ICONE.paleta + ' Pôr na minha lista', on: { click: () => { if (precisaTam() && porNaLista(p.id, tam)) abrirLista(); } } }),
            h('button', { class: 'bt bt--zap bt--cheio', type: 'button', html: ICONE.zap + ' Pedir esta peça no Zap', on: { click: () => { if (precisaTam()) abrirZap('Olá, Aquarela! Quero ' + p.nome + ' no tamanho ' + tam + ' (' + brl(p.preco) + ' no site). Ainda tem?'); } } })
          ]),
          h('div', { class: 'onde' }, [h('h3', {}, 'Prefere comprar no app?'), h('div', { class: 'onde__bts' }, [
            h('a', { class: 'bt bt--shopee', href: linkShopee(p), target: '_blank', rel: 'noopener noreferrer', html: ICONE.shopee + ' Comprar na Shopee' }),
            h('a', { class: 'bt bt--ml', href: linkML(p), target: '_blank', rel: 'noopener noreferrer', html: ICONE.ml + ' Mercado Livre' })])]),
          h('details', { class: 'sanfona', id: 'medidas', open: !ehCalcado }, [h('summary', {}, 'Qual tamanho escolher?'), h('div', {}, [
            h('p', {}, 'Medidas do corpo da criança, em centímetros. Ficou na dúvida? Manda a idade e a altura no Zap.'),
            h('table', { class: 'medidas' }, [h('tr', {}, ['Tamanho', 'Altura', 'Tórax', 'Cintura'].map((t) => h('th', {}, t))),
              ...[['4', '99–104', '56', '52'], ['6', '105–116', '60', '54'], ['8', '117–128', '64', '57'], ['10', '129–140', '68', '60']].map((l) => h('tr', {}, l.map((t) => h('td', {}, t))))])])]),
          h('details', { class: 'sanfona' }, [h('summary', {}, 'Como comprar'), h('div', {}, 'Ponha na sua lista e envie pelo WhatsApp, ou compre direto na Shopee ou no Mercado Livre. Sem cadastro e sem senha aqui no site.')]),
          h('details', { class: 'sanfona' }, [h('summary', {}, 'Retirada na loja'), h('div', {}, 'Combine pelo WhatsApp e retire na ' + L.endereco + '.')])
        ])
      ]),
      h('section', { class: 'secao' }, [h('div', { class: 'cab' }, h('div', {}, [h('span', { class: 'mao' }, 'combina com'), h('h2', {}, 'Monte o look')])), h('div', { class: 'grade' }, combina.map((x) => card(x)))])
    );
  }

  document.addEventListener('DOMContentLoaded', () => {
    montarTopo();
    const pg = document.body.dataset.pagina;
    if (pg === 'inicio') inicio();
    if (pg === 'produto') paginaProduto();
  });
})();
