/* =====================================================================
   ATLAS DA REPÚBLICA — script.js
   ---------------------------------------------------------------------
   Organização:
   1. DADOS        (eras, presidentes, períodos, constituições, estados,
                    curiosidades, vestibulares, quiz)
   2. UTILITÁRIOS  (datas, duração, iniciais, embaralhar)
   3. TELAS        (uma função render* por seção)
   4. ROTEADOR     (navegação por hash: #/presidente/vargas)
   5. INICIALIZAÇÃO

   Dica: para incluir uma foto, preencha o campo `foto` do presidente com
   a URL de uma imagem (ex.: Wikimedia Commons, observando a licença).
   Sem foto, o cartão mostra as iniciais.
   ===================================================================== */
"use strict";

/* =====================================================================
   1. DADOS
   ===================================================================== */

/* ---- Épocas históricas (também controlam o tema visual via data-era) ---- */
const ERAS = {
  primeira:  { nome: "Primeira República",  anos: "1889–1930",       icone: "📜" },
  vargas:    { nome: "Era Vargas",          anos: "1930–1945",       icone: "🏭" },
  populista: { nome: "República Populista", anos: "1946–1964",       icone: "🎙️" },
  militar:   { nome: "Regime Militar",      anos: "1964–1985",       icone: "🪖" },
  nova:      { nome: "Nova República",      anos: "1985–presente",   icone: "🗳️" }
};

/* ---- Presidentes ----
   mandatos: pares [início, fim] em AAAA-MM-DD; fim = null significa "em curso". */
