class UI {
    constructor() {
        this.elements = {};
        this.isPlaying = false;
        this.isPaused = false;
    }

    init() {
        this.cacheElements();
        this.attachEventListeners();
        this.updateSpeedDisplay();
    }

    cacheElements() {
        this.elements = {
            keywordInput: document.getElementById('keyword-input'),
            fetchButton: document.getElementById('fetch-button'),
            audioControls: document.getElementById('audio-controls'),
            playButton: document.getElementById('play-button'),
            pauseButton: document.getElementById('pause-button'),
            stopButton: document.getElementById('stop-button'),
            speedControl: document.getElementById('speed-control'),
            speedSlider: document.getElementById('speed-slider'),
            speedValue: document.getElementById('speed-value'),
            statusMessage: document.getElementById('status-message'),
            statusText: document.getElementById('status-text')
        };
    }

    attachEventListeners() {
        this.elements.fetchButton.addEventListener('click', () => this.handleFetch());
        this.elements.keywordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleFetch();
            }
        });
        
        this.elements.playButton.addEventListener('click', () => this.handlePlay());
        this.elements.pauseButton.addEventListener('click', () => this.handlePause());
        this.elements.stopButton.addEventListener('click', () => this.handleStop());
        this.elements.speedSlider.addEventListener('input', () => this.handleSpeedChange());
    }

    handleFetch() {
        const keyword = this.elements.keywordInput.value.trim();
        if (!keyword) {
            this.showStatus('キーワードを入力してください', 'error');
            return;
        }

        this.setLoading(true);
        this.hideStatus();
        
        if (window.logic) {
            window.logic.fetchContent(keyword);
        }
    }

    handlePlay() {
        if (window.logic) {
            window.logic.playAudio();
        }
    }

    handlePause() {
        if (window.logic) {
            window.logic.pauseAudio();
        }
    }

    handleStop() {
        if (window.logic) {
            window.logic.stopAudio();
        }
    }

    handleSpeedChange() {
        const speed = parseFloat(this.elements.speedSlider.value);
        this.updateSpeedDisplay();
        
        if (window.logic) {
            window.logic.setSpeed(speed);
        }
    }

    updateSpeedDisplay() {
        const speed = parseFloat(this.elements.speedSlider.value);
        this.elements.speedValue.textContent = `${speed.toFixed(1)}x`;
    }

    setLoading(isLoading) {
        if (isLoading) {
            this.elements.fetchButton.classList.add('loading');
            this.elements.fetchButton.disabled = true;
            this.elements.keywordInput.disabled = true;
            this.elements.fetchButton.textContent = '';
        } else {
            this.elements.fetchButton.classList.remove('loading');
            this.elements.fetchButton.disabled = false;
            this.elements.keywordInput.disabled = false;
            this.elements.fetchButton.textContent = '取得する';
        }
    }

    showAudioControls() {
        this.elements.audioControls.classList.remove('hidden');
        this.elements.speedControl.classList.remove('hidden');
    }

    hideAudioControls() {
        this.elements.audioControls.classList.add('hidden');
        this.elements.speedControl.classList.add('hidden');
    }

    showStatus(message, type = 'info') {
        this.elements.statusMessage.classList.remove('hidden');
        this.elements.statusMessage.className = `status-toast ${type}`;
        this.elements.statusText.textContent = message;
        
        setTimeout(() => {
            this.hideStatus();
        }, 3000);
    }

    hideStatus() {
        this.elements.statusMessage.classList.add('hidden');
    }

    setPlayingState(playing) {
        this.isPlaying = playing;
        if (playing) {
            this.elements.playButton.classList.add('hidden');
            this.elements.pauseButton.classList.remove('hidden');
        } else {
            this.elements.playButton.classList.remove('hidden');
            this.elements.pauseButton.classList.add('hidden');
        }
    }

    setPausedState(paused) {
        this.isPaused = paused;
    }

    reset() {
        this.setPlayingState(false);
        this.setPausedState(false);
        this.hideAudioControls();
        this.hideStatus();
    }
}

const ui = new UI();
document.addEventListener('DOMContentLoaded', () => {
    ui.init();
});

window.ui = ui;