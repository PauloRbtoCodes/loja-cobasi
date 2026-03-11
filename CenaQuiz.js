// cena responsável pelo quiz do jogo
// estende Phaser.Scene para poder ser usada como uma cena do Phaser
class CenaQuiz extends Phaser.Scene {
  constructor() {
    // chamar o construtor da cena com a chave usada pelo Phaser
    super({ key: "CenaQuiz" });

    // montamos aqui a lista completa de perguntas do quiz
    // cada objeto tem: texto da pergunta, opções, índice da correta e explicação
    this._todasPerguntas = [
      {
        pergunta:
          "Qual linha de produtos a Cobasi oferece para higiene de pets?",
        opcoes: [
          "A) Apenas shampoos",
          "B) Shampoos, condicionadores e perfumes",
          "C) Somente perfumes",
          "D) Apenas escovas",
        ],
        correta: 1,
        explicacao:
          "A Cobasi oferece uma linha completa de produtos de higiene que inclui shampoos, condicionadores e perfumes para manter seus pets limpos e perfumados.",
      },
      {
        pergunta: "O que é ração premium para cães?",
        opcoes: [
          "A) Ração com corantes artificiais",
          "B) Ração com ingredientes de alta qualidade e maior valor nutricional",
          "C) Ração com menor proteína",
          "D) Ração misturada com areia",
        ],
        correta: 1,
        explicacao:
          "Ração premium é formulada com ingredientes de qualidade superior e maior valor nutricional, oferecendo melhor saúde e disposição para seu cão.",
      },
      {
        pergunta: "Qual acessório é essencial para passear com um cachorro?",
        opcoes: [
          "A) Fantasia",
          "B) Brinquedo",
          "C) Guia e coleira",
          "D) Óculos de sol",
        ],
        correta: 2,
        explicacao:
          "Guia e coleira são essenciais para passear com segurança, permitindo controlar o pet e evitar acidentes na rua.",
      },
      {
        pergunta: "Para que serve uma caixa de transporte para pets?",
        opcoes: [
          "A) Guardar ração",
          "B) Transportar o animal com segurança",
          "C) Servir de casinha permanente",
          "D) Armazenar brinquedos",
        ],
        correta: 1,
        explicacao:
          "A caixa de transporte é um acessório fundamental para transportar pets com segurança em viagens de carro, ônibus ou avião.",
      },
      {
        pergunta: "O que é antipulgas?",
        opcoes: [
          "A) Um tipo de ração",
          "B) Um brinquedo para gatos",
          "C) Produto que previne e elimina pulgas nos pets",
          "D) Um shampoo comum",
        ],
        correta: 2,
        explicacao:
          "Antipulgas é um produto essencial para prevenir e eliminar pulgas, ácaros e parasitas externos que podem prejudicar a saúde do seu pet.",
      },
      {
        pergunta: "Qual produto é usado para limpar os dentes de um pet?",
        opcoes: [
          "A) Shampoo",
          "B) Escova e pasta de dente própria para animais",
          "C) Água oxigenada",
          "D) Sal grosso",
        ],
        correta: 1,
        explicacao:
          "Escova e pasta de dente própria para animais são fundamentais para manter a saúde bucal do pet, prevenindo tártaro e problemas dentários.",
      },
      {
        pergunta: "Quantas vezes ao dia um filhote deve ser alimentado?",
        opcoes: ["A) 1 vez", "B) 2 vezes", "C) 3 a 4 vezes", "D) 6 vezes"],
        correta: 2,
        explicacao:
          "Filhotes devem ser alimentados 3 a 4 vezes ao dia para garantir energia e crescimento saudável, distribuindo melhor os nutrientes.",
      },
      {
        pergunta:
          "Qual item é importante para o enriquecimento ambiental de gatos?",
        opcoes: [
          "A) Aquário",
          "B) Arranhador e brinquedos interativos",
          "C) Gaiola grande",
          "D) Comedouro extra",
        ],
        correta: 1,
        explicacao:
          "Arranhadores e brinquedos interativos são essenciais para gatos, oferecendo estimulação mental, exercício e diversão diária.",
      },
      {
        pergunta: "O que é um comedouro automático?",
        opcoes: [
          "A) Um prato comum",
          "B) Equipamento que libera ração em horários programados",
          "C) Um brinquedo que dispensa petiscos",
          "D) Um filtro de água",
        ],
        correta: 1,
        explicacao:
          "Comedouro automático é um equipamento inteligente que libera ração em horários programados, perfeito para tutores que trabalham fora.",
      },
      {
        pergunta: "Qual produto ajuda a reduzir o odor das fezes do pet?",
        opcoes: [
          "A) Perfume para pets",
          "B) Suplemento alimentar digestivo",
          "C) Shampoo seco",
          "D) Coleira antipulgas",
        ],
        correta: 1,
        explicacao:
          "Suplemento alimentar digestivo melhora a digestão e reduz o odor das fezes, deixando o ambiente mais agradável.",
      },
    ];
  }