const PRESIDENTES = [
  { id: "deodoro", nome: "Deodoro da Fonseca", nasc: 1827, uf: "AL", era: "primeira", partido: "Sem partido (militar)",
    mandatos: [["1889-11-15", "1891-11-23"]],
    bio: "Marechal que liderou o golpe militar que derrubou a monarquia e foi o primeiro chefe de Estado da República.",
    resumo: "Deodoro comandou o movimento de 15 de novembro de 1889 e chefiou o Governo Provisório. Eleito indiretamente pelo Congresso em 1891, entrou em choque com os parlamentares, dissolveu o Congresso e acabou renunciando semanas depois.",
    eventos: ["1889: Proclamação da República e banimento da família imperial", "1890: Separação entre Igreja e Estado e criação do casamento civil", "1891: Promulgação da primeira Constituição republicana", "Nov. 1891: Dissolução do Congresso e renúncia sob forte pressão política e militar"],
    economia: "Período do Encilhamento (1890–91): a política de crédito fácil do ministro Rui Barbosa gerou especulação na bolsa, inflação e falências. Moeda: mil-réis.",
    reformas: ["Constituição de 1891", "Separação entre Igreja e Estado", "Grande Naturalização de estrangeiros"],
    curiosidade: "Segundo relatos históricos, Deodoro era amigo pessoal de Dom Pedro II e só aderiu de vez à República nos últimos momentos do processo." },

  { id: "floriano", nome: "Floriano Peixoto", nasc: 1839, uf: "AL", era: "primeira", partido: "Sem partido (militar)",
    mandatos: [["1891-11-23", "1894-11-15"]],
    bio: "Vice de Deodoro, assumiu como o “Marechal de Ferro” e consolidou a República pela força.",
    resumo: "Assumiu após a renúncia de Deodoro e enfrentou a Revolta da Armada e a Revolução Federalista, que ameaçaram o novo regime. Seu governo fortaleceu o Exército e o Poder Executivo e ficou lembrado como o “consolidador da República”.",
    eventos: ["1892: Manifesto dos 13 generais pede novas eleições e é reprimido", "1893: Início da Revolução Federalista no Sul", "1893–94: Revolta da Armada na baía de Guanabara", "1894: Passagem do cargo a Prudente de Morais, o primeiro civil"],
    economia: "Herdou a crise do Encilhamento, com inflação alta e finanças públicas desorganizadas, agravadas pelos custos das revoltas. Moeda: mil-réis.",
    reformas: ["Consolidação do regime republicano", "Fortalecimento do Exército e da ordem interna"],
    curiosidade: "Floriano assumiu sem convocar novas eleições, embora a Constituição exigisse eleições se a vaga ocorresse antes de dois anos de mandato — o que motivou o Manifesto dos 13 Generais." },

  { id: "prudente", nome: "Prudente de Morais", nasc: 1841, uf: "SP", era: "primeira", partido: "PRP (Partido Republicano Paulista)",
    mandatos: [["1894-11-15", "1898-11-15"]],
    bio: "Primeiro presidente civil, eleito pelo voto direto; pacificou o Sul e enfrentou Canudos.",
    resumo: "Primeiro presidente civil, ligado aos cafeicultores paulistas. Encerrou a Revolução Federalista, restabeleceu relações com Portugal e enfrentou a Guerra de Canudos, no sertão da Bahia.",
    eventos: ["1895: Fim da Revolução Federalista", "1896–97: Guerra de Canudos", "1897: Atentado em que morre o ministro da Guerra, marechal Bittencourt", "1898: Crise financeira leva ao Funding Loan, assinado ao fim do mandato"],
    economia: "Queda do preço do café, desvalorização do mil-réis e forte endividamento externo marcaram o período.",
    reformas: ["Pacificação do país após a Revolução Federalista", "Início do predomínio civil e das oligarquias cafeeiras"],
    curiosidade: "Prudente foi eleito pelo voto direto, mas menos de 3% da população votou, já que mulheres, analfabetos e outros grupos eram excluídos." },

  { id: "campos-sales", nome: "Campos Sales", nasc: 1841, uf: "SP", era: "primeira", partido: "PRP",
    mandatos: [["1898-11-15", "1902-11-15"]],
    bio: "Criou a “política dos governadores” e reorganizou as finanças com o Funding Loan.",
    resumo: "Buscou estabilidade política e financeira. Fechou acordo com os credores estrangeiros e criou o arranjo que garantia apoio do Congresso ao presidente em troca do apoio federal às oligarquias estaduais.",
    eventos: ["1898: Funding Loan refinancia a dívida externa", "1899: Consolidação da política dos governadores", "1900: Comemorações dos 400 anos do Descobrimento", "1900–02: Forte contenção de gastos"],
    economia: "Austeridade rígida do ministro Joaquim Murtinho: corte de gastos, aumento de impostos e retirada de papel-moeda de circulação para recuperar o crédito do país. Moeda: mil-réis.",
    reformas: ["Política dos governadores", "Funding Loan", "Mudança no regimento da Câmara sobre a verificação de poderes"],
    curiosidade: "O Funding Loan suspendeu por 13 anos o pagamento do principal da dívida externa, em troca de garantias como as rendas da alfândega." },

  { id: "rodrigues-alves", nome: "Rodrigues Alves", nasc: 1848, uf: "SP", era: "primeira", partido: "PRP",
    mandatos: [["1902-11-15", "1906-11-15"]],
    bio: "Modernizou o Rio de Janeiro e combateu a febre amarela com Oswaldo Cruz.",
    resumo: "Governou em período de estabilidade e crescimento. Promoveu a reforma urbana do Rio (Pereira Passos), o saneamento (Oswaldo Cruz) e a incorporação do Acre (Tratado de Petrópolis).",
    eventos: ["1903: Tratado de Petrópolis incorpora o Acre ao Brasil", "1903–06: Reforma urbana do Rio (“bota-abaixo”)", "1904: Revolta da Vacina", "1906: Convênio de Taubaté para sustentar o preço do café"],
    economia: "O café dominava as exportações. O Convênio de Taubaté criou a política de valorização, com o governo comprando excedentes. Moeda: mil-réis.",
    reformas: ["Saneamento do Rio e combate à febre amarela", "Abertura da Avenida Central e reforma do porto", "Incorporação do Acre"],
    curiosidade: "Eleito para um segundo mandato em 1918, morreu em janeiro de 1919, vítima da gripe espanhola, antes de tomar posse." },

  { id: "afonso-pena", nome: "Afonso Pena", nasc: 1847, uf: "MG", era: "primeira", partido: "PRM (Partido Republicano Mineiro)",
    mandatos: [["1906-11-15", "1909-06-14"]],
    bio: "Mineiro que incentivou ferrovias, imigração e o Exército; morreu no cargo.",
    resumo: "Deu continuidade à política do café e investiu em ferrovias, imigração e telégrafos. Instituiu o serviço militar por sorteio. Morreu em 1909, em meio à disputa sucessória.",
    eventos: ["1907: Criação da Comissão Rondon", "1908: Lei do Sorteio Militar", "1908: Exposição Nacional no Rio de Janeiro", "1909: Morte do presidente e posse do vice, Nilo Peçanha"],
    economia: "Auge do ciclo do café, com estímulo à imigração e às ferrovias. A Caixa de Conversão (1906) buscou estabilizar o câmbio. Moeda: mil-réis.",
    reformas: ["Caixa de Conversão (1906)", "Serviço militar por sorteio", "Expansão ferroviária e telegráfica"],
    curiosidade: "Foi o primeiro presidente a morrer no exercício do cargo: faleceu em 14 de junho de 1909." },

  { id: "nilo", nome: "Nilo Peçanha", nasc: 1867, uf: "RJ", era: "primeira", partido: "PRF (Partido Republicano Fluminense)",
    mandatos: [["1909-06-14", "1910-11-15"]],
    bio: "Vice que assumiu após a morte de Afonso Pena; criou o Serviço de Proteção aos Índios.",
    resumo: "Governou por cerca de 17 meses e conduziu uma sucessão tumultuada, com a Campanha Civilista de Rui Barbosa contra o marechal Hermes da Fonseca. Criou o SPI e as escolas de ensino técnico.",
    eventos: ["1909: Criação das escolas de aprendizes artífices", "1909: Criação do Ministério da Agricultura, Indústria e Comércio", "1910: Criação do Serviço de Proteção aos Índios (SPI)", "1910: Campanha Civilista disputa a presidência"],
    economia: "Estímulo à indústria e ao ensino técnico em meio à forte dependência do café. Moeda: mil-réis.",
    reformas: ["Escolas de aprendizes artífices", "Serviço de Proteção aos Índios", "Ministério da Agricultura, Indústria e Comércio"],
    curiosidade: "Nilo era vice-presidente quando Afonso Pena morreu e governou por cerca de 17 meses." },

  { id: "hermes", nome: "Hermes da Fonseca", nasc: 1855, uf: "RS", era: "primeira", partido: "PRC (Partido Republicano Conservador)",
    mandatos: [["1910-11-15", "1914-11-15"]],
    bio: "Marechal eleito após a Campanha Civilista; enfrentou a Revolta da Chibata e o Contestado.",
    resumo: "Marechal e sobrinho de Deodoro, venceu Rui Barbosa em 1910. O governo foi marcado por revoltas: a da Chibata, a Guerra do Contestado e as chamadas “salvações” nos estados.",
    eventos: ["1910: Revolta da Chibata, liderada por João Cândido", "1911–12: Política das “salvações” nos estados", "1912: Início da Guerra do Contestado", "1914: Primeiros efeitos da Primeira Guerra Mundial"],
    economia: "Crise da borracha amazônica diante da concorrência asiática e queda do café ao final do governo. Moeda: mil-réis.",
    reformas: ["Modernização do Exército", "Intervenções federais nos estados (“salvações”)"],
    curiosidade: "Em 1914, a primeira-dama Nair de Teffé tocou ao violão “Corta-Jaca”, de Chiquinha Gonzaga, no Palácio do Catete, o que escandalizou parte da elite." },

  { id: "venceslau", nome: "Venceslau Brás", nasc: 1868, uf: "MG", era: "primeira", partido: "PRM",
    mandatos: [["1914-11-15", "1918-11-15"]],
    bio: "Governou durante a Primeira Guerra Mundial e declarou guerra à Alemanha em 1917.",
    resumo: "Governou em meio à Primeira Guerra Mundial, à greve geral de 1917 e à chegada da gripe espanhola. O Brasil abandonou a neutralidade em 1917, após ataques a navios mercantes.",
    eventos: ["1914: Brasil declara neutralidade na guerra", "1916: Sancionado o Código Civil", "1917: Greve geral em São Paulo e declaração de guerra à Alemanha", "1918: Gripe espanhola chega ao Brasil"],
    economia: "A guerra reduziu importações e estimulou a indústria nacional (substituição de importações), enquanto os preços de produtos básicos subiam. Moeda: mil-réis.",
    reformas: ["Código Civil de 1916", "Estímulo à indústria durante a guerra"],
    curiosidade: "O Brasil foi o único país sul-americano a entrar efetivamente na Primeira Guerra Mundial, enviando uma missão médica e uma divisão naval." },

  { id: "delfim", nome: "Delfim Moreira", nasc: 1868, uf: "MG", era: "primeira", partido: "PRM",
    mandatos: [["1918-11-15", "1919-07-28"]],
    bio: "Vice que governou interinamente após a doença e a morte do presidente eleito Rodrigues Alves.",
    resumo: "Assumiu porque Rodrigues Alves, eleito em 1918, adoeceu e não tomou posse. Governou durante a epidemia de gripe espanhola e convocou novas eleições, vencidas por Epitácio Pessoa.",
    eventos: ["1918: Epidemia de gripe espanhola", "1919: Morte de Rodrigues Alves e convocação de eleições", "1919: Eleição extraordinária de Epitácio Pessoa"],
    economia: "Fim da guerra e retomada das exportações; inflação e greves operárias marcaram o pós-guerra. Moeda: mil-réis.",
    reformas: ["Organização da eleição extraordinária de 1919", "Transição institucional após a morte do eleito"],
    curiosidade: "O mandato de Delfim Moreira durou menos de nove meses." },

  { id: "epitacio", nome: "Epitácio Pessoa", nasc: 1865, uf: "PB", era: "primeira", partido: "Alianças dos partidos republicanos estaduais",
    mandatos: [["1919-07-28", "1922-11-15"]],
    bio: "Paraibano e jurista, eleito em eleição extraordinária; governou em meio ao tenentismo.",
    resumo: "Assumiu em 1919 após eleição extraordinária. Seu governo viu o Centenário da Independência, a fundação do Partido Comunista e a Revolta dos 18 do Forte, primeiro sinal do tenentismo.",
    eventos: ["1920: Revogação do banimento da família imperial", "1922: Fundação do Partido Comunista do Brasil", "1922: Revolta dos 18 do Forte de Copacabana", "1922: Centenário da Independência e Semana de Arte Moderna"],
    economia: "Dependência do café e das exportações. Investiu em obras contra as secas no Nordeste, como açudes e ferrovias. Moeda: mil-réis.",
    reformas: ["Obras contra as secas no Nordeste", "Revogação do banimento da família imperial"],
    curiosidade: "Epitácio estava em Paris, como chefe da delegação brasileira na Conferência de Paz, quando foi eleito presidente." },

  { id: "bernardes", nome: "Artur Bernardes", nasc: 1875, uf: "MG", era: "primeira", partido: "PRM",
    mandatos: [["1922-11-15", "1926-11-15"]],
    bio: "Governou quase todo o mandato sob estado de sítio, enfrentando revoltas tenentistas.",
    resumo: "Teve um mandato turbulento: revoltas tenentistas (1924), a Coluna Prestes e estado de sítio quase permanente, com censura e repressão aos opositores.",
    eventos: ["1922: Posse sob estado de sítio", "1924: Revolta tenentista em São Paulo", "1925: Início da Coluna Prestes", "1926: Reforma constitucional restringe o habeas corpus"],
    economia: "Austeridade, queda do preço do café e endividamento externo; apoio à política de valorização do café. Moeda: mil-réis.",
    reformas: ["Reforma constitucional de 1926", "Políticas de austeridade fiscal"],
    curiosidade: "Sua candidatura foi atingida pelas “Cartas Falsas” de 1921, que o apresentavam insultando o Exército e foram depois provadas falsas." },

  { id: "washington", nome: "Washington Luís", nasc: 1869, uf: "RJ", era: "primeira", partido: "PRP",
    mandatos: [["1926-11-15", "1930-10-24"]],
    bio: "Último presidente da Primeira República; seu lema era “governar é abrir estradas”.",
    resumo: "Priorizou rodovias e a estabilidade monetária. Ao romper com Minas Gerais na sucessão e indicar Júlio Prestes, desencadeou a crise que levou à Revolução de 1930 e à sua deposição.",
    eventos: ["1926–27: Estabilização cambial e Caixa de Estabilização", "1928: Inauguração de rodovias como Rio–São Paulo e Rio–Petrópolis", "1929: Crise da Bolsa de Nova Iorque e queda do café", "1930: Eleição de Júlio Prestes, morte de João Pessoa e Revolução de 1930"],
    economia: "Plano de estabilização monetária com padrão-ouro. A crise de 1929 derrubou o preço do café e destruiu a base do sistema. Moeda: mil-réis.",
    reformas: ["Primeiras grandes rodovias pavimentadas", "Estabilização monetária (1926–27)"],
    curiosidade: "Deposto em 1930 e exilado, só voltou ao Brasil em 1947. Embora nascido em Macaé (RJ), fez a carreira política em São Paulo." },

  { id: "vargas", nome: "Getúlio Vargas", nasc: 1882, uf: "RS", era: "vargas", partido: "Sem partido (1930–45) · PTB (1951–54)",
    mandatos: [["1930-11-03", "1945-10-29"], ["1951-01-31", "1954-08-24"]],
    bio: "Governou mais de 18 anos em dois períodos: Governo Provisório, Estado Novo e mandato eleito.",
    resumo: "Chegou ao poder pela Revolução de 1930, governou de forma provisória e constitucional (1934–37) e ditatorial no Estado Novo (1937–45). Voltou pelo voto em 1951. Criou a legislação trabalhista, estatais e símbolos do nacional-desenvolvimentismo. Suicidou-se em 1954.",
    eventos: ["1930: Revolução e Governo Provisório", "1932: Revolução Constitucionalista paulista", "1937: Golpe do Estado Novo", "1943: Criação da CLT", "1953: Criação da Petrobras", "1954: Crise política e suicídio (24 de agosto)"],
    economia: "Industrialização por substituição de importações (CSN, Vale do Rio Doce), criação do salário mínimo (1940) e troca do mil-réis pelo cruzeiro (1942). Nos anos 1950: inflação em alta e crise cambial.",
    reformas: ["CLT e salário mínimo", "Voto feminino e Justiça Eleitoral", "CSN, Vale e Petrobras"],
    curiosidade: "Vargas é o presidente que mais tempo governou o Brasil: mais de 18 anos, sendo 15 consecutivos." },

  { id: "linhares", nome: "José Linhares", nasc: 1886, uf: "CE", era: "populista", partido: "Sem partido (presidente do STF)",
    mandatos: [["1945-10-29", "1946-01-31"]],
    bio: "Presidente do STF que comandou a transição após a queda de Vargas.",
    resumo: "Assumiu por ser presidente do Supremo, diante do vazio criado pela deposição de Vargas, e organizou as eleições de dezembro de 1945. É o único presidente do STF a ocupar a Presidência da República.",
    eventos: ["Out. 1945: Posse após a deposição de Vargas", "1945: Convocação da Assembleia Constituinte", "2 dez. 1945: Eleições gerais", "Jan. 1946: Transmissão do cargo a Dutra"],
    economia: "Governo de transição de poucos meses, sem grandes planos econômicos. O país vivia o pós-guerra, com inflação crescente. Moeda: cruzeiro.",
    reformas: ["Realização das eleições de 1945", "Organização da Constituinte"],
    curiosidade: "Ministro do STF, Linhares tornou-se por poucos meses chefe do Executivo e é até hoje o único presidente do Supremo a assumir a Presidência." },

  { id: "dutra", nome: "Eurico Gaspar Dutra", nasc: 1883, uf: "MT", era: "populista", partido: "PSD",
    mandatos: [["1946-01-31", "1951-01-31"]],
    bio: "General eleito com apoio de Vargas; promulgou a Constituição de 1946.",
    resumo: "Ex-ministro da Guerra de Vargas, venceu o brigadeiro Eduardo Gomes. Governou sob a Constituição de 1946, alinhou o país aos EUA na Guerra Fria, proibiu o jogo e cancelou o registro do Partido Comunista.",
    eventos: ["1946: Constituição democrática", "1946: Proibição dos jogos de azar", "1947: Cancelamento do registro do PCB", "1948: Plano SALTE", "1950: Copa do Mundo no Brasil e inauguração do Maracanã"],
    economia: "O consumo de importações no pós-guerra esgotou as reservas acumuladas. O governo lançou o Plano SALTE (saúde, alimentação, transporte, energia). Moeda: cruzeiro.",
    reformas: ["Constituição de 1946", "Plano SALTE", "Alinhamento aos EUA"],
    curiosidade: "Diz-se que a religiosa esposa, Carmela Dutra, influenciou a proibição dos cassinos, embora historiadores discutam o peso dessa influência." },

  { id: "cafe-filho", nome: "Café Filho", nasc: 1899, uf: "RN", era: "populista", partido: "PSP (Partido Social Progressista)",
    mandatos: [["1954-08-24", "1955-11-08"]],
    bio: "Vice de Vargas que assumiu após o suicídio e foi afastado por problemas de saúde.",
    resumo: "Assumiu em meio à crise do suicídio de Vargas e conduziu a eleição de 1955. Afastado por licença médica em novembro de 1955, foi impedido de reassumir pelo Congresso e pelo Exército, no “golpe preventivo” do general Lott.",
    eventos: ["Ago. 1954: Posse após a morte de Vargas", "1954: Política econômica ortodoxa de Eugênio Gudin", "Out. 1955: Eleição de JK e Jango", "Nov. 1955: Afastamento e impedimento"],
    economia: "Plano de estabilização ortodoxo do ministro Eugênio Gudin, com corte de crédito e gastos. A Instrução 113 da SUMOC (1955) facilitou investimentos estrangeiros. Moeda: cruzeiro.",
    reformas: ["Instrução 113 da SUMOC", "Ajuste fiscal ortodoxo"],
    curiosidade: "O Rio Grande do Norte só teve um presidente da República nascido no estado: Café Filho." },

  { id: "carlos-luz", nome: "Carlos Luz", nasc: 1894, uf: "MG", era: "populista", partido: "PSD",
    mandatos: [["1955-11-08", "1955-11-11"]],
    bio: "Presidente da Câmara que ocupou a Presidência por apenas 3 dias.",
    resumo: "Presidente da Câmara dos Deputados, assumiu quando Café Filho se afastou. Tentou punir o general Lott por um discurso político e acabou deposto pelo “golpe preventivo” de 11 de novembro, que garantiu a posse de JK.",
    eventos: ["8 nov. 1955: Posse como presidente interino", "10 nov.: Tentativa de afastar o ministro da Guerra, Lott", "11 nov.: Movimento de 11 de Novembro derruba Carlos Luz", "Carlos Luz refugia-se no cruzador Tamandaré"],
    economia: "Sem tempo para medidas econômicas; herdou a política de estabilização do governo anterior. Moeda: cruzeiro.",
    reformas: ["Nenhuma medida de destaque, pela brevidade do mandato"],
    curiosidade: "Carlos Luz tem o mandato presidencial mais curto da República: apenas três dias." },

  { id: "nereu", nome: "Nereu Ramos", nasc: 1888, uf: "SC", era: "populista", partido: "PSD",
    mandatos: [["1955-11-11", "1956-01-31"]],
    bio: "Vice-presidente do Senado que garantiu a posse de JK.",
    resumo: "Assumiu com o apoio do Exército e governou sob estado de sítio, transmitindo o cargo a Juscelino Kubitschek conforme o resultado da eleição de 1955.",
    eventos: ["Nov. 1955: Estado de sítio para garantir a posse", "Dez. 1955: Manutenção do general Lott no Ministério da Guerra", "Jan. 1956: Posse de JK e João Goulart"],
    economia: "Governo curto, sem mudanças econômicas relevantes. Moeda: cruzeiro.",
    reformas: ["Garantia da posse do presidente eleito"],
    curiosidade: "Nereu Ramos é o único catarinense a ter presidido o Brasil. Estava na linha sucessória como vice-presidente do Senado." },

  { id: "jk", nome: "Juscelino Kubitschek", nasc: 1902, uf: "MG", era: "populista", partido: "PSD (aliança com o PTB)",
    mandatos: [["1956-01-31", "1961-01-31"]],
    bio: "“50 anos em 5”: construiu Brasília e impulsionou a industrialização.",
    resumo: "Juscelino lançou o Plano de Metas, atraindo a indústria automobilística e investindo em energia e transporte, e construiu Brasília, inaugurada em 1960. Governou em clima de otimismo, com a Bossa Nova e o título mundial de 1958, mas deixou inflação e dívida externa.",
    eventos: ["1956: Lançamento do Plano de Metas", "1957: Início da produção automobilística nacional", "1958: Brasil conquista a primeira Copa do Mundo", "1960: Inauguração de Brasília (21 de abril)"],
    economia: "Crescimento acelerado, em torno de 7% ao ano, com entrada de capital estrangeiro, mas com inflação em alta e endividamento externo. Em 1959 rompeu negociações com o FMI. Moeda: cruzeiro.",
    reformas: ["Plano de Metas", "Criação da SUDENE (1959)", "Construção de Brasília"],
    curiosidade: "O lema “50 anos em 5” prometia avanço equivalente a meio século em um único mandato de cinco anos." },

  { id: "janio", nome: "Jânio Quadros", nasc: 1917, uf: "MS", era: "populista", partido: "PTN (apoio da UDN)",
    mandatos: [["1961-01-31", "1961-08-25"]],
    bio: "Eleito por larga margem com a “vassoura”, renunciou depois de 7 meses e abriu uma grave crise.",
    resumo: "Jânio, de estilo personalista e símbolo da “vassoura”, venceu com a maior votação até então. Adotou política externa independente e medidas de austeridade, mas renunciou em 25 de agosto de 1961, provocando a crise que levou ao parlamentarismo e, depois, ao golpe de 1964.",
    eventos: ["1961: Proibição das brigas de galo (polêmica)", "1961: Política externa independente; condecorou Che Guevara", "1961: Instrução 204 da SUMOC e austeridade", "25 ago. 1961: Renúncia"],
    economia: "Herdou inflação e dívida do governo anterior. Adotou austeridade e a Instrução 204 da SUMOC, que unificou o câmbio e eliminou subsídios. Moeda: cruzeiro.",
    reformas: ["Instrução 204 da SUMOC", "Política externa independente"],
    curiosidade: "Jânio governava por “bilhetinhos”: ordens curtas, escritas à mão, enviadas a ministros e funcionários. Nasceu em Campo Grande, então no Mato Grosso (hoje Mato Grosso do Sul)." },

  { id: "mazzilli", nome: "Ranieri Mazzilli", nasc: 1910, uf: "SP", era: "populista", partido: "PSD",
    mandatos: [["1961-08-25", "1961-09-07"], ["1964-04-02", "1964-04-15"]],
    bio: "Presidente da Câmara que assumiu interinamente duas vezes: em 1961 e em 1964.",
    resumo: "Como presidente da Câmara, assumiu interinamente com a renúncia de Jânio (1961) e novamente após a deposição de Jango (1964), entre 2 e 15 de abril.",
    eventos: ["Ago. 1961: Veto militar à posse de Jango", "Ago.–set. 1961: Campanha da Legalidade, liderada por Brizola", "Set. 1961: Emenda do parlamentarismo", "Abr. 1964: Segunda interinidade, após o golpe"],
    economia: "Interinidades curtas, sem política econômica própria. Inflação em alta. Moeda: cruzeiro.",
    reformas: ["Mediação institucional da crise de 1961"],
    curiosidade: "Mazzilli presidiu o Brasil duas vezes, ambas por 13 dias: de 25/8 a 7/9 de 1961 e de 2 a 15/4 de 1964." },

  { id: "jango", nome: "João Goulart", nasc: 1918, uf: "RS", era: "populista", partido: "PTB",
    mandatos: [["1961-09-07", "1964-04-02"]],
    bio: "Herdeiro político de Vargas, defendeu as Reformas de Base e foi deposto em 1964.",
    resumo: "Assumiu sob regime parlamentarista; o presidencialismo foi restaurado em plebiscito (1963). Defendeu as Reformas de Base (agrária, urbana, educacional) em meio à crescente polarização. Foi deposto no golpe de 31 de março/1º de abril de 1964.",
    eventos: ["1961: Posse sob o parlamentarismo", "1962: Criação do 13º salário", "1963: Plebiscito restabelece o presidencialismo", "1964: Comício da Central (13 de março) e golpe civil-militar"],
    economia: "Inflação em forte alta (acima de 70% em 1963), queda do crescimento e do investimento. O Plano Trienal, de Celso Furtado, não deu certo. Moeda: cruzeiro.",
    reformas: ["13º salário", "Estatuto do Trabalhador Rural", "Reformas de Base (propostas)"],
    curiosidade: "Jango estava em visita oficial à China quando Jânio renunciou." },

  { id: "castelo", nome: "Castelo Branco", nasc: 1897, uf: "CE", era: "militar", partido: "Sem partido (apoio da ARENA a partir de 1966)",
    mandatos: [["1964-04-15", "1967-03-15"]],
    bio: "Primeiro presidente do regime militar; editou os primeiros atos institucionais.",
    resumo: "Eleito pelo Congresso sob pressão militar, instaurou o regime com o AI-1, extinguiu os partidos (AI-2) e implantou o PAEG, programa de estabilização. Em 1967, deixou nova Constituição.",
    eventos: ["1964: AI-1 e cassações", "1964: Criação do SNI e do BNH", "1965: AI-2 e bipartidarismo (ARENA e MDB)", "1966–67: Criação do FGTS e nova Constituição"],
    economia: "PAEG: combate à inflação com arrocho salarial, reforma tributária e financeira, criação do Banco Central (1964–65), do FGTS e do BNH. Moeda: cruzeiro.",
    reformas: ["PAEG", "Reforma tributária e Código Tributário Nacional", "Criação do Banco Central e do FGTS"],
    curiosidade: "Castelo Branco morreu em 1967, num acidente aéreo, poucos meses depois de deixar o cargo." },

  { id: "costa-e-silva", nome: "Costa e Silva", nasc: 1899, uf: "RS", era: "militar", partido: "ARENA",
    mandatos: [["1967-03-15", "1969-08-31"]],
    bio: "Governou até o AI-5; afastado por um AVC em 1969.",
    resumo: "Da chamada “linha dura”, assumiu em 1967 com a nova Constituição e enfrentou protestos estudantis, greves e a Passeata dos Cem Mil. Em dezembro de 1968, editou o AI-5, o mais duro ato do regime.",
    eventos: ["1967: Nova Constituição e Cruzeiro Novo", "1968: Protestos estudantis e Passeata dos Cem Mil", "13 dez. 1968: AI-5", "1969: Afastamento por AVC e Junta Militar"],
    economia: "Início do “milagre econômico” (1968): crescimento acelerado, com crédito e investimento. Moeda: cruzeiro novo (1967).",
    reformas: ["Constituição de 1967", "AI-5 e censura", "Lei de Imprensa e de Segurança Nacional"],
    curiosidade: "Após o AVC de agosto de 1969, o vice civil Pedro Aleixo foi impedido de assumir, e o poder passou a uma Junta Militar." },

  { id: "medici", nome: "Emílio Garrastazu Médici", nasc: 1905, uf: "RS", era: "militar", partido: "ARENA",
    mandatos: [["1969-10-30", "1974-03-15"]],
    bio: "Auge da repressão e do “milagre econômico”.",
    resumo: "Presidente do período mais repressivo da ditadura (os “anos de chumbo”), com forte censura, tortura e combate à luta armada. Ao mesmo tempo, o PIB crescia mais de 10% ao ano e o governo explorava a propaganda e a Copa de 1970.",
    eventos: ["1970: Tricampeonato mundial no México", "1970: Início da Transamazônica e do Mobral", "1972: Começa a Guerrilha do Araguaia", "1973: Primeira crise do petróleo"],
    economia: "“Milagre econômico” (1968–73): crescimento acima de 10% ao ano, com inflação controlada, mas aumento da concentração de renda e da dívida externa. Moeda: cruzeiro (1970).",
    reformas: ["Mobral", "Programa de Integração Nacional", "Ampliação do aparato repressivo"],
    curiosidade: "O slogan “Brasil: ame-o ou deixe-o” marcou a propaganda do período." },

  { id: "geisel", nome: "Ernesto Geisel", nasc: 1907, uf: "RS", era: "militar", partido: "ARENA",
    mandatos: [["1974-03-15", "1979-03-15"]],
    bio: "Iniciou a distensão política “lenta, gradual e segura”.",
    resumo: "General de perfil nacionalista, iniciou a distensão política, mas manteve a repressão e usou o “Pacote de Abril” (1977) para controlar o Congresso. Em 1978, revogou o AI-5 (efetivo em 1979).",
    eventos: ["1974: MDB vence as eleições para o Senado", "1975: Assassinato do jornalista Vladimir Herzog", "1977: Pacote de Abril fecha o Congresso", "1978: Fim do AI-5 (em vigor em 1979)"],
    economia: "Diante da crise do petróleo, lançou o II PND, com investimentos em energia, siderurgia e o Proálcool. A dívida externa cresceu e a inflação subiu. Moeda: cruzeiro.",
    reformas: ["II PND", "Proálcool (1975)", "Acordo nuclear com a Alemanha"],
    curiosidade: "Geisel presidiu a Petrobras (1969–73) antes de chegar à Presidência." },

  { id: "figueiredo", nome: "João Figueiredo", nasc: 1918, uf: "RJ", era: "militar", partido: "ARENA / PDS",
    mandatos: [["1979-03-15", "1985-03-15"]],
    bio: "Último general-presidente; sancionou a Anistia e acompanhou o fim do regime.",
    resumo: "Governou o fim do regime. Sancionou a Anistia (1979), reformou o sistema partidário e viu o país afundar na crise da dívida e na inflação. A campanha das Diretas Já e a eleição indireta de Tancredo marcaram a saída dos militares.",
    eventos: ["1979: Lei da Anistia e fim do bipartidarismo", "1981: Atentado do Riocentro", "1983–84: Campanha das Diretas Já", "1985: Eleição indireta de Tancredo Neves"],
    economia: "“Década perdida”: crise da dívida externa (1982), recessão, desemprego e inflação acima de 200% ao ano em 1983–85. Moeda: cruzeiro.",
    reformas: ["Lei da Anistia", "Pluripartidarismo", "Eleições diretas para governadores (1982)"],
    curiosidade: "Figueiredo recusou-se a passar a faixa a Sarney e deixou o Palácio pela porta dos fundos." },

  { id: "sarney", nome: "José Sarney", nasc: 1930, uf: "MA", era: "nova", partido: "PMDB",
    mandatos: [["1985-03-15", "1990-03-15"]],
    bio: "Vice de Tancredo; conduziu a transição democrática e a Constituinte.",
    resumo: "Assumiu após a morte de Tancredo Neves e presidiu a transição democrática, a Constituinte e a promulgação da Constituição de 1988. O governo foi marcado por planos econômicos fracassados e hiperinflação.",
    eventos: ["1985: Fim da censura e voto do analfabeto", "1986: Plano Cruzado", "1987–88: Assembleia Nacional Constituinte", "1988: Promulgação da Constituição Cidadã"],
    economia: "Vários planos (Cruzado, Bresser, Verão) tentaram conter a inflação, que passou de 80% ao mês no início de 1990. Moedas: cruzado (1986) e cruzado novo (1989).",
    reformas: ["Constituição de 1988", "Legalização dos partidos de esquerda", "Fim da censura prévia"],
    curiosidade: "Sarney é escritor e membro da Academia Brasileira de Letras desde 1980." },

  { id: "collor", nome: "Fernando Collor", nasc: 1949, uf: "RJ", era: "nova", partido: "PRN",
    mandatos: [["1990-03-15", "1992-12-29"]],
    bio: "Primeiro presidente eleito pelo voto direto após a ditadura; renunciou no processo de impeachment.",
    resumo: "Venceu Lula em 1989 com a imagem de “caçador de marajás”. Lançou o Plano Collor, abriu a economia e privatizou estatais, mas foi envolvido em denúncias de corrupção e, após as manifestações dos “caras-pintadas”, renunciou antes do julgamento no Senado.",
    eventos: ["1990: Plano Collor bloqueia poupanças", "1991: Mercosul (Tratado de Assunção)", "1992: Eco-92 no Rio de Janeiro", "1992: Impeachment e renúncia"],
    economia: "Bloqueio de depósitos, congelamento de preços, abertura comercial e privatizações. A inflação voltou a subir e o país entrou em recessão. Moeda: cruzeiro (1990).",
    reformas: ["Abertura comercial", "Programa Nacional de Desestatização", "Fim da reserva de mercado de informática"],
    curiosidade: "Collor é o presidente mais jovem a tomar posse: tinha 40 anos." },

  { id: "itamar", nome: "Itamar Franco", nasc: 1930, uf: "BA", era: "nova", partido: "Sem partido (governo de união)",
    mandatos: [["1992-12-29", "1995-01-01"]],
    bio: "Vice de Collor; em seu governo nasceu o Plano Real.",
    resumo: "Assumiu após o impeachment e formou um governo de união nacional. Em 1993, o plebiscito manteve a República e o presidencialismo; com Fernando Henrique Cardoso na Fazenda, lançou o Plano Real em 1994.",
    eventos: ["1993: Plebiscito mantém a República e o presidencialismo", "1993: Relançamento do Fusca", "1994: Lançamento do Real (1º de julho)", "1994: Brasil tetracampeão mundial"],
    economia: "Inflação superior a 2.000% ao ano em 1993. A URV e o Plano Real derrubaram a inflação nos anos seguintes. Moedas: cruzeiro real e, depois, real.",
    reformas: ["Plano Real", "Lei de Licitações (1993)"],
    curiosidade: "Itamar nasceu em alto-mar, a bordo de um navio na costa da Bahia — por isso o estado de nascimento consta como Bahia (Salvador)." },

  { id: "fhc", nome: "Fernando Henrique Cardoso", nasc: 1931, uf: "RJ", era: "nova", partido: "PSDB",
    mandatos: [["1995-01-01", "2003-01-01"]],
    bio: "Sociólogo; consolidou o Real, privatizou estatais e instituiu a reeleição.",
    resumo: "Eleito em 1994 e reeleito em 1998. Estabilizou a moeda, privatizou empresas como Telebras e Vale, aprovou a Lei de Responsabilidade Fiscal e a emenda da reeleição. Enfrentou crises cambiais e o apagão de 2001.",
    eventos: ["1997: Emenda da reeleição", "1998: Privatização do Sistema Telebras", "1999: Câmbio flutuante e metas de inflação", "2000: Lei de Responsabilidade Fiscal"],
    economia: "Estabilidade monetária e inflação de um dígito, mas crises externas (Ásia 1997, Rússia 1998), desvalorização do real em 1999 e crescimento modesto. Moeda: real.",
    reformas: ["Reeleição (EC 16/1997)", "Lei de Responsabilidade Fiscal", "Privatizações e agências reguladoras", "Lei dos Genéricos (1999)"],
    curiosidade: "FHC foi o primeiro presidente reeleito para um mandato consecutivo na história do país." },

  { id: "lula", nome: "Luiz Inácio Lula da Silva", nasc: 1945, uf: "PE", era: "nova", partido: "PT",
    mandatos: [["2003-01-01", "2011-01-01"], ["2023-01-01", null]],
    bio: "Ex-metalúrgico e sindicalista, presidente em três mandatos.",
    resumo: "Fundador do PT, foi eleito em 2002 e reeleito em 2006, com programas como o Bolsa Família e aumento real do salário mínimo, em meio ao boom das commodities. Voltou ao Planalto em 2023, após derrotar Bolsonaro em eleição acirrada.",
    eventos: ["2003: Criação do Bolsa Família", "2005: Crise do Mensalão", "2008–09: Resposta à crise financeira global", "2023: Terceiro mandato e ataques de 8 de janeiro"],
    economia: "Nos dois primeiros mandatos: crescimento médio perto de 4% ao ano, alta das commodities, redução da pobreza e do desemprego. No terceiro: retomada de programas sociais e debate sobre o arcabouço fiscal. Moeda: real.",
    reformas: ["Bolsa Família", "Prouni e expansão das universidades federais", "Arcabouço fiscal e reforma tributária (EC 132/2023)"],
    curiosidade: "Lula é o único presidente eleito três vezes pelo voto direto e o primeiro de origem operária." },

  { id: "dilma", nome: "Dilma Rousseff", nasc: 1947, uf: "MG", era: "nova", partido: "PT",
    mandatos: [["2011-01-01", "2016-08-31"]],
    bio: "Primeira mulher presidente; sofreu impeachment em 2016.",
    resumo: "Ex-ministra de Lula, foi eleita em 2010 e reeleita em 2014. Instalou a Comissão Nacional da Verdade, ampliou programas como o Minha Casa, Minha Vida e sancionou a Lei de Cotas, mas enfrentou recessão, a Lava Jato e as manifestações de 2013. Foi afastada por impeachment.",
    eventos: ["2011: Programa Brasil Sem Miséria", "2012: Lei de Cotas e Comissão Nacional da Verdade", "2013: Protestos de junho", "2016: Impeachment (31 de agosto)"],
    economia: "Desaceleração, inflação mais alta, polêmica das “pedaladas fiscais” e recessão profunda em 2015–16, com queda do PIB em torno de 3,5% ao ano. Moeda: real.",
    reformas: ["Lei de Cotas (2012)", "Comissão Nacional da Verdade", "Marco Civil da Internet (2014)"],
    curiosidade: "Dilma foi presa e torturada durante a ditadura, quando integrava grupos de luta armada." },

  { id: "temer", nome: "Michel Temer", nasc: 1940, uf: "SP", era: "nova", partido: "MDB",
    mandatos: [["2016-08-31", "2019-01-01"]],
    bio: "Vice de Dilma; aprovou o teto de gastos e a reforma trabalhista.",
    resumo: "Assumiu interinamente em maio de 2016 e em definitivo em agosto. Aprovou o teto de gastos (EC 95/2016) e a reforma trabalhista (2017), enfrentou denúncias e a greve dos caminhoneiros (2018).",
    eventos: ["2016: Teto de gastos", "2017: Reforma trabalhista", "2017: Câmara barra denúncias da PGR", "2018: Greve dos caminhoneiros e intervenção federal no Rio"],
    economia: "Saída da recessão com crescimento tímido (cerca de 1% ao ano), inflação e juros em queda, mas com desemprego alto. Moeda: real.",
    reformas: ["Teto de gastos (EC 95)", "Reforma trabalhista", "Novo Ensino Médio (Lei 13.415/2017)"],
    curiosidade: "Temer é autor de livros de Direito Constitucional e de um livro de poemas, “Anônima Intimidade” (2012)." },

  { id: "bolsonaro", nome: "Jair Bolsonaro", nasc: 1955, uf: "SP", era: "nova", partido: "PSL → sem partido → PL",
    mandatos: [["2019-01-01", "2023-01-01"]],
    bio: "Capitão reformado e ex-deputado; primeiro presidente a perder a reeleição.",
    resumo: "Eleito em 2018 com pauta anticorrupção e conservadora. Aprovou a reforma da Previdência (2019), enfrentou a pandemia de Covid-19 e instituiu o auxílio emergencial. Em 2022, perdeu a reeleição para Lula.",
    eventos: ["2019: Reforma da Previdência", "2020: Pandemia de Covid-19 e auxílio emergencial", "2021: CPI da Covid", "2022: Derrota na tentativa de reeleição"],
    economia: "Pandemia: o PIB caiu cerca de 3,3% em 2020 e se recuperou em 2021. A inflação subiu (IPCA de 10,1% em 2021) e o câmbio se desvalorizou. Moeda: real.",
    reformas: ["Reforma da Previdência (EC 103/2019)", "Lei da Liberdade Econômica (2019)", "Autonomia do Banco Central (2021)"],
    curiosidade: "Bolsonaro foi o primeiro presidente a não conseguir se reeleger desde a criação da reeleição, em 1997." }
];

