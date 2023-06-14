class End extends Phaser.Scene {
   constructor() {
      super("end");
   }

   create() {
      let w = this.game.config.width;
      let h = this.game.config.height;

      let mainTxt = this.add.text(w / 2, h * 0.3, "You escaped the Day-Byrinth!").setOrigin(0.5).setFontSize(64);
      
      let restartBtn = this.add.image(w * 0.3, h * 0.8, "menuBtn").setScale(1.5, 1);
      restartBtn.setInteractive().on("pointerdown", () => this.scene.start("gamelevel", { lvl: 1}));
      let restartTxt = this.add.text(w * 0.3, h * 0.8, "Restart").setOrigin(0.5).setFontSize(40).setColor("#000000");

      let titleBtn = this.add.image(w * 0.7, h * 0.8, "menuBtn").setScale(1.5, 1);
      titleBtn.setInteractive().on("pointerdown", () => this.scene.start("interactive"));
      let titleTxt = this.add.text(w * 0.7, h * 0.8, "Back to Title").setOrigin(0.5).setFontSize(32).setColor("#000000");
   }
}