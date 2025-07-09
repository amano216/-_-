const CONSTANTS = {
    API: {
        WIKIPEDIA_ENDPOINT: 'https://ja.wikipedia.org/api/rest_v1/page/summary/',
        TIMEOUT: 10000,
        RETRY_COUNT: 3
    },
    
    SPEECH: {
        DEFAULT_LANG: 'ja-JP',
        DEFAULT_RATE: 1.0,
        DEFAULT_PITCH: 1.0,
        DEFAULT_VOLUME: 1.0,
        MIN_RATE: 0.5,
        MAX_RATE: 2.0
    },
    
    UI: {
        DEBOUNCE_DELAY: 300,
        ANIMATION_DURATION: 300,
        STATUS_DISPLAY_TIME: 3000
    },
    
    MESSAGES: {
        FETCHING: '情報を取得しています...',
        FETCH_SUCCESS: '情報を取得しました',
        FETCH_ERROR: '情報の取得に失敗しました',
        NO_CONTENT: 'コンテンツが見つかりませんでした',
        SPEECH_NOT_SUPPORTED: 'お使いのブラウザは音声読み上げに対応していません',
        SPEAKING: '読み上げ中...',
        PAUSED: '一時停止中',
        STOPPED: '停止しました',
        EMPTY_KEYWORD: 'キーワードを入力してください'
    },
    
    STORAGE_KEYS: {
        LAST_KEYWORD: 'earinfo_last_keyword',
        SPEED_PREFERENCE: 'earinfo_speed_preference'
    }
};

Object.freeze(CONSTANTS);