/* ---- Períodos históricos ---- */
const PERIODOS = {
  primeira: {
    intro: "Do golpe militar que derrubou o Império até a Revolução de 1930. Também chamada de República Velha, foi dominada pelas elites agrárias.",
    politico: "República federativa e presidencialista, com voto aberto e restrito. A “política dos governadores” (Campos Sales) e o revezamento entre São Paulo e Minas Gerais (“café com leite”) garantiam o poder das oligarquias. Coronelismo, fraude eleitoral e “voto de cabresto” eram comuns.",
    economico: "Economia agroexportadora baseada no café, com o ciclo da borracha na Amazônia. Valorização artificial do preço do café (Convênio de Taubaté) e início da industrialização em São Paulo e no Rio. Moeda: mil-réis.",
    social: "O fim da escravidão (1888) não veio acompanhado de políticas de inclusão. Imigração europeia, urbanização e greves operárias (1917). Revoltas populares: Canudos, Contestado, Vacina e Chibata.",
    marcos: [[1889, "Proclamação da República em 15 de novembro"], [1891, "Primeira Constituição republicana"], [1897, "Destruição de Canudos"], [1904, "Revolta da Vacina no Rio de Janeiro"], [1922, "Semana de Arte Moderna, Tenentismo e fundação do PCB"], [1930, "Crise do café, eleição de Júlio Prestes e Revolução de 1930"]]
  },
  vargas: {
    intro: "Quinze anos de poder centralizado de Getúlio Vargas, do Governo Provisório ao Estado Novo.",
    politico: "Governo Provisório (1930–34), governo constitucional (1934–37) e Estado Novo (1937–45), com censura e propaganda do DIP. O poder se centralizou na União, com interventores nos estados. Foram criadas a Justiça Eleitoral e a Justiça do Trabalho.",
    economico: "Industrialização por substituição de importações, com a CSN e a Vale. Criação do salário mínimo (1940) e troca do mil-réis pelo cruzeiro (1942). A crise de 1929 derrubou o café.",
    social: "CLT e sindicatos ligados ao Estado, voto feminino (1932), expansão da educação e da saúde, culto à imagem de Vargas (“pai dos pobres”) e forte repressão a comunistas e opositores.",
    marcos: [[1930, "Revolução de 1930 leva Vargas ao poder"], [1932, "Revolução Constitucionalista em São Paulo"], [1934, "Nova Constituição e voto feminino"], [1937, "Golpe do Estado Novo e Constituição de 1937"], [1943, "Consolidação das Leis do Trabalho (CLT)"], [1945, "Fim do Estado Novo: Vargas é deposto"]]
  },
  populista: {
    intro: "A redemocratização trouxe eleições diretas, partidos nacionais e líderes de forte apelo popular.",
    politico: "Constituição de 1946, pluripartidarismo (PSD, UDN, PTB) e disputa entre nacionalistas e liberais. Crises sucessivas: suicídio de Vargas (1954), “golpe preventivo” de 1955 e renúncia de Jânio (1961).",
    economico: "Nacional-desenvolvimentismo: Petrobras, Plano de Metas e indústria automobilística. Em contrapartida, aumentaram a inflação e a dívida externa. Moeda: cruzeiro.",
    social: "Urbanização acelerada, migração do Nordeste para o Sudeste, expansão do rádio e da TV, Bossa Nova, Cinema Novo, Ligas Camponesas e mobilização estudantil e sindical.",
    marcos: [[1946, "Constituição democrática"], [1953, "Criação da Petrobras"], [1954, "Suicídio de Vargas"], [1958, "Primeira Copa do Mundo"], [1960, "Inauguração de Brasília"], [1961, "Renúncia de Jânio e crise da posse de Jango"]]
  },
  militar: {
    intro: "Vinte e um anos de governos militares, com bipartidarismo, censura e eleições indiretas para a presidência.",
    politico: "Atos Institucionais, cassações, ARENA e MDB, censura e AI-5 (1968). A abertura “lenta, gradual e segura” começou com Geisel e terminou com a eleição indireta de 1985.",
    economico: "PAEG e depois o “milagre econômico” (1968–73), com crescimento alto e concentração de renda. Endividamento externo, choques do petróleo e inflação levaram à “década perdida” dos anos 1980.",
    social: "Repressão, tortura e desaparecimentos políticos; a Comissão Nacional da Verdade (2014) reconheceu 434 mortos e desaparecidos. Resistência cultural (Tropicália, MPB), movimento estudantil, greves do ABC e Diretas Já.",
    marcos: [[1964, "Golpe civil-militar e AI-1"], [1968, "Passeata dos Cem Mil e AI-5"], [1970, "Tricampeonato e auge do milagre econômico"], [1979, "Lei da Anistia"], [1984, "Campanha das Diretas Já"], [1985, "Fim do ciclo de presidentes militares"]]
  },
  nova: {
    intro: "Da redemocratização aos dias atuais: eleições diretas, Constituição Cidadã e consolidação das instituições.",
    politico: "Constituição de 1988, eleições diretas e alternância de poder entre diferentes forças políticas. Dois impeachments (1992 e 2016), reeleição desde 1997 e crescente polarização.",
    economico: "Hiperinflação nos anos 1980–90, Plano Real (1994), metas de inflação e câmbio flutuante, boom das commodities nos anos 2000, recessão de 2014–16 e choque da pandemia. Moeda: real.",
    social: "Criação do SUS, programas de transferência de renda, políticas de cotas, protestos de 2013, expansão da internet e das redes sociais e debate sobre desigualdade e segurança pública.",
    marcos: [[1985, "Posse de Sarney após a morte de Tancredo"], [1988, "Promulgação da Constituição Cidadã"], [1994, "Plano Real"], [2002, "Eleição de Lula"], [2016, "Impeachment de Dilma Rousseff"], [2023, "Ataques de 8 de janeiro em Brasília"]]
  }
};

