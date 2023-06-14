class NonInteractive extends SceneCache {
	constructor() {
		super("noninteractive");
	}

	preload() {
		this.load.path = "./assets/";
		this.load.image("one", "images/Numeral1.png");
		this.load.image("seven", "images/Numeral7.png");
		this.load.image("teamname", "images/TeamName.png");
		this.load.image("moon", "images/Moon.png");
		this.load.image("sun", "images/Sun.png");
		this.load.image("ghost", "images/Ghost.png");
		this.load.image("titleTxt", "images/GameTitleText.png");
		this.load.image("titleBg", "images/GameTitleBG.png");
		this.load.image("menuBtn", "images/MenuButton.png");
		this.load.image("titleBgImg", "images/TitleSceneBackground.png");
		this.load.image("titleFgImg", "images/TitleSceneForeground.png");
	}

	create() {
		let w = this.game.config.width;
		let h = this.game.config.height;

		let scaleFactor = 1920 / 120;
		let one = this.add.image(0.5 * w, 0.5 * h, "one").setOrigin(0.5).setScale(scaleFactor * 0.5);
		let seven = this.add.image(0.5 * w, 0.5 * h, "seven").setOrigin(0.5).setScale(scaleFactor * 0.5);
		let team = this.add.image(0.5 * w, 0.5 * h, "teamname").setOrigin(0.5).setScale(scaleFactor * 0.5);

		this.sfx = new sfxPlayer();

		let teamNameAppear = this.tweens.add({
			targets: team,
			alpha: { start: 0, to: 1 },
			duration: 800,
			onComplete: () => {
				one.postFX.addShine(1);
				seven.postFX.addShine(1);
				team.postFX.addShine(1);
				this.sfx.timeToggle(false); // Repurpose time toggle to day sound
				this.time.delayedCall(600, () => this.cameras.main.fadeOut(1000, 0, 0, 0, (c, t) => {
					if (t >= 1) {
                  this.sfx.stop();
                  this.scene.start("interactive");
               }
				}));
			},
			paused: true
		});

		let sevenDrop = this.tweens.add({
			targets: seven,
			y: { start: -0.5 * h, to: 0.5 * h },
			duration: 800,
			onComplete: () => {
				this.sfx.bump();
				this.time.delayedCall(50, () => teamNameAppear.play());
			},
			paused: true
		});

		let oneDrop = this.tweens.add({
			targets: one,
			y: { start: -0.5 * h, to: 0.5 * h },
			duration: 800,
			onComplete: () => {
				this.sfx.bump();
				this.time.delayedCall(50, () => sevenDrop.play());
			},
			paused: true
		});

		let instruction = this.add.text(0.5 * w, 0.5 * h, "A touchscreen is recommended for best experience.\nClick/tap to proceed.")
			.setOrigin(0.5)
			.setFontSize(32)
			.setWordWrapWidth(800)
			.setColor("#ffffff");

		this.input.once("pointerdown", () => {
			instruction.destroy();
			oneDrop.play();
         Tone.start(); // Please leave this line as is -- this ensures that audio context starts on iOS.
		});
	}

	update() {

	}
}
