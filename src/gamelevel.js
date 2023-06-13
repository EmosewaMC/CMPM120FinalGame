class GameLevel extends Phaser.Scene {
   static essentialsLoaded = false;
   lvl = 1;
   lightMode = true;
   
   levelWorld = {
      width: 0,
      height: 0,
      bgOffset: {},
      center: {}
   };

   uiArea = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
   };
   
   constructor() {
      super("gamelevel");
   }

   init(data) {
      if (data.lvl != undefined) {
         this.lvl = data.lvl;
      }
   }

   preload() {
      if (!GameLevel.essentialsLoaded) {
         this.load.path = "./assets/";
         this.load.video({key: "dayBG", url: "videos/skyBackground.mp4", noAudio: true});
         this.load.video({key: "nightBG", url: "videos/night.mp4", noAudio: true});
         this.load.json("gameConfig", "data/gameConfig.json");
         this.load.image("moveBtn", "images/ArrowButton.png");
         this.load.spritesheet("tileset", "images/CMPM120FinalTiles.png", {frameWidth: 120, frameHeight: 120});
         this.load.tilemapTiledJSON("level1", "data/tilemaps/Level1.json");
         this.load.tilemapTiledJSON("level2", "data/tilemaps/Level2.json");
         // this.load.tilemapTiledJSON("level3", "data/tilemaps/Level3.json");
         GameLevel.essentialsLoaded = true;
      }
   }

   create() {
      // Note: levels are hard-coded to start in daytime mode.

      this.levelWorld.width = this.game.config.width * (13 / 16);
      this.levelWorld.height = this.game.config.height;
      this.levelWorld.bgOffset = {x: this.game.config.width * -0.5, y: this.game.config.height * 0.4};
      this.levelWorld.center = {x: this.levelWorld.width / 2, y: this.levelWorld.height / 2};

      this.uiArea.bottom = this.game.config.height;
      this.uiArea.left = this.game.config.width * (13 / 16);
      this.uiArea.right = this.game.config.width;

      this.configJSON = this.cache.json.get("gameConfig");
      
      // Background video setup
      this.nightBG = this.add.video(this.levelWorld.center.x + this.levelWorld.bgOffset.x, 
         this.levelWorld.center.y + this.levelWorld.bgOffset.y, 
         "nightBG").setScale(6);
      this.nightBG.play(true);

      this.dayBG = this.add.video(this.levelWorld.center.x + this.levelWorld.bgOffset.x, 
         this.levelWorld.center.y + this.levelWorld.bgOffset.y, 
         "dayBG").setScale(6);
      this.dayBG.play(true);

      // SFX source
      this.sfx = new sfxPlayer();

      // BGM Player
      this.bgm = new BGM();
      this.bgm.toggleMute(false);
      this.bgm.play();

      // UI region backdrop
      let uiWidth = this.uiArea.right - this.uiArea.left;
      let uiHeight = this.uiArea.bottom - this.uiArea.top;
      this.add.rectangle(this.uiArea.left, this.uiArea.top, uiWidth, uiHeight, 0x808080).setOrigin(0);

      // Directional buttons setup
      let dirBtnCounter = 0;
      let dirBtnCenter = {
         x : this.uiArea.left + this.configJSON.dirButtonsCenter.xOffset * uiWidth,
         y : this.uiArea.top + this.configJSON.dirButtonsCenter.yOffset * uiHeight
      };
      
      for (let dir in this.configJSON.directions) {
         let multiplier = dirBtnCounter++;
         let btnX = dirBtnCenter.x + this.configJSON.directions[dir].buttonOffsetFactor.x * uiWidth;
         let btnY = dirBtnCenter.y + this.configJSON.directions[dir].buttonOffsetFactor.y * uiHeight;
         let btn = this.add.image(btnX, btnY, "moveBtn")
            .setAngle(-90 * multiplier).setScale(0.8).setInteractive();
         
         btn.on("pointerdown", () => {
            btn.setTint(0x555555);
            this.sfx.toggleMoveSFX(true);
            this.player.setAngle(-90 * multiplier);
            let xSpeed = this.configJSON.directions[dir].x * this.configJSON.playerSpeed;
            let ySpeed = this.configJSON.directions[dir].y * this.configJSON.playerSpeed;
            this.player.setVelocity(xSpeed, ySpeed);
         })
         .on("pointerup", () => {
            btn.clearTint();
            this.sfx.toggleMoveSFX(false);
            this.player.setVelocity(0);
         });
      }

      // Mute button
      let muteBtnX = this.uiArea.left + this.configJSON.muteButton.offsetFactor.x * uiWidth;
      let muteBtnY = this.uiArea.top + this.configJSON.muteButton.offsetFactor.y * uiHeight;
      let muteButton = this.add.text(muteBtnX, muteBtnY, "MUTE").setFontSize(40).setInteractive()
      .setOrigin(0.5)
      .on("pointerdown", () => {
         // TODO: change text based on mute state
         let displayTxt = "UNMUTE";
         muteButton.setText(displayTxt);
         this.bgm.toggleMute(true);
      });

      // Full screen button
      let fullscreenBtnX = this.uiArea.left + this.configJSON.fullscreenButton.offsetFactor.x * uiWidth;
      let fullscreenBtnY = this.uiArea.top + this.configJSON.fullscreenButton.offsetFactor.y * uiHeight;
      let fullscreenBtn = this.add.text(fullscreenBtnX, fullscreenBtnY, "FULL SCREEN").setFontSize(40).setInteractive()
      .setWordWrapWidth(200)
      .setAlign('center')
      .setOrigin(0.5)
      .on("pointerdown", () => {
         // TODO: change text based on full screen state
         let displayTxt = "SHRINK";
         fullscreenBtn.setText(displayTxt);
      })
      .on("pointerup", () => {
         this.scale.startFullscreen();
      });

      // Level tile layout
      this.tilemap = this.add.tilemap(`level${this.lvl}`);
      this.tileset = this.tilemap.addTilesetImage("CMPM120FinalTiles", "tileset", 120, 120);
      
      this.staticLayer = this.tilemap.createLayer("StaticObjects", this.tileset, 0, 0);
      this.staticLayer.setCollisionByExclusion([-1, 4]);
      this.staticLayer.setTileIndexCallback([1, 2, 3, 9, 11], this.sfx.bump, this.sfx);
      // this.staticLayer.renderDebug(this.add.graphics());

      this.dayBridges = this.tilemap.createLayer("DayBridges", this.tileset, 0, 0);
      this.dayBridges.setCollisionByExclusion([-1, 4]);
      // this.dayBridges.renderDebug(this.add.graphics());

      this.nightBridges = this.tilemap.createLayer("NightBridges", this.tileset, 0, 0).setVisible(false);
      this.nightBridges.setCollisionByExclusion([-1, 4]);

      this.interactables = this.tilemap.createLayer("Interactables", this.tileset, 0, 0);
      this.interactables.setCollisionByExclusion([-1, 4]);
      this.interactables.setTileIndexCallback(5, this.EndLevel, this);
      this.interactables.setTileIndexCallback(6, this.ToDay, this);
      this.interactables.setTileIndexCallback(7, this.ToNight, this);
      // this.interactables.renderDebug(this.add.graphics());

      // Player setup
      let px = this.tilemap.tileWidth * (this.configJSON.levels[this.lvl - 1].spawnPoint.x + 0.5);
      let py = this.tilemap.tileHeight * (this.configJSON.levels[this.lvl - 1].spawnPoint.y + 0.5);
      this.player = this.physics.add.sprite(px, py, "moveBtn").setScale(0.8).setCollideWorldBounds(true);

      this.physics.add.collider(this.player, this.staticLayer);
      this.dayBridgeCollider = this.physics.add.collider(this.player, this.dayBridges);
      this.dayBridgeCollider.active = false;
      this.nightBridgeCollider = this.physics.add.collider(this.player, this.nightBridges);
      this.physics.add.overlap(this.player, this.interactables);
   }

   ToDay() {
      if (this.lightMode) return;
      this.lightMode = true;

      this.dayBG.setVisible(true);
      this.nightBG.setVisible(false);

      this.dayBridges.setVisible(true);
      this.dayBridgeCollider.active = false;

      this.nightBridges.setVisible(false);
      this.nightBridgeCollider.active = true;

      // Disable day button collision
      this.interactables.setCollision(6, false);
      // Enable night button collision
      this.interactables.setCollision(7, true);

      this.sfx.timeToggle(false);
      this.bgm.toggleTime(false);
      this.staticLayer.setTint(0xffffff);
   }

   ToNight() {
      if (!this.lightMode) return;
      this.lightMode = false;

      this.dayBG.setVisible(false);
      this.nightBG.setVisible(true);

      this.dayBridges.setVisible(false);
      this.dayBridgeCollider.active = true;

      this.nightBridges.setVisible(true);
      this.nightBridgeCollider.active = false;

      // Enable day button collision
      this.interactables.setCollision(6, true);
      // Disable night button collision
      this.interactables.setCollision(7, false);

      this.sfx.timeToggle(true);
      this.bgm.toggleTime(true);
      this.staticLayer.setTint(0x222438);
   }

   EndLevel() {
      console.log("Player has reached end of level");
      // Restart level for now. Either go back to level select or move directly into the next level
      this.scene.start("gamelevel", {lvl: 2});
      this.sfx.toggleMoveSFX(false);
      this.bgm.stop();
   }
}