/* ---- Linha do tempo horizontal da página inicial ---- */
const TIMELINE = [
  [1889, "Proclamação da República", "primeira"], [1891, "1ª Constituição republicana", "primeira"],
  [1897, "Guerra de Canudos", "primeira"], [1904, "Revolta da Vacina", "primeira"],
  [1922, "Semana de Arte Moderna e Tenentismo", "primeira"], [1930, "Revolução de 1930", "vargas"],
  [1932, "Revolução Constitucionalista", "vargas"], [1934, "Constituição de 1934", "vargas"],
  [1937, "Estado Novo", "vargas"], [1943, "CLT", "vargas"], [1945, "Fim do Estado Novo", "vargas"],
  [1946, "Constituição de 1946", "populista"], [1954, "Morte de Vargas", "populista"],
  [1960, "Inauguração de Brasília", "populista"], [1964, "Golpe civil-militar", "militar"],
  [1968, "AI-5", "militar"], [1979, "Lei da Anistia", "militar"], [1984, "Diretas Já", "militar"],
  [1985, "Fim da ditadura", "nova"], [1988, "Constituição Cidadã", "nova"], [1994, "Plano Real", "nova"],
  [2016, "Impeachment de Dilma", "nova"], [2023, "Ataques de 8 de janeiro", "nova"]
];

/* ---- Constituições ---- */
const CONSTITUICOES = [
  { ano: 1891, nome: "Constituição de 1891", tipo: "Promulgada", era: "primeira",
    contexto: "Elaborada por um Congresso Constituinte logo após a Proclamação da República, com forte influência do modelo dos Estados Unidos e do jurista Rui Barbosa.",
    caracteristicas: ["República federativa e presidencialista", "Três Poderes (fim do Poder Moderador)", "Estado laico", "Antigas províncias viram estados, com ampla autonomia"],
    direitos: ["Voto direto para homens alfabetizados maiores de 21 anos", "Liberdade de culto e casamento civil", "Habeas corpus"],
    mudancas: ["Fim da monarquia e do voto censitário", "Separação entre Igreja e Estado", "Federalismo no lugar do Estado unitário"],
    curiosidades: ["Foi a primeira Constituição republicana e vigorou até a Revolução de 1930.", "Mulheres, analfabetos, soldados rasos e religiosos de ordens ficaram sem direito de voto."],
    comparacao: "Em relação à Constituição do Império (1824): acabaram o Poder Moderador, o catolicismo como religião oficial e a monarquia hereditária; o federalismo substituiu a centralização." },

  { ano: 1934, nome: "Constituição de 1934", tipo: "Promulgada", era: "vargas",
    contexto: "Resultado da Revolução de 1930 e da pressão da Revolução Constitucionalista de 1932. Inspirou-se na Constituição alemã de Weimar.",
    caracteristicas: ["Maior intervenção do Estado na economia", "Voto secreto e Justiça Eleitoral", "Mandato presidencial de 4 anos", "Eleição indireta do primeiro presidente (Vargas) pela Assembleia"],
    direitos: ["Voto feminino", "Direitos trabalhistas (jornada de 8 horas, salário mínimo, férias, repouso semanal)", "Criação da Justiça do Trabalho"],
    mudancas: ["Entrada dos direitos sociais no texto constitucional", "Maior poder da União", "Voto secreto e feminino"],
    curiosidades: ["Durou apenas três anos, até o golpe de 1937.", "O voto feminino já havia sido instituído pelo Código Eleitoral de 1932."],
    comparacao: "Em relação à de 1891: manteve a federação, mas ampliou o papel do Estado e acrescentou direitos sociais, voto secreto e voto feminino." },

  { ano: 1937, nome: "Constituição de 1937 (“Polaca”)", tipo: "Outorgada", era: "vargas",
    contexto: "Imposta por Vargas em 10 de novembro de 1937, com o golpe que instalou o Estado Novo, sob o pretexto do falso “Plano Cohen”. Inspirou-se em modelos autoritários europeus, como a Constituição polonesa.",
    caracteristicas: ["Concentração de poderes no presidente", "Dissolução do Congresso e dos partidos", "Censura prévia", "Eleições suspensas"],
    direitos: ["Direitos individuais fortemente restringidos", "Manutenção e controle estatal da legislação trabalhista", "Previsão de pena de morte"],
    mudancas: ["Fim do federalismo efetivo, com interventores", "Fim das eleições", "Sindicatos ligados ao Estado"],
    curiosidades: ["Chamada de “Polaca” pela inspiração polonesa.", "Previa um plebiscito de aprovação que nunca foi realizado."],
    comparacao: "Em relação à de 1934: acabou com a separação efetiva de poderes, a autonomia dos estados e as liberdades civis, mantendo apenas parte dos direitos trabalhistas." },

  { ano: 1946, nome: "Constituição de 1946", tipo: "Promulgada", era: "populista",
    contexto: "Elaborada por uma Assembleia Constituinte eleita em 1945, após a queda de Vargas e o fim da Segunda Guerra Mundial.",
    caracteristicas: ["Redemocratização e pluripartidarismo", "Federalismo restabelecido", "Mandato presidencial de 5 anos", "Eleição direta para presidente"],
    direitos: ["Liberdades individuais e de expressão", "Direito de greve", "Manutenção dos direitos trabalhistas"],
    mudancas: ["Fim da censura e da ditadura do Estado Novo", "Retorno das eleições e dos partidos", "Função social da propriedade"],
    curiosidades: ["Analfabetos continuaram sem direito de voto.", "Foi sendo desfigurada pelos atos institucionais após 1964."],
    comparacao: "Em relação à de 1937: restabeleceu a democracia, as eleições, os partidos e a separação de poderes. Em relação à de 1934, foi parecida, mas com menos intervencionismo econômico." },

  { ano: 1967, nome: "Constituição de 1967", tipo: "Aprovada sob ditadura", era: "militar",
    contexto: "Aprovada por um Congresso já controlado pelo regime militar, para dar forma legal à ordem instalada em 1964. Em 1969, a Emenda Constitucional nº 1, editada pela Junta Militar, mudou tanto o texto que é considerada uma nova Carta.",
    caracteristicas: ["Fortalecimento do Executivo", "Doutrina de segurança nacional", "Eleição indireta para presidente", "Bipartidarismo na prática"],
    direitos: ["Direitos formais mantidos, mas limitados pelos atos institucionais", "Direito de greve restringido", "Censura e cassações permitidas"],
    mudancas: ["Redução da autonomia dos estados e do Congresso", "Aumento do poder da União", "Institucionalização do regime militar"],
    curiosidades: ["O AI-5 (1968) suspendeu garantias e esvaziou o texto.", "Ficou em vigor até a Constituição de 1988."],
    comparacao: "Em relação à de 1946: manteve a forma democrática, mas centralizou o poder no Executivo, restringiu direitos e eliminou as eleições diretas para presidente." },

  { ano: 1988, nome: "Constituição de 1988 (“Cidadã”)", tipo: "Promulgada", era: "nova",
    contexto: "Fruto da Assembleia Nacional Constituinte de 1987–88, presidida por Ulysses Guimarães, que a chamou de “Constituição Cidadã”. Foi promulgada em 5 de outubro de 1988.",
    caracteristicas: ["Democracia, pluripartidarismo e eleições diretas", "Federalismo com municípios como entes federativos", "Cláusulas pétreas", "Mandato presidencial inicialmente de 5 anos, depois reduzido para 4 (1994) e com reeleição (1997)"],
    direitos: ["Voto facultativo a analfabetos e a jovens de 16 e 17 anos", "SUS e seguridade social", "Racismo como crime inafiançável e imprescritível", "Habeas data e mandado de injunção"],
    mudancas: ["Ampliou direitos sociais e coletivos", "Reconheceu direitos de povos indígenas e quilombolas", "Fortaleceu o Ministério Público e o Judiciário", "Fim da censura"],
    curiosidades: ["É a Constituição mais longa e duradoura da era republicana recente.", "Já recebeu mais de 130 emendas."],
    comparacao: "Em relação à de 1967: restaurou plenamente a democracia, ampliou muito os direitos individuais e sociais e limitou o poder do Executivo." }
];

