class BGM {
	isNight = false;
	measureCount = 0;

	constructor() {
		this.volumeLevel = new Tone.Multiply(1).toDestination();
		this.synth = new Tone.AMSynth().connect(this.volumeLevel);

		let day1 = ["C3", "E3", "G3", null];
		let day2 = ["G3", "B3", "D4", "B3"];
		let day3 = ["A2", "C3", "E3", null];
		let day4 = ["F3", "A3", "C4", "A3"];
		this.daySequences = [day1, day2, day3, day4];

		let night1 = ["A2", "C3", "E3", null];
		let night2 = ["D3", "F3", "A3", "F3"];
		let night3 = ["E3", "G3", "B3", null];
		let night4 = ["A2", "C3", "E3", "C3"];
		this.nightSequences = [night1, night2, night3, night4];
		this.loop = undefined;
	}

	toggleMute(mute) {
		if (mute) {
			this.volumeLevel.disconnect();
		}
		else if (!mute) {
			this.volumeLevel.toDestination();
		}
	}

	play() {
		Tone.Transport.bpm.value = 120;
		if (this.loop == undefined) {
			this.loop = new Tone.Loop((time) => {
				let sequencePool = this.isNight ? this.nightSequences : this.daySequences;
				let sequence = new Tone.Sequence((time, note) => {
					this.synth.triggerAttackRelease(note, "4n", time);
				}, sequencePool[this.measureCount], "4n");
				sequence.loop = false;
				sequence.start();
				this.measureCount = (this.measureCount + 1) % 4;
			}, "1m").start(0);
			Tone.Transport.start();
		}
	}

	stop() {
		this.loop.stop();
		this.loop.dispose();
	}

	toggleTime(toNight) {
		this.isNight = toNight;
	}
}
