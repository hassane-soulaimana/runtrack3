class KonamiCode {
    constructor() {
        this.sequence = [
            'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'
        ];
        this.position = 0;
        this.init();
    }

    init() {
        this._handler = (event) => {
            if (event.code === this.sequence[this.position]) {
                this.position++;
                if (this.position === this.sequence.length) {
                    this.activateKonami();
                    this.position = 0;
                }
            } else {
                this.position = 0;
            }
        };

        document.addEventListener('keydown', this._handler);
    }

    activateKonami() {
        document.body.classList.add('konami-activated');
        
        
        this.playBeep();
        
        if (this._handler) {
            document.removeEventListener('keydown', this._handler);
            this._handler = null;
        }
    }

    playBeep() {

        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log("Audio non supporté");
        }
    }
}
new KonamiCode();