/* ---- Estados (mapa em formato de cartograma) ----
   r = região (N, NE, CO, SE, S); pos = [linha, coluna] na grade */
const STATES = {
  RR: { n: "Roraima", r: "N", pos: [1, 3], p: "Estado criado em 1988; antes, território federal. Peso eleitoral pequeno, mas protagonista em debates sobre terras indígenas.", e: ["1988: Transformação do território em estado", "2005–2009: Demarcação da Terra Indígena Raposa Serra do Sol"] },
  AP: { n: "Amapá", r: "N", pos: [1, 4], p: "Território federal desde 1943, tornou-se estado pela Constituição de 1988.", e: ["1943: Criação do Território Federal do Amapá", "1988: Estadualização"] },
  AM: { n: "Amazonas", r: "N", pos: [2, 2], p: "Centro do ciclo da borracha na Primeira República e, desde 1967, sede da Zona Franca de Manaus.", e: ["1896: Inauguração do Teatro Amazonas", "1967: Criação da Zona Franca de Manaus"] },
  PA: { n: "Pará", r: "N", pos: [2, 3], p: "Belém foi polo da borracha. A região recebeu grandes projetos de integração durante o regime militar.", e: ["1960: Rodovia Belém–Brasília", "1980: Programa Grande Carajás", "1996: Massacre de Eldorado dos Carajás"] },
  MA: { n: "Maranhão", r: "NE", pos: [2, 4], p: "Berço de José Sarney, presidente de 1985 a 1990 e figura central da transição democrática.", e: ["1983: Criação do Centro de Lançamento de Alcântara", "1985–90: Sarney na Presidência"] },
  CE: { n: "Ceará", r: "NE", pos: [2, 5], p: "Estado natal de Castelo Branco e de José Linhares; palco de lideranças regionais como Padre Cícero.", e: ["1914: Sedição de Juazeiro", "1964–67: Castelo Branco na Presidência"] },
  RN: { n: "Rio Grande do Norte", r: "NE", pos: [2, 6], p: "Estado natal de Café Filho. Natal teve base americana na Segunda Guerra.", e: ["1935: A Intentona Comunista começa em Natal", "1954–55: Café Filho na Presidência"] },
  AC: { n: "Acre", r: "N", pos: [3, 1], p: "Território incorporado ao Brasil em 1903 e transformado em estado em 1962.", e: ["1899–1903: Revolução Acreana", "1903: Tratado de Petrópolis"] },
  RO: { n: "Rondônia", r: "N", pos: [3, 2], p: "Terra da Comissão Rondon e da ferrovia Madeira-Mamoré. Tornou-se estado em 1981–82.", e: ["1907–15: Comissão Rondon", "1912: Inauguração da ferrovia Madeira-Mamoré"] },
  MT: { n: "Mato Grosso", r: "CO", pos: [3, 3], p: "Estado natal de Eurico Gaspar Dutra. Foi alvo da “Marcha para o Oeste”.", e: ["1907: Linhas telegráficas da Comissão Rondon", "1946–51: Dutra na Presidência"] },
  TO: { n: "Tocantins", r: "N", pos: [3, 4], p: "Criado pela Constituição de 1988, por desmembramento de Goiás.", e: ["1988: Criação do estado", "1989: Fundação de Palmas"] },
  PI: { n: "Piauí", r: "NE", pos: [3, 5], p: "Nenhum presidente nasceu no estado. Mais recentemente, parte do cerrado entrou na fronteira agrícola conhecida como Matopiba.", e: ["1979: Criação do Parque Nacional Serra da Capivara", "1991: Reconhecimento pela UNESCO"] },
  PB: { n: "Paraíba", r: "NE", pos: [3, 6], p: "Estado natal de Epitácio Pessoa. O assassinato de João Pessoa, candidato a vice em 1930, foi estopim da Revolução de 1930.", e: ["1919–22: Epitácio Pessoa na Presidência", "1930: Assassinato de João Pessoa"] },
  MS: { n: "Mato Grosso do Sul", r: "CO", pos: [4, 3], p: "Criado em 1977 (instalado em 1979) pela divisão de Mato Grosso. Jânio Quadros nasceu em Campo Grande, quando a cidade ainda era mato-grossense.", e: ["1977: Divisão de Mato Grosso", "1961: Jânio Quadros na Presidência"] },
  GO: { n: "Goiás", r: "CO", pos: [4, 4], p: "Cedeu parte do território para o Distrito Federal. Goiânia foi planejada nos anos 1930 e simboliza a Marcha para o Oeste.", e: ["1933–42: Construção de Goiânia", "1960: Brasília inaugurada em território goiano"] },
  BA: { n: "Bahia", r: "NE", pos: [4, 5], p: "Terra da Guerra de Canudos e de Rui Barbosa, grande nome da Constituição de 1891. Itamar Franco consta como baiano (nascido em um navio).", e: ["1896–97: Guerra de Canudos", "1910: Campanha Civilista de Rui Barbosa"] },
  PE: { n: "Pernambuco", r: "NE", pos: [4, 6], p: "Estado natal de Lula e do governador Miguel Arraes, deposto em 1964.", e: ["1964: Prisão e exílio de Miguel Arraes", "2003–11 e 2023–: Lula na Presidência"] },
  AL: { n: "Alagoas", r: "NE", pos: [4, 7], p: "Berço dos dois primeiros presidentes: Deodoro da Fonseca e Floriano Peixoto. Collor foi governador do estado.", e: ["1889–94: Deodoro e Floriano na Presidência", "1987–89: Collor governa Alagoas"] },
  SP: { n: "São Paulo", r: "SE", pos: [5, 3], p: "Centro econômico da República e do Partido Republicano Paulista. Terra de vários presidentes e de movimentos como a Revolução de 1932 e as Diretas Já.", e: ["1917: Greve geral", "1932: Revolução Constitucionalista", "1978–80: Greves do ABC", "1984: Comícios das Diretas Já"] },
  DF: { n: "Distrito Federal", r: "CO", pos: [5, 4], p: "Capital federal desde 1960 e sede dos Três Poderes.", e: ["1960: Inauguração de Brasília", "2023: Ataques às sedes dos Três Poderes (8 de janeiro)"] },
  MG: { n: "Minas Gerais", r: "SE", pos: [5, 5], p: "Parceiro de São Paulo na “política do café com leite”. Deu vários presidentes, como Afonso Pena, Artur Bernardes, JK e Dilma.", e: ["1930: Aliança Liberal", "1964: O golpe começa com tropas saídas de Juiz de Fora"] },
  ES: { n: "Espírito Santo", r: "SE", pos: [5, 6], p: "Produtor de café na Primeira República e polo siderúrgico e portuário a partir dos anos 1980.", e: ["1983: Início da operação da CST (hoje ArcelorMittal Tubarão)"] },
  SE: { n: "Sergipe", r: "NE", pos: [5, 7], p: "Menor estado do país em área. Nenhum presidente nasceu em Sergipe.", e: ["Anos 1960: Descoberta do campo de petróleo de Carmópolis"] },
  PR: { n: "Paraná", r: "S", pos: [6, 3], p: "Palco, com Santa Catarina, da Guerra do Contestado. Curitiba foi sede da Operação Lava Jato.", e: ["1912–16: Guerra do Contestado", "2014: Início da Operação Lava Jato"] },
  RJ: { n: "Rio de Janeiro", r: "SE", pos: [6, 5], p: "Capital federal até 1960. Origem de presidentes como Nilo Peçanha, Figueiredo, Collor e FHC.", e: ["1904: Revolta da Vacina", "1910: Revolta da Chibata", "1922: Revolta dos 18 do Forte", "1992: Eco-92"] },
  SC: { n: "Santa Catarina", r: "S", pos: [7, 3], p: "Estado natal de Nereu Ramos, que garantiu a posse de JK em 1955.", e: ["1912–16: Guerra do Contestado", "1955–56: Nereu Ramos na Presidência"] },
  RS: { n: "Rio Grande do Sul", r: "S", pos: [8, 3], p: "Estado que mais deu presidentes: Vargas, Hermes da Fonseca, Jango, Costa e Silva, Médici e Geisel.", e: ["1923: Guerra civil gaúcha", "1930: Revolução liderada por Vargas", "1961: Campanha da Legalidade"] }
};
const REGIOES = { N: "Norte", NE: "Nordeste", CO: "Centro-Oeste", SE: "Sudeste", S: "Sul" };

/* ---- Curiosidades gerais (somadas às derivadas dos presidentes) ---- */
const CURIOSIDADES_BASE = [
  ["Presidentes", "Fernando Collor foi o presidente mais jovem a tomar posse: tinha 40 anos."],
  ["Presidentes", "Lula tinha 77 anos ao iniciar o terceiro mandato, em 2023, o mais velho a assumir a Presidência."],
  ["Presidentes", "Carlos Luz governou por apenas três dias, em novembro de 1955."],
  ["Presidentes", "Dilma Rousseff foi a primeira mulher a presidir o Brasil e foi reeleita em 2014."],
  ["Presidentes", "Getúlio Vargas governou por mais de 18 anos, em dois períodos."],
  ["Presidentes", "Ranieri Mazzilli assumiu a Presidência duas vezes, em 1961 e em 1964."],
  ["Presidentes", "José Linhares, presidente do STF, é o único ministro do Supremo a ter ocupado a Presidência."],
  ["Presidentes", "Afonso Pena foi o primeiro presidente a morrer no cargo, em 1909."],
  ["Presidentes", "O Rio Grande do Sul é o estado que mais deu presidentes à República."],
  ["Presidentes", "Itamar Franco nasceu em um navio, em alto-mar, na costa da Bahia."],
  ["Presidentes", "Jânio Quadros ficou conhecido pelos “bilhetinhos” com ordens curtas escritas à mão."],
  ["Presidentes", "Bolsonaro foi o primeiro presidente a perder uma tentativa de reeleição desde que ela foi criada, em 1997."],
  ["Presidentes", "Castelo Branco morreu em 1967, em um acidente aéreo, meses após deixar a Presidência."],
  ["Presidentes", "Sarney e Temer escreveram livros de poemas além de livros jurídicos e políticos."],
  ["Eleições", "Em 1955, Juscelino Kubitschek foi eleito com cerca de 36% dos votos, pois não havia segundo turno."],
  ["Eleições", "Tancredo Neves foi eleito pelo Colégio Eleitoral em 1985, mas foi internado na véspera da posse e morreu em 21 de abril, sem governar."],
  ["Eleições", "Júlio Prestes foi eleito presidente em 1930, mas não tomou posse por causa da Revolução de 1930."],
  ["Eleições", "O voto do analfabeto só foi permitido em 1985, e o voto aos 16 anos, em 1988."],
  ["Eleições", "Em 2022, Lula derrotou Bolsonaro com cerca de 50,9% dos votos válidos, uma das eleições mais apertadas desde a redemocratização."],
  ["Eleições", "O voto feminino foi instituído pelo Código Eleitoral de 1932, no governo Vargas."],
  ["Eleições", "Em 1894, Prudente de Morais foi o primeiro presidente eleito pelo voto direto, mas menos de 3% dos brasileiros votaram."],
  ["Eleições", "A emenda da reeleição foi aprovada em 1997, e FHC foi o primeiro presidente a ser reeleito em mandato consecutivo."],
  ["Crises", "Em 1891, Deodoro dissolveu o Congresso e acabou renunciando sob pressão."],
  ["Crises", "A Revolta da Vacina (1904) foi uma rebelião popular no Rio contra a vacinação obrigatória contra a varíola."],
  ["Crises", "A Revolta da Chibata (1910) pôs fim aos castigos corporais na Marinha, e foi liderada por João Cândido."],
  ["Crises", "A Coluna Prestes percorreu mais de 25 mil quilômetros pelo interior do Brasil entre 1925 e 1927."],
  ["Crises", "O suicídio de Vargas, em 24 de agosto de 1954, mudou o rumo da crise política da época."],
  ["Crises", "Em 1961, Jânio renunciou e os militares tentaram impedir a posse de Jango, o que levou à Campanha da Legalidade, liderada por Brizola."],
  ["Crises", "O Ato Institucional nº 5, de 13 de dezembro de 1968, suspendeu garantias constitucionais e fechou o Congresso."],
  ["Crises", "As Diretas Já reuniram multidões em 1984, mas a emenda que previa eleições diretas foi rejeitada na Câmara por poucos votos."],
  ["Crises", "Collor renunciou em 29 de dezembro de 1992, quando o Senado começava o julgamento do impeachment; mesmo assim, foi condenado e ficou inelegível por oito anos."],
  ["Crises", "Dilma Rousseff foi afastada em 31 de agosto de 2016, depois de votação no Senado."],
  ["Crises", "Em 8 de janeiro de 2023, as sedes dos Três Poderes, em Brasília, foram invadidas e depredadas."],
  ["Economia", "O Brasil teve oito padrões monetários entre 1942 e 1994; o Real foi o oitavo."],
  ["Economia", "O Plano Real entrou em circulação em 1º de julho de 1994."],
  ["Economia", "O Plano Collor bloqueou depósitos bancários e poupanças em março de 1990."],
  ["Economia", "Em 1993, a inflação passou de 2.000% ao ano."],
  ["Economia", "O Estado Novo e a CLT, de 1943, consolidaram a legislação trabalhista brasileira."],
  ["Economia", "O Convênio de Taubaté (1906) fez o governo comprar café para sustentar o preço."],
  ["Economia", "A Petrobras foi criada em 1953, com a campanha “O petróleo é nosso”."],
  ["Economia", "O “milagre econômico” (1968–73) trouxe crescimento acima de 10% ao ano, mas aumentou a desigualdade e a dívida externa."],
  ["Economia", "A Zona Franca de Manaus foi criada em 1967."],
  ["Constituições", "A Constituição de 1988 foi promulgada em 5 de outubro, e Ulysses Guimarães a chamou de “Cidadã”."],
  ["Constituições", "A Constituição de 1937 ficou conhecida como “Polaca” pela inspiração na Constituição autoritária da Polônia."],
  ["Constituições", "A Constituição de 1934 durou apenas três anos."],
  ["Constituições", "A Constituição de 1891 foi a primeira da República e adotou o federalismo."],
  ["Constituições", "A Constituição de 1946 foi aprovada após a queda de Vargas, mas os analfabetos continuaram sem votar."],
  ["Constituições", "A Constituição de 1988 criou o SUS e tornou o racismo crime inafiançável e imprescritível."],
  ["Constituições", "A Constituição de 1988 estabeleceu inicialmente mandatos presidenciais de 5 anos; o prazo caiu para 4 anos em 1994."],
  ["Cultura e sociedade", "A Semana de Arte Moderna, em fevereiro de 1922, foi realizada em São Paulo e inaugurou o modernismo brasileiro."],
  ["Cultura e sociedade", "Brasília foi inaugurada em 21 de abril de 1960 e mudou o centro do poder do país."],
  ["Cultura e sociedade", "A Lei Áurea (1888) antecedeu a República; o Brasil foi o último país das Américas a abolir a escravidão."],
  ["Cultura e sociedade", "O Brasil conquistou sua primeira Copa do Mundo em 1958, durante o governo JK."],
  ["Cultura e sociedade", "O Brasil sediou a Copa do Mundo de 1950 e perdeu a final no Maracanã, episódio conhecido como “Maracanaço”."],
  ["Cultura e sociedade", "Em 1993, um plebiscito manteve a República e o presidencialismo, com cerca de dois terços dos votos válidos."],
  ["Cultura e sociedade", "A Comissão Nacional da Verdade reconheceu 434 mortos e desaparecidos políticos da ditadura."],
  ["Cultura e sociedade", "O Brasil entrou na Primeira Guerra Mundial em 1917 e na Segunda Guerra Mundial em 1942, enviando a FEB à Itália em 1944."],
  ["Cultura e sociedade", "A capital do Brasil já foi Salvador, depois Rio de Janeiro e, desde 1960, Brasília."],
  ["Cultura e sociedade", "A Canudos de Antônio Conselheiro inspirou o livro “Os Sertões”, de Euclides da Cunha, publicado em 1902."]
];

