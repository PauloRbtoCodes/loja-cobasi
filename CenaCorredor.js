class CenaCorredor extends Phaser.Scene {
  constructor() {
    super({ key: "CenaCorredor" });
  }

  create() {
    const W = window.innerWidth;
    const H = window.innerHeight;

    // Fundo preto
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000).setDepth(0);

    // Texto "Corredor"
    this.add
      .text(W / 2, H / 2 - 50, "Corredor", {
        fontSize: "32px",
        fill: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(1);

    // Pontinhos digitando
    this._pontinhos = this.add
      .text(W / 2, H / 2 + 50, "", {
        fontSize: "24px",
        fill: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setDepth(1);

    // Animação dos pontinhos
    this._estadoPontinhos = 0;
    this.time.addEvent({
      delay: 500,
      callback: () => {
        this._estadoPontinhos = (this._estadoPontinhos + 1) % 4;
        this._pontinhos.setText(".".repeat(this._estadoPontinhos));
      },
      loop: true,
    });

    // Após 3 segundos, vai para CenaFabrica
    this.time.delayedCall(3000, () => {
      this.scene.start("CenaFabrica");
    });
  }
}
