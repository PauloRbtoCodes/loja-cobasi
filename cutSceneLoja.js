class cutSceneLoja extends Phaser.Scene {
  constructor() {
    super({ key: "cutSceneLoja" });

    this._linhas = [
      {
        personagem: "Vendedora",
        texto: "Olá! Bem-vindo à nossa loja. Posso te ajudar?",
        avatar: "npcLoja",
      },
      {
        personagem: "Jogador",
        texto: "Oi! Estou procurando algo especial para presentear.",
        avatar: "persona4",
      },
      {
        personagem: "Vendedora",
        texto: "Que ótimo! Mas antes de te ajudar, que tal um desafio?",
        avatar: "npcLoja",
      },
      {
        personagem: "Jogador",
        texto: "Um desafio? Que tipo?",
        avatar: "persona4",
      },
      {
        personagem: "Vendedora",
        texto: "Vou te fazer 5 perguntas sobre nossos produtos. Topas?",
        avatar: "npcLoja",
      },
      {
        personagem: "Jogador",
        texto: "Claro! Pode perguntar!",
        avatar: "persona4",
      },
    ];
  }

  preload() {
    // Carrega assets necessários para a cutscene
    try {
      this.load.image("npcLoja", "assets/mulhertras1.png");
      this.load.spritesheet("persona4", "./assets/andareto.PNG", {
        frameWidth: 16,
        frameHeight: 27,
      });
    } catch (e) {
      console.warn("Assets já carregados ou não encontrados", e);
    }
  }

  create() {
    const W = window.innerWidth;
    const H = window.innerHeight;

    this._linhaAtual = 0;
    this._digitando = false;
    this._textoCompleto = "";
    this._textoAtual = "";
    this._timerDigitar = null;

    this.add
      .rectangle(W / 2, H / 2, W, H, 0x000000, 0.55)
      .setDepth(10)
      .setScrollFactor(0);

    const caixaH = H * 0.28;
    const caixaY = H - caixaH / 2 - 10;

    this.add
      .rectangle(W / 2, caixaY, W - 40, caixaH, 0x1a1a2e, 0.95)
      .setStrokeStyle(2, 0xffd700)
      .setDepth(11)
      .setScrollFactor(0);

    this._avatar = this.add
      .image(80, caixaY, "npcLoja")
      .setDisplaySize(100, 100)
      .setDepth(12)
      .setScrollFactor(0);

    this._textoNome = this.add
      .text(160, caixaY - caixaH / 2 + 18, "", {
        fontSize: "18px",
        fill: "#ffd700",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setDepth(12)
      .setScrollFactor(0);

    this._textoCaixa = this.add
      .text(160, caixaY - caixaH / 2 + 48, "", {
        fontSize: "16px",
        fill: "#ffffff",
        fontFamily: "Arial",
        wordWrap: { width: W - 240 },
        lineSpacing: 6,
      })
      .setDepth(12)
      .setScrollFactor(0);

    this._indicador = this.add
      .text(W - 60, H - 25, "▼", {
        fontSize: "18px",
        fill: "#ffd700",
      })
      .setDepth(12)
      .setScrollFactor(0)
      .setVisible(false);

    this.tweens.add({
      targets: this._indicador,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    this._mostrarLinha(0);
    this.input.on("pointerdown", () => this._avancar());
  }

  _mostrarLinha(index) {
    if (index >= this._linhas.length) {
      this._encerrar();
      return;
    }

    const linha = this._linhas[index];
    this._digitando = true;
    this._textoCompleto = linha.texto;
    this._textoAtual = "";
    this._indicador.setVisible(false);
    this._textoNome.setText(linha.personagem);

    try {
      if (linha.avatar === "persona4") {
        this._avatar.setTexture("persona4", 0).setDisplaySize(100, 100);
      } else {
        this._avatar.setTexture("npcLoja").setDisplaySize(100, 100);
      }
    } catch (e) {
      console.warn("Erro ao carregar textura:", linha.avatar, e);
    }

    this._textoNome.setStyle({
      fontSize: "18px",
      fontStyle: "bold",
      fontFamily: "Arial",
      fill: linha.personagem === "Jogador" ? "#7ec8e3" : "#ffd700",
    });

    let i = 0;
    if (this._timerDigitar) this._timerDigitar.remove();
    this._timerDigitar = this.time.addEvent({
      delay: 35,
      repeat: this._textoCompleto.length - 1,
      callback: () => {
        this._textoAtual += this._textoCompleto[i];
        this._textoCaixa.setText(this._textoAtual);
        i++;
        if (i >= this._textoCompleto.length) {
          this._digitando = false;
          this._indicador.setVisible(true);
        }
      },
    });
  }

  _avancar() {
    if (this._digitando) {
      if (this._timerDigitar) this._timerDigitar.remove();
      this._textoCaixa.setText(this._textoCompleto);
      this._digitando = false;
      this._indicador.setVisible(true);
    } else {
      this._linhaAtual++;
      this._mostrarLinha(this._linhaAtual);
    }
  }

  _encerrar() {
    this.time.delayedCall(100, () => {
      // Para a cutscene (overlay)
      this.scene.stop("cutSceneLoja");
      // Para a cena da loja
      this.scene.stop("Cenaloja");
      // Inicia o quiz
      this.scene.start("CenaQuiz");
    });
  }
}
