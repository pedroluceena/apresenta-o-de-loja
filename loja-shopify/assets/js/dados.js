/* Aquarela Moda Infantil · vitrine (prévia DigitalWorks)
   Tudo que muda na loja fica aqui. No site final, os produtos podem vir de uma planilha do Google.

   PRODUTOS DE EXEMPLO: as fotos são de banco de imagens só para mostrar o layout.
   Serão trocadas pelas peças reais da Aquarela (Instagram / fotos da loja). */
window.AQUARELA = {
  loja: {
    nome: 'Aquarela Moda Infantil',
    whatsapp: '',                                            // A CONFIRMAR: 55 + DDD + número. Vazio = usa o link curto abaixo
    whatsappLink: 'https://wa.me/message/JXYMZCGY7Q5MN1',     // link do WhatsApp Business da bio do Instagram
    instagram: 'https://www.instagram.com/aquarelakids2019/',
    arroba: '@aquarelakids2019',
    seguidores: '11,5 mil',
    shopee: '',                                               // link da loja na Shopee, se ela tiver
    mercadoLivre: '',                                         // link da loja no Mercado Livre, se ela tiver
    endereco: 'Rua Velha, 348 – Rio das Pedras, Rio de Janeiro/RJ',
    mapa: 'Aquarela Moda Infantil, Rua Velha, 348 - Rio das Pedras, Rio de Janeiro - RJ',
    horario: 'Horários e novidades no Instagram',
    idades: 'de 4 a 10 anos'
  },

  // cor de cada categoria = uma tinta da paleta
  categorias: [
    { slug: 'vestidos', nome: 'Vestidos', tinta: 'rosa', foto: '1611003967145-fb3960072424' },
    { slug: 'conjuntos', nome: 'Conjuntos', tinta: 'azul', foto: '1759313560190-d160c3567170' },
    { slug: 'camisetas', nome: 'Camisetas', tinta: 'verde', foto: '1624523276755-4f11827d2386' },
    { slug: 'festa', nome: 'Festa', tinta: 'roxo', foto: '1578897367107-2828e351c8a8' },
    { slug: 'casacos', nome: 'Casacos', tinta: 'laranja', foto: '1695263747144-a52aa3739d62' },
    { slug: 'calcados', nome: 'Calçados', tinta: 'amarelo', foto: '1678192568478-9488ee55def6' }
  ],

  // shopee / ml: link EXATO do anúncio (regra nº 1 do manual). Na prévia, a busca do marketplace.
  produtos: [
    { id: 'vestido-floral-verde', nome: 'Vestido Floral Folhagem', categoria: 'vestidos', preco: 69.9, fotos: ['1700751616200-538519121c6b'], tamanhos: ['4', '6', '8', '10'], cores: ['#3a7d4f'], novidade: true, exemplo: true },
    { id: 'vestido-tule-estrelas', nome: 'Vestido Tule Estrelinhas', categoria: 'festa', preco: 119.9, de: 139.9, fotos: ['1759313560250-3bb4bc1d10bc', '1759313560255-0458c8f4e615'], tamanhos: ['4', '6', '8'], cores: ['#2c3e8f'], destaque: true, exemplo: true },
    { id: 'vestido-babados-vermelho', nome: 'Vestido Babados Vermelho', categoria: 'festa', preco: 149.9, fotos: ['1578897367107-2828e351c8a8', '1578897366846-358bb1c2412a'], tamanhos: ['4', '6', '8', '10'], cores: ['#c9252c'], destaque: true, exemplo: true },
    { id: 'vestido-amarelo-sol', nome: 'Vestido Amarelo Sol', categoria: 'vestidos', preco: 79.9, fotos: ['1611003967145-fb3960072424'], tamanhos: ['4', '6'], cores: ['#f2b51d'], novidade: true, exemplo: true },
    { id: 'vestido-flores-rosa', nome: 'Vestido Flores de Cerejeira', categoria: 'vestidos', preco: 74.9, fotos: ['1513791149369-f88da26c8e93'], tamanhos: ['4', '6', '8', '10'], cores: ['#f2849e'], exemplo: true },
    { id: 'camiseta-positive', nome: 'Camiseta Positive Vibes', categoria: 'camisetas', preco: 49.9, de: 59.9, fotos: ['1624523276755-4f11827d2386'], tamanhos: ['4', '6', '8', '10'], cores: ['#ffffff'], destaque: true, exemplo: true },
    { id: 'camiseta-moto', nome: 'Camiseta Moto Turquesa', categoria: 'camisetas', preco: 44.9, fotos: ['1786293424511-0ab6db8f7ac6'], tamanhos: ['4', '6', '8'], cores: ['#1aa6a6'], novidade: true, exemplo: true },
    { id: 'camiseta-listrada', nome: 'Camiseta Listrada Navy', categoria: 'camisetas', preco: 49.9, fotos: ['1625488134180-7e16a4fe6e12'], tamanhos: ['8', '10'], cores: ['#ffffff', '#c9252c'], exemplo: true },
    { id: 'conjunto-camisa-sarja', nome: 'Conjunto Camisa + Calça Sarja', categoria: 'conjuntos', preco: 129.9, fotos: ['1596392927852-2a18c336fb78'], tamanhos: ['4', '6', '8'], cores: ['#f4f1ea', '#b98a52'], destaque: true, exemplo: true },
    { id: 'camisa-xadrez', nome: 'Camisa Xadrez Manga Longa', categoria: 'conjuntos', preco: 79.9, fotos: ['1604303768345-038b79a8c47a'], tamanhos: ['4', '6', '8'], cores: ['#b3262d', '#24407a'], exemplo: true },
    { id: 'conjunto-esportivo', nome: 'Conjunto Esportivo Marinho', categoria: 'conjuntos', preco: 79.9, de: 99.9, fotos: ['1759313560190-d160c3567170'], tamanhos: ['4', '6', '8'], cores: ['#1f2f5c'], novidade: true, exemplo: true },
    { id: 'conjunto-skate', nome: 'Conjunto Skate Tie-Dye', categoria: 'conjuntos', preco: 109.9, fotos: ['1781369068097-32ba353516ec'], tamanhos: ['8', '10'], cores: ['#3fb3e0', '#e07ab8'], novidade: true, exemplo: true },
    { id: 'jaqueta-puffer', nome: 'Jaqueta Puffer Verde-Água', categoria: 'casacos', preco: 159.9, de: 189.9, fotos: ['1695263747144-a52aa3739d62'], tamanhos: ['4', '6', '8', '10'], cores: ['#1f8a8a'], exemplo: true },
    { id: 'jaqueta-sarja', nome: 'Jaqueta Sarja Bege', categoria: 'casacos', preco: 139.9, fotos: ['1758782213532-bbb5fd89885e'], tamanhos: ['4', '6', '8'], cores: ['#d8c3a0'], exemplo: true },
    { id: 'tenis-verde-agua', nome: 'Tênis Estrelinhas Verde-Água', categoria: 'calcados', preco: 89.9, fotos: ['1678192568478-9488ee55def6'], tamanhos: ['26', '28', '30', '32'], cores: ['#45c4b0'], exemplo: true },
    { id: 'tenis-cano-alto', nome: 'Tênis Cano Alto Rosa', categoria: 'calcados', preco: 84.9, fotos: ['1766129486324-2d8894484750'], tamanhos: ['26', '28', '30'], cores: ['#f2a5b8'], novidade: true, exemplo: true },
    { id: 'tenis-floral', nome: 'Tênis Floral Lilás', categoria: 'calcados', preco: 89.9, fotos: ['1624958797025-b119e2fa2b53'], tamanhos: ['28', '30', '32'], cores: ['#b9a3e3'], exemplo: true }
  ]
};
