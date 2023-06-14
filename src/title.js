class Title extends SceneCache {
	constructor() {
		super("interactive");
	}

	create() {
		this.w = this.game.config.width;
		this.h = this.game.config.height;
		this.cameras.main.fadeIn();
		this.cameras.main.setBackgroundColor("rgb(0, 20, 60)");

		this.counter = this.tweens.addCounter({
			duration: 800,
			paused: true
		});

		this.bg = this.add.image(this.w / 2, this.h / 2, "titleBgImg")
			.setOrigin(0.5)
			.setScale(5)
			.setTint(0x222438);

		let ghost = this.add.image(this.w * 0.9, this.h * 0.65, "ghost").setScale(2);
		let ghostBob = this.tweens.add({
			targets: ghost,
			y: `+= ${0.04 * this.h}`,
			duration: 800,
			ease: "sine.InOut",
			yoyo: true,
			repeat: -1
		});
		let ghostWander = this.tweens.add({
			targets: ghost,
			x: { start: this.w * 0.9, to: this.w * 0.1 },
			duration: 6400,
			yoyo: true,
			flipX: true,
			loopDelay: 600,
			repeat: -1
		});
		let ghostFade = this.tweens.add({
			targets: ghost,
			alpha: { from: 1, to: 0 },
			duration: 800,
			onComplete: () => {
				ghostBob.stop();
				ghostWander.stop();
				ghost.destroy();
			},
			paused: true
		});

		this.fg = this.add.image(this.w / 2, this.h / 2, "titleFgImg")
			.setOrigin(0.5)
			.setScale(5)
			.setTint(0x222438);

		let moon = this.add.image(0.9 * this.w, 0.15 * this.h, "moon").setScale(2);
		let sun = this.add.image(-0.1 * this.w, 0.15 * this.h, "sun").setScale(2);

		let moonfall = this.tweens.add({
			targets: moon,
			x: { from: 0.9 * this.w, to: 1.9 * this.w },
			duration: 800,
			paused: true
		});
		let sunrise = this.tweens.add({
			targets: sun,
			x: { from: -0.1 * this.w, to: 0.9 * this.w },
			onStart: () => moonfall.play(),
			duration: 800,
			paused: true
		});

		this.titleBG = this.add.image(0, 0, "titleBg").setScale(2).setAlpha(0);
		let titleText = this.add.image(0, 0, "titleTxt").setScale(2);
		this.titleObj = this.add.group([this.titleBG, titleText]).setX(0.5 * this.w).setY(0.5 * this.h).setOrigin(0.5);

		let prompt = this.add.text(0.5 * this.w, 0.8 * this.h, "Tap anywhere to begin")
			.setOrigin(0.5)
			.setWordWrapWidth(800)
			.setFontSize(32);

		let promptFlash = this.tweens.add({
			targets: prompt,
			alpha: { start: 1, to: 0.2 },
			duration: 800,
			yoyo: true,
			repeat: -1
		});

		let playButtonBG = this.add.image(0, 0, "menuBtn").setOrigin(0.5);
		let playButtonText = this.add.text(0, 0, "PLAY").setOrigin(0.5).setFontSize(40).setColor("#111111");
		let playButton = this.add.group([playButtonBG, playButtonText]).setX(0.5 * this.w).setY(0.5 * this.h);

		let settingsBtnBG = this.add.image(0, 0, "menuBtn").setOrigin(0.5);
		let settingsBtnText = this.add.text(0, 0, "SETTINGS").setOrigin(0.5).setFontSize(40).setColor("#111111");
		let settingsButton = this.add.group([settingsBtnBG, settingsBtnText]).setX(0.5 * this.w).setY(0.7 * this.h);

		let settingsPlaceholderBacking = this.add.rectangle(0, 0, this.w / 6, this.h / 6, 0xababab);
		let settingsPlaceholderText = this.add.text(0, 0, GameLevel.muted ? "Unmute" : "Mute")
			.setOrigin(0.5)
			.setColor("#111111")
			.setFontSize(40).setInteractive()
			.on("pointerdown", () => {
				GameLevel.muted = !GameLevel.muted;
				this.setMuted(GameLevel.muted);
				settingsPlaceholderText.setText(GameLevel.muted ? "Unmute" : "Mute");
			});
		let settingsPlaceholderArea = this.add.group([settingsPlaceholderBacking, settingsPlaceholderText])
			.setX(this.w / 2)
			.setY(this.h / 2)
			.setAlpha(0);

		let settingsConfirmBG = this.add.image(0, 0, "menuBtn")
			.setOrigin(0.5)
			.setAlpha(0);
		let settingsConfirmTxt = this.add.text(0, 0, "Confirm")
			.setFontSize(40)
			.setColor("#111111")
			.setOrigin(0.5)
			.setAlpha(0);
		let settingsConfirmBtn = this.add.group([settingsConfirmBG, settingsConfirmTxt]).setX(this.w * 0.35).setY(this.h * 0.8);

		let settingsCancelBG = this.add.image(0, 0, "menuBtn")
			.setOrigin(0.5)
			.setAlpha(0);
		let settingsCancelTxt = this.add.text(0, 0, "Cancel")
			.setFontSize(40)
			.setColor("#111111")
			.setOrigin(0.5)
			.setAlpha(0);
		let settingsCancelBtn = this.add.group([settingsCancelBG, settingsCancelTxt]).setX(this.w * 0.65).setY(this.h * 0.8);

		settingsConfirmBG.on("pointerdown", () => {
			this.changeMenu([settingsConfirmBtn, settingsCancelBtn], [playButton, settingsButton]);
			this.titleObj.setAlpha(1);
			settingsPlaceholderArea.setAlpha(0);
		});

		settingsCancelBG.on("pointerdown", () => {
			this.changeMenu([settingsConfirmBtn, settingsCancelBtn], [playButton, settingsButton]);
			this.titleObj.setAlpha(1);
			settingsPlaceholderArea.setAlpha(0);
		});

		let buttonsReveal = this.tweens.add({
			targets: [playButtonBG, playButtonText, settingsBtnBG, settingsBtnText],
			alpha: { start: 0, to: 1 },
			duration: 800,
			paused: true,
			onComplete: () => {
				playButtonBG.setInteractive()
					.on("pointerdown", () => this.scene.start("gamelevel"));

				settingsBtnBG.setInteractive()
					.on("pointerdown", () => {
						this.changeMenu([playButton, settingsButton], [settingsConfirmBtn, settingsCancelBtn]);
						this.titleObj.setAlpha(0);
						settingsPlaceholderArea.setAlpha(1);
					});
			}
		});

		this.input.once("pointerdown", () => {
			promptFlash.stop();
			prompt.destroy();

			ghostFade.play();

			this.counter.play();
			sunrise.play();
			buttonsReveal.play();
		});
	}

	update() {
		if (this.counter.isPlaying()) {
			let val = this.counter.getValue();
			this.titleObj.setY((0.5 - 0.25 * val) * this.h);
			this.titleBG.setAlpha(val);

			let g = Math.floor(20 + 80 * val);
			let b = Math.floor(60 + 160 * val);
			this.cameras.main.setBackgroundColor(`rgb(0, ${g}, ${b})`);

			let tintR = 0x22 + (0xff - 0x22) * val;
			let tintG = 0x24 + (0xff - 0x24) * val;
			let tintB = 0x38 + (0xff - 0x38) * val;
			let tintVal = Phaser.Display.Color.GetColor(tintR, tintG, tintB);
			this.bg.setTint(tintVal);
			this.fg.setTint(tintVal);
		}
	}

	changeMenu(from, to) {
		from.forEach(element => {
			element.setAlpha(0);
			element.children.getArray()[0].removeInteractive();
		});

		to.forEach(element => {
			element.setAlpha(1);
			element.children.getArray()[0].setInteractive();
		});
	}
}