  create() {
    const W = window.innerWidth;
    const H = window.innerHeight;

    // variáveis que controlam a lógica do quiz
    this._acertos = 0; // quantas respostas certas o jogador fez
    this._perguntaAtual = 0; // índice da pergunta que estamos mostrando
    this._respondido = false; // se já clicou em alguma opção
    this._emResultado = false; // se já estamos na tela de resultado

    // embaralha e pega apenas 5 perguntas para cada rodada
    this._perguntas = [...this._todasPerguntas]
      .sort(() => Math.random() - 0.5) // embaralha a cópia do array
      .slice(0, 5); // fica só com as cinco primeiras

    // fundo escuro por baixo de tudo, só um retângulo que cobre a tela
    this._fundo = this.add
      .rectangle(W / 2, H / 2, W, H, 0x0d0d1a)
      .setDepth(0)
      .setScrollFactor(0);

    // título do jogo lá em cima
    this._titulo = this.add
      .text(W / 2, 30, "🐾 Quiz Cobasi", {
        fontSize: "28px",
        fill: "#ffd700",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0.5, 0)
      .setDepth(1)
      .setScrollFactor(0);

    // onde mostramos quantas perguntas o jogador acertou
    this._textoPlacar = this.add
      .text(W - 20, 20, "Acertos: 0/5", {
        fontSize: "16px",
        fill: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(1, 0)
      .setDepth(1)
      .setScrollFactor(0);

    // mostra em qual pergunta estamos (ex: 2/5)
    this._textoProgresso = this.add
      .text(20, 20, "Pergunta 1/5", {
        fontSize: "16px",
        fill: "#aaaaaa",
        fontFamily: "Arial",
      })
      .setOrigin(0, 0)
      .setDepth(1)
      .setScrollFactor(0);

    // plano de fundo do texto da pergunta e o texto propriamente dito
    this._caixaPerguntaBg = this.add
      .rectangle(W / 2, H * 0.28, W - 80, H * 0.18, 0x1a1a2e)
      .setStrokeStyle(2, 0xffd700)
      .setDepth(1)
      .setScrollFactor(0);

    this._textoPergunta = this.add
      .text(W / 2, H * 0.28, "", {
        fontSize: "18px",
        fill: "#ffffff",
        fontFamily: "Arial",
        wordWrap: { width: W - 140 },
        align: "center",
        lineSpacing: 6,
      })
      .setOrigin(0.5)
      .setDepth(2)
      .setScrollFactor(0);

    // onde ficam as 4 opções de resposta ( caixas cinza e texto )
    this._botoes = [];
    this._caixasBotoes = [];
    const opcaoY = [H * 0.48, H * 0.58, H * 0.68, H * 0.78];

    for (let i = 0; i < 4; i++) {
      const caixa = this.add
        .rectangle(W / 2, opcaoY[i], W - 120, H * 0.08, 0x2d2d5e)
        .setStrokeStyle(2, 0x4444aa)
        .setDepth(1)
        .setInteractive()
        .setScrollFactor(0);

      const texto = this.add
        .text(W / 2, opcaoY[i], "", {
          fontSize: "16px",
          fill: "#ffffff",
          fontFamily: "Arial",
          wordWrap: { width: W - 160 },
          align: "center",
        })
        .setOrigin(0.5)
        .setDepth(2)
        .setScrollFactor(0);

      // mudar cor quando passa o mouse (efeito hover)
      caixa.on("pointerover", () => {
        if (!this._respondido) caixa.setFillStyle(0x3d3d7e);
      });
      caixa.on("pointerout", () => {
        if (!this._respondido) caixa.setFillStyle(0x2d2d5e);
      });
      // clique: responde à pergunta se ainda não acabou o jogo
      caixa.on("pointerdown", () => {
        if (!this._emResultado) this._responder(i);
      });

      this._botoes.push(texto);
      this._caixasBotoes.push(caixa);
    }

    // mensagem que aparece depois de responder, diz certo ou errado
    this._textoFeedback = this.add
      .text(W / 2, H * 0.85, "", {
        fontSize: "18px",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setDepth(2)
      .setVisible(false)
      .setScrollFactor(0);

    // botão para seguir para a pergunta seguinte (ou ver resultado no fim)
    // aparece só depois que o usuário responde; leva para a próxima pergunta
    this._caixaProxima = this.add
      .rectangle(W / 2, H * 0.95, 200, 44, 0xffd700)
      .setDepth(1)
      .setInteractive()
      .setVisible(false)
      .setScrollFactor(0);
    this._textoProxima = this.add
      .text(W / 2, H * 0.95, "Próxima →", {
        fontSize: "17px",
        fill: "#000000",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setDepth(2)
      .setVisible(false)
      .setScrollFactor(0);

    // popup que aparece quando erra, mostrando a resposta certa e explicação
    this._popupFundo = this.add
      .rectangle(W / 2, H / 2, W, H, 0x000000, 0.7)
      .setDepth(10)
      .setScrollFactor(0)
      .setVisible(false);

    this._popupCaixa = this.add
      .rectangle(W / 2, H / 2, W * 0.8, H * 0.5, 0x1a1a2e)
      .setStrokeStyle(3, 0xff6b6b)
      .setDepth(11)
      .setScrollFactor(0)
      .setVisible(false);

    this._popupTitulo = this.add
      .text(W / 2, H / 2 - H * 0.15, "❌ Resposta Incorreta!", {
        fontSize: "24px",
        fill: "#ff6b6b",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setDepth(12)
      .setScrollFactor(0)
      .setVisible(false);

    this._popupTexto = this.add
      .text(W / 2, H / 2, "", {
        fontSize: "16px",
        fill: "#ffffff",
        fontFamily: "Arial",
        wordWrap: { width: W * 0.7 },
        align: "center",
        lineSpacing: 8,
      })
      .setOrigin(0.5)
      .setDepth(12)
      .setScrollFactor(0)
      .setVisible(false);

    this._popupBotao = this.add
      .rectangle(W / 2, H / 2 + H * 0.15, 200, 44, 0xffd700)
      .setDepth(11)
      .setInteractive()
      .setScrollFactor(0)
      .setVisible(false);

    this._popupBotaoTexto = this.add
      .text(W / 2, H / 2 + H * 0.15, "OK", {
        fontSize: "18px",
        fill: "#000000",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setDepth(12)
      .setScrollFactor(0)
      .setVisible(false);

    this._popupBotao.on("pointerdown", () => this._fecharPopup());
    this._popupBotao.on("pointerover", () =>
      this._popupBotao.setFillStyle(0xffea00),
    );
    this._popupBotao.on("pointerout", () =>
      this._popupBotao.setFillStyle(0xffd700),
    );

    this._caixaProxima.on("pointerdown", () => this._proximaPergunta());
    this._caixaProxima.on("pointerover", () =>
      this._caixaProxima.setFillStyle(0xffea00),
    );
    this._caixaProxima.on("pointerout", () =>
      this._caixaProxima.setFillStyle(0xffd700),
    );

    this._mostrarPergunta(0);
  }

  _ocultarQuiz() {
    this._titulo.setVisible(false);
    this._textoPlacar.setVisible(false);
    this._textoProgresso.setVisible(false);
    this._caixaPerguntaBg.setVisible(false);
    this._textoPergunta.setVisible(false);
    this._textoFeedback.setVisible(false);
    this._caixaProxima.setVisible(false);
    this._textoProxima.setVisible(false);
    this._botoes.forEach((b) => b.setVisible(false));
    this._caixasBotoes.forEach((c) => c.setVisible(false).disableInteractive());
  }

  // coloca a pergunta de índice 'index' na tela
  _mostrarPergunta(index) {
    this._respondido = false; // nova pergunta, ainda não respondida
    const p = this._perguntas[index];

    // atualiza indicadores de progresso
    this._textoProgresso.setText(`Pergunta ${index + 1}/5`);
    this._textoPergunta.setText(p.pergunta);
    // limpa feedback/resposta do ciclo anterior
    this._textoFeedback.setVisible(false);
    this._caixaProxima.setVisible(false);
    this._textoProxima.setVisible(false);

    // preenche cada opção com o texto apropriado e estilo padrão
    for (let i = 0; i < 4; i++) {
      this._botoes[i].setText(p.opcoes[i]);
      this._caixasBotoes[i].setFillStyle(0x2d2d5e).setStrokeStyle(2, 0x4444aa);
    }
  }

  // chamada quando o jogador clica em uma das opções
  _responder(index) {
    // evita executar duas vezes para a mesma pergunta
    if (this._respondido) return;
    this._respondido = true; // marca que respondeu

    // pega a pergunta atual e verifica se o índice batem
    const p = this._perguntas[this._perguntaAtual];
    const acertou = index === p.correta;

    if (acertou) {
      // incrementa acertos e coloriza a caixa certa de verde
      this._acertos++;
      this._caixasBotoes[index]
        .setFillStyle(0x1a6b1a) // verde escuro
        .setStrokeStyle(2, 0x00ff00); // borda verde
      // mostra feedback de acerto
      this._textoFeedback.setText("✅ Correto!").setStyle({
        fill: "#00ff00",
        fontSize: "18px",
        fontStyle: "bold",
        fontFamily: "Arial",
      });
    } else {
      // colorir errado em vermelho, mostrar a certa em verde
      this._caixasBotoes[index]
        .setFillStyle(0x6b1a1a)
        .setStrokeStyle(2, 0xff0000);
      this._caixasBotoes[p.correta]
        .setFillStyle(0x1a6b1a)
        .setStrokeStyle(2, 0x00ff00);
      // feedback de erro
      this._textoFeedback.setText("❌ Errado!").setStyle({
        fill: "#ff4444",
        fontSize: "18px",
        fontStyle: "bold",
        fontFamily: "Arial",
      });

      // abrir o popup com resposta e explicação
      this._mostrarPopup(p.opcoes[p.correta], p.explicacao);
    }

    // atualiza placar e mostra feedback + próximo
    this._textoPlacar.setText(`Acertos: ${this._acertos}/5`);
    this._textoFeedback.setVisible(true);
    this._caixaProxima.setVisible(true);
    this._textoProxima.setVisible(true);

    // altera texto do botão no fim do quiz
    if (this._perguntaAtual === 4) {
      this._textoProxima.setText("Ver resultado");
    }
  }

  // avança para a próxima pergunta ou fim do quiz
  _proximaPergunta() {
    this._perguntaAtual++;
    if (this._perguntaAtual >= 5) {
      // todas as cinco respondidas, mostra a tela de resultado
      this._mostrarResultado();
    } else {
      // exibe pergunta seguinte
      this._mostrarPergunta(this._perguntaAtual);
    }
  }

  _mostrarResultado() {
    const W = window.innerWidth;
    const H = window.innerHeight;

    this._emResultado = true;
    this._ocultarQuiz();

    const mensagens = [
      "Puxa, precisa estudar mais sobre nossos produtos!",
      "Não foi dessa vez, mas continue tentando!",
      "Razoável! Você conhece alguns produtos.",
      "Muito bem! Você conhece bastante!",
      "Quase lá! Só errou uma!",
      "Perfeito! Você é um expert em produtos Cobasi! 🐾",
    ];

    this.add
      .text(W / 2, H * 0.2, "🏆 Resultado", {
        fontSize: "32px",
        fill: "#ffd700",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setDepth(3)
      .setScrollFactor(0);

    this.add
      .text(W / 2, H * 0.38, `Você acertou ${this._acertos} de 5 perguntas!`, {
        fontSize: "22px",
        fill: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setDepth(3)
      .setScrollFactor(0);

    this.add
      .text(W / 2, H * 0.5, mensagens[Math.min(this._acertos, 5)], {
        fontSize: "18px",
        fill: "#aaaaff",
        fontFamily: "Arial",
        wordWrap: { width: W - 100 },
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(3)
      .setScrollFactor(0);

    const estrelas =
      this._acertos >= 5 ? "⭐⭐⭐" : this._acertos >= 3 ? "⭐⭐" : "⭐";
    this.add
      .text(W / 2, H * 0.62, estrelas, { fontSize: "40px" })
      .setOrigin(0.5)
      .setDepth(3)
      .setScrollFactor(0);

    const btnVoltar = this.add
      .rectangle(W / 2, H * 0.78, 240, 50, 0xffd700)
      .setDepth(3)
      .setInteractive()
      .setScrollFactor(0);
    this.add
      .text(W / 2, H * 0.78, "Voltar à loja", {
        fontSize: "18px",
        fill: "#000000",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setDepth(4)
      .setScrollFactor(0);

    btnVoltar.on("pointerdown", () => {
      this.time.delayedCall(100, () => {
        this.scene.stop("CenaQuiz");
        this.scene.start("Cenaloja");
        this.scene.launch("CenaPosQuiz");
      });
    });
    btnVoltar.on("pointerover", () => btnVoltar.setFillStyle(0xffea00));
    btnVoltar.on("pointerout", () => btnVoltar.setFillStyle(0xffd700));
  }

  _mostrarPopup(respostaCorreta, explicacao) {
    // Mostra o popup com a resposta correta e explicação
    this._popupFundo.setVisible(true);
    this._popupCaixa.setVisible(true);
    this._popupTitulo.setVisible(true);
    this._popupTexto.setVisible(true);
    this._popupBotao.setVisible(true);
    this._popupBotaoTexto.setVisible(true);

    this._popupTexto.setText(
      `Resposta correta:\n${respostaCorreta}\n\n💡 Explicação:\n${explicacao}`,
    );
  }

  _fecharPopup() {
    // Oculta todos os elementos do popup
    this._popupFundo.setVisible(false);
    this._popupCaixa.setVisible(false);
    this._popupTitulo.setVisible(false);
    this._popupTexto.setVisible(false);
    this._popupBotao.setVisible(false);
    this._popupBotaoTexto.setVisible(false);
  }
}