/* ---- Vestibulares ----
   Aviso: reúne temas recorrentes em provas anteriores; confirme sempre nos editais e nas provas mais recentes. */
const VESTIBULARES = {
  ENEM: [
    ["Era Vargas e direitos trabalhistas", "Relacione CLT, populismo, propaganda (DIP) e construção da identidade nacional."],
    ["Ditadura militar: repressão, censura e cultura", "Comece pelo AI-5 e pelo “milagre econômico”; analise canções e charges como fontes."],
    ["Constituição de 1988 e cidadania", "Saiba direitos sociais, voto facultativo e instrumentos como habeas data."],
    ["Primeira República: coronelismo e voto de cabresto", "Entenda a política dos governadores e a exclusão de grupos sociais."],
    ["Movimentos sociais e Diretas Já", "Relacione participação popular e redemocratização."]
  ],
  FUVEST: [
    ["Primeira República: oligarquias e revoltas", "Política do café com leite, tenentismo, Canudos, Contestado e Revolta da Vacina."],
    ["Estado Novo e a Constituição de 1937", "Estude a centralização política, a censura e o corporativismo sindical."],
    ["Desenvolvimentismo de JK", "Plano de Metas, Brasília e as consequências econômicas."],
    ["Ditadura militar e milagre econômico", "Comparar crescimento, concentração de renda e endividamento."]
  ],
  UERJ: [
    ["Rio de Janeiro como capital republicana", "Reforma urbana, Revolta da Vacina, Chibata e 18 do Forte."],
    ["Era Vargas e as relações de trabalho", "Cobrança frequente de textos e imagens de época."],
    ["Ditadura militar e movimentos sociais", "Estudantes, imprensa e resistência cultural."],
    ["Constituição de 1988 e direitos", "Avance dos direitos sociais e da cidadania."]
  ],
  UNICAMP: [
    ["Primeira República e sociedade rural", "Canudos, Contestado e relações de poder no campo."],
    ["Trabalhismo e projeto nacional (Vargas)", "Leitura crítica de discursos e documentos."],
    ["Ditadura, censura e produção cultural", "Músicas, filmes e jornais como fontes históricas."],
    ["Redemocratização e direitos de cidadania", "Constituinte e participação política."]
  ]
};
const DATAS_RAPIDAS = [
  ["1889", "Proclamação da República"], ["1891", "Constituição republicana"], ["1930", "Revolução de 1930"],
  ["1937", "Estado Novo"], ["1945", "Fim do Estado Novo"], ["1946", "Constituição democrática"],
  ["1954", "Suicídio de Vargas"], ["1960", "Inauguração de Brasília"], ["1964", "Golpe civil-militar"],
  ["1968", "AI-5"], ["1979", "Lei da Anistia"], ["1985", "Fim da ditadura"],
  ["1988", "Constituição Cidadã"], ["1994", "Plano Real"], ["2016", "Impeachment de Dilma"]
];

/* ---- Quiz: c = resposta correta; w = respostas erradas (as opções são embaralhadas) ---- */
const QUIZ = [
  { cat: "Presidentes", q: "Quem foi o primeiro presidente do Brasil?", c: "Deodoro da Fonseca", w: ["Floriano Peixoto", "Prudente de Morais", "Getúlio Vargas"], exp: "Marechal Deodoro da Fonseca chefiou o Governo Provisório e foi o primeiro presidente da República." },
  { cat: "Presidentes", q: "Quem foi a primeira mulher a presidir o Brasil?", c: "Dilma Rousseff", w: ["Marina Silva", "Benedita da Silva", "Luiza Erundina"], exp: "Dilma foi eleita em 2010 e reeleita em 2014." },
  { cat: "Presidentes", q: "Qual presidente inaugurou Brasília, em 1960?", c: "Juscelino Kubitschek", w: ["Jânio Quadros", "Getúlio Vargas", "Eurico Dutra"], exp: "Brasília foi inaugurada em 21 de abril de 1960 por JK." },
  { cat: "Presidentes", q: "Qual presidente renunciou em 1961, depois de apenas cerca de 7 meses de governo?", c: "Jânio Quadros", w: ["João Goulart", "Café Filho", "Carlos Luz"], exp: "A renúncia de Jânio, em 25 de agosto de 1961, abriu uma grave crise política." },
  { cat: "Presidentes", q: "Quem era o presidente quando o Plano Real foi lançado, em 1994?", c: "Itamar Franco", w: ["Fernando Collor", "Fernando Henrique Cardoso", "José Sarney"], exp: "FHC era o ministro da Fazenda; o presidente era Itamar Franco." },
  { cat: "Constituições", q: "Qual Constituição é conhecida como “Constituição Cidadã”?", c: "A de 1988", w: ["A de 1946", "A de 1967", "A de 1934"], exp: "A expressão é de Ulysses Guimarães, presidente da Constituinte." },
  { cat: "Constituições", q: "Qual Constituição ficou conhecida como “Polaca”?", c: "A de 1937", w: ["A de 1891", "A de 1946", "A de 1988"], exp: "Foi outorgada por Vargas no início do Estado Novo e inspirada em modelo autoritário polonês." },
  { cat: "Constituições", q: "Qual foi a primeira Constituição republicana do Brasil?", c: "A de 1891", w: ["A de 1824", "A de 1934", "A de 1937"], exp: "A Constituição de 1824 era imperial; a de 1891 inaugurou a República." },
  { cat: "Constituições", q: "Qual Constituição criou a Justiça do Trabalho e consolidou o voto feminino?", c: "A de 1934", w: ["A de 1891", "A de 1946", "A de 1967"], exp: "A de 1934 incorporou direitos sociais e trabalhistas." },
  { cat: "Constituições", q: "Quem presidiu a Assembleia Constituinte de 1987–88?", c: "Ulysses Guimarães", w: ["José Sarney", "Tancredo Neves", "Leonel Brizola"], exp: "Ulysses Guimarães presidiu os trabalhos e promulgou a Carta em 5 de outubro de 1988." },
  { cat: "Ditadura Militar", q: "Em que ano ocorreu o golpe civil-militar que deu início à ditadura?", c: "1964", w: ["1954", "1968", "1937"], exp: "O golpe aconteceu entre 31 de março e 1º de abril de 1964." },
  { cat: "Ditadura Militar", q: "Qual ato institucional, de 1968, endureceu o regime e fechou o Congresso?", c: "AI-5", w: ["AI-1", "AI-2", "AI-10"], exp: "O AI-5, de 13 de dezembro de 1968, suspendeu garantias constitucionais." },
  { cat: "Ditadura Militar", q: "Qual campanha popular pediu eleições diretas para presidente em 1983–84?", c: "Diretas Já", w: ["Caras-pintadas", "Legalidade", "Cívico-Militar"], exp: "A emenda das Diretas foi derrotada na Câmara em 1984, mas a campanha mobilizou o país." },
  { cat: "Ditadura Militar", q: "Qual presidente sancionou a Lei da Anistia, em 1979?", c: "João Figueiredo", w: ["Ernesto Geisel", "Médici", "Costa e Silva"], exp: "A Lei da Anistia foi sancionada por Figueiredo em 28 de agosto de 1979." },
  { cat: "Ditadura Militar", q: "Quem foi o primeiro presidente do regime militar?", c: "Castelo Branco", w: ["Costa e Silva", "Médici", "Geisel"], exp: "Castelo Branco governou de 1964 a 1967." },
  { cat: "Era Vargas", q: "Em que ano foi implantado o Estado Novo?", c: "1937", w: ["1930", "1934", "1945"], exp: "O golpe de 10 de novembro de 1937 instalou o Estado Novo." },
  { cat: "Era Vargas", q: "Em que ano foi sancionada a CLT?", c: "1943", w: ["1930", "1951", "1964"], exp: "A Consolidação das Leis do Trabalho foi sancionada em 1º de maio de 1943." },
  { cat: "Era Vargas", q: "Qual movimento paulista enfrentou Vargas em 1932?", c: "Revolução Constitucionalista", w: ["Coluna Prestes", "Intentona Comunista", "Revolta da Armada"], exp: "Os paulistas exigiam uma nova Constituição." },
  { cat: "Era Vargas", q: "O que levou ao fim do primeiro período de Vargas, em 1945?", c: "Foi deposto pelos militares", w: ["Renunciou por doença", "Morreu no cargo", "Perdeu a eleição de 1945"], exp: "Vargas foi deposto em 29 de outubro de 1945, e voltou ao poder pelo voto em 1951." },
  { cat: "Era Vargas", q: "Qual estatal criada no período Vargas ficou ligada à siderurgia, em Volta Redonda?", c: "Companhia Siderúrgica Nacional (CSN)", w: ["Petrobras", "Embraer", "Eletrobras"], exp: "A CSN foi inaugurada em 1946; a Petrobras só foi criada em 1953." },
  { cat: "Nova República", q: "Qual presidente foi eleito pelo Colégio Eleitoral em 1985, mas morreu sem tomar posse?", c: "Tancredo Neves", w: ["Ulysses Guimarães", "José Sarney", "Itamar Franco"], exp: "Tancredo morreu em 21 de abril de 1985; Sarney governou em seu lugar." },
  { cat: "Nova República", q: "Qual plano econômico bloqueou poupanças em 1990?", c: "Plano Collor", w: ["Plano Real", "Plano Cruzado", "Plano Bresser"], exp: "O Plano Collor bloqueou depósitos bancários para conter a inflação." },
  { cat: "Nova República", q: "Qual presidente sofreu impeachment em 2016?", c: "Dilma Rousseff", w: ["Michel Temer", "Fernando Collor", "Itamar Franco"], exp: "O Senado votou pelo afastamento definitivo de Dilma em 31 de agosto de 2016." },
  { cat: "Nova República", q: "Em que ano ocorreu a primeira eleição direta para presidente depois da ditadura?", c: "1989", w: ["1985", "1994", "1982"], exp: "Collor venceu Lula no segundo turno de 1989." },
  { cat: "Nova República", q: "Qual presidente foi o primeiro reeleito, depois da emenda de 1997?", c: "Fernando Henrique Cardoso", w: ["Lula", "Dilma Rousseff", "Itamar Franco"], exp: "FHC foi reeleito em 1998." }
];

/* =====================================================================
   2. UTILITÁRIOS
   ===================================================================== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** Embaralha uma cópia do array (Fisher–Yates). */
function embaralhar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Converte AAAA-MM-DD em Date local. */
const paraData = s => new Date(s + "T00:00:00");

/** Total de dias de todos os mandatos de um presidente (fim null = hoje). */
function diasTotais(p) {
  return p.mandatos.reduce((tot, [ini, fim]) => {
    const f = fim ? paraData(fim) : new Date();
    return tot + Math.max(1, Math.round((f - paraData(ini)) / 86400000));
  }, 0);
}

/** Texto amigável para a duração: "3 dias", "7 meses", "4 anos". */
function textoDuracao(dias) {
  if (dias < 60) return dias + " dias";
  const meses = Math.round(dias / 30.44);
  if (meses < 24) return meses + " meses";
  const a = Math.floor(meses / 12), m = meses % 12;
  return a + " anos" + (m ? " e " + m + (m > 1 ? " meses" : " mês") : "");
}

