class sfxPlayer {
	nodes = [];
	constructor() {
		// Footstep sound setup
		this.stepCounter = 0;
		this.stepLoop = new Tone.Loop(() => {
			let pitch = (this.stepCounter == 0) ? "B4" : "D#5";
			const volumeLevel = new Tone.Multiply(0.15).toDestination();
			this.nodes.push(volumeLevel);
			
			const aEnv = new Tone.AmplitudeEnvelope({
				attack: 0.05,
				decay: 0.1,
				sustain: 0.9,
				release: 0.1
			}).connect(volumeLevel);
			this.nodes.push(aEnv);
			
			const osc = new Tone.Oscillator(pitch, "sawtooth").connect(aEnv).start();
			this.nodes.push(osc);

			aEnv.triggerAttackRelease(0.05);
			this.stepCounter = (this.stepCounter + 1) % 2;
		}, 0.3);

		this.nodes.push(this.stepLoop);
	}

	toggleMoveSFX(starting) {
		if (starting) {
			this.stepLoop.start();
		}
		else {
			this.stepCounter = 0;
			this.stepLoop.stop();
		}
	}

	// For when player bumps into a wall
	bump() {
		const volumeLevel = new Tone.Multiply(0.45).toDestination();
		this.nodes.push(volumeLevel);
		
		const aEnv = new Tone.AmplitudeEnvelope({
			attack: 0.05,
			decay: 0.15,
			sustain: 0.35,
			release: 0.1
		}).connect(volumeLevel);
		this.nodes.push(aEnv);

		const noise = new Tone.Noise("pink").connect(aEnv).start();
		this.nodes.push(noise);

		aEnv.triggerAttackRelease(0.15);
	}

	// Day/Night toggle sound
	timeToggle(toNight) {
		let pitches = ["C4", "G4"];
		if (toNight) pitches.reverse();

		const volumeLevel = new Tone.Multiply(0.3).toDestination();
		this.nodes.push(volumeLevel);
		const cheby = new Tone.Chebyshev(20).connect(volumeLevel);
		this.nodes.push(cheby);
		const src = new Tone.Synth().connect(cheby);
		this.nodes.push(src);

		src.triggerAttackRelease(pitches[0], "8n");
		src.triggerAttackRelease(pitches[1], "8n.", "+8n");
	}

	stop() {
		for (let node of this.nodes) {
			node.dispose();
		}
	}
}
