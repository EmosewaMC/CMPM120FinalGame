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

		// Bump setup
		this.bumpVol = new Tone.Multiply(0.45).toDestination();
		this.nodes.push(this.bumpVol);

		this.bumpEnv = new Tone.AmplitudeEnvelope({
			attack: 0.05,
			decay: 0.15,
			sustain: 0.35,
			release: 0.1
		}).connect(this.bumpVol);
		this.nodes.push(this.bumpEnv);

		this.bumpNoise = new Tone.Noise("pink").connect(this.bumpEnv).start();
		this.nodes.push(this.bumpNoise);

		// Toggle setup
		this.toggleVol = new Tone.Multiply(0.3).toDestination();
		this.nodes.push(this.toggleVol);

		this.cheby = new Tone.Chebyshev(20).connect(this.toggleVol);
		this.nodes.push(this.cheby);
		
		this.toggleSynth = new Tone.Synth().connect(this.cheby);
		this.nodes.push(this.toggleSynth);
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
		this.bumpEnv.triggerAttackRelease(0.15);
	}

	// Day/Night toggle sound
	timeToggle(toNight) {
		let pitches = ["C4", "G4"];
		if (toNight) pitches.reverse();

		this.toggleSynth.triggerAttackRelease(pitches[0], "8n");
		this.toggleSynth.triggerAttackRelease(pitches[1], "8n.", "+8n");
	}

	stop() {
		for (let node of this.nodes) {
			node.dispose();
		}
	}
}
