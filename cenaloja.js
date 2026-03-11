class Cenaloja extends Phaser.Scene {
  constructor() {
    super({ key: "Cenaloja" });
  }

  preload() {
    this.load.image("loja", "assets/lojaCENARIO.png");
    this.load.image("movel1", "assets/lojaMovel1.png");
    this.load.image("movel4", "assets/lojaMovel4.png");
    this.load.image("movel5", "assets/lojaMovel5.png");
    this.load.image("npcLoja", "assets/mulhertras1.png");
    this.load.spritesheet("persona1", "./assets/anda1.PNG", {
      frameWidth: 16,
      frameHeight: 27,
    });
    this.load.spritesheet("persona2", "./assets/anda2.PNG", {
      frameWidth: 16,
      frameHeight: 27,
    });
    this.load.spritesheet("persona3", "./assets/anda3.PNG", {
      frameWidth: 16,
      frameHeight: 27,
    });
    this.load.spritesheet("persona4", "./assets/andareto.PNG", {
      frameWidth: 16,
      frameHeight: 27,
    });
  }

  create() {
    window.larguraJogo = window.innerWidth;
    window.alturaJogo = window.innerHeight;

    this.imagemFundoLoja = this.add.image(
      window.larguraJogo / 2,
      window.alturaJogo / 2,
      "loja",
    );
    this.imagemFundoLoja.displayWidth = window.larguraJogo;
    this.imagemFundoLoja.displayHeight = window.alturaJogo;
    this.imagemFundoLoja.setDepth(-2);

    const moveis = [
      { key: "movel1", rx: 3 / 4, ry: 1 / 2, flipX: false, scale: 0.225 },
      { key: "movel5", rx: 1 / 4, ry: 1 / 2, flipX: false, scale: 0.3 },
      { key: "movel4", rx: 1 / 2, ry: 0.3, flipX: false, scale: 0.18 },
    ];

    this.moveisSprites = [];
    moveis.forEach(({ key, rx, ry, flipX, scale }) => {
      const sprite = this.add.image(
        rx * window.larguraJogo,
        ry * window.alturaJogo,
        key,
      );
      sprite.setOrigin(0.5).setScale(scale).setDepth(0);
      sprite.setFlipX(flipX);
      sprite.rx = rx;
      sprite.ry = ry;

      // adiciona corpo estático para colisões, reduzindo o tamanho dele
      this.physics.add.existing(sprite, true);
      // hitbox padrão reduzida (80%)
      const body = sprite.body;
      let reduction = 0.8;
      // para movel5 e movel1 diminuímos bastante a hitbox
      if (key === "movel5" || key === "movel1") {
        reduction = 0.3; // apenas 30% do sprite
      }
      body.setSize(
        sprite.displayWidth * reduction,
        sprite.displayHeight * reduction,
      );
      body.setOffset(
        (sprite.displayWidth - sprite.displayWidth * reduction) / 2,
        (sprite.displayHeight - sprite.displayHeight * reduction) / 2,
      );

      this.moveisSprites.push(sprite);
    });

    window.npcLoja = this.add
      .image(window.larguraJogo * 0.5, window.alturaJogo * 0.25, "npcLoja")
      .setScale(0.5)
      .setDepth(1);

    this.physics.world.setBounds(0, 0, window.larguraJogo, window.alturaJogo);
    this.cameras.main.setBounds(0, 0, window.larguraJogo, window.alturaJogo);

    this.zonasColisao = this.add.group();

    this._criarZona(0.1698, 0.3176, 0.1751, 0.1605); // Zona 1
    this._criarZona(0.2488, 0.4691, 0.0519, 0.2031); // Zona 2
    this._criarZona(0.0012, 0.6644, 0.3597, 0.2604); // Zona 3
    // Zona 4 representa o teto; reduzimos a altura para que o "hitbox" acima fique menor
    // originalmente 0.1829 de altura relativa, agora usamos 0.1 para diminuir a região
    this._criarZona(0.02, 0.0011, 0.9746, 0.1); // Zona 4  — teto (altura reduzida)
    this._criarZona(0.9811, 0.009, 0.0153, 0.1); // Zona 5  — parede direita
    this._criarZona(0.0035, 0.9091, 0.9917, 0.1); // Zona 6  — chão inferior
    this._criarZona(0.3903, 0.8215, 0.0295, 0.1044); // Zona 7
    this._criarZona(0.6621, 0.826, 0.0413, 0.0786); // Zona 8
    this._criarZona(0.3833, 0.881, 0.2836, 0.1); // Zona 9
    this._criarZona(0.7211, 0.8687, 0.0295, 0.1); // Zona 10
    this._criarZona(0.6368, 0.3423, 0.2388, 0.1); // Zona 11
    this._criarZona(0.625, 0.5701, 0.043, 0.1); // Zona 12
    this._criarZona(0.6822, 0.6117, 0.0507, 0.1); // Zona 13
    this._criarZona(0.3143, 0.1852, 0.3744, 0.1); // Zona 14
    this._criarZona(0.4304, 0.7082, 0.1368, 0.1); // Zona 15

    window.spriteJogador = this.physics.add
      .sprite(window.larguraJogo / 2, window.alturaJogo / 2, "persona4")
      .setScale(3)
      .setDepth(2);
    window.spriteJogador.setCollideWorldBounds(true);
    window.ultimaAnimacao = "anda4";
    this._dialogoAtivado = false;
    this._movendoParaNPC = false;

    this.physics.add.collider(window.spriteJogador, this.zonasColisao);
    this.cameras.main.startFollow(window.spriteJogador, true, 0.9, 0.9);

    const criarAnim = (key, texture, s, e) => {
      if (!this.anims.exists(key))
        this.anims.create({
          key,
          frames: this.anims.generateFrameNumbers(texture, {
            start: s,
            end: e,
          }),
          frameRate: window.taxaQuadros || 8,
          repeat: -1,
        });
    };
    criarAnim("anda1", "persona1", 0, 3);
    criarAnim("anda2", "persona2", 0, 3);
    criarAnim("anda3", "persona3", 0, 3);
    criarAnim("anda4", "persona4", 0, 3);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      e: Phaser.Input.Keyboard.KeyCodes.E,
      esc: Phaser.Input.Keyboard.KeyCodes.ESC,
    });

    window.addEventListener("resize", () => this._onResize());
  }

  _criarZona(rx, ry, rw, rh) {
    // aplicamos um fator de redução geral nas zonas porque elas estavam
    // muito maiores que os móveis e acabavam bloqueando o jogador em
    // posições onde não deveria. Com 30% do tamanho original, as áreas de
    // colisão ficam bem mais justas.
    const shrinkFactor = 0.3; // ajustável se precisar (0.2 = ainda menor)

    const x = rx * window.larguraJogo;
    const y = ry * window.alturaJogo;
    const w = rw * window.larguraJogo * shrinkFactor;
    const h = rh * window.alturaJogo * shrinkFactor;
    const zona = this.add.zone(x + w / 2, y + h / 2, w, h);
    this.physics.add.existing(zona, true);
    zona.body.setSize(w, h);
    zona.body.reset(x + w / 2, y + h / 2);
    this.zonasColisao.add(zona);
    // manteremos as proporções originais para recalcular no resize, mas
    // lembrar que a largura/altura usados depois serão escalados de novo
    zona.rx = rx;
    zona.ry = ry;
    zona.rw = rw;
    zona.rh = rh;
  }

  _onResize() {
    window.larguraJogo = window.innerWidth;
    window.alturaJogo = window.innerHeight;

    this.imagemFundoLoja.displayWidth = window.larguraJogo;
    this.imagemFundoLoja.displayHeight = window.alturaJogo;
    this.imagemFundoLoja.setPosition(
      window.larguraJogo / 2,
      window.alturaJogo / 2,
    );

    this.moveisSprites.forEach((s) => {
      s.x = s.rx * window.larguraJogo;
      s.y = s.ry * window.alturaJogo;
    });

    if (window.npcLoja) {
      window.npcLoja.x = window.larguraJogo * 0.5;
      window.npcLoja.y = window.alturaJogo * 0.25;
    }

    this.zonasColisao.getChildren().forEach((zona) => {
      const x = zona.rx * window.larguraJogo;
      const y = zona.ry * window.alturaJogo;
      const w = zona.rw * window.larguraJogo;
      const h = zona.rh * window.alturaJogo;
      zona.x = x + w / 2;
      zona.y = y + h / 2;
      zona.body.reset(x + w / 2, y + h / 2);
      zona.body.setSize(w, h);
    });

    this.physics.world.setBounds(0, 0, window.larguraJogo, window.alturaJogo);
    this.cameras.main.setBounds(0, 0, window.larguraJogo, window.alturaJogo);
  }

  update() {
    if (!window.spriteJogador || !this.cursors || !this.keys) return;
    if (this._dialogoAtivado) return;

    const vel = window.velocidadeJogador || 120;
    const npcX = window.larguraJogo * 0.5;
    const npcY = window.alturaJogo * 0.25;
    const dist = Phaser.Math.Distance.Between(
      window.spriteJogador.x,
      window.spriteJogador.y,
      npcX,
      npcY,
    );

    if (Phaser.Input.Keyboard.JustDown(this.keys.e) && dist < 150) {
      this._movendoParaNPC = true;
    }

    if (this._movendoParaNPC) {
      if (dist > 60) {
        const angulo = Phaser.Math.Angle.Between(
          window.spriteJogador.x,
          window.spriteJogador.y,
          npcX,
          npcY,
        );
        window.spriteJogador.setVelocityX(Math.cos(angulo) * vel);
        window.spriteJogador.setVelocityY(Math.sin(angulo) * vel);
        window.spriteJogador.anims.play("anda4", true);
      } else {
        window.spriteJogador.setVelocity(0);
        window.spriteJogador.anims.stop();
        window.spriteJogador.setFrame(0);
        this._movendoParaNPC = false;
        this._dialogoAtivado = true;
        // Inicia a cutscene como overlay (sem parar a Cenaloja)
        this.scene.launch("cutSceneLoja");
      }
      return;
    }

    const cima = this.keys.w.isDown || this.cursors.up.isDown;
    const baixo = this.keys.s.isDown || this.cursors.down.isDown;
    const esq = this.keys.a.isDown || this.cursors.left.isDown;
    const dir = this.keys.d.isDown || this.cursors.right.isDown;

    window.spriteJogador.setVelocity(0);

    if (cima) {
      window.spriteJogador.setVelocityY(-vel);
      window.spriteJogador.anims.play("anda1", true);
      window.ultimaAnimacao = "anda1";
    } else if (baixo) {
      window.spriteJogador.setVelocityY(vel);
      window.spriteJogador.anims.play("anda4", true);
      window.ultimaAnimacao = "anda4";
    }
    if (dir) {
      window.spriteJogador.setVelocityX(vel);
      window.spriteJogador.anims.play("anda2", true);
      window.ultimaAnimacao = "anda2";
    } else if (esq) {
      window.spriteJogador.setVelocityX(-vel);
      window.spriteJogador.anims.play("anda3", true);
      window.ultimaAnimacao = "anda3";
    }

    if (!cima && !baixo && !esq && !dir) {
      window.spriteJogador.anims.stop();
      window.spriteJogador.setFrame(window.ultimaAnimacao === "anda3" ? 3 : 0);
    }

    if (this.keys.esc?.isDown) {
      window.spriteJogador.anims.stop();
      window.spriteJogador.setFrame(0);
      this.scene.stop("Cenaloja");
      this.scene.start("MenuPrincipal");
    }
  }

  _mostrarIndicacaoFabrica() {
    const W = window.innerWidth;
    const H = window.innerHeight;

    // Fundo semi-transparente para a indicação
    this.add
      .rectangle(80, 60, 160, 80, 0x1a1a2e, 0.95)
      .setStrokeStyle(2, 0xffd700)
      .setDepth(20)
      .setScrollFactor(0);

    // Texto de indicação
    this.add
      .text(80, 30, "📍 Fábrica", {
        fontSize: "16px",
        fill: "#ffd700",
        fontStyle: "bold",
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setDepth(21)
      .setScrollFactor(0);

    this.add
      .text(80, 65, "Pressione E\npara entrar", {
        fontSize: "12px",
        fill: "#ffffff",
        fontFamily: "Arial",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(21)
      .setScrollFactor(0);
  }
}