/** Período em texto: "1930–1945 · 1951–1954". */
function textoPeriodo(p) {
  return p.mandatos.map(([ini, fim]) => {
    const a = ini.slice(0, 4), b = fim ? fim.slice(0, 4) : "presente";
    return a === b ? a : `${a}–${b}`;
  }).join(" · ");
}

/** Iniciais para o avatar quando não há foto. */
function iniciais(nome) {
  const ps = nome.split(" ").filter(w => /^[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/.test(w));
  return (ps[0][0] + (ps.length > 1 ? ps[ps.length - 1][0] : "")).toUpperCase();
}

function avatar(p, grande = false) {
  const inner = p.foto
    ? `<img src="${p.foto}" alt="Retrato de ${p.nome}" loading="lazy">`
    : `<span aria-hidden="true">${iniciais(p.nome)}</span>`;
  return `<div class="avatar${grande ? " lg" : ""}">${inner}</div>`;
}

/** Aplica o tema visual da época. */
function definirEra(era) { document.body.dataset.era = era; }

/** Monta o acervo completo de curiosidades (base + dos presidentes + derivadas). */
function montarCuriosidades() {
  const lista = CURIOSIDADES_BASE.map(([cat, texto]) => ({ cat, texto }));
  PRESIDENTES.forEach(p => {
    lista.push({ cat: "Presidentes", texto: p.curiosidade });
    lista.push({ cat: "Presidentes", texto: `${p.nome} governou por ${textoDuracao(diasTotais(p))} (${textoPeriodo(p)}).` });
    const est = STATES[p.uf];
    const extra = p.id === "itamar" ? " (nasceu em um navio, na costa baiana)" : p.id === "janio" ? " (na época, a cidade natal ainda pertencia ao Mato Grosso)" : "";
    lista.push({ cat: "Estados", texto: `${p.nome} nasceu no estado de ${est.n}${extra}.` });
  });
  return lista;
}
const ACERVO = montarCuriosidades();

/* =====================================================================
   3. TELAS
   ===================================================================== */

/* ---------- Início ---------- */
function renderInicio(_, app) {
  definirEra("nova");
  const anosDemocracia = new Date().getFullYear() - 1985;
  const indicadores = [
    { n: PRESIDENTES.length, l: "Ocupantes da Presidência", s: "inclui interinos" },
    { n: CONSTITUICOES.length, l: "Constituições", s: "1891, 1934, 1937, 1946, 1967 e 1988" },
    { n: 4, l: "Golpes e rupturas", s: "1930, 1937, 1945 e 1964 (a contagem varia)" },
    { n: 24, l: "Eleições diretas", s: "para presidente, de 1894 a 2022" },
    { n: 29, l: "Anos autoritários", s: "Estado Novo (8) e ditadura militar (21)" },
    { n: anosDemocracia, l: "Anos de democracia contínua", s: "desde 1985" }
  ];

  app.innerHTML = `
  <div class="view">
    <section class="hero">
      <div class="container">
        <h1>Atlas da República</h1>
        <p>Uma enciclopédia interativa da história política do Brasil, de 1889 até hoje. Explore presidentes, constituições, crises e transformações — sem precisar ler paredes de texto.</p>
        <div class="actions">
          <a class="btn light" href="#/presidentes">Ver presidentes</a>
          <a class="btn light" href="#/periodos">Explorar períodos</a>
          <a class="btn light" href="#/quiz">Fazer o quiz</a>
        </div>
      </div>
    </section>

    <div class="container">
      <section class="indicators" aria-label="Indicadores históricos">
        ${indicadores.map(i => `
          <div class="card indicator">
            <div class="num" data-alvo="${i.n}">0</div>
            <div class="lbl">${i.l}</div>
            <div class="sub">${i.s}</div>
          </div>`).join("")}
      </section>

      <section class="section">
        <h2 class="section-title">Linha do tempo da República</h2>
        <p class="lead">Clique em um acontecimento para ir ao período correspondente.</p>
        <div class="card timeline-wrap">
          <div class="timeline-h" role="list">
            ${TIMELINE.map(([ano, tit, era]) => `
              <a class="tl-item" role="listitem" data-era="${era}" href="#/periodos/${era}" title="${ERAS[era].nome}">
                <div class="tl-year">${ano}</div>
                <div class="tl-title">${tit}</div>
              </a>`).join("")}
          </div>
          <div class="tl-legend">
            ${Object.entries(ERAS).map(([k, e]) => `<span><i style="--c:${{ primeira: "#8b5a2b", vargas: "#c9a227", populista: "#d1603d", militar: "#5c8a52", nova: "#0a5ab4" }[k]}"></i>${e.nome}</span>`).join("")}
          </div>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">Comece por aqui</h2>
        <div class="grid grid-cards">
          <a class="card quick-card" href="#/constituicoes"><div class="ico">📘</div><h3>Constituições</h3><p class="muted">De 1891 a 1988, compare as seis Cartas do país.</p></a>
          <a class="card quick-card" href="#/mapa"><div class="ico">🗺️</div><h3>Mapa do Brasil</h3><p class="muted">Presidentes e fatos históricos por estado.</p></a>
          <a class="card quick-card" href="#/curiosidades"><div class="ico">💡</div><h3>Curiosidades</h3><p class="muted">Clique e descubra um fato inesperado.</p></a>
          <a class="card quick-card" href="#/comparar"><div class="ico">⚖️</div><h3>Comparar presidentes</h3><p class="muted">Mandatos, economia e reformas lado a lado.</p></a>
          <a class="card quick-card" href="#/estudante"><div class="ico">🎓</div><h3>Vestibulares</h3><p class="muted">Temas recorrentes no ENEM, FUVEST, UERJ e UNICAMP.</p></a>
        </div>
      </section>
    </div>
  </div>`;

  // Animação de contagem dos indicadores
  $$(".indicator .num", app).forEach(el => {
    const alvo = +el.dataset.alvo, dur = 900, ini = performance.now();
    const passo = t => {
      const k = Math.min(1, (t - ini) / dur);
      el.textContent = Math.round(alvo * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  });
}

/* ---------- Galeria de presidentes ---------- */
function renderPresidentes(_, app) {
  definirEra("nova");
  let filtro = "todos", busca = "";

  app.innerHTML = `
  <div class="view container section">
    <h1 class="section-title">Presidentes da República</h1>
    <p class="lead">Clique em um cartão para abrir a página do presidente.</p>
    <div class="toolbar">
      <div class="chips" id="filtros">
        <button class="chip on" data-era="todos">Todos</button>
        ${Object.entries(ERAS).map(([k, e]) => `<button class="chip" data-era="${k}">${e.nome}</button>`).join("")}
      </div>
      <input type="search" id="busca" placeholder="Buscar presidente…" aria-label="Buscar presidente">
    </div>
    <div class="grid grid-cards" id="lista"></div>
  </div>`;

  const lista = $("#lista", app);
  function pintar() {
    const itens = PRESIDENTES.filter(p => (filtro === "todos" || p.era === filtro) &&
      p.nome.toLowerCase().includes(busca.toLowerCase()));
    lista.innerHTML = itens.length ? itens.map(p => `
      <a class="card pres-card" href="#/presidente/${p.id}">
        <div class="pres-head">
          ${avatar(p)}
          <div>
            <h3>${p.nome}</h3>
            <div class="pres-meta">${textoPeriodo(p)}</div>
          </div>
        </div>
        <p class="pres-meta"><strong>${p.partido}</strong></p>
        <p class="pres-bio">${p.bio}</p>
        <div class="pres-foot">
          <span class="tag">${textoDuracao(diasTotais(p))}</span>
          <span class="tag">${ERAS[p.era].nome}</span>
        </div>
      </a>`).join("") : `<p class="muted">Nenhum presidente encontrado.</p>`;
  }
  pintar();

  $("#filtros", app).addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    filtro = b.dataset.era;
    $$(".chip", app).forEach(c => c.classList.toggle("on", c === b));
    pintar();
  });
  $("#busca", app).addEventListener("input", e => { busca = e.target.value; pintar(); });
}

/* ---------- Página individual do presidente ---------- */
function renderPresidente(id, app) {
  const i = PRESIDENTES.findIndex(p => p.id === id);
  if (i < 0) return renderNaoEncontrado(app);
  const p = PRESIDENTES[i], ant = PRESIDENTES[i - 1], prox = PRESIDENTES[i + 1];
  definirEra(p.era);

  app.innerHTML = `
  <div class="view container section">
    <a class="crumb" href="#/presidentes">← Todos os presidentes</a>
    <header class="pres-hero">
      ${avatar(p, true)}
      <div>
        <h1>${p.nome}</h1>
        <div class="pres-facts">
          <span>🗓️ ${textoPeriodo(p)}</span>
          <span>⏳ ${textoDuracao(diasTotais(p))} de governo</span>
          <span>🏛️ ${p.partido}</span>
          <span>📍 Nascido em ${STATES[p.uf].n} (${p.nasc})</span>
          <span>${ERAS[p.era].icone} ${ERAS[p.era].nome}</span>
        </div>
      </div>
    </header>

    <div class="cols">
      <section class="card full"><h2>Resumo</h2><p>${p.resumo}</p></section>
      <section class="card"><h2>Principais acontecimentos</h2>
        <ul class="event-list">${p.eventos.map(e => `<li>${e}</li>`).join("")}</ul>
      </section>
      <section class="card"><h2>Economia</h2><p>${p.economia}</p>
        <h3>Reformas e medidas</h3>
        <ul>${p.reformas.map(r => `<li>${r}</li>`).join("")}</ul>
      </section>
      <section class="full">
        <details class="fun">
          <summary>💡 Você sabia? (clique para abrir)</summary>
          <p>${p.curiosidade}</p>
        </details>
      </section>
    </div>

    <nav class="pager" aria-label="Navegar entre presidentes">
      ${ant ? `<a class="btn ghost" href="#/presidente/${ant.id}">← ${ant.nome}</a>` : "<span></span>"}
      ${prox ? `<a class="btn ghost" href="#/presidente/${prox.id}">${prox.nome} →</a>` : "<span></span>"}
    </nav>
  </div>`;
}

/* ---------- Períodos ---------- */
function renderPeriodos(eraSel, app) {
  const era = ERAS[eraSel] ? eraSel : "primeira";
  definirEra(era);
  const d = PERIODOS[era];

  app.innerHTML = `
  <div class="view container section">
    <h1 class="section-title">Linha do tempo da República</h1>
    <div class="tabs" role="tablist">
      ${Object.entries(ERAS).map(([k, e]) => `
        <a class="tab${k === era ? " on" : ""}" role="tab" aria-selected="${k === era}" href="#/periodos/${k}" style="text-decoration:none">
          ${e.icone} ${e.nome}<small>${e.anos}</small>
        </a>`).join("")}
    </div>

    <section class="card"><h2>${ERAS[era].icone} ${ERAS[era].nome} <small class="muted">(${ERAS[era].anos})</small></h2>
      <p class="lead">${d.intro}</p></section>

    <div class="grid grid-2" style="margin-top:1rem">
      <section class="card block"><h3>🏛️ Contexto político</h3><p>${d.politico}</p></section>
      <section class="card block"><h3>💰 Contexto econômico</h3><p>${d.economico}</p></section>
      <section class="card block"><h3>👥 Contexto social</h3><p>${d.social}</p></section>
      <section class="card block"><h3>📌 Acontecimentos marcantes</h3>
        <ul class="marks">${d.marcos.map(([a, t]) => `<li><b>${a}</b> — ${t}</li>`).join("")}</ul>
      </section>
    </div>

    <h2 style="margin-top:2rem">Presidentes deste período</h2>
    <div class="grid grid-cards">
      ${PRESIDENTES.filter(p => p.era === era).map(p => `
        <a class="card pres-card" href="#/presidente/${p.id}">
          <div class="pres-head">${avatar(p)}<div><h3>${p.nome}</h3><div class="pres-meta">${textoPeriodo(p)}</div></div></div>
        </a>`).join("")}
    </div>
  </div>`;
}

/* ---------- Constituições ---------- */
function renderConstituicoes(anoSel, app) {
  const c = CONSTITUICOES.find(x => String(x.ano) === anoSel) || CONSTITUICOES[0];
  definirEra(c.era);
  const lista = arr => `<ul>${arr.map(x => `<li>${x}</li>`).join("")}</ul>`;

  app.innerHTML = `
  <div class="view container section">
    <h1 class="section-title">Constituições Brasileiras</h1>
    <div class="tabs" role="tablist">
      ${CONSTITUICOES.map(x => `<a class="tab${x.ano === c.ano ? " on" : ""}" role="tab" aria-selected="${x.ano === c.ano}" href="#/constituicoes/${x.ano}" style="text-decoration:none">${x.ano}<small>${x.tipo}</small></a>`).join("")}
    </div>

    <section class="card"><h2>${c.nome}</h2>
      <span class="tag">${c.tipo}</span> <span class="tag">${ERAS[c.era].nome}</span>
      <h3 style="margin-top:1rem">Contexto histórico</h3><p>${c.contexto}</p>
    </section>

    <div class="grid grid-2" style="margin-top:1rem">
      <section class="card"><h3>Principais características</h3>${lista(c.caracteristicas)}</section>
      <section class="card"><h3>Direitos garantidos</h3>${lista(c.direitos)}</section>
      <section class="card"><h3>Mudanças introduzidas</h3>${lista(c.mudancas)}</section>
      <section class="card"><h3>Curiosidades</h3>${lista(c.curiosidades)}</section>
    </div>

    <section class="card" style="margin-top:1rem"><h3>Comparação com a anterior</h3>
      <div class="compare-box">${c.comparacao}</div></section>
  </div>`;
}

/* ---------- Mapa interativo (cartograma) ---------- */
function renderMapa(_, app) {
  definirEra("nova");
  app.innerHTML = `
  <div class="view container section">
    <h1 class="section-title">Mapa político do Brasil</h1>
    <p class="lead">Cada peça representa um estado (em um cartograma, que dá o mesmo tamanho a todos). Clique para ver a participação política, os presidentes nascidos ali e fatos relevantes.</p>
    <div class="chips">
      ${Object.entries(REGIOES).map(([k, v]) => `<span class="tag" style="background:var(--surface);border:1px solid var(--line)"><i class="r-${k}" style="display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:.4rem"></i>${v}</span>`).join("")}
    </div>
    <div class="map-layout">
      <div class="tilemap" id="tilemap" role="group" aria-label="Estados do Brasil">
        ${Object.entries(STATES).map(([uf, s]) => {
          const n = PRESIDENTES.filter(p => p.uf === uf).length;
          return `<button class="tile r-${s.r}" data-uf="${uf}" style="grid-row:${s.pos[0]};grid-column:${s.pos[1]}" aria-label="${s.n}">${uf}${n ? `<span class="dot">${n}</span>` : ""}</button>`;
        }).join("")}
      </div>
      <aside class="card map-panel" id="painel" aria-live="polite">
        <h2>Selecione um estado</h2>
        <p class="muted">O número no canto de cada peça indica quantos presidentes da lista nasceram naquele estado.</p>
      </aside>
    </div>
  </div>`;

  $("#tilemap", app).addEventListener("click", e => {
    const b = e.target.closest(".tile"); if (!b) return;
    $$(".tile", app).forEach(t => t.classList.toggle("on", t === b));
    const uf = b.dataset.uf, s = STATES[uf];
    const nascidos = PRESIDENTES.filter(p => p.uf === uf);
    $("#painel", app).innerHTML = `
      <h2>${s.n} <small class="muted">(${uf} · ${REGIOES[s.r]})</small></h2>
      <h3>Participação política</h3><p>${s.p}</p>
      <h3>Presidentes nascidos no estado</h3>
      ${nascidos.length ? `<ul>${nascidos.map(p => `<li><a href="#/presidente/${p.id}">${p.nome}</a> (${textoPeriodo(p)})</li>`).join("")}</ul>` : "<p class='muted'>Nenhum presidente da lista nasceu aqui.</p>"}
      <h3>Acontecimentos relevantes</h3>
      <ul>${s.e.map(x => `<li>${x}</li>`).join("")}</ul>`;
  });
}

/* ---------- Curiosidades ---------- */
function renderCuriosidades(_, app) {
  definirEra("nova");
  const cats = ["Todas", ...new Set(ACERVO.map(c => c.cat))];
  let cat = "Todas", baralho = [], revelou = 0;

  app.innerHTML = `
  <div class="view container section">
    <h1 class="section-title">Curiosidades históricas</h1>
    <p class="lead">O acervo tem <strong>${ACERVO.length}</strong> curiosidades. Nenhuma aparece até você clicar.</p>
    <div class="chips" id="cats">${cats.map((c, i) => `<button class="chip${i === 0 ? " on" : ""}" data-cat="${c}">${c}</button>`).join("")}</div>
    <div class="card fun-stage">
      <div>
        <p class="fun-text" id="texto">Clique no botão para descobrir uma curiosidade.</p>
        <p class="muted" id="rotulo"></p>
      </div>
      <button class="btn" id="revelar">🎲 Revelar curiosidade</button>
      <p class="muted" id="contador"></p>
    </div>
  </div>`;

  const reabastecer = () => { baralho = embaralhar(ACERVO.filter(c => cat === "Todas" || c.cat === cat)); };
  reabastecer();

  $("#cats", app).addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    cat = b.dataset.cat; reabastecer();
    $$(".chip", app).forEach(c => c.classList.toggle("on", c === b));
  });
  $("#revelar", app).addEventListener("click", () => {
    if (!baralho.length) reabastecer();
    const c = baralho.pop(); revelou++;
    const t = $("#texto", app);
    t.classList.remove("pop"); void t.offsetWidth; // reinicia a animação
    t.textContent = c.texto; t.classList.add("pop");
    $("#rotulo", app).textContent = c.cat;
    $("#contador", app).textContent = `${revelou} revelada(s) nesta sessão`;
    $("#revelar", app).textContent = "🎲 Outra curiosidade";
  });
}

/* ---------- Comparar presidentes ---------- */
function renderComparar(_, app) {
  definirEra("nova");
  const opcoes = sel => PRESIDENTES.map(p => `<option value="${p.id}"${p.id === sel ? " selected" : ""}>${p.nome} (${textoPeriodo(p)})</option>`).join("");

  app.innerHTML = `
  <div class="view container section">
    <h1 class="section-title">Comparar presidentes</h1>
    <div class="cmp-pickers">
      <select id="a" aria-label="Primeiro presidente">${opcoes("vargas")}</select>
      <strong>×</strong>
      <select id="b" aria-label="Segundo presidente">${opcoes("jk")}</select>
    </div>
    <div id="resultado"></div>
  </div>`;

  const ul = arr => `<ul>${arr.map(x => `<li>${x}</li>`).join("")}</ul>`;
  function comparar() {
    const A = PRESIDENTES.find(p => p.id === $("#a", app).value);
    const B = PRESIDENTES.find(p => p.id === $("#b", app).value);
    const linhas = [
      ["Período", p => textoPeriodo(p)],
      ["Tempo de mandato", p => textoDuracao(diasTotais(p))],
      ["Época", p => ERAS[p.era].nome],
      ["Partido / apoio", p => p.partido],
      ["Contexto econômico", p => p.economia],
      ["Acontecimentos", p => ul(p.eventos)],
      ["Reformas", p => ul(p.reformas)]
    ];
    $("#resultado", app).innerHTML = `
      <table class="cmp-table">
        <thead><tr><th></th><th scope="col">${A.nome}</th><th scope="col">${B.nome}</th></tr></thead>
        <tbody>${linhas.map(([rot, f]) => `<tr><th scope="row">${rot}</th><td>${f(A)}</td><td>${f(B)}</td></tr>`).join("")}</tbody>
      </table>`;
  }
  $("#a", app).addEventListener("change", comparar);
  $("#b", app).addEventListener("change", comparar);
  comparar();
}

/* ---------- Modo estudante ---------- */
function renderEstudante(prova, app) {
  definirEra("nova");
  const exame = VESTIBULARES[prova] ? prova : "ENEM";

  app.innerHTML = `
  <div class="view container section">
    <h1 class="section-title">Preparação para Vestibulares</h1>
    <p class="note">Os temas abaixo reúnem assuntos recorrentes de História do Brasil República nessas provas. Confirme sempre nos editais e nas provas mais recentes, pois os conteúdos mudam de ano para ano.</p>

    <div class="tabs" style="margin-top:1rem">
      ${Object.keys(VESTIBULARES).map(k => `<a class="tab${k === exame ? " on" : ""}" href="#/estudante/${k}" style="text-decoration:none">${k}</a>`).join("")}
    </div>

    <section class="card exam-box"><h2>Temas recorrentes — ${exame}</h2>
      <ul>${VESTIBULARES[exame].map(([t, d]) => `<li><b>${t}</b>${d}</li>`).join("")}</ul>
    </section>

    <h2 style="margin-top:2rem">Resumos rápidos por período</h2>
    ${Object.entries(ERAS).map(([k, e]) => `
      <details class="sum"><summary>${e.icone} ${e.nome} (${e.anos})</summary>
        <p>${PERIODOS[k].intro}</p>
        <ul class="marks">${PERIODOS[k].marcos.map(([a, t]) => `<li><b>${a}</b> — ${t}</li>`).join("")}</ul>
        <a href="#/periodos/${k}">Abrir período completo →</a>
      </details>`).join("")}

    <h2 style="margin-top:2rem">Cola de datas</h2>
    <div class="card"><ul class="marks">${DATAS_RAPIDAS.map(([a, t]) => `<li><b>${a}</b> — ${t}</li>`).join("")}</ul></div>

    <p style="margin-top:1.5rem"><a class="btn" href="#/quiz">Testar o que aprendi no quiz</a></p>
  </div>`;
}

/* ---------- Quiz ---------- */
function renderQuiz(_, app) {
  definirEra("nova");
  const cats = ["Misto", ...new Set(QUIZ.map(q => q.cat))];
  let perguntas = [], idx = 0, pontos = 0;

  function melhor() { try { return +localStorage.getItem("atlas-melhor") || 0; } catch (e) { return 0; } }
  function salvarMelhor(v) { try { if (v > melhor()) localStorage.setItem("atlas-melhor", v); } catch (e) { /* sem armazenamento */ } }

  function menu() {
    app.innerHTML = `
    <div class="view container section"><div class="quiz-box">
      <h1 class="section-title">Quiz da República</h1>
      <p class="lead">Escolha uma categoria e teste seus conhecimentos.</p>
      <div class="chips">${cats.map(c => `<button class="chip" data-c="${c}">${c === "Misto" ? "🎯 Misto (10 perguntas)" : c}</button>`).join("")}</div>
      ${melhor() ? `<p class="muted">Seu melhor resultado neste navegador: <strong>${melhor()}</strong> acertos.</p>` : ""}
    </div></div>`;
    $$(".chip", app).forEach(b => b.addEventListener("click", () => iniciar(b.dataset.c)));
  }

  function iniciar(cat) {
    const base = cat === "Misto" ? embaralhar(QUIZ).slice(0, 10) : embaralhar(QUIZ.filter(q => q.cat === cat));
    perguntas = base.map(q => ({ ...q, opcoes: embaralhar([q.c, ...q.w]) }));
    idx = 0; pontos = 0; perguntar();
  }

  function perguntar() {
    const q = perguntas[idx];
    app.innerHTML = `
    <div class="view container section"><div class="quiz-box card">
      <div class="quiz-progress"><span style="width:${(idx / perguntas.length) * 100}%"></span></div>
      <p class="muted">${q.cat} · Pergunta ${idx + 1} de ${perguntas.length} · Pontos: ${pontos}</p>
      <p class="quiz-q">${q.q}</p>
      <div class="opts">${q.opcoes.map(o => `<button class="opt">${o}</button>`).join("")}</div>
      <div id="fb"></div>
    </div></div>`;
    $$(".opt", app).forEach(btn => btn.addEventListener("click", () => {
      const certo = btn.textContent === q.c;
      if (certo) pontos++;
      $$(".opt", app).forEach(b => { b.disabled = true; if (b.textContent === q.c) b.classList.add("ok"); });
      if (!certo) btn.classList.add("bad");
      const ultimo = idx === perguntas.length - 1;
      $("#fb", app).innerHTML = `
        <div class="explain"><strong>${certo ? "Correto!" : "Não foi dessa vez."}</strong> ${q.exp}</div>
        <button class="btn" id="prox">${ultimo ? "Ver resultado" : "Próxima →"}</button>`;
      $("#prox", app).addEventListener("click", () => { idx++; idx < perguntas.length ? perguntar() : fim(); });
      $("#prox", app).focus();
    }));
  }

  function fim() {
    salvarMelhor(pontos);
    const pct = Math.round((pontos / perguntas.length) * 100);
    const msg = pct >= 80 ? "Excelente! Você domina a história da República." : pct >= 50 ? "Bom resultado! Revise os períodos para chegar ao topo." : "Continue explorando o Atlas e tente novamente!";
    app.innerHTML = `
    <div class="view container section"><div class="quiz-box card" style="text-align:center">
      <h1>Resultado</h1>
      <div class="score-big">${pontos} / ${perguntas.length}</div>
      <p class="lead" style="margin-inline:auto">${pct}% de acertos. ${msg}</p>
      <p><button class="btn" id="de-novo">Jogar de novo</button> <a class="btn ghost" href="#/periodos">Estudar períodos</a></p>
    </div></div>`;
    $("#de-novo", app).addEventListener("click", menu);
  }

  menu();
}

/* ---------- Sobre ---------- */
function renderSobre(_, app) {
  definirEra("nova");
  app.innerHTML = `
  <div class="view container section" style="max-width:820px">
    <h1 class="section-title">Sobre</h1>
    <div class="card">
      <p>Atlas da República é uma plataforma interativa desenvolvida por Gabriel Nunes Fernandes com o objetivo de democratizar o acesso à história política brasileira por meio de recursos visuais, cronologias dinâmicas e conteúdo educacional acessível.</p>
    </div>
    <p class="note" style="margin-top:1rem">O conteúdo é didático e resumido; datas e números podem variar conforme o critério adotado pelos historiadores. Os retratos dos presidentes podem ser adicionados no campo <code>foto</code> de cada presidente em <code>script.js</code>.</p>
  </div>`;
}

function renderNaoEncontrado(app) {
  definirEra("nova");
  app.innerHTML = `<div class="view container section"><h1>Página não encontrada</h1><p><a class="btn" href="#/inicio">Voltar ao início</a></p></div>`;
}

/* =====================================================================
   4. ROTEADOR (hash: #/tela/parametro)
   ===================================================================== */
const ROTAS = {
  inicio: renderInicio, presidentes: renderPresidentes, presidente: renderPresidente,
  periodos: renderPeriodos, constituicoes: renderConstituicoes, mapa: renderMapa,
  curiosidades: renderCuriosidades, comparar: renderComparar, estudante: renderEstudante,
  quiz: renderQuiz, sobre: renderSobre
};
let ultimaTela = "";

function rotear() {
  const app = $("#app");
  const [tela, param] = location.hash.replace(/^#\/?/, "").split("/");
  const nome = tela || "inicio";
  const render = ROTAS[nome];
  if (!render) { renderNaoEncontrado(app); return; }

  render(param, app);

  // Marca o item ativo do menu (o presidente individual conta como "presidentes")
  const ativo = nome === "presidente" ? "presidentes" : nome;
  $$(".main-nav a").forEach(a => a.classList.toggle("active", a.dataset.view === ativo));
  $("#mainNav").classList.remove("open");
  $("#menuBtn").setAttribute("aria-expanded", "false");

  if (nome !== ultimaTela || param) { window.scrollTo({ top: 0 }); }
  ultimaTela = nome;
  document.title = "Atlas da República" + (nome !== "inicio" ? " · " + nome.charAt(0).toUpperCase() + nome.slice(1) : "");
}

/* =====================================================================
   5. INICIALIZAÇÃO
   ===================================================================== */
function iniciar() {
  $("#menuBtn").addEventListener("click", () => {
    const aberto = $("#mainNav").classList.toggle("open");
    $("#menuBtn").setAttribute("aria-expanded", String(aberto));
  });
  window.addEventListener("hashchange", rotear);
  rotear();
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", iniciar);
}
// Exporta os dados para testes em Node (não afeta o navegador)
if (typeof module !== "undefined") {
  module.exports = { PRESIDENTES, STATES, CONSTITUICOES, PERIODOS, QUIZ, ACERVO, TIMELINE, ERAS, VESTIBULARES, diasTotais, textoDuracao, textoPeriodo };
}
