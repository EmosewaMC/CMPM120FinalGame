class Hostile {
	constructor(scene, startX, startY, endX, speed, px, py) {
		this.sprite = scene.physics.add.sprite(startX, startY, "hostile").setScale(0.8).setCollideWorldBounds(true);
		this.startX = startX;
		this.endX = endX;
		this.speed = speed;
		this.sprite.setFlipX(this.startX > this.endX);

		scene.physics.add.overlap(this.sprite, scene.player, () => {
			scene.player.setPosition(px, py);
		});

		this.dayBridgeCollider = scene.physics.add.collider(scene.dayBridges, this.sprite, () => this.changeDirection());
		this.nightBridgeCollider = scene.physics.add.collider(scene.nightBridges, this.sprite, () => this.changeDirection());
	}

	updateVelocity() {
		let dir = Math.sign(this.endX - this.startX);
		this.sprite.setVelocity(dir * this.speed, 0);

		if (Math.abs(this.sprite.x - this.startX) >= Math.abs(this.endX - this.startX)) this.changeDirection();
	}

	toggleBridgeCollisions(toNight) {
		this.dayBridgeCollider.active = toNight;
		this.nightBridgeCollider.active = !toNight;
	}

	changeDirection() {
		let temp = this.endX;
		this.endX = this.startX;
		this.startX = temp;
		this.sprite.setFlipX(this.startX > this.endX);
	}
}
