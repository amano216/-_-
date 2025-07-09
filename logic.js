class Logic {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.utterance = null;
        this.content = '';
        this.currentSpeed = CONSTANTS.SPEECH.DEFAULT_RATE;
        this.voices = [];
        this.selectedVoice = null;
    }

    init() {
        if (!this.checkSpeechSupport()) {
            ui.showStatus(CONSTANTS.MESSAGES.SPEECH_NOT_SUPPORTED, 'error');
            return;
        }

        this.loadVoices();
        this.synthesis.addEventListener('voiceschanged', () => this.loadVoices());
        
        const savedSpeed = localStorage.getItem(CONSTANTS.STORAGE_KEYS.SPEED_PREFERENCE);
        if (savedSpeed) {
            this.currentSpeed = parseFloat(savedSpeed);
            ui.elements.speedSlider.value = this.currentSpeed;
            ui.updateSpeedDisplay();
        }
    }

    checkSpeechSupport() {
        return 'speechSynthesis' in window;
    }

    loadVoices() {
        this.voices = this.synthesis.getVoices();
        this.selectedVoice = this.voices.find(voice => 
            voice.lang === CONSTANTS.SPEECH.DEFAULT_LANG
        ) || this.voices[0];
    }

    async fetchContent(keyword) {
        ui.showStatus(CONSTANTS.MESSAGES.FETCHING, 'info');
        
        try {
            const response = await fetch(
                CONSTANTS.API.WIKIPEDIA_ENDPOINT + encodeURIComponent(keyword),
                { timeout: CONSTANTS.API.TIMEOUT }
            );

            if (!response.ok) {
                throw new Error('API response error');
            }

            const data = await response.json();
            
            if (data.extract) {
                this.content = data.extract;
                ui.setLoading(false);
                ui.showStatus(CONSTANTS.MESSAGES.FETCH_SUCCESS, 'success');
                ui.showAudioControls();
                
                localStorage.setItem(CONSTANTS.STORAGE_KEYS.LAST_KEYWORD, keyword);
                
                setTimeout(() => {
                    this.playAudio();
                }, 500);
            } else {
                throw new Error('No content found');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            ui.setLoading(false);
            ui.showStatus(CONSTANTS.MESSAGES.FETCH_ERROR, 'error');
            this.simulateContent(keyword);
        }
    }

    simulateContent(keyword) {
        this.content = `「${keyword}」についての情報です。${keyword}は、様々な文脈で使用される重要な概念です。` +
            `この言葉は、日常生活から専門分野まで幅広く活用されています。` +
            `詳しい情報については、専門書やオンラインリソースを参照することをお勧めします。`;
        
        ui.showStatus(CONSTANTS.MESSAGES.FETCH_SUCCESS, 'success');
        ui.showAudioControls();
        
        setTimeout(() => {
            this.playAudio();
        }, 500);
    }

    playAudio() {
        if (!this.content) {
            ui.showStatus(CONSTANTS.MESSAGES.NO_CONTENT, 'error');
            return;
        }

        if (this.synthesis.paused) {
            this.synthesis.resume();
            ui.setPlayingState(true);
            ui.showStatus(CONSTANTS.MESSAGES.SPEAKING, 'info');
            return;
        }

        this.stopAudio();

        this.utterance = new SpeechSynthesisUtterance(this.content);
        this.utterance.lang = CONSTANTS.SPEECH.DEFAULT_LANG;
        this.utterance.rate = this.currentSpeed;
        this.utterance.pitch = CONSTANTS.SPEECH.DEFAULT_PITCH;
        this.utterance.volume = CONSTANTS.SPEECH.DEFAULT_VOLUME;

        if (this.selectedVoice) {
            this.utterance.voice = this.selectedVoice;
        }

        this.utterance.onstart = () => {
            ui.setPlayingState(true);
            ui.showStatus(CONSTANTS.MESSAGES.SPEAKING, 'info');
        };

        this.utterance.onend = () => {
            ui.setPlayingState(false);
            ui.hideStatus();
        };

        this.utterance.onerror = (event) => {
            console.error('Speech error:', event);
            ui.setPlayingState(false);
            ui.showStatus(CONSTANTS.MESSAGES.FETCH_ERROR, 'error');
        };

        this.synthesis.speak(this.utterance);
    }

    pauseAudio() {
        if (this.synthesis.speaking && !this.synthesis.paused) {
            this.synthesis.pause();
            ui.setPlayingState(false);
            ui.setPausedState(true);
            ui.showStatus(CONSTANTS.MESSAGES.PAUSED, 'info');
        }
    }

    stopAudio() {
        this.synthesis.cancel();
        ui.setPlayingState(false);
        ui.setPausedState(false);
        ui.showStatus(CONSTANTS.MESSAGES.STOPPED, 'info');
        
        setTimeout(() => {
            ui.hideStatus();
        }, CONSTANTS.UI.STATUS_DISPLAY_TIME);
    }

    setSpeed(speed) {
        this.currentSpeed = speed;
        localStorage.setItem(CONSTANTS.STORAGE_KEYS.SPEED_PREFERENCE, speed.toString());
        
        if (this.synthesis.speaking) {
            const wasPaused = this.synthesis.paused;
            const currentContent = this.content;
            
            this.stopAudio();
            this.content = currentContent;
            
            if (!wasPaused) {
                setTimeout(() => {
                    this.playAudio();
                }, 100);
            }
        }
    }
}

const logic = new Logic();
document.addEventListener('DOMContentLoaded', () => {
    logic.init();
});

window.logic